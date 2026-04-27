<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';
</script>

<Post
	title={currentPost.title}
	slug={currentPost.slug}
	coverImage={currentPost.coverImage}
	date={currentPost.date}
	tags={currentPost.tags}
	excerpt={currentPost.excerpt}
	contributor={currentPost.contributor}
	contributorSlug={currentPost.contributorSlug}
>
	<PagesWrapper>
		<div class="wrapper">
			<Toc class="toc" />
			<div id="toc-contents" class="content-preview">
				<h2 id="introduction">Introduction</h2>
				<p>
					When you run a UDP BitTorrent tracker behind Docker bridge networking, the Linux kernel
					creates conntrack (connection tracking) entries for UDP flows that pass through Docker's
					NAT layer. Under sustained tracker load those entries accumulate faster than they expire,
					the conntrack table fills up, and the kernel starts silently dropping packets.
				</p>
				<p>
					The result is <strong>intermittent UDP timeouts</strong> with a characteristic self-recovery
					cycle: the table fills, a probe gets dropped, entries expire, the table drains, the next probe
					succeeds, and the cycle repeats. The application log is completely silent. No error, no counter,
					no warning — just unexplained timeout spikes on your uptime monitor.
				</p>
				<p>
					This post documents the mechanism behind the problem, how to diagnose it, the fix, and a
					reboot-persistence trap that trips many operators.
				</p>

				<h2 id="our-experience">Our Experience: Repeated Incidents Across Two Demos</h2>

				<h3 id="first-demo">First Demo — DigitalOcean (2024–2025)</h3>
				<p>
					The first occurrence was on the original
					<a href="https://github.com/torrust/torrust-demo">torrust/torrust-demo</a> hosted on
					DigitalOcean. UDP uptime on
					<a href="https://newtrackon.com">newTrackon</a> had been fluctuating and eventually
					dropped to around 60 % at peak. The investigation is documented in
					<a href="https://github.com/torrust/torrust-demo/issues/26">torrust/torrust-demo#26</a>.
				</p>
				<p>
					The kernel journal confirmed: <code>nf_conntrack: table full, dropping packet</code> with
					20 million+ <code>early_drop</code> events on CPU 3. After increasing
					<code>nf_conntrack_max</code>, UDP uptime on
					<a href="https://newtrackon.com">newTrackon</a> recovered to
					<strong>99.2 %</strong>.
				</p>
				<p>
					A few months later, in June 2025, the same DigitalOcean server filled the conntrack table
					again (uptime back down to about 90 %, with fresh
					<code>nf_conntrack: table full, dropping packet</code> messages and tens of millions of
					<code>early_drop</code> events on CPU 3). The follow-up investigation in
					<a href="https://github.com/torrust/torrust-demo/issues/72">torrust/torrust-demo#72</a>
					tried to go further than just raising the ceiling and disable conntrack for the tracker port
					altogether using <code>NOTRACK</code> rules. As the
					<a href="#alternatives">Alternative Approaches</a> section below describes in detail, that
					attempt failed in our Docker setup — even after switching the tracker to
					<code>--network=host</code> mode — and ultimately required restoring a server backup. We kept
					the sysctl tuning and migrated the demo to Hetzner shortly afterwards.
				</p>

				<h3 id="new-tracker-demo">New Tracker Demo — Hetzner (2026)</h3>
				<p>
					In April 2026 we migrated the
					<a href="https://github.com/torrust/torrust-tracker-demo">Torrust Tracker Demo</a> to
					Hetzner and resized the server from a CCX23 (4 vCPU, 16 GB RAM) to a CCX33 (8 vCPU, 32 GB
					RAM) to improve performance. The opposite happened: UDP uptime the day after the resize
					was
					<strong>83.9 %</strong>, down from 92.2 % before the resize.
				</p>
				<p>
					As we explain in the symptom section below, a larger server can make things
					<em>worse</em>: more processing power means more requests per second, which fills the
					conntrack table faster and increases the drop rate.
				</p>
				<p>
					Investigation (tracked in
					<a href="https://github.com/torrust/torrust-tracker-demo/issues/21"
						>torrust/torrust-tracker-demo#21</a
					>) found <code>nf_conntrack_count = nf_conntrack_max = 262144</code> — the table
					completely full — with 2478 "table full" messages in <code>dmesg</code>.
				</p>
				<p>
					The fix was applied on 2026-04-20 (see
					<a href="https://github.com/torrust/torrust-tracker-demo/pull/22"
						>torrust/torrust-tracker-demo PR #22</a
					>) with all three parameters and the module pre-load. We are monitoring
					<a href="https://newtrackon.com">newTrackon</a> for recovery data.
				</p>

				<Callout type="info">
					<strong>Confirmed outcome (2026-04-27):</strong> the 7-day post-fix observation window is
					complete. newTrackon reports UDP uptime at <strong>99.9 %</strong> — above the 99.0 %
					target. The conntrack table stabilised at roughly 32–34 % utilisation (≈ 340 000 of 1 048
					576 entries) with no table-full events in <code>dmesg</code> and zero IPv4
					<code>UdpRcvbufErrors</code>. The fix held across a server reboot and at peak load (~750
					UDP req/s, ~2 000 HTTP req/s). Before the fix, UDP uptime had been as low as 83.9 % on the
					day the conntrack table first filled (262 144 / 262 144 entries).
				</Callout>

				<h2 id="the-symptom">The Symptom</h2>
				<p>
					If you run a UDP tracker and observe any of the following on an uptime monitor such as
					<a href="https://newtrackon.com">newTrackon</a>, you may be hitting conntrack exhaustion:
				</p>
				<ul>
					<li>
						UDP availability drops intermittently to 60–90 % while the HTTP tracker stays healthy.
					</li>
					<li>
						Outages are self-recovering — they resolve without any operator intervention, typically
						within seconds to a few minutes.
					</li>
					<li>
						You cannot reproduce the problem by sending a single announce manually; it only appears
						under sustained load.
					</li>
					<li>
						There is nothing relevant in the tracker application log, the Docker logs, or
						<code>netstat</code> / <code>ss</code> socket counters.
					</li>
					<li>
						Restarting the tracker or Docker has no lasting effect — the problem returns once load
						resumes.
					</li>
					<li>
						Upgrading the server to a larger instance (more CPU, more RAM) makes things
						<em>worse</em> because the tracker can now handle more requests per second, which fills the
						conntrack table faster.
					</li>
				</ul>

				<Callout type="warning">
					<strong>A counter-intuitive signal:</strong> if your UDP uptime drops <em>after</em> you resize
					to a larger server, conntrack exhaustion is the likely explanation. More processing power increases
					request throughput, which exhausts the table sooner.
				</Callout>

				<h2 id="why-its-hard-to-diagnose">Why It's Hard to Diagnose</h2>
				<p>The standard places you look for dropped packets do not show this problem:</p>
				<ul>
					<li>
						<strong>Application log:</strong> the tracker process never sees the dropped packet. The kernel
						drops it before it reaches the socket.
					</li>
					<li>
						<strong>Socket receive-buffer drops:</strong>
						<code>ss -u -s</code> and <code>netstat -su</code> show socket-level drops, not kernel-level
						conntrack drops. They will not increment.
					</li>
					<li>
						<strong>Firewall logs:</strong> <code>iptables</code> / <code>ufw</code> log rules fire on
						packets that reach the firewall. A packet dropped by the conntrack subsystem before the firewall
						never appears in those logs.
					</li>
					<li>
						<strong>Docker logs:</strong> Docker has no visibility into kernel packet drops.
					</li>
				</ul>
				<p>
					The primary evidence is in <code>dmesg</code> and conntrack counters in
					<code>/proc/sys/net/netfilter/</code>.
				</p>

				<CodeBlock
					lang="bash"
					code={`# Look for the telltale message:
dmesg | grep -i conntrack
# nf_conntrack: table full, dropping packet

# Check current fill level:
cat /proc/sys/net/netfilter/nf_conntrack_count
cat /proc/sys/net/netfilter/nf_conntrack_max

# If count equals max, the table is full right now.`}
				/>

				<p>
					When we investigated the second occurrence on Hetzner, we found
					<code>nf_conntrack_count = nf_conntrack_max = 262144</code> — the table was completely
					full at the moment of inspection — and 2478 "table full" drop messages in
					<code>dmesg</code>.
				</p>

				<h2 id="the-mechanism">The Mechanism: Docker DNAT and Conntrack</h2>

				<h3 id="how-docker-publishes-udp-ports">How Docker Publishes UDP Ports</h3>
				<p>
					When you publish a UDP port in Docker (<code>-p 6969:6969/udp</code>), Docker installs a
					DNAT (Destination Network Address Translation) rule in <code>iptables</code>. This rule
					rewrites the destination address of every inbound packet from the host's public IP to the
					container's private bridge IP.
				</p>
				<p>
					NAT requires connection tracking. The kernel must remember which packets were rewritten so
					it can apply the reverse translation to outbound replies. For each new UDP "flow" (unique
					source IP + source port combination), the kernel creates a conntrack entry.
				</p>

				<h3 id="how-entries-accumulate">How Entries Accumulate Under UDP Tracker Load</h3>
				<p>
					Unlike TCP, UDP has no handshake. The kernel cannot know when a UDP exchange is
					"finished", so each entry persists until a configurable timeout expires:
				</p>
				<ul>
					<li>
						<strong>One-way (unreplied) UDP:</strong> default timeout is
						<strong>30 seconds</strong>.
					</li>
					<li>
						<strong>Bidirectional (replied) UDP:</strong> default timeout is
						<strong>120 seconds</strong>.
					</li>
				</ul>
				<p>
					A BitTorrent tracker announce is a request–response exchange, so entries are classified as
					bidirectional with the 120-second timeout. Each unique client IP/port pair that sends an
					announce holds a conntrack entry for two full minutes.
				</p>

				<Callout type="info">
					<strong>Not the same as the announce interval.</strong> The conntrack timeout is a
					kernel-level timer — it controls how long the NAT translation entry survives after the
					last packet. It is completely independent of the tracker's <em>announce interval</em>,
					which is the time the tracker tells BitTorrent clients to wait before re-announcing the
					same torrent. The Torrust Tracker Demo sets an announce interval of 300 seconds (5
					minutes); <a href="https://newtrackon.com/submitted">newTrackon</a> requires announce intervals
					between 5 minutes and 3 hours. Each re-announce typically arrives on a new ephemeral source
					port, creating a fresh conntrack entry regardless of whether the previous entry has expired.
				</Callout>

				<h2 id="the-calculation">The Calculation</h2>
				<p>
					The minimum conntrack table size needed to handle your request rate without dropping
					packets is:
				</p>
				<p>
					<strong>minimum_table_size = requests_per_second × udp_stream_timeout_seconds</strong>
				</p>
				<p>
					With default settings (<code>udp_timeout_stream = 120 s</code>) and a table size of 262
					144 entries:
				</p>
				<ul>
					<li>Maximum safe request rate = 262 144 ÷ 120 ≈ <strong>2 186 requests/s</strong></li>
				</ul>
				<p>
					That sounds large, but BitTorrent clients re-announce every 30–60 minutes from a rotating
					pool of ports. A tracker with tens of thousands of active torrents, each with dozens of
					peers, easily exceeds this rate at peak times.
				</p>
				<p>
					Reducing the stream timeout to 15 seconds multiplies the effective capacity by 8× without
					changing the table size:
				</p>
				<ul>
					<li>262 144 ÷ 15 ≈ <strong>17 476 requests/s</strong> at the default table size</li>
				</ul>
				<p>
					Combining a larger table with a shorter timeout gives significant headroom even on a busy
					public tracker.
				</p>

				<h2 id="the-fix">The Fix: Three Kernel Parameters</h2>
				<p>
					Create (or edit) <code>/etc/sysctl.d/99-conntrack.conf</code> with the following content
					(the deployed version for the Torrust Tracker Demo is at
					<a
						href="https://github.com/torrust/torrust-tracker-demo/blob/main/server/etc/sysctl.d/99-conntrack.conf"
						>server/etc/sysctl.d/99-conntrack.conf</a
					>):
				</p>

				<CodeBlock
					lang="ini"
					code={`# Raise the table ceiling.
# Default 65536–262144 is too small under tracker load.
net.netfilter.nf_conntrack_max = 1048576

# Reduce UDP stream timeout.
# Default 120 s; a tracker announce round-trip completes in milliseconds.
net.netfilter.nf_conntrack_udp_timeout_stream = 15

# Reduce one-way UDP timeout.
# Default 30 s.
net.netfilter.nf_conntrack_udp_timeout = 10`}
				/>

				<p>Apply the settings immediately without rebooting:</p>

				<CodeBlock
					lang="bash"
					code={`sudo sysctl --system
# or apply only this file:
sudo sysctl -p /etc/sysctl.d/99-conntrack.conf`}
				/>

				<p>Verify that the new values are active:</p>

				<CodeBlock
					lang="bash"
					code={`sysctl net.netfilter.nf_conntrack_max
sysctl net.netfilter.nf_conntrack_udp_timeout_stream
sysctl net.netfilter.nf_conntrack_udp_timeout`}
				/>

				<Callout type="info">
					The three values above are a conservative starting point. You can calculate a more precise
					<code>nf_conntrack_max</code> from your actual request rate using the formula in the
					previous section. Raising the table ceiling increases kernel memory usage (roughly 300–400
					bytes per entry). At <code>nf_conntrack_max = 1 048 576</code> that is ≈ 384 MB of kernel memory
					reserved for the conntrack table — trivial on a 32 GB server, but worth budgeting for on a 1–2
					GB VPS.
				</Callout>

				<h3 id="resize-the-hash-table">Don't Forget the Hash Table</h3>
				<p>
					When you raise <code>nf_conntrack_max</code> by an order of magnitude, the
					<strong>hash bucket count does not auto-scale</strong>. The default is around 65 536
					buckets; if you keep that while raising the ceiling to 1 048 576, every lookup walks long
					collision chains and table operations degrade from O(1) toward O(n). The recommended ratio
					is roughly
					<code>nf_conntrack_max / 4</code> to <code>nf_conntrack_max / 8</code>.
				</p>
				<p>
					You can tune buckets with the <code>nf_conntrack_buckets</code> sysctl (writeable in the
					initial network namespace) or set the module parameter <code>hashsize</code> for early-boot
					consistency.
				</p>

				<CodeBlock
					lang="bash"
					code={`# Runtime (sysctl): 262144 buckets pairs well with nf_conntrack_max = 1048576
sudo sysctl -w net.netfilter.nf_conntrack_buckets=262144

# Persistent (sysctl)
echo 'net.netfilter.nf_conntrack_buckets = 262144' | sudo tee /etc/sysctl.d/98-conntrack-buckets.conf

# Optional early-boot module option (equivalent bucket size)
echo 'options nf_conntrack hashsize=262144' | sudo tee /etc/modprobe.d/nf_conntrack.conf

# Verify
sysctl net.netfilter.nf_conntrack_buckets
cat /sys/module/nf_conntrack/parameters/hashsize`}
				/>

				<h3 id="watch-other-udp-services">Reduced Timeouts Are Global</h3>
				<p>
					The <code>nf_conntrack_udp_timeout*</code> values are kernel-wide — they apply to every
					UDP flow on the host, not only to tracker traffic. A 15-second stream timeout is
					appropriate for request–response protocols like a BitTorrent tracker, DNS resolver, or
					QUIC server, but it can be aggressive for long-lived UDP services such as WireGuard,
					IPsec, VoIP/SIP gateways, or long-running game servers. If you co-host such services,
					either keep the default 120 s or use
					<code>NOTRACK</code> rules (see the
					<a href="#alternatives">Alternative Approaches</a> section) to exempt them from connection tracking
					entirely.
				</p>

				<h2 id="the-reboot-trap">The Reboot Persistence Trap</h2>
				<p>
					This is where many operators get burned: you apply the fix, it works perfectly, you reboot
					the server, and the problem silently comes back.
				</p>
				<p>
					The <code>net.netfilter.nf_conntrack_*</code> sysctl keys only exist after the
					<code>nf_conntrack</code> kernel module has been loaded. The module is loaded by Docker
					when Docker starts. However, systemd applies sysctl configuration at boot
					<strong>before</strong> Docker runs — so when systemd reads
					<code>/etc/sysctl.d/99-conntrack.conf</code>, the keys do not exist yet and the settings
					are silently skipped.
				</p>
				<p>The fix is to instruct the kernel to pre-load the module during boot:</p>

				<CodeBlock
					lang="bash"
					code={`echo "nf_conntrack" | sudo tee /etc/modules-load.d/conntrack.conf`}
				/>

				<p>
					With this in place, the module is loaded early in the boot sequence, the sysctl keys exist
					when systemd applies <code>sysctl.d</code>, and the settings take effect before Docker
					starts.
				</p>

				<Callout type="warning">
					<strong>Always pair the sysctl config with the module pre-load.</strong> Without
					<code>/etc/modules-load.d/conntrack.conf</code>, the settings will not survive a reboot
					even though <code>sysctl --system</code> confirms they are active on the running system.
				</Callout>

				<p>
					After the next reboot, verify both that the module is loaded and that the values are
					correct:
				</p>

				<CodeBlock
					lang="bash"
					code={`lsmod | grep nf_conntrack
sysctl net.netfilter.nf_conntrack_max
sysctl net.netfilter.nf_conntrack_udp_timeout_stream`}
				/>

				<h2 id="alternatives">Alternative Approaches: Avoid the Problem Entirely</h2>
				<p>
					Tuning conntrack raises the ceiling, but the most fundamental fix is to stop creating
					conntrack entries for tracker traffic in the first place. There are three approaches worth
					knowing about, in order of how invasive they are.
				</p>

				<h3 id="alt-host-network">1. Host Networking (<code>--network=host</code>)</h3>
				<p>
					Running the tracker container with <code>--network=host</code> bypasses Docker's bridge
					and DNAT layer entirely. The tracker binds directly to the host network namespace, so no
					NAT rewrite happens and <strong>no conntrack entry is created</strong> for incoming UDP packets.
				</p>
				<p>
					This is what many high-volume public trackers do. Trade-offs: you lose Docker's network
					isolation between containers, port mappings (<code>-p host:container</code>) are ignored,
					and the container can collide with any other process listening on the same port on the
					host.
				</p>

				<CodeBlock
					lang="yaml"
					code={`# docker-compose.yml — host networking for the UDP tracker
services:
  tracker:
    image: torrust/tracker:latest
    network_mode: host
    # 'ports:' are ignored when network_mode: host
    # The tracker binds to 0.0.0.0:6969 on the host directly.`}
				/>

				<h3 id="alt-notrack">2. <code>NOTRACK</code> on the Tracker Port</h3>
				<p>
					If you want to keep bridge networking for isolation, you can tell the kernel to skip
					connection tracking for traffic on the tracker port using a rule in the
					<code>raw</code> table. Modern Ubuntu / Debian uses <code>iptables-nft</code> under the
					hood, so the cleanest way to express these rules is directly in <code>nftables</code>. Add
					the following to <code>/etc/nftables.conf</code>:
				</p>

				<CodeBlock
					lang="bash"
					code={`# /etc/nftables.conf — disable conntrack for the UDP tracker ports
table inet raw {
    chain prerouting {
        type filter hook prerouting priority raw;
        udp dport { 6868, 6969 } notrack
    }
    chain output {
        type filter hook output priority raw;
        udp sport { 6868, 6969 } notrack
    }
}`}
				/>

				<p>Apply and persist across reboots:</p>

				<CodeBlock
					lang="bash"
					code={`sudo systemctl enable nftables    # crucial — without this the rules are not loaded at boot
sudo systemctl restart nftables
sudo nft list ruleset | grep notrack`}
				/>

				<p>For comparison, the equivalent classic <code>iptables</code> form is:</p>

				<CodeBlock
					lang="bash"
					code={`sudo iptables -t raw -A PREROUTING -p udp --dport 6969 -j NOTRACK
sudo iptables -t raw -A OUTPUT     -p udp --sport 6969 -j NOTRACK
# IPv6
sudo ip6tables -t raw -A PREROUTING -p udp --dport 6969 -j NOTRACK
sudo ip6tables -t raw -A OUTPUT     -p udp --sport 6969 -j NOTRACK`}
				/>

				<p>
					With <code>NOTRACK</code>, packets bypass conntrack and the table never grows from tracker
					traffic. The catch is significant: <strong>NAT requires conntrack</strong>, so once you
					stop tracking these packets, Docker's automatic DNAT for the published port no longer
					works.
				</p>

				<Callout type="warning">
					<strong>We tried this and it broke the tracker.</strong> In
					<a href="https://github.com/torrust/torrust-demo/issues/72">torrust/torrust-demo#72</a>
					we added the <code>nftables</code> rules above, confirmed they were active (<code
						>conntrack -S</code
					>
					showed <code>early_drop = 0</code>), and immediately UDP announces from
					<a href="https://newtrackon.com">newTrackon</a> and from our own
					<code>tracker_checker</code> client started timing out. HTTP kept working. Switching the
					tracker container to <code>network_mode: host</code> (per
					<a href="https://github.com/torrust/torrust-demo/issues/27">torrust/torrust-demo#27</a>)
					did <em>not</em> fix it either, and we eventually had to
					<a href="https://github.com/torrust/torrust-demo/issues/78">restore a server backup</a>. A
					secondary problem we observed: even with port-level <code>NOTRACK</code>, internal Docker
					traffic to the tracker (statsd on 8125, healthchecks, the index calling the tracker over
					<code>127.0.0.1</code>) was still being tracked because those flows go through the
					loopback / bridge interfaces, not through the public DNAT path.
				</Callout>

				<p>
					The takeaway is that <code>NOTRACK</code> is most useful with macvlan or with a bare-metal
					install that does not rely on Docker's DNAT/iptables rules. With host networking, many
					setups do not need <code>NOTRACK</code> at all. In a typical multi-container Docker Compose
					setup it is fragile and hard to get right.
				</p>

				<Callout type="warning">
					<strong>Reboot trap, again.</strong> If you do go down the <code>nftables</code> route,
					run <code>sudo systemctl enable nftables</code>. We hit a case where the rules in
					<code>/etc/nftables.conf</code> were syntactically valid and present on disk, but
					<code>nft list ruleset</code> came back empty after a reboot because the
					<code>nftables</code> service was not enabled.
				</Callout>

				<h3 id="alt-macvlan">3. <code>macvlan</code> Network Driver</h3>
				<p>
					The <a href="https://docs.docker.com/engine/network/drivers/macvlan/">macvlan driver</a>
					gives the container its own MAC address and IP on the physical LAN. Packets reach the container
					without NAT, so no conntrack entries are created on the host for tracker traffic. This preserves
					container isolation but requires more involved network setup (a parent interface in promiscuous
					mode, an IP plan, and a host that is allowed to claim multiple MACs — which rules out most cloud
					providers that filter on the upstream switch).
				</p>

				<Callout type="info">
					<strong>Why we kept Docker bridge networking on the demo.</strong> The Torrust Tracker
					Demo uses Docker Compose with bridge networking because the same stack also runs HTTP
					services behind a reverse proxy and benefits from Docker's built-in DNS service discovery
					between containers. For us, sysctl tuning is the right balance. For a single-purpose,
					high-throughput public UDP tracker, <code>--network=host</code> is usually the simplest and
					most efficient choice.
				</Callout>

				<h2 id="monitoring">Monitoring and Verification</h2>
				<p>
					After applying the fix, use these commands to confirm that the table is no longer
					exhausting. The <code>conntrack</code> CLI is not installed by default on most distributions;
					install it first:
				</p>

				<CodeBlock
					lang="bash"
					code={`# Debian / Ubuntu
sudo apt-get install -y conntrack

# RHEL / Fedora / Rocky / Alma
sudo dnf install -y conntrack-tools`}
				/>

				<CodeBlock
					lang="bash"
					code={`# Current fill level (watch for count approaching max)
watch -n5 'echo "count: $(cat /proc/sys/net/netfilter/nf_conntrack_count) / max: $(cat /proc/sys/net/netfilter/nf_conntrack_max)"'

# Cross-check: nf_conntrack_count should match the number of entries listed by the conntrack tool
sudo conntrack -L 2>/dev/null | wc -l
cat /proc/sys/net/netfilter/nf_conntrack_count

# Drop messages since boot
dmesg | grep -c "table full"

# Conntrack statistics per CPU (early_drop column indicates table pressure)
sudo conntrack -S

# One-liner for the drop count across all CPUs
sudo conntrack -S | awk '{for (i=1;i<=NF;i++) if ($i ~ /^early_drop=/) { split($i,a,"="); sum += a[2] } } END {print "total early_drop:", sum+0}'`}
				/>

				<p>
					The <code>conntrack -S</code> output includes an <code>early_drop</code> counter per CPU. A
					non-zero value means the kernel had to evict entries early to make room — a leading indicator
					of exhaustion before packets start dropping. If this counter is growing, you need a larger table
					or shorter timeouts.
				</p>
				<p>
					On the first Torrust demo, we observed 20 million+ <code>early_drop</code> events on CPU 3
					before the fix. After increasing <code>nf_conntrack_max</code> and adjusting the timeouts, the
					counter stabilized at zero.
				</p>

				<Callout type="info">
					Consider adding a simple alerting rule that fires when
					<code>nf_conntrack_count / nf_conntrack_max &gt; 0.8</code>. At 80 % fill, entries are
					still being accepted; at 100 % they are being dropped. Catching it at 80 % gives you time
					to react without customer-facing impact.
				</Callout>

				<h2 id="independent-documentation">Independent Documentation</h2>
				<p>
					This is not unique to Torrust. The
					<a href="https://github.com/zootella/ftorrent/blob/master/open/README.md"
						>ftorrent/open README</a
					>
					— a comprehensive guide to running the
					<a href="https://github.com/greatest-ape/aquatic">Aquatic tracker</a> in Docker — covers
					the same problem in its "Kernel tuning for bridge networking" section. That guide
					documents the same
					<code>nf_conntrack_max</code>, <code>nf_conntrack_udp_timeout</code>, and
					<code>nf_conntrack_udp_timeout_stream</code> fixes, and extends them with two additional
					parameters: <code>net.core.rmem_max</code> / <code>rmem_default</code> to size UDP socket
					receive buffers, and <code>net.core.netdev_max_backlog</code> to prevent softirq drops
					when Docker's veth pair adds per-packet overhead. It also covers the same
					reboot-persistence trap (pre-loading the <code>nf_conntrack</code> module) and provides matching
					monitoring commands.
				</p>
				<p>
					Any UDP service that receives sustained traffic through Docker bridge networking and
					Docker's DNAT layer is susceptible. BitTorrent trackers happen to be a high-frequency case
					because every peer re-announces periodically, generating a constant stream of short
					request–response exchanges.
				</p>

				<h2 id="further-reading">Further Reading</h2>
				<p>
					The resources below independently document the same conntrack problem and cover related
					topics for anyone running a public tracker with Docker.
				</p>
				<ul>
					<li>
						<a href="https://github.com/zootella/ftorrent/blob/master/open/README.md"
							>Running Aquatic in Docker: A Complete Guide to Public BitTorrent and WebTorrent
							Trackers</a
						>
						— A detailed guide to deploying the
						<a href="https://github.com/greatest-ape/aquatic">Aquatic</a> tracker (a Rust implementation
						of all three BitTorrent tracker protocols) in hardened Docker containers. Covers conntrack
						tuning, UDP socket buffers, NIC backlog, Docker bridge networking security, container hardening
						with dropped capabilities and custom seccomp profiles, IPv6 dual-stack, and reverse proxy
						setup. The "Kernel tuning for bridge networking" section is directly relevant to this post.
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-demo/issues/26">torrust/torrust-demo#26</a>
						— The GitHub issue tracking our first encounter with this problem on the DigitalOcean demo.
						Includes the kernel journal output showing
						<code>nf_conntrack: table full, dropping packet</code> and the initial fix.
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-demo/issues/72">torrust/torrust-demo#72</a>
						— The follow-up issue from June 2025 documenting the second occurrence on the same DigitalOcean
						droplet, the failed attempt to disable conntrack with
						<code>nftables</code> <code>NOTRACK</code> rules (with and without
						<code>--network=host</code>), and the localhost-tracking gotcha that affects
						multi-container Docker setups. Closely related to
						<a href="https://github.com/torrust/torrust-demo/issues/27">torrust/torrust-demo#27</a>
						(Docker network configuration) and
						<a href="https://github.com/torrust/torrust-demo/issues/78">torrust/torrust-demo#78</a> (the
						backup restore that followed).
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker-demo/issues/21"
							>torrust/torrust-tracker-demo#21</a
						>
						— The issue tracking the second occurrence on the Hetzner tracker demo, along with
						<a href="https://github.com/torrust/torrust-tracker-demo/pull/22">PR #22</a>
						which added the sysctl settings and the conntrack module pre-load to the deployer.
					</li>
				</ul>

				<h3>Related Posts on This Blog</h3>
				<ul>
					<li>
						<a href="/blog/new-torrust-tracker-demo">The New Torrust Tracker Demo Is Live</a>
						— Introduces the Hetzner tracker demo that was affected by the conntrack overflow described
						in this post. Covers the deployment architecture, observability stack, and goals for the demo.
					</li>
					<li>
						<a href="/blog/deploying-torrust-tracker-with-the-deployer"
							>Deploying the Torrust Tracker Demo with the Torrust Tracker Deployer</a
						>
						— Step-by-step walkthrough of deploying the Hetzner tracker demo using the Torrust Tracker
						Deployer, including the sysctl and kernel module changes introduced to fix this conntrack
						issue.
					</li>
					<li>
						<a href="/blog/setup-udp-tracker-behind-floating-ip"
							>How to Run a UDP Tracker Behind a Floating IP on Ubuntu</a
						>
						— A companion networking guide covering policy routing, Docker IPv6 networking, and SNAT for
						correct UDP reply paths — closely related problems to the one described here.
					</li>
					<li>
						<a href="/blog/submitting-trackers-to-newtrackon">Submitting Trackers to newTrackon</a>
						— How to register your tracker with newTrackon, the uptime-monitoring service used throughout
						this post to detect and confirm the conntrack problem.
					</li>
					<li>
						<a href="/blog/visualize-tracker-metrics-prometheus-grafana"
							>Visualize Tracker Metrics with Prometheus and Grafana</a
						>
						— How to set up the observability stack used to monitor the Torrust Tracker. Pairs well with
						the monitoring commands in this post for a complete view of tracker health.
					</li>
					<li>
						<a href="/blog/containerizing-rust-applications-best-practices"
							>Containerizing Rust Applications</a
						>
						— Best practices for building and running Torrust services in Docker, including the bridge
						networking configuration that makes conntrack tuning necessary.
					</li>
				</ul>

				<h3>Official Documentation</h3>
				<ul>
					<li>
						<a href="https://www.kernel.org/doc/html/latest/networking/nf_conntrack-sysctl.html"
							>Linux kernel: Netfilter Conntrack Sysfs variables</a
						>
						— The authoritative reference for every <code>nf_conntrack_*</code> sysctl parameter,
						including the default values for <code>nf_conntrack_udp_timeout</code> (30 s),
						<code>nf_conntrack_udp_timeout_stream</code> (120 s), and
						<code>nf_conntrack_max</code>.
					</li>
					<li>
						<a href="https://docs.docker.com/engine/network/port-publishing/"
							>Docker Engine: Port publishing and mapping</a
						>
						— Explains how Docker uses NAT, PAT, and masquerading to forward traffic to published container
						ports, and the role of iptables firewall rules in that process.
					</li>
					<li>
						<a href="https://docs.docker.com/engine/network/firewall-iptables/"
							>Docker Engine: Docker with iptables</a
						>
						— Documents the custom iptables chains Docker creates (including the
						<code>DOCKER</code> <code>nat</code> table for port-mapping) and notes that packets in
						the <code>DOCKER-USER</code> chain have already been DNAT-rewritten — confirming why the
						<code>conntrack</code> extension is required to match original IP/port.
					</li>
					<li>
						<a href="https://docs.docker.com/engine/network/packet-filtering-firewalls/"
							>Docker Engine: Packet filtering and firewalls</a
						>
						— Overview of Docker's firewall rule model for bridge networks, including masquerading and
						the interaction with external firewall tools.
					</li>
					<li>
						<a href="https://docs.docker.com/engine/network/drivers/bridge/"
							>Docker Engine: Bridge network driver</a
						>
						— Covers how Docker's default bridge network works, including IP masquerading and port publishing
						to host addresses.
					</li>
				</ul>

				<h2 id="lessons">Lessons</h2>
				<ul>
					<li>
						<strong>The application log is not enough.</strong> For kernel-level drops, check
						<code>dmesg</code> and <code>/proc/sys/net/netfilter/</code>.
					</li>
					<li>
						<strong>A larger server can make conntrack exhaustion worse, not better.</strong>
						More throughput fills the table faster if the table size is unchanged.
					</li>
					<li>
						<strong>Always pre-load the module.</strong> Without
						<code>/etc/modules-load.d/conntrack.conf</code>, the sysctl settings will not survive a
						reboot.
					</li>
					<li>
						<strong>This affects any UDP service behind Docker bridge networking</strong> at non-trivial
						request rates — not just BitTorrent trackers. DNS resolvers, game servers, VoIP services,
						and QUIC-based applications are equally vulnerable.
					</li>
					<li>
						<strong>Reducing UDP timeouts is safe for request–response protocols.</strong> A BitTorrent
						announce completes in milliseconds. The default 120-second stream timeout exists for stateful
						protocols; for stateless UDP services, shorter timeouts are appropriate and dramatically increase
						effective table capacity.
					</li>
					<li>
						<strong>Monitor conntrack fill level proactively.</strong> An alert at 80 % gives you time
						to respond before packets start dropping.
					</li>
					<li>
						<strong>Resize the hash table when you raise the ceiling.</strong>
						<code>nf_conntrack_max</code> and the bucket count (<code>hashsize</code>) are
						independent. Raising one without the other turns O(1) lookups into O(n) chain walks.
					</li>
					<li>
						<strong>Consider eliminating the problem instead of tuning around it.</strong>
						<code>--network=host</code>, <code>NOTRACK</code> rules, and the <code>macvlan</code> driver
						all remove conntrack from the path entirely. Sysctl tuning is the right call when you need
						bridge networking; otherwise it is treating a symptom.
					</li>
					<li>
						<strong>
							<code>NOTRACK</code> is harder than it looks in a multi-container Docker setup.
						</strong>
						A port-level rule does not catch flows that traverse loopback or the Docker bridge (statsd,
						healthchecks, container-to-container traffic), and disabling tracking on a NAT-published port
						breaks Docker's DNAT. We tried it twice on the DigitalOcean demo and reverted both times —
						see
						<a href="https://github.com/torrust/torrust-demo/issues/72">torrust/torrust-demo#72</a>.
					</li>
				</ul>
			</div>
		</div>
	</PagesWrapper>
	<PrevNextPost currentPage={currentPost.slug} {allPosts} />
	<div class="related-posts-container">
		<h2>Related Posts:</h2>
		<div class="grid">
			{#each data.allPosts.slice(0, 3) as post}
				<a href="/blog/{post.slug}">
					<BlogPreview post_data={post} />
				</a>
			{/each}
		</div>
	</div>
</Post>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	/* ── Layout ──────────────────────────────────────────── */

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		max-width: 1150px;
	}

	.content-preview {
		flex: 1;
		word-break: keep-all;
		padding-top: 2rem;
	}

	/* ── Typography ──────────────────────────────────────── */

	h2 {
		font-size: 1.8rem;
		font-weight: bold;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	h3 {
		font-size: 1.5rem;
		font-weight: bold;
		padding-top: 1.25rem;
	}

	p {
		font-size: 1rem;
		padding-top: 1rem;
		color: rgba(245, 245, 245, 0.8);
		word-break: keep-all;
	}

	a {
		word-break: keep-all;
		color: rgba(254, 13, 0, 1);
	}

	ul {
		display: flex;
		flex-direction: column;
		list-style-type: disc;
		margin: 0;
		padding-left: 1.5rem;
		word-break: keep-all;
	}

	ul li {
		margin: 0.25rem 0;
		word-break: keep-all;
	}

	code {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	.content-preview > p,
	.content-preview > ul,
	.content-preview > h2,
	.content-preview > h3 {
		margin-bottom: 1rem;
	}

	/* ── Related posts ───────────────────────────────────── */

	.related-posts-container {
		display: flex;
		flex-direction: column;
		color: rgba(245, 245, 245, 0.96);
		margin: 0 auto;
		text-align: center;
		padding-top: 2rem;

		@include bp.for-desktop-up {
			max-width: 1176px;
		}
	}

	.grid {
		padding-top: 3rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 24px;
		max-width: 1200px;
		margin: 0 auto;
		padding-inline: 2.5rem;

		@include bp.for-phone-only {
			grid-template-columns: 1fr;
		}

		@include bp.for-tablet-landscape-up {
			grid-template-columns: 1fr 1fr;
		}

		@include bp.for-desktop-up {
			grid-template-columns: 1fr 1fr 1fr;
			padding-inline: 0;
		}
	}

	/* ── Responsive wrapper + TOC ────────────────────────── */

	@include bp.for-desktop-up {
		.wrapper {
			flex-direction: row;
			gap: 4rem;
		}

		.wrapper :global(.toc) {
			position: sticky;
			top: 4rem;
			height: min-content;
		}

		.content-preview {
			overflow-y: auto;
			padding-top: 0rem;
		}
	}
</style>
