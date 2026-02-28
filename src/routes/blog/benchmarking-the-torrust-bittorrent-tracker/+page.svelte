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
	import Image from '$lib/components/atoms/Image.svelte';
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
					In the ever-evolving landscape of BitTorrent technology, performance and scalability are
					paramount. Torrust stands at the forefront, offering a suite of open-source software
					products designed to enhance peer-to-peer file sharing. At the heart of this suite is the <a
						href="https://github.com/torrust/torrust-tracker">Torrust BitTorrent Tracker</a
					>, a Rust-based engine crafted for efficiency and speed. This post will introduce you to
					the benchmarking tools we are using at the moment for the tracker. It will also shed light
					on its performance and how it stacks up against its contemporaries.
				</p>
				<p>
					Before going into details we should explain what are the tradeoffs we did on the design of
					the Torrust Tracker. Our goal is to design a robust, reliable and fast tracker but at the
					same time a feature-reach and sustainable one. Very often those two groups of objectives
					are exclusive. We know that being the fastest tracker implies some drawbacks. In general,
					our rule is:
				</p>

				<Callout type="info">
					"Embracing a slight slowdown for substantial benefits underlines our commitment to
					delivering a tracker that's not just fast but also rich in features and usability."
				</Callout>

				<p>
					We decided to use Rust due to its speed and memory-safe features but we also wanted to
					build a tracker with the following features:
				</p>

				<ul>
					<li>
						A <strong>comprehensive API</strong> that allow users to perform any action or extract any
						data from the tracker.
					</li>
					<li>
						A <strong>good support for observability</strong>. For example, a logging system that
						allow users to detect errors or extract statistics. The logging has several levels.
						Enabling more verbose logging affects performance. But if you are only interested in
						performance you can disable logging. Observability it&#39;s also related to testing.
						Code without support for observability it&#39;s usually hard to test too.
					</li>
					<li>
						A <strong>sustainable code</strong>. Very often &quot;fast code&quot; means &quot;direct
						code&quot; without abstraction layers and separation of concerns, but that leads to code
						that is hard to maintain and eventually to a death project. It&#39;s hard to attract
						maintainers for open-source projects that are hard to understand. And even if it&#39;s
						not hard to understand it&#39;s usually hard to change because there are no independent
						parts that can be changed independently.
					</li>
				</ul>

				<h2 id="understating-the-tracker">Understating The Tracker</h2>
				<p>
					BitTorrent trackers play a crucial role in the file-sharing ecosystem, acting as
					intermediaries that facilitate the transfer of files among users. By tracking peer
					locations and helping them connect, these trackers ensure the swift and reliable
					distribution of data.
				</p>
				<p>
					Before benchmarking the tracker is important to know the internal architecture of the
					tracker. A deep dive into the Torrust Tracker&#39;s architecture reveals a four-layer
					design, crucial for benchmarking accuracy.
				</p>
				<p>
					The first layer is the delivery layer. Clients can connect to the tracker in different
					ways: using the HTTP tracker, the UDP tracker, the tracker API or console commands.
					Internally all requests are routed through application services and reaching the main
					tracker domain service that handles the <code>announce</code> and <code>scrape</code> requests.
					At the lowest level the tracker service stores all the information in different data structures.
					One of them is the torrent repository that holds the list of torrents. Each torrent entry on
					the list contains statistics like how many peers have downloaded the torrent and the list of
					peers for that torrent (swarm).
				</p>

				<Image
					src="/images/posts/benchmarking-the-torrust-bittorrent-tracker/torrust-tracker-simplified-architecture.png"
					alt="Torrust Architecture"
				/>

				<h2 id="benchmarking-methodology">Benchmarking Methodology</h2>
				<p>Our benchmarking approach encompasses three pivotal areas:</p>

				<ul>
					<li>
						<strong>Internal repository benchmarking</strong>: Evaluating the repository within the
						tracker responsible for managing peer lists across torrents.
					</li>
					<li>
						<strong>End-to-End benchmarking</strong>: Utilizing an external UDP tracker load test
						tool from the aquatic repository to simulate some real-world scenarios.
					</li>
					<li>
						<strong>Comparative Benchmarking with other trackers</strong>: Employing the
						&quot;Bencher&quot; from the Aquatic GitHub repository to compare the Torrust Tracker
						against notable implementations like
						<a href="https://erdgeist.org/arts/software/opentracker/">opentracker</a>,
						<a href="https://github.com/chihaya/chihaya">Chihaya</a>, and
						<a href="https://github.com/greatest-ape/aquatic">aquatic</a> itself.
					</li>
				</ul>

				<h2 id="internal-repository-benchmarking">Internal Repository Benchmarking</h2>
				<p>
					Basically a tracker is just a shared data structure between all the BitTorrent peers.
					Peers announce themselves and the tracker builds up a list of torrents. For each torrent,
					the tracker keeps a list of peers interested in that torrent. The in-memory data structure
					is an array of structures that look like this one (example in JSON):
				</p>

				<CodeBlock
					lang="json"
					code={`{
	"info_hash": "090c6d4fb3a03191c4ef1fda6236ef0efb2d5c10",
	"seeders": 1,
	"completed": 1,
	"leechers": 0,
	"peers": [
		{
			"peer_id": {
				"id": "0x2d71423030303030303030303030303030303031",
				"client": null
			},
			"peer_addr": "0.0.0.0:17548",
			"updated": 1709916034742,
			"updated_milliseconds_ago": 1709916034742,
			"uploaded": 0,
			"downloaded": 0,
			"left": 0,
			"event": "Completed"
		}
	]
}`}
				/>

				<p>
					There are many ways to keep this information in memory. The access to this data is
					actually a bottleneck. Eventually all requests hit this structure. The problem is all <code
						>announce</code
					> requests need to update this structure. Due to Rust owning rules, only the owner can write
					into this struct. We have been trying different implementations to minimize contention. There
					is a trait for the torrent &quot;Repository&quot;. You can benchmark the different repository
					implementations by running the following command:
				</p>

				<CodeBlock
					lang="bash"
					code={`cargo run --release -p torrust-torrent-repository-benchmarks -- --threads 4 --sleep 0 --compare true`}
				/>

				<p>The output at the time of writing this post is:</p>

				<CodeBlock
					lang="bash"
					code={`tokio::sync::RwLock<std::collections::BTreeMap<InfoHash, Entry>>
add_one_torrent: Avg/AdjAvg: (60ns, 59ns)
update_one_torrent_in_parallel: Avg/AdjAvg: (10.909457ms, 0ns)
add_multiple_torrents_in_parallel: Avg/AdjAvg: (13.88879ms, 0ns)
update_multiple_torrents_in_parallel: Avg/AdjAvg: (7.772484ms, 7.782535ms)\n
std::sync::RwLock<std::collections::BTreeMap<InfoHash, Entry>>
add_one_torrent: Avg/AdjAvg: (43ns, 39ns)
update_one_torrent_in_parallel: Avg/AdjAvg: (4.020937ms, 4.020937ms)
add_multiple_torrents_in_parallel: Avg/AdjAvg: (5.896177ms, 5.768448ms)
update_multiple_torrents_in_parallel: Avg/AdjAvg: (3.883823ms, 3.883823ms)\n
std::sync::RwLock<std::collections::BTreeMap<InfoHash, Arc<std::sync::Mutex<Entry>>>>
add_one_torrent: Avg/AdjAvg: (51ns, 49ns)
update_one_torrent_in_parallel: Avg/AdjAvg: (3.252314ms, 3.149109ms)
add_multiple_torrents_in_parallel: Avg/AdjAvg: (8.411094ms, 8.411094ms)
update_multiple_torrents_in_parallel: Avg/AdjAvg: (4.106086ms, 4.106086ms)\n
tokio::sync::RwLock<std::collections::BTreeMap<InfoHash, Arc<std::sync::Mutex<Entry>>>>
add_one_torrent: Avg/AdjAvg: (91ns, 90ns)
update_one_torrent_in_parallel: Avg/AdjAvg: (3.542378ms, 3.435695ms)
add_multiple_torrents_in_parallel: Avg/AdjAvg: (15.651172ms, 15.651172ms)
update_multiple_torrents_in_parallel: Avg/AdjAvg: (4.368189ms, 4.257572ms)\n
tokio::sync::RwLock<std::collections::BTreeMap<InfoHash, Arc<tokio::sync::Mutex<Entry>>>>
add_one_torrent: Avg/AdjAvg: (111ns, 109ns)
update_one_torrent_in_parallel: Avg/AdjAvg: (6.590677ms, 6.808535ms)
add_multiple_torrents_in_parallel: Avg/AdjAvg: (16.572217ms, 16.30488ms)
update_multiple_torrents_in_parallel: Avg/AdjAvg: (4.073221ms, 4.000122ms)
					`}
				/>

				<p>We are benchmarking four scenarios that we think are the most relevant:</p>

				<ul>
					<li>
						<strong>Adding one torrent</strong>: How long it takes to add a new torrent to the
						tracker when there is only one peer. We run it several times sequentially to calculate
						the average.
					</li>
					<li>
						<strong>Update one torrent in parallel</strong>: This is the same as the previous one
						but running updates in parallel, meaning we spawn some threads to make the same request.
						This case tries to simulate the case where multiple peers try to announce the same
						torrent, so they are competing to write on the same repository entry, which contains the
						peer list.
					</li>
					<li>
						<strong>Add multiple torrents in parallel</strong>: In this case, the same peer is
						adding different torrents at the same time. This case tries to simulate many peers
						announcing different torrents, so they are not conflicting to access the same peer list.
					</li>
					<li>
						<strong>Update multiple torrents in parallel</strong>: Finally, this case is the same as
						the previous one, but we prefill the repository with all the torrents. This tries to
						simulate an scenario where multiple peers are announcing multiple torrents but the
						torrent entries already exists. The main different in this case is that the application
						might not need to allocate more memory to increase the data structure. So the problem is
						reduced to contention or locking (how many writes we can do in parallel on the same peer
						list).
					</li>
				</ul>

				<p>
					At the moment we are trying with other data structures that allow concurrent updates like <a
						href="https://docs.rs/dashmap/latest/dashmap/">DashMap</a
					>. See
					<a href="https://github.com/torrust/torrust-tracker/issues/565"
						>https://github.com/torrust/torrust-tracker/issues/565</a
					>.
				</p>
				<h2 id="e2e-udp-benchmarking">E2E UDP Benchmarking</h2>
				<p>
					We have been using one of the aquatic packages to test the UDP tracker performance as a
					whole service.
				</p>
				<p>
					<a href="https://github.com/greatest-ape/aquatic">Aquatic</a> is a high-performance open BitTorrent
					tracker including a lot a packages. One of the tools provided by Aquatic is a UDP load test
					command.
				</p>
				<p>
					In order to test the Torrust Tracker with the &quot;UDP load test&quot; tool you need to
					run both the tracker and this tester.
				</p>
				<h3 id="running-the-torrust-tracker">Running the Torrust Tracker</h3>
				<p>
					You can follow the <a href="https://docs.rs/torrust-tracker"
						>Torrust Tracker documentation</a
					>
					to install the tracker but there is an especial configuration for benchmarking. First at all,
					you should build the tracker for release (<code>--release</code>) and you should also
					disable all services. Finally you should set the logging level to <code>error</code>.
				</p>

				<Callout type="info">
					Logging levels are: `Off`, `Error`, `Warn`, `Info`, `Debug` and `Trace`. The more you
					increase the log level and the verbosity the worse the performance results are.
				</Callout>

				<p>
					We provide a especial configuration for benchmarking <code
						>./share/default/config/tracker.udp.benchmarking.toml</code
					> with the best configuration to test the performance of the UDP tracker. After cloning the
					tracker repo you can build and run it with:
				</p>

				<CodeBlock
					lang="bash"
					code={`cargo build --release
TORRUST_TRACKER_PATH_CONFIG="./share/default/config/tracker.udp.benchmarking.toml" ./target/release/torrust-tracker`}
				/>

				<h3 id="running-the-aquatic-udp-load-test">Running The Aquatic UDP Load Test</h3>

				<p>
					For updated instructions about how to setup the tool please follow the <a
						href="https://github.com/greatest-ape/aquatic/tree/master/crates/"
						>official documentation</a
					>.
				</p>

				<CodeBlock
					lang="bash"
					code={`cd /tmp
git clone git@github.com:greatest-ape/aquatic.git
cd aquatic
cargo build --release -p aquatic_udp_load_test
./target/release/aquatic_udp_load_test -p > "load-test-config.toml"`}
				/>

				<p>
					The last line <code
						>./target/release/aquatic_udp_load_test -p &gt; &quot;load-test-config.toml&quot;</code
					>
					generates a config file. At least you will need to change the UDP port from
					<code>3000</code>
					to <code>6969</code> which is the default one in the Torrust Tracker. You can also edit other
					options like how many requests of each type you want to make.
				</p>

				<p>Edit the <code>load-test-config.toml</code>:</p>

				<CodeBlock
					lang="bash"
					code={`# ...
server_address = "127.0.0.1:6969"
# ...
# Probability that a generated request is a connect request as part
# of sum of the various weight arguments.
weight_connect = 50
# Probability that a generated request is a announce request, as part
# of sum of the various weight arguments.
weight_announce = 50
# Probability that a generated request is a scrape request, as part
# of sum of the various weight arguments.
weight_scrape = 1
# ...`}
				/>

				<p>Finally you can run the test with:</p>

				<CodeBlock
					lang="toml"
					code={`./target/release/aquatic_udp_load_test -c "load-test-config.toml"`}
				/>

				<h3 id="test-results">Test Results</h3>
				<p>Just as an example we show the test results with a non dedicated machine.</p>
				<p><strong>Machine used for the test</strong>:</p>

				<ul>
					<li>RAM: 64GiB</li>
					<li>Processor: AMD Ryzen 9 7950X x 32</li>
					<li>Graphics: AMD Radeon Graphics / Intel Arc A770 Graphics (DG2)</li>
					<li>OS: Ubuntu 23.04</li>
					<li>OS Type: 64-bit</li>
					<li>Kernel Version: Linux 6.2.0-20-generic</li>
				</ul>

				<p><strong>Test result</strong>:</p>

				<CodeBlock
					lang="bash"
					code={`Requests out: 388702.94/second
Responses in: 349832.25/second
	- Connect responses:  173325.85
	- Announce responses: 173061.13
	- Scrape responses:   3445.27
	- Error responses:    0.00
Peers per announce response: 0.00
Announce responses per info hash:
	- p10: 1
	- p25: 1
	- p50: 1
	- p75: 1
	- p90: 2
	- p95: 3
	- p99: 106
	- p99.9: 283
	- p100: 357`}
				/>

				<h2 id="comparative-udp-benchmarking-with-other-trackers">
					Comparative UDP Benchmarking With Other Trackers
				</h2>

				<p>
					Aquatic also provides a tool to compare how several trackers perform on the same machine.
					At the moment they support these tracker:
				</p>

				<ul>
					<li><a href="https://erdgeist.org/arts/software/opentracker/">opentracker</a>.</li>
					<li><a href="https://github.com/chihaya/chihaya">Chihaya</a>.</li>
					<li><a href="https://github.com/greatest-ape/aquatic">aquatic</a>.</li>
				</ul>

				<p>
					We've opened a <a href="https://github.com/greatest-ape/aquatic/pull/191">PR</a> to add support
					to the Torrust Tracker too.
				</p>
				<p>In order to run the Bencher you need to install all the trackers first.</p>

				<h3 id="setup-the-chihaya-tracker">Setup The Chihaya Tracker</h3>
				<p>
					Follow the <a href="https://github.com/chihaya/chihaya">official documentation</a>. You
					will need to install Go:
				</p>

				<CodeBlock lang="bash" code={`sudo apt install golang-go`} />

				<h3 id="setup-the-opentracker-tracker">Setup The Opentracker Tracker</h3>
				<p>
					You can<code>make</code>it from sources following the
					<a href="https://erdgeist.org/arts/software/opentracker/#toc-entry-3"
						>official documentation</a
					> or install it on Ubuntu with:
				</p>

				<CodeBlock
					lang="bash"
					code={`cd /tmp
cvs -d :pserver:cvs@cvs.fefe.de:/cvs -z9 co libowfat
cd libowfat
make
cd ..
git clone git://erdgeist.org/opentracker
cd opentracker
make
cp opentracker ~/bin
opentracker -h`}
				/>

				<Callout type="info">
					NOTICE: Installing the opentracker from Ubuntu repositories did not work for us. Maybe
					arguments to run the application have changes in recent versions.
				</Callout>

				<h3 id="setup-the-aquatic-tracker">Setup The Aquatic Tracker</h3>
				<p>
					You can follow the <a
						href="https://github.com/greatest-ape/aquatic/tree/master/crates/udp"
						>official documentation</a
					>. At the moment this is the process:
				</p>

				<CodeBlock
					lang="bash"
					code={`sudo apt update && sudo apt upgrade -y
sudo apt-get install libhwloc-dev
cd /tmp
git clone git@github.com:greatest-ape/aquatic.git
cd aquatic
cargo build --profile=release-debug --all-features -p aquatic_udp`}
				/>

				<Callout type="info">NOTICE: `libhwloc-dev` is needed for `io-uring` feature.</Callout>

				<h3 id="running-the-bencher">Running The Bencher</h3>
				<p>
					You don't need to run the trackers manually the Bencher does it. First you need to build
					the Bencher:
				</p>

				<CodeBlock
					lang="bash"
					code={`cd /tmp
git clone git@github.com:greatest-ape/aquatic.git
cd aquatic
cargo build --profile=release-debug -p aquatic_bencher`}
				/>

				<p>And then you can run it with:</p>

				<Callout type="info">
					If you also want to include the Torrust Tracker make sure you use the fork in the <a
						href="https://github.com/greatest-ape/aquatic/pull/191">PR</a
					>.
				</Callout>

				<h3 id="bencher-results">Bencher Results</h3>
				<p>Again, this is only an example with the test result using a non dedicated machine.</p>
				<p>Machine used for the test:</p>

				<ul>
					<li>RAM: 64GiB</li>
					<li>Processor: AMD Ryzen 9 7950X x 32</li>
					<li>Graphics: AMD Radeon Graphics / Intel Arc A770 Graphics (DG2)</li>
					<li>OS: Ubuntu 23.04</li>
					<li>OS Type: 64-bit</li>
					<li>Kernel Version: Linux 6.2.0-20-generic</li>
				</ul>

				<p>Bencher result:</p>

				<CodeBlock
					lang="bash"
					code={`# Benchmark report

Total number of load test runs: 72
Estimated duration: 0 hours, 44 minutes

## Tracker cores: 1 (cpus: 0,16)
### aquatic_udp run (socket workers: 1) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 351,834
- Average tracker CPU utilization: 95.5%
- Peak tracker RSS: 192.5 MiB
### aquatic_udp run (socket workers: 1) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 372,991
- Average tracker CPU utilization: 95.5%
- Peak tracker RSS: 191.9 MiB
### aquatic_udp (io_uring) run (socket workers: 1) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 389,576
- Average tracker CPU utilization: 95.5%
- Peak tracker RSS: 214 MiB
### aquatic_udp (io_uring) run (socket workers: 1) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 409,824
- Average tracker CPU utilization: 95.5%
- Peak tracker RSS: 214.7 MiB
### opentracker run (workers: 0) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 297,698
- Average tracker CPU utilization: 95.5%
- Peak tracker RSS: 71.7 MiB
### opentracker run (workers: 0) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 307,874
- Average tracker CPU utilization: 95.5%
- Peak tracker RSS: 72 MiB
### opentracker run (workers: 1) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 343,570
- Average tracker CPU utilization: 95.4%
- Peak tracker RSS: 72 MiB
### opentracker run (workers: 1) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 378,880
- Average tracker CPU utilization: 95.3%
- Peak tracker RSS: 72.2 MiB
### chihaya run () (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 115,159
- Average tracker CPU utilization: 190%
- Peak tracker RSS: 863.4 MiB
### chihaya run () (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 113,002
- Average tracker CPU utilization: 190%
- Peak tracker RSS: 867.4 MiB
### torrust-tracker run () (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 222,330
- Average tracker CPU utilization: 189%
- Peak tracker RSS: 193.3 MiB
### torrust-tracker run () (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 216,407
- Average tracker CPU utilization: 189%
- Peak tracker RSS: 191.8 MiB
## Tracker cores: 2 (cpus: 0-1,16-17)
### aquatic_udp run (socket workers: 2) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 699,783
- Average tracker CPU utilization: 191%
- Peak tracker RSS: 195.6 MiB
### aquatic_udp run (socket workers: 2) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 804,774
- Average tracker CPU utilization: 191%
- Peak tracker RSS: 193.9 MiB
### aquatic_udp (io_uring) run (socket workers: 2) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 749,745
- Average tracker CPU utilization: 190%
- Peak tracker RSS: 237.4 MiB
### aquatic_udp (io_uring) run (socket workers: 2) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 797,605
- Average tracker CPU utilization: 190%
- Peak tracker RSS: 239 MiB
### opentracker run (workers: 2) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 692,167
- Average tracker CPU utilization: 190%
- Peak tracker RSS: 71.5 MiB
### opentracker run (workers: 2) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 780,108
- Average tracker CPU utilization: 190%
- Peak tracker RSS: 72 MiB
### chihaya run () (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 185,137
- Average tracker CPU utilization: 371%
- Peak tracker RSS: 8.2 GiB
### chihaya run () (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 186,243
- Average tracker CPU utilization: 380%
- Peak tracker RSS: 7.1 GiB
### torrust-tracker run () (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 415,864
- Average tracker CPU utilization: 374%
- Peak tracker RSS: 188.4 MiB
### torrust-tracker run () (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 407,551
- Average tracker CPU utilization: 375%
- Peak tracker RSS: 188.9 MiB
## Tracker cores: 4 (cpus: 0-3,16-19)
### aquatic_udp run (socket workers: 4) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 1,270,832
- Average tracker CPU utilization: 369%
- Peak tracker RSS: 194.9 MiB
### aquatic_udp run (socket workers: 4) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 1,482,250
- Average tracker CPU utilization: 382%
- Peak tracker RSS: 194.9 MiB
### aquatic_udp (io_uring) run (socket workers: 4) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 1,217,457
- Average tracker CPU utilization: 354%
- Peak tracker RSS: 237.9 MiB
### aquatic_udp (io_uring) run (socket workers: 4) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 1,618,228
- Average tracker CPU utilization: 381%
- Peak tracker RSS: 284.3 MiB
### opentracker run (workers: 4) (load test workers: 8, cpus: 8-15,24-31)
- Average responses per second: 1,348,825
- Average tracker CPU utilization: 381%
- Peak tracker RSS: 71.5 MiB
### opentracker run (workers: 4) (load test workers: 12, cpus: 4-15,20-31)
- Average responses per second: 1,546,907
- Average tracker CPU utilization: 381%
- Peak tracker RSS: 71 MiB
### chihaya run () (load test workers: 8, cpus: 8-15,24-31)
...
					`}
				/>

				<Callout type="info">
					<strong>IMPORTANT</strong>: The test was run is a non dedicated machine running other
					tasks. It&#39;s just an example. You can get the latest results with dedicated machine on
					the <a href="https://github.com/greatest-ape/aquatic">Aquatic</a> repo.
				</Callout>

				<p>The extracted and ordered results for 1 core are:</p>
				<p>Average responses per second with 8 load test workers and cpus: 8-15,24-31</p>

				<ol>
					<li><strong>389,576</strong> aquatic (io_uring)</li>
					<li><strong>351,834</strong> aquatic</li>
					<li><strong>343,570</strong> opentracker (workers 1)</li>
					<li><strong>297,698</strong> opentracker (workers 0)</li>
					<li><strong>222,330</strong> torrust-tracker</li>
					<li><strong>115,159</strong> chihaya</li>
				</ol>

				<p>Average responses per second with 12 load test workers and cpus: 4-15,20-31</p>

				<ol>
					<li><strong>409,824</strong> aquatic (io_uring)</li>
					<li><strong>378,880</strong> opentracker (workers 1)</li>
					<li><strong>372,991</strong> aquatic</li>
					<li><strong>307,874</strong> opentracker (workers 0)</li>
					<li><strong>216,407</strong> torrust-tracker</li>
					<li><strong>113,002</strong> chihaya</li>
				</ol>

				<p>
					The <a
						href="https://github.com/greatest-ape/aquatic/blob/master/documents/aquatic-udp-load-test-2024-02-10.md"
						>latest official results</a
					> (2024-02-10):
				</p>
				<Image
					src="/images/posts/benchmarking-the-torrust-bittorrent-tracker/aquatic-bencher-average-responses-per-second.png"
					alt="Torrust Architecture"
				/>

				<Callout type="info">
					The Aquatic &quot;Bencher&quot; uses the Aquatic &quot;UDP load test&quot;.
				</Callout>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					As you have seen we are collecting metrics to improve the tracker and avoid performance
					regressions, by using these benchmarking tools provided by Aquatic. Although performance
					is important there are other factor like horizontal scalability that are even more
					critical because sooner or later no matter how powerful is your machine it will be not
					enough the handle all the requests. But that is our of the scope of this article.
				</p>
				<p>
					On the other hand, we have analyzed performance only from the point of view of number of
					request handled per second. Memory consumption should be also considered. We have started
					instrumenting the application to track memory consumption. See <a
						href="https://github.com/torrust/torrust-tracker/issues/567"
						>https://github.com/torrust/torrust-tracker/issues/567</a
					>.
				</p>
				<p>If you see something wrong or you want to contribute by:</p>

				<ul>
					<li>Adding new sections.</li>
					<li>Fixing typos.</li>
					<li>Making it clearer.</li>
					<li>Adding links.</li>
					<li>Or whatever you think that could be interesting to have,</li>
				</ul>

				<p>
					please open an <a href="https://github.com/torrust/torrust-website/issues">issue</a> or a
					<a href="https://github.com/torrust/torrust-website/pulls">PR</a>.
				</p>
				<p>
					If you have any questions or issues please open an issue in the corresponding repository:
				</p>

				<ul>
					<li>
						Torrust Tracker: <a href="https://github.com/torrust/torrust-tracker/issues"
							>https://github.com/torrust/torrust-tracker/issues</a
						>
					</li>
					<li>
						Torrust Index: <a href="https://github.com/torrust/torrust-index/issues"
							>https://github.com/torrust/torrust-index/issues</a
						>
					</li>
					<li>
						Torrust Website: <a href="https://github.com/torrust/torrust-index-gui/issues"
							>https://github.com/torrust/torrust-index-gui/issues</a
						>
					</li>
					<li>
						Torrust Compose: <a href="https://github.com/torrust/torrust-compose"
							>https://github.com/torrust/torrust-compose</a
						>
					</li>
					<li>
						Containerizing Rust Applications Examples: <a
							href="https://github.com/torrust/containerizing-rust-apps-examples"
							>https://github.com/torrust/containerizing-rust-apps-examples</a
						>
					</li>
				</ul>

				<p>
					We very welcome any contributions to the projects or <a
						href="https://github.com/torrust/torrust-website/issues">this article</a
					>.
				</p>
				<h2 id="links">Links</h2>
				<p>Other trackers:</p>

				<ul>
					<li><a href="https://github.com/chihaya/chihaya">Chihaya</a>.</li>
					<li><a href="https://erdgeist.org/arts/software/opentracker/">opentracker</a>.</li>
					<li><a href="https://github.com/greatest-ape/aquatic">aquatic</a>.</li>
				</ul>

				<p>Crates for concurrent writes:</p>

				<ul>
					<li>
						<a href="https://docs.rs/dashmap/latest/dashmap/">DashMap</a>.
					</li>
				</ul>

				<p>Other links:</p>

				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/blob/develop/docs/benchmarking.md"
							>Torrust Tracker Benchmarking Docs</a
						>.
					</li>
					<li>
						<a href="https://github.com/greatest-ape/aquatic/tree/master/crates/udp_load_test"
							>Aquatic UDP load test tool</a
						>.
					</li>
					<li>
						<a href="https://github.com/greatest-ape/aquatic/tree/master/crates/bencher"
							>Aquatic Bencher</a
						>.
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

	h2 {
		font-size: 1.8rem;
		font-weight: bold;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	p {
		font-size: 1rem;
		padding-top: 1rem;
		color: rgba(245, 245, 245, 0.8);
		word-break: keep-all;
	}

	a {
		word-break: keep-all;
		color: var(--color-link);
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

	.content-preview > p,
	.content-preview > ul,
	.content-preview > h2 {
		margin-bottom: 1rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

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
