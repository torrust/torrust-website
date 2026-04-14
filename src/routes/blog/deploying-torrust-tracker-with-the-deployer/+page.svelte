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
	import Image from '$lib/components/atoms/Image.svelte';
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
				<p>Hello, Torrust community!</p>

				<p>
					We recently deployed the <strong>Torrust Tracker Demo</strong> — a fully public,
					production Torrust Tracker instance — using the
					<a href="https://github.com/torrust/torrust-tracker-deployer">Torrust Tracker Deployer</a
					>, our new tool for automating tracker deployments to virtual machines. Both the
					<a href="https://http1.torrust-tracker-demo.com/announce">HTTP tracker</a> (online since
					4-3-2026) and the
					<a href="udp://udp1.torrust-tracker-demo.com:6969/announce">UDP tracker</a> (online since
					6-3-2026) are running and monitored on
					<a href="https://newtrackon.com/">newTrackon</a>.
				</p>

				<p>
					We used this real deployment as an end-to-end test of the deployer itself. We found 11
					bugs — all of which have been fixed ahead of the upcoming v0.1.0 release. This post
					documents the full experience: the step-by-step tutorial for deploying your own tracker,
					the manual post-provision steps the deployer does not yet automate, and a troubleshooting
					appendix for the problems most likely to trip up first-time deployers.
				</p>

				<Callout type="warning">
					<strong>A note on complexity</strong>: This deployment may look more involved than the
					<a href="/blog/deploying-torrust-to-production">manual installation guide</a>. That is
					because we chose two production features that currently exceed the deployer's automation
					capabilities and require manual post-provision steps:
					<ul>
						<li>
							<strong>Floating IPs</strong> — static IPs that can be reassigned to a new server without
							changing DNS records, allowing zero-downtime server replacements and resizes.
						</li>
						<li>
							<strong>Attached storage volume</strong> — a separate disk for all persistent data, making
							it easy to back up or migrate data independently of the VM.
						</li>
					</ul>
					If you skip these two features and deploy to a single server with a direct IP, the deployer
					is significantly easier to use than the manual installation guide — the same end result, reduced
					to a handful of commands instead of dozens of manual steps.
				</Callout>

				<Callout type="info">
					<strong>Live Tracker Endpoints</strong>
					<ul>
						<li>
							<strong>HTTP:</strong>
							<a href="https://http1.torrust-tracker-demo.com/announce"
								>https://http1.torrust-tracker-demo.com/announce</a
							>
						</li>
						<li>
							<strong>UDP:</strong>
							<code>udp://udp1.torrust-tracker-demo.com:6969/announce</code>
						</li>
					</ul>
					Both are monitored on<a href="https://newtrackon.com/">newTrackon</a>.
				</Callout>

				<h2 id="background">Background</h2>

				<p>
					Back in 2023 we published a
					<a href="/blog/deploying-torrust-to-production">manual deployment guide</a> that walked through
					every step needed to get Torrust running on a Digital Ocean droplet. It worked, but it involved
					dozens of manual steps — SSH access, Nginx configuration, Let's Encrypt setup, tracker config
					files — things that get tedious when you need to recreate an environment or hand it off to someone
					else.
				</p>

				<p>
					In late 2025 we announced the
					<a href="/blog/introducing-the-torrust-tracker-deployer">Torrust Tracker Deployer</a>, a
					tool designed to reduce that entire process to a handful of commands. This post is the
					first real-world report of using it in production. All configuration used for the demo is
					published (with secrets masked) in the
					<a href="https://github.com/torrust/torrust-tracker-demo"
						>torrust-tracker-demo repository</a
					>.
				</p>

				<h2 id="what-we-deployed">What We Deployed</h2>

				<p>
					The demo runs six services on a single Hetzner Cloud server, all behind a Caddy reverse
					proxy with automatic Let's Encrypt certificates:
				</p>

				<table>
					<thead>
						<tr>
							<th>Service</th>
							<th>Endpoint</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>HTTP Tracker 1 (public)</td>
							<td
								><a href="https://http1.torrust-tracker-demo.com/announce"
									><code>https://http1.torrust-tracker-demo.com/announce</code></a
								></td
							>
						</tr>
						<tr>
							<td>HTTP Tracker 2 (private testing)</td>
							<td><code>https://http2.torrust-tracker-demo.com/announce</code></td>
						</tr>
						<tr>
							<td>UDP Tracker 1 (public)</td>
							<td><code>udp://udp1.torrust-tracker-demo.com:6969/announce</code></td>
						</tr>
						<tr>
							<td>UDP Tracker 2 (private testing)</td>
							<td><code>udp://udp2.torrust-tracker-demo.com:6868/announce</code></td>
						</tr>
						<tr>
							<td>REST API</td>
							<td
								><a href="https://api.torrust-tracker-demo.com"
									><code>https://api.torrust-tracker-demo.com</code></a
								></td
							>
						</tr>
						<tr>
							<td>Grafana</td>
							<td
								><a href="https://grafana.torrust-tracker-demo.com"
									><code>https://grafana.torrust-tracker-demo.com</code></a
								></td
							>
						</tr>
					</tbody>
				</table>

				<p>
					We intentionally keep <code>http2</code> and <code>udp2</code> off all public tracker lists.
					Once a tracker appears in public lists it receives a continuous stream of announces from BitTorrent
					clients worldwide. Keeping those endpoints quiet reserves them as low-traffic endpoints for
					manual testing and log analysis.
				</p>

				<p>Key configuration decisions:</p>

				<ul>
					<li>
						<strong>Server</strong>: Hetzner Cloud <code>ccx23</code> — 4 vCPU, 16 GB RAM, Nuremberg (nbg1)
					</li>
					<li><strong>OS</strong>: Ubuntu 24.04 LTS</li>
					<li>
						<strong>Database</strong>: MySQL (production-ready; SQLite is the dev default — see
						troubleshooting)
					</li>
					<li>
						<strong>HTTPS</strong>: Let's Encrypt production certificates via Caddy reverse proxy
					</li>
					<li><strong>Monitoring</strong>: Prometheus + Grafana included out of the box</li>
					<li>
						<strong>Storage</strong>: Separate 50 GB Hetzner volume mounted at
						<code>/opt/torrust/storage</code>
					</li>
					<li><strong>Backups</strong>: Daily automated backups at 03:00 UTC, 7-day retention</li>
				</ul>

				<h2 id="prerequisites">Prerequisites</h2>

				<p>Before running any deployer command, you need the following in place.</p>

				<h3 id="hetzner-account">Hetzner Account and Project</h3>

				<ol>
					<li>
						<a href="https://www.hetzner.com/cloud">Sign up</a> for Hetzner Cloud if you don't have an
						account.
					</li>
					<li>
						Create a new project in the
						<a href="https://console.hetzner.cloud/">Hetzner Console</a>. We named ours
						<code>torrust-tracker-demo.com</code>.
					</li>
					<li>
						Generate an API token with <strong>Read &amp; Write</strong> permissions: project →
						<em>Security</em> → <em>API Tokens</em> → <em>Generate API Token</em>. Copy it
						immediately — it won't be shown again.
					</li>
				</ol>

				<Image
					src="/images/posts/deploying-torrust-tracker-with-the-deployer/hetzner-api-token-read-write-permissions.webp"
					alt="Hetzner Console Generate API token dialog with Read and Write permissions selected"
				/>

				<h3 id="domain-dns">Domain and DNS</h3>

				<ol>
					<li>
						Register a domain and change its nameservers to Hetzner's:
						<ul>
							<li><code>helium.ns.hetzner.de</code></li>
							<li><code>hydrogen.ns.hetzner.com</code></li>
							<li><code>oxygen.ns.hetzner.com</code></li>
						</ul>
					</li>
					<li>
						Create a DNS zone for your domain in the Hetzner Console under <em>DNS</em>.
					</li>
				</ol>

				<Callout type="info">
					<strong>DNS delegation</strong>: DNS propagation can take up to 24 hours. Start this
					before the rest of the setup so it's ready by the time services need to reach their
					domains.
				</Callout>

				<h3 id="ssh-key">SSH Key Pair</h3>

				<p>
					The deployer uses an SSH key pair to connect to the provisioned VM. Generate a dedicated
					temporary key <strong>without a passphrase</strong> — automation tools like OpenTofu and Ansible
					cannot prompt for one, and the deployer will fail silently if the key is passphrase-protected:
				</p>

				<CodeBlock
					lang="bash"
					code={`ssh-keygen -t ed25519 -C "torrust-tracker-deployer" \\
  -f ~/.ssh/torrust_tracker_deployer_ed25519 -N ""`}
				/>

				<p>Tighten permissions on the private key:</p>

				<CodeBlock lang="bash" code={`chmod 600 ~/.ssh/torrust_tracker_deployer_ed25519`} />

				<Callout type="warning">
					<strong>Treat this as a temporary key.</strong> Because it has no passphrase, it must be
					handled with extra care:
					<ul>
						<li>
							Never reuse it for anything other than this deployment — one key per deployment
							environment.
						</li>
						<li>
							Once deployment is complete, remove it from the Hetzner project (Console → <em
								>Security → SSH Keys</em
							>) and delete the local files.
						</li>
						<li>
							For ongoing server access after deployment, add a separate, passphrase-protected key
							manually.
						</li>
						<li>
							If you are using an AI agent (e.g. Claude Code) to run the deployer on your behalf,
							use a temporary key scoped to this deployment only — especially if you are using a
							hosted model rather than a local LLM, since the key material could be included in
							context sent to the model.
						</li>
					</ul>
				</Callout>

				<h3 id="tools">Deployer Tool</h3>

				<p>
					The deployer supports two modes. For most users, Docker is the recommended choice — no
					Rust, Ansible, or OpenTofu installation required:
				</p>

				<CodeBlock
					lang="bash"
					code={`# Pull the latest image
docker pull torrust/tracker-deployer:latest

# Verify it works
docker run --rm torrust/tracker-deployer:latest --help`}
				/>

				<p>
					The image bundles OpenTofu (for infrastructure provisioning), Ansible (for server
					configuration), and SSH. If you prefer to run from source, the repository's README covers
					the native setup.
				</p>

				<h2 id="tutorial">Step-by-Step Deployment Tutorial</h2>

				<p>
					The deployer follows a strict linear lifecycle. Each command advances the environment to
					the next state, and commands can only be run in order:
				</p>

				<p>
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/create.md"
						><code>create template</code></a
					>
					→ <code>edit config</code> →
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/validate.md"
						><code>validate</code></a
					>
					→
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/create.md"
						><code>create environment</code></a
					>
					→
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/provision.md"
						><code>provision</code></a
					>
					→
					<code>(manual post-provision steps)</code> →
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/configure.md"
						><code>configure</code></a
					>
					→
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/release.md"
						><code>release</code></a
					>
					→
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/run.md"
						><code>run</code></a
					>
					→
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/test.md"
						><code>test</code></a
					>
				</p>

				<p>
					All commands below use Docker. Replace <code>torrust-tracker-demo</code> with your own environment
					name throughout.
				</p>

				<h2 id="step-create-template">Step 1 — Generate the Config Template</h2>

				<p>
					Start by generating a starter config file for the Hetzner provider. This creates a JSON
					file with all required fields and sensible placeholders:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  torrust/tracker-deployer:latest \\
  create template --provider hetzner \\
  /var/lib/torrust/deployer/envs/torrust-tracker-demo.json`}
				/>

				<p>Open the generated file and replace the placeholders. The key fields to fill in are:</p>

				<table>
					<thead>
						<tr>
							<th>Placeholder</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>REPLACE_WITH_ENVIRONMENT_NAME</code></td>
							<td><code>torrust-tracker-demo</code> (or your chosen name)</td>
						</tr>
						<tr>
							<td><code>REPLACE_WITH_SSH_PRIVATE_KEY_ABSOLUTE_PATH</code></td>
							<td
								><code>/home/deployer/.ssh/torrust_tracker_deployer_ed25519</code> (container path)</td
							>
						</tr>
						<tr>
							<td><code>REPLACE_WITH_SSH_PUBLIC_KEY_ABSOLUTE_PATH</code></td>
							<td
								><code>/home/deployer/.ssh/torrust_tracker_deployer_ed25519.pub</code> (container path)</td
							>
						</tr>
						<tr>
							<td><code>REPLACE_WITH_HETZNER_API_TOKEN</code></td>
							<td>Your Hetzner API token (never commit this)</td>
						</tr>
					</tbody>
				</table>

				<Callout type="warning">
					<strong>Container paths</strong>: When running via Docker, all file paths in the config
					must be container-internal paths (e.g. <code>/home/deployer/.ssh/...</code>), not host
					paths like <code>/home/yourname/.ssh/...</code>. The deployer mounts your
					<code>~/.ssh</code> directory into the container at <code>/home/deployer/.ssh/</code>.
					Using host paths will cause an immediate failure at
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/provision.md"
						><code>provision</code></a
					> time.
				</Callout>

				<p>
					Beyond filling in the placeholders, review these two settings before moving on — the
					template defaults are wrong for public production trackers:
				</p>

				<ol>
					<li>
						<strong>Bind addresses</strong>: The template defaults to <code>0.0.0.0</code> (IPv4
						only). For a public tracker, change all bind addresses to <code>[::]</code>, which
						accepts both IPv4 and IPv6 on Linux. Only the internal health-check API should stay on
						<code>127.0.0.1</code>.
					</li>
					<li>
						<strong>Database</strong>: The template silently selects SQLite. For any production
						deployment, change this to MySQL. See the
						<a href="#troubleshoot-sqlite">troubleshooting note</a> for details.
					</li>
				</ol>

				<p>A minimal excerpt of the final config for the demo deployment looks like this:</p>

				<CodeBlock
					lang="json"
					code={`{
  "environment": {
    "name": "torrust-tracker-demo",
    "instance_name": null
  },
  "ssh_credentials": {
    "private_key_path": "/home/deployer/.ssh/torrust_tracker_deployer_ed25519",
    "public_key_path": "/home/deployer/.ssh/torrust_tracker_deployer_ed25519.pub",
    "username": "torrust",
    "port": 22
  },
  "provider": {
    "provider": "hetzner",
    "api_token": "<HETZNER_API_TOKEN>",
    "server_type": "ccx23",
    "location": "nbg1",
    "image": "ubuntu-24.04"
  },
  "tracker": {
    "udp_trackers": [
      { "bind_address": "[::]:6969", "domain": "udp1.torrust-tracker-demo.com" },
      { "bind_address": "[::]:6868", "domain": "udp2.torrust-tracker-demo.com" }
    ],
    "http_trackers": [
      { "bind_address": "[::]:7070", "domain": "http1.torrust-tracker-demo.com" },
      { "bind_address": "[::]:7171", "domain": "http2.torrust-tracker-demo.com" }
    ],
    "http_api": {
      "bind_address": "[::]:1212",
      "domain": "api.torrust-tracker-demo.com"
    },
    "database": {
      "driver": "MySQL",
      "host": "mysql",
      "port": 3306,
      "name": "torrust_tracker",
      "username": "torrust",
      "password": "<TRACKER_DB_PASSWORD>"
    }
  }
}`}
				/>

				<Callout type="info">
					<strong>instance_name: null</strong>: Leaving <code>instance_name</code> as
					<code>null</code> makes the deployer auto-generate the server name as
					<code>torrust-tracker-vm-{'{env_name}'}</code> — in our case
					<code>torrust-tracker-vm-torrust-tracker-demo</code>. You can set a custom name if
					preferred.
				</Callout>

				<h2 id="step-validate">Step 2 — Validate the Config</h2>

				<p>Before creating the environment, validate the config file:</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  torrust/tracker-deployer:latest \\
  validate --env-file /var/lib/torrust/deployer/envs/torrust-tracker-demo.json \\
  --output-format json`}
				/>

				<p>
					The command validates file readability, JSON schema, and domain constraints (SSH key
					paths, naming rules, ports, IPs, and required fields). With <code
						>--output-format json</code
					>, a valid config returns a JSON summary:
				</p>

				<CodeBlock
					lang="json"
					code={`{
  "environment_name": "torrust-tracker-demo",
  "config_file": "envs/torrust-tracker-demo.json",
  "provider": "hetzner",
  "is_valid": true,
  "has_prometheus": true,
  "has_grafana": true,
  "has_https": true,
  "has_backup": true
}`}
				/>

				<h2 id="step-create-environment">Step 3 — Create the Environment</h2>

				<p>
					Once validated, create the environment with the deployer. This creates the local state
					directories:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  torrust/tracker-deployer:latest \\
  create environment --env-file /var/lib/torrust/deployer/envs/torrust-tracker-demo.json`}
				/>

				<p>
					The deployer creates <code>data/torrust-tracker-demo/environment.json</code> — the environment's
					state file, managed exclusively by the deployer. Never edit this file manually.
				</p>

				<h2 id="step-provision">Step 4 — Provision the Server</h2>

				<p>
					The <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/provision.md"
						><code>provision</code></a
					> command creates the Hetzner VM via OpenTofu (an open-source Terraform fork) and waits for
					SSH to become available:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  -v ~/.ssh:/home/deployer/.ssh:ro \\
  torrust/tracker-deployer:latest \\
  provision torrust-tracker-demo`}
				/>

				<p>
					This step creates the VM with an Ubuntu 24.04 base image (as with most cloud providers,
					the OS is selected at creation time), injects your public SSH key via cloud-init, and
					waits up to 300 seconds for SSH to respond and cloud-init to complete. On success it
					reports the instance IP and transitions the environment state to
					<code>Provisioned</code>.
				</p>

				<Callout type="info">
					<strong>Tip</strong>: Provisioning a new Hetzner server for the first time can take 3–5
					minutes due to Hetzner's cloud-init user provisioning. The deployer's default timeout (300
					seconds) is set to cover this. If it does time out, the deployer transitions to a failed
					state and you will need to destroy the environment and start from scratch. See the
					<a href="#troubleshoot-ssh-timeout">troubleshooting section</a> for details.
				</Callout>

				<p>
					After provisioning, note the server's primary IP address from the output or the Hetzner
					Console. You will need this IP for the post-provision manual steps.
				</p>

				<Image
					src="/images/posts/deploying-torrust-tracker-with-the-deployer/hetzner-provisioned-server-console-overview.webp"
					alt="Hetzner Console overview of the provisioned Torrust Tracker VM showing server type, IP addresses, and OpenTofu labels"
				/>

				<h2 id="step-post-provision">Step 5 — Post-Provision Manual Steps</h2>

				<p>
					The deployer does not yet automate the following steps. They must be completed manually
					before running <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/configure.md"
						><code>configure</code></a
					>.
				</p>

				<Callout type="info">
					These steps are specific to production deployments that use Hetzner floating IPs for
					stable DNS. If you are testing on a simple single-IP setup and don't need stable IPs
					across server recreations, you can skip the floating IP parts and use the server's primary
					IP directly in your DNS records.
				</Callout>

				<h3 id="post-provision-floating-ips">Provision and Assign Floating IPs</h3>

				<p>
					<strong>Hetzner floating IPs</strong> are static IPs that can be reassigned to a different server
					at any time. Using them means your DNS records never need to change even if you rebuild the
					server. We provisioned one IPv4 and one IPv6 floating IP per public service.
				</p>

				<p>In the Hetzner Console → <em>Networking → Floating IPs</em>:</p>

				<ol>
					<li>
						Create a new IPv4 floating IP in the same datacenter as your server (<code>nbg1</code> in
						our case).
					</li>
					<li>Create a new IPv6 floating IP (<code>/64</code> block) in the same datacenter.</li>
					<li>Assign both floating IPs to the provisioned server.</li>
				</ol>

				<Image
					src="/images/posts/deploying-torrust-tracker-with-the-deployer/hetzner-floating-ips-assigned-to-server.webp"
					alt="Hetzner Console Floating IPs list showing IPv4 and IPv6 addresses assigned to the Torrust Tracker VM"
				/>

				<p>
					After assigning, Hetzner updates their routing, but the VM itself still needs to know
					about the new IPs. Configure them persistently using netplan. SSH into the server and
					create <code>/etc/netplan/60-floating-ip.yaml</code>:
				</p>

				<CodeBlock
					lang="yaml"
					code={`network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses:
        - 116.202.176.169/32   # your floating IPv4
        - 2a01:4f8:1c0c:9aae::1/64  # your floating IPv6
      routing-policy:
        - from: 116.202.176.169
          table: 100
        - from: 2a01:4f8:1c0c:9aae::1
          table: 200
      routes:
        - to: default
          via: 172.31.1.1
          table: 100
        - to: default
          via: fe80::1
          table: 200`}
				/>

				<p>Apply the configuration:</p>

				<CodeBlock lang="bash" code={`sudo netplan apply`} />

				<p>
					The routing-policy entries ensure reply packets leave via the same floating IP they
					arrived on — this is essential for UDP tracker traffic, which uses asymmetric routing
					otherwise. See the
					<a href="#troubleshoot-ipv6-udp">troubleshooting section on IPv6 UDP</a> for the full story.
				</p>

				<Callout type="info">
					A full guide to floating IP configuration for multi-IP setups (e.g., separate IPs for HTTP
					and UDP trackers so both can be listed on newTrackon independently) is documented in the
					Torrust Tracker Deployer repository under <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/providers/hetzner/post-deployment.md"
						><code>docs/user-guide/providers/hetzner/post-deployment.md</code></a
					>.
				</Callout>

				<h3 id="post-provision-dns">Create DNS Records</h3>

				<p>
					In the Hetzner DNS Console (or via API), create <strong>A</strong> and
					<strong>AAAA</strong> records for each subdomain pointing to your floating IPs:
				</p>

				<table>
					<thead>
						<tr>
							<th>Subdomain</th>
							<th>A (IPv4)</th>
							<th>AAAA (IPv6)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>http1</code></td>
							<td>floating IPv4</td>
							<td>floating IPv6</td>
						</tr>
						<tr>
							<td><code>http2</code></td>
							<td>floating IPv4</td>
							<td>floating IPv6</td>
						</tr>
						<tr>
							<td><code>udp1</code></td>
							<td>floating IPv4</td>
							<td>floating IPv6</td>
						</tr>
						<tr>
							<td><code>udp2</code></td>
							<td>floating IPv4</td>
							<td>floating IPv6</td>
						</tr>
						<tr>
							<td><code>api</code></td>
							<td>floating IPv4</td>
							<td>floating IPv6</td>
						</tr>
						<tr>
							<td><code>grafana</code></td>
							<td>floating IPv4</td>
							<td>floating IPv6</td>
						</tr>
					</tbody>
				</table>

				<Image
					src="/images/posts/deploying-torrust-tracker-with-the-deployer/hetzner-dns-records-all-subdomains.webp"
					alt="Hetzner DNS Console showing all A, AAAA, and TXT records for the torrust-tracker-demo.com domain"
				/>

				<Callout type="info">
					DNS records must resolve correctly before running <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/run.md"
						><code>run</code></a
					>. The
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/configure.md"
						><code>configure</code></a
					>
					command only installs system dependencies; the
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/release.md"
						><code>release</code></a
					>
					command stages the application. It is only when <code>run</code> starts the services that Caddy
					attempts to obtain Let's Encrypt certificates using DNS validation. If DNS has not propagated
					by then, certificate issuance will fail and the services will not start with HTTPS.
				</Callout>

				<h3 id="post-provision-volume">Create and Mount a Storage Volume</h3>

				<p>
					Torrust stores all persistent data (database, logs, Grafana state, Prometheus data,
					backups) under <code>/opt/torrust/storage/</code>. Putting this on a separate Hetzner
					volume means you can detach it and reattach it to a new server if the VM is ever recreated
					— no data loss.
				</p>

				<p>Create a 50 GB volume via the Hetzner Cloud API:</p>

				<CodeBlock
					lang="bash"
					code={`curl -s -X POST \\
  -H "Authorization: Bearer $HCLOUD_TOKEN" \\
  -H "Content-Type: application/json" \\
  "https://api.hetzner.cloud/v1/volumes" \\
  -d '{
    "name": "torrust-tracker-demo-storage",
    "size": 50,
    "location": "nbg1",
    "format": "ext4",
    "labels": {"project": "torrust-tracker-demo"}
  }'`}
				/>

				<p>
					Then attach the volume to the server (also via Hetzner API or Console), SSH in, and mount
					it permanently by adding it to <code>/etc/fstab</code>:
				</p>

				<CodeBlock
					lang="bash"
					code={`# The volume device will appear as /dev/sdb (or /dev/disk/by-id/...)
sudo mkdir -p /opt/torrust/storage
echo '/dev/sdb /opt/torrust/storage ext4 discard,nofail,defaults 0 0' | sudo tee -a /etc/fstab
sudo mount -a
df -h /opt/torrust/storage`}
				/>

				<Image
					src="/images/posts/deploying-torrust-tracker-with-the-deployer/hetzner-volume-attached-to-server.webp"
					alt="Hetzner Console Volumes list showing the 50 GB storage volume attached to the Torrust Tracker server"
				/>

				<h3 id="post-provision-backups">Enable Hetzner Server Backups</h3>

				<p>
					In the Hetzner Console → server → <em>Backups</em>, enable automated server backups. We
					configured daily backups at 03:00 UTC with 7-day retention. This can be done at any point
					after provisioning.
				</p>

				<Callout type="info">
					Hetzner server backups capture the <strong>root disk only</strong>, not attached volumes.
					Hetzner does not provide automated backups for volumes. To protect volume data you need to
					either periodically download the backups produced by the deployer's built-in backup
					service, or copy them to a secondary volume. For this demo tracker we did neither — it is
					a demo and data loss is acceptable.
				</Callout>

				<h2 id="step-configure">Step 6 — Configure the Server</h2>

				<p>
					The <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/configure.md"
						><code>configure</code></a
					>
					command runs Ansible over SSH to prepare the host: it installs Docker Engine and the Docker
					Compose plugin, configures automatic security updates and UFW firewall rules, and adds the SSH
					user to the <code>docker</code> group:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  -v ~/.ssh:/home/deployer/.ssh:ro \\
  torrust/tracker-deployer:latest \\
  configure torrust-tracker-demo`}
				/>

				<p>
					This takes about 100 seconds. On success the environment state advances to
					<code>Configured</code>.
				</p>

				<h2 id="step-release">Step 7 — Stage the Release</h2>

				<p>
					The <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/release.md"
						><code>release</code></a
					>
					command deploys the application layer to the configured VM: it creates storage directories,
					renders and copies configuration files, and deploys
					<code>docker-compose.yml</code> and <code>.env</code>. It prepares the application layer
					without starting services:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  -v ~/.ssh:/home/deployer/.ssh:ro \\
  torrust/tracker-deployer:latest \\
  release torrust-tracker-demo`}
				/>

				<p>
					This step prepares the application layer (files, templates, and compose definitions) and
					then transitions the environment to <code>Released</code>.
				</p>

				<h2 id="step-run">Step 8 — Start Services</h2>

				<p>
					The <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/run.md"
						><code>run</code></a
					>
					command starts the Docker Compose services (via
					<code>docker compose up -d</code>), then validates that services are running and
					externally accessible:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v ~/.ssh:/home/deployer/.ssh:ro \\
  torrust/tracker-deployer:latest \\
  run torrust-tracker-demo`}
				/>

				<Callout type="warning">
					<strong><code>Running</code> ≠ healthy</strong>: The
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/run.md"
						><code>run</code></a
					>
					command already validates startup and basic external accessibility. Still run
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/test.md"
						><code>test</code></a
					> immediately afterwards for a separate smoke-test pass (including advisory DNS checks).
				</Callout>

				<Callout type="info">
					<strong>Backup initialization note</strong>: The backup service uses the Docker Compose
					<code>backup</code> profile and is <strong>not</strong> started by
					<code>docker compose up</code>. Scheduled backups run daily at 03:00 UTC via host cron. If
					you want to create the first backup immediately after deployment, trigger it manually:
				</Callout>

				<CodeBlock
					lang="bash"
					code={`ssh -i ~/.ssh/<ssh-key> torrust@<your-server-ip> "
  cd /opt/torrust
  sudo docker compose --profile backup run --rm backup
"`}
				/>

				<h2 id="step-test">Step 9 — Run Infrastructure Tests</h2>

				<p>
					The <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/test.md"
						><code>test</code></a
					> command performs smoke tests against deployed services (Tracker API and HTTP Tracker endpoints)
					and also runs advisory DNS resolution checks for configured domains. It can run against environments
					in any state, as long as the instance is reachable:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v ~/.ssh:/home/deployer/.ssh:ro \\
  torrust/tracker-deployer:latest \\
  test torrust-tracker-demo`}
				/>

				<p>
					If you used floating IPs, expect DNS warnings — the deployer compares DNS results against
					the server's primary IP rather than the floating IPs. A <code>"result": "pass"</code>
					alongside warnings is correct behaviour.
				</p>

				<h2 id="verifying">Verifying the Deployment</h2>

				<p>
					The deployer's <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/test.md"
						><code>test</code></a
					>
					command covers infrastructure-level checks. For end-to-end protocol verification, use these
					manual checks from your local machine. If you want the complete manual verification checklist,
					see the
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/tree/main/docs/deployments/hetzner-demo-tracker/verify"
						>deployer verify docs</a
					>.
				</p>

				<h3 id="verify-http">HTTP Tracker</h3>

				<CodeBlock
					lang="bash"
					code={`curl "https://http1.torrust-tracker-demo.com/announce?info_hash=%89I%85%EE%A3%B1R%02r%93%E5%C6%7F%29%8B%5B%AD%8Ad%99&peer_id=-TR2940-k8hj0wgej6ch&port=51413&uploaded=0&downloaded=0&left=0&event=started"`}
				/>

				<p>A healthy response returns a bencoded peers dictionary.</p>

				<h3 id="verify-api">REST API</h3>

				<CodeBlock
					lang="bash"
					code={`curl "https://api.torrust-tracker-demo.com/api/v1/stats" \\
  -H "Authorization: Bearer <admin-token>"`}
				/>

				<h3 id="verify-grafana">Grafana</h3>

				<p>
					Open <a href="https://grafana.torrust-tracker-demo.com"
						>grafana.torrust-tracker-demo.com</a
					> in a browser and log in with the admin credentials set in your environment config. You should
					see dashboards for tracker announces and system metrics.
				</p>

				<p>The demo also exposes three read-only public dashboards that require no login:</p>

				<ul>
					<li>
						<a
							href="https://grafana.torrust-tracker-demo.com/public-dashboards/186b355b56cd482d9c441a0affdb8ecd"
							>Tracker Overview</a
						>
					</li>
					<li>
						<a
							href="https://grafana.torrust-tracker-demo.com/public-dashboards/6d493d22396c4e3cbaeec5669ed2ae69"
							>UDP Tracker 1</a
						>
					</li>
					<li>
						<a
							href="https://grafana.torrust-tracker-demo.com/public-dashboards/ca57cd298a0240c5b7b7965b3c47ebcf"
							>HTTP Tracker 1</a
						>
					</li>
				</ul>

				<h3 id="verify-docker">Docker Services</h3>

				<p>SSH into the server and verify all containers are healthy:</p>

				<CodeBlock
					lang="bash"
					code={`ssh torrust@<your-server-ip> "docker compose -f /opt/torrust/docker-compose.yml ps"`}
				/>

				<p>
					All services should report <code>healthy</code> (or <code>running</code> for services
					without a health check defined). The full verification checklist — including MySQL,
					storage volume, and backup verification — is published in the
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/tree/main/docs/deployments/hetzner-demo-tracker/verify"
						>deployer verification docs</a
					>.
				</p>

				<h2 id="newtrackon">Listing the Tracker on newTrackon</h2>

				<p>
					<a href="https://newtrackon.com/">newTrackon</a> continuously monitors open BitTorrent trackers
					and publishes them in public lists consumed by torrent clients. Getting listed provides uptime
					monitoring as a side-effect, and helps the BitTorrent community discover your tracker.
				</p>

				<p>
					Two prerequisites must be met before submitting. We missed both during our first
					submission on 2026-03-04 — the HTTP tracker was accepted anyway, but the UDP tracker was
					not. For a full submission walkthrough, see
					<a href="/blog/submitting-trackers-to-newtrackon">Submitting Trackers to newTrackon</a>.
				</p>

				<h3 id="bep34">BEP 34 DNS TXT Records</h3>

				<p>
					<a href="https://www.bittorrent.org/beps/bep_0034.html">BEP 34</a> defines a DNS TXT record
					format that declares which ports a domain intentionally serves as a BitTorrent tracker. newTrackon
					uses this for validation. Add a TXT record on each tracker subdomain:
				</p>

				<table>
					<thead>
						<tr>
							<th>Subdomain</th>
							<th>TXT value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>http1.your-domain.com</code></td>
							<td><code>BITTORRENT TCP:443</code></td>
						</tr>
						<tr>
							<td><code>udp1.your-domain.com</code></td>
							<td><code>BITTORRENT UDP:6969</code></td>
						</tr>
					</tbody>
				</table>

				<h3 id="unique-ip">One Tracker Per IP Address</h3>

				<p>
					newTrackon only accepts one tracker per IP address. If two tracker URLs resolve to the
					same IP(s), only one can be listed. This is why we provisioned separate floating IPs for
					<code>http1</code> and <code>udp1</code> — each subdomain resolves to a unique IPv4 and IPv6
					address, satisfying the policy.
				</p>

				<p>
					If you only need one tracker listed publicly, a single pair of floating IPs is sufficient.
				</p>

				<Image
					src="/images/posts/deploying-torrust-tracker-with-the-deployer/newtrackon-torrust-trackers-all-working.webp"
					alt="newTrackon listing showing three Torrust trackers all with 100% uptime and Working status"
				/>

				<h2 id="secrets-rotation">Secrets Rotation After AI-Assisted Deployment</h2>

				<p>
					We deployed with GitHub Copilot (Claude Sonnet) active in our editor. Any secrets that
					appeared in terminal output, configuration files, or SSH sessions were potentially
					processed by cloud infrastructure operated by Microsoft and Anthropic. After deployment,
					we rotated every secret:
				</p>

				<table>
					<thead>
						<tr>
							<th>Secret</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Tracker admin token</td>
							<td>Rotated</td>
						</tr>
						<tr>
							<td>MySQL application user password</td>
							<td>Rotated</td>
						</tr>
						<tr>
							<td>MySQL root password</td>
							<td>Rotated</td>
						</tr>
						<tr>
							<td>Grafana admin password</td>
							<td>Rotated</td>
						</tr>
						<tr>
							<td>SSH deployer key</td>
							<td>Rotated</td>
						</tr>
						<tr>
							<td>Hetzner Cloud API token</td>
							<td>Deleted (no longer needed post-deploy)</td>
						</tr>
						<tr>
							<td>Hetzner DNS API token</td>
							<td>Deleted (no longer needed post-DNS setup)</td>
						</tr>
					</tbody>
				</table>

				<Callout type="warning">
					<strong>Multi-file secrets</strong>: The same secret can appear in multiple locations on
					the server (e.g. the tracker admin token appears in <code>.env</code> and also in
					<code>prometheus.yml</code> as a scrape parameter). Missing any location when rotating
					will silently break that service. The full secret-to-file map is documented in the
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/deployments/hetzner-demo-tracker/maintenance/secrets-rotation.md"
						>deployer secrets rotation guide</a
					>.
				</Callout>

				<p>
					Even if you are not using an AI coding assistant, rotating secrets after initial
					deployment is good practice — the API token used to provision the server is often still in
					your shell history or environment variables.
				</p>

				<h2 id="what-we-learned">What We Learned — Bugs and Improvements</h2>

				<p>
					We treated this deployment as a comprehensive end-to-end test of the deployer. We
					discovered 11 bugs and 13 improvement opportunities. All critical bugs have been fixed
					ahead of the v0.1.0 release. Here are the most impactful findings.
				</p>

				<h3 id="bugs-create">Config Generation Issues</h3>

				<ul>
					<li>
						<strong>IPv4-only bind addresses (B-01)</strong>: The template defaulted to
						<code>0.0.0.0</code> for all sockets, silently producing an IPv6-only-listening failure
						for all UDP clients on IPv6 networks. Fixed: default will be <code>[::]</code>.
					</li>
					<li>
						<strong>SQLite default without warning (B-02)</strong>: The template selected SQLite
						without prompting or noting that MySQL is recommended for production. Fixed: the
						template will prompt or include a clear comment.
					</li>
				</ul>

				<h3 id="bugs-provision">Provisioning Issues</h3>

				<ul>
					<li>
						<strong>SSH timeout too short (B-04)</strong>: The original 120-second SSH probe budget
						was too short for Hetzner's <code>ccx23</code> instances, where cloud-init can take over 3
						minutes. Fixed: increased to 300 seconds with configurable timeout.
					</li>
					<li>
						<strong>Passphrase-protected SSH keys fail silently in Docker (B-05)</strong>: When
						running inside Docker (the standard workflow), there is no SSH agent. A
						passphrase-protected deployment key causes every SSH probe to return
						<code>Permission denied</code> with no diagnostic pointing to the passphrase as the cause.
						Fixed: the deployer now emits a clear warning.
					</li>
					<li>
						<strong>Container SSH key path mismatch</strong>: When running via Docker, SSH key paths
						in the config must be container-internal paths (<code>/home/deployer/.ssh/...</code>),
						not host machine paths. This caused an immediate template rendering failure. Added to
						the documentation.
					</li>
				</ul>

				<h3 id="bugs-run">Service Start Issues</h3>

				<ul>
					<li>
						<strong>MySQL restart loop (run bugs)</strong>: Using <code>"root"</code> as the MySQL application
						username caused MySQL 8.4 to reject startup, leaving all dependent services in a restart loop.
						Fixed: the deployer now validates this at environment creation time. Separately, the MySQL
						password must be URL-encoded in the tracker connection string — the deployer now handles this
						automatically.
					</li>
				</ul>

				<h2 id="troubleshooting">Troubleshooting</h2>

				<h3 id="troubleshoot-ssh-paths">SSH Key Paths Differ Between Host and Container</h3>

				<p>
					<strong>Symptom</strong>:
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/provision.md"
						><code>provision</code></a
					>
					fails immediately with
					<em>"SSH public key file not found or unreadable"</em>.
				</p>

				<p>
					<strong>Cause</strong>: The SSH key paths in your environment config JSON use host machine
					paths (e.g. <code>/home/yourname/.ssh/key</code>), but when the deployer runs inside
					Docker, your <code>~/.ssh</code> directory is mounted at
					<code>/home/deployer/.ssh/</code> inside the container.
				</p>

				<p>
					<strong>Fix</strong>: In the <code>ssh_credentials</code> block of your config, always use the
					container path:
				</p>

				<CodeBlock
					lang="json"
					code={`{
  "ssh_credentials": {
    "private_key_path": "/home/deployer/.ssh/torrust_tracker_deployer_ed25519",
    "public_key_path": "/home/deployer/.ssh/torrust_tracker_deployer_ed25519.pub"
  }
}`}
				/>

				<p>
					If you have already run <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/create.md"
						><code>create environment</code></a
					> with wrong paths, purge the environment and recreate it:
				</p>

				<CodeBlock
					lang="bash"
					code={`docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  torrust/tracker-deployer:latest \\
  purge torrust-tracker-demo --force`}
				/>

				<h3 id="troubleshoot-ssh-timeout">SSH Connectivity Times Out at Provision</h3>

				<p>
					<strong>Symptom</strong>: The Hetzner VM appears in the console but
					<code>provision</code> exits with an SSH connectivity timeout.
				</p>

				<p>
					<strong>Cause</strong>: Hetzner cloud-init user provisioning on larger instance types (<code
						>ccx23</code
					> and above) can take 3–4 minutes. Earlier versions of the deployer had a hardcoded 120-second
					timeout, which was too short.
				</p>

				<p>
					<strong>Fix</strong>: In v0.1.0 the timeout is set to 300 seconds, which is long enough
					for Hetzner's cloud-init to complete. If provisioning still times out, the deployer
					transitions to a failed state. You cannot retry directly — you must destroy the
					environment and start from scratch: run <code>destroy</code> to remove the VM, then re-run
					the full sequence from
					<a href="#step-create-environment">Step 3</a>.
				</p>

				<h3 id="troubleshoot-passphrase">Passphrase-Protected SSH Key Fails in Docker</h3>

				<p>
					<strong>Symptom</strong>: <code>provision</code> repeatedly prints SSH auth failures even though
					the key exists and permissions are correct.
				</p>

				<p>
					<strong>Cause</strong>: There is no SSH agent inside the Docker container. Every SSH
					attempt with a passphrase-protected key requires interactive passphrase entry, which the
					deployer cannot do non-interactively. The result is silent
					<code>Permission denied</code> on every probe.
				</p>

				<p>
					<strong>Fix</strong>: Use a passphrase-free deployment key. Generate a dedicated key
					without a passphrase for the deployer:
				</p>

				<CodeBlock
					lang="bash"
					code={`ssh-keygen -t ed25519 -C "torrust-tracker-deployer-no-passphrase" \\
  -f ~/.ssh/torrust_tracker_deployer_ed25519 \\
  -N ""`}
				/>

				<p>
					Store this key securely (e.g. a dedicated secrets manager, not your everyday keychain).
					Rotate it after deployment is complete.
				</p>

				<h3 id="troubleshoot-sqlite">Tracker Ignores MySQL Config and Uses SQLite</h3>

				<p>
					<strong>Symptom</strong>: After deployment, the tracker runs but all data is lost on
					restart, or you notice a SQLite database file on disk despite configuring MySQL.
				</p>

				<p>
					<strong>Cause</strong>: The
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/create.md"
						><code>create template</code></a
					>
					command silently defaults to SQLite without prompting. If you did not explicitly change the
					database driver to
					<code>MySQL</code> in the config, SQLite is what gets deployed.
				</p>

				<p>
					<strong>Fix</strong>: Edit the template before running
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/validate.md"
						><code>validate</code></a
					>
					and change the <code>database.driver</code> to <code>"MySQL"</code> with the full MySQL
					connection details. If you've already deployed, you need to re-run the full
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/configure.md"
						><code>configure</code></a
					>
					→
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/release.md"
						><code>release</code></a
					>
					→
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/run.md"
						><code>run</code></a
					> sequence with the corrected config.
				</p>

				<h3 id="troubleshoot-tracker-restart">
					Tracker Container in Restart Loop After <a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/run.md"
						><code>run</code></a
					>
				</h3>

				<p>
					<strong>Symptom</strong>:
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/run.md"
						><code>run</code></a
					> succeeds but the tracker container immediately enters a restart loop. MySQL health checks
					fail or the tracker logs show a database connection error.
				</p>

				<p>
					<strong>Common causes</strong>:
				</p>

				<ul>
					<li>
						<strong>MySQL application username set to <code>"root"</code></strong>: MySQL 8.4
						rejects <code>MYSQL_USER=root</code>. Use any non-root username (e.g.
						<code>"torrust"</code>). Fixed in v0.1.0 with a validation error at
						<a
							href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/commands/create.md"
							><code>create environment</code></a
						> time.
					</li>
					<li>
						<strong>MySQL password not URL-encoded in connection string</strong>: If your MySQL
						password contains special characters, the tracker's TOML connection string requires
						percent-encoding. Fixed in v0.1.0 — the deployer now URL-encodes the password
						automatically during config rendering.
					</li>
				</ul>

				<p>Diagnose with Docker logs on the server:</p>

				<CodeBlock
					lang="bash"
					code={`ssh torrust@<your-server-ip> "docker logs torrust-tracker --tail 50"`}
				/>

				<h3 id="troubleshoot-ipv6-udp">UDP Tracker Unreachable via IPv6</h3>

				<p>
					<strong>Symptom</strong>: The UDP tracker works on IPv4 but IPv6 clients (including
					newTrackon probes) time out.
				</p>

				<p><strong>Root cause identified during our deployment:</strong></p>

				<p>
					<strong>Asymmetric routing on floating IPs</strong>: Without policy routing rules, UDP
					replies leave the server via the primary IP, not the floating IP the probe arrived on. The
					client receives a reply from a different address and discards it as spurious. In our case,
					this routing issue was the actual cause; UFW was not the blocker. The fix is the netplan
					policy routing configuration shown in
					<a href="#post-provision-floating-ips">Provision and Assign Floating IPs</a>.
				</p>

				<p>
					The full investigation — including all diagnostic commands and intermediate checks — is
					documented in the
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/deployments/hetzner-demo-tracker/post-provision/ipv6-udp-tracker-issue.md"
						>deployer investigation guide</a
					>.
				</p>

				<Callout type="info">
					IPv6 UDP issues with floating IPs are complex enough to warrant a dedicated article. We
					plan to publish a deep-dive covering the routing investigation and solution in detail.
				</Callout>

				<h3 id="troubleshoot-recovery">Recovering from a Failed Deployer Command</h3>

				<p>
					<strong>Situation</strong>: A deployer command fails mid-way and leaves the environment in
					a failed state (<code>ProvisionFailed</code>, <code>ConfigureFailed</code>, etc.).
				</p>

				<p>
					The deployer has no built-in recovery mechanism. If a command fails, the only fully
					supported path forward is to clean up and restart from scratch:
				</p>

				<CodeBlock
					lang="bash"
					code={`# Destroy infrastructure and purge local state
docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  torrust/tracker-deployer:latest \\
  destroy torrust-tracker-demo

docker run --rm \\
  -v $(pwd)/data:/var/lib/torrust/deployer/data \\
  -v $(pwd)/build:/var/lib/torrust/deployer/build \\
  -v $(pwd)/envs:/var/lib/torrust/deployer/envs \\
  torrust/tracker-deployer:latest \\
  purge torrust-tracker-demo --force`}
				/>

				<p>
					There is a theoretical recovery path via state file snapshots, but it is untested and only
					recommended if you understand exactly why the command failed and are confident the server
					is in a consistent, manually-completable state. The full recovery procedure is described
					in the deployment journal in the torrust-tracker-deployer repository.
				</p>

				<h2 id="next-steps">Next Steps</h2>

				<p>
					The demo tracker is deployed and running. Here are the immediate next steps for the
					Torrust project:
				</p>

				<ul>
					<li>
						<strong>v0.1.0 release</strong>: The Torrust Tracker Deployer v0.1.0 release is
						imminent. All 11 bugs found during this deployment have been fixed. The release will
						include the Docker image, full user documentation, and the deployment journal as a
						reference.
					</li>
					<li>
						<strong>IPv6 floating IP automation</strong>: Post-provision floating IP configuration
						is currently manual. We plan to automate it in a future release.
					</li>
					<li>
						<strong>Configurable SSH timeout</strong>: The SSH probe timeout is now configurable
						(defaulting to 300 seconds) as of v0.1.0.
					</li>
					<li>
						<strong>Dual-stack defaults</strong>: The <code>create template</code> command will
						default to <code>[::]</code> bind addresses in v0.1.0.
					</li>
					<li>
						<strong>Live demo</strong>: Both trackers are publicly accessible and monitored. You can
						submit them as announce URLs in any BitTorrent client:
						<ul>
							<li><code>https://http1.torrust-tracker-demo.com/announce</code></li>
							<li><code>udp://udp1.torrust-tracker-demo.com:6969/announce</code></li>
						</ul>
					</li>
				</ul>

				<p>
					A full deployment guide is also maintained in the
					<a href="https://github.com/torrust/torrust-tracker-deployer">deployer repository</a>
					under <code>docs/user-guide/</code>, including Hetzner-specific details and
					post-deployment configuration guides.
				</p>

				<p>
					If you run into issues or want to share your own deployment experience, open a discussion
					in the
					<a href="https://github.com/torrust/torrust-tracker-deployer/discussions"
						>deployer repository</a
					>
					or join our community.
				</p>
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
		min-width: 0;
		word-break: keep-all;
		padding-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* ── Typography ──────────────────────────────────────── */

	h2 {
		font-size: 1.9rem;
		font-weight: 800;
		letter-spacing: 0.01em;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	h3 {
		font-size: 1.3rem;
		font-weight: 600;
		padding-top: 1.25rem;
		padding-left: 0.75rem;
		border-left: 3px solid rgba(254, 13, 0, 0.45);
		color: rgba(245, 245, 245, 0.88);
	}

	:global(h4) {
		font-size: 1.25rem;
		font-weight: bold;
		padding-top: 1rem;
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

	ul,
	ol {
		display: flex;
		flex-direction: column;
		list-style-type: disc;
		margin: 0;
		padding-left: 1.5rem;
		word-break: keep-all;
	}

	ol {
		list-style-type: decimal;
	}

	ul li,
	ol li {
		margin: 0.25rem 0;
		word-break: keep-all;
	}

	:global(blockquote) {
		border-left: 4px solid rgba(254, 13, 0, 0.6);
		padding: 0.5rem 1rem;
		margin: 1rem 0;
		color: rgba(245, 245, 245, 0.7);
		font-style: italic;
	}

	code {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	table {
		display: block;
		width: 100%;
		max-width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		overflow-x: auto;
	}

	th,
	td {
		padding: 0.6rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		text-align: left;
		color: rgba(245, 245, 245, 0.8);
	}

	th {
		background-color: rgba(0, 0, 0, 0.3);
		font-weight: 600;
	}

	.content-preview > p,
	.content-preview > ul,
	.content-preview > ol,
	.content-preview > h2,
	.content-preview > h3,
	:global(.content-preview > h4) {
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
			top: 6rem;
			align-self: flex-start;
			min-width: 220px;
			max-width: 260px;
		}

		.content-preview {
			overflow-y: auto;
			padding-top: 0rem;
		}
	}
</style>
