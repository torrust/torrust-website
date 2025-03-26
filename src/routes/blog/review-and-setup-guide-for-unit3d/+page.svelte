<script lang="ts">
	let { data } = $props();
	let { currentPost, allPosts } = data;
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
				<h2 id="introduction-to-unit3d">Introduction to UNIT3D</h2>
				<p>
					This blog post serves as an introduction to our review series at Torrust, where we&#39;ll
					continue to explore and evaluate other projects within the BitTorrent ecosystem.
				</p>
				<p>
					UNIT3D is a private torrent tracker software, crafted meticulously in <a
						href="https://www.php.net/">PHP</a
					>
					using the <a href="https://laravel.com/">Laravel</a> framework. Whether you&#39;re a developer
					looking to deploy a robust BitTorrent index or an enthusiast exploring the depths of the BitTorrent
					ecosystem, this guide will walk you through UNIT3D&#39;s features and provide a detailed, step-by-step
					setup tutorial.
				</p>
				<p>UNIT3D was created from scratch. The first commit was on December 2017.</p>
				<ul>
					<li>
						<strong>Repo:</strong>
						<a href="https://github.com/HDInnovations/UNIT3D-Community-Edition"
							>https://github.com/HDInnovations/UNIT3D-Community-Edition</a
						>
					</li>
					<li>
						<strong>Contributors:</strong>
						<a href="https://github.com/HDInnovations/UNIT3D-Community-Edition/graphs/contributors"
							>116</a
						>
					</li>
					<li><strong>Stars:</strong> 1.9k.</li>
					<li>
						<strong>Production Stats</strong>:
						<ul>
							<li>Installations: 26</li>
							<li>Users: 235,041</li>
							<li>Torrents: 1,570,340</li>
							<li>Peers: 5,881,717</li>
						</ul>
					</li>
					<li>
						<strong>Official Demo Site:</strong>
						<a href="https://unit3d.dev/">https://unit3d.dev/</a> (currently not working).
					</li>
				</ul>
				<p>
					Stats from <a href="https://hdvinnie.github.io/Private-Trackers-Spreadsheet/"
						>Private-Trackers-Spreadsheet</a
					>.
				</p>

				<Callout type="info">
					To write this post we have setup a new demo site on: <a
						href="https://www.unit3d-demo.com/">https://www.unit3d-demo.com</a
					>. Following the tutorial section you can also easily deploy your UNIT3D Index. The demo
					site could be shutdown at any time.
				</Callout>

				<h3 id="overview">Overview</h3>
				<p>
					It&#39;s not our intention to list and evaluate all the features because that would be a
					really hard task. However we want to give you an idea about how many features this
					software includes:
				</p>
				<h3 id="key-features">Key features</h3>
				<h4 id="torrents">Torrents</h4>
				<ul>
					<li>Index, Search, Upload</li>
					<li>Requests</li>
					<li>RSS</li>
				</ul>
				<h4 id="community">Community</h4>
				<ul>
					<li>Forums</li>
					<li>Chatrooms with chatbot</li>
					<li>Playlists</li>
					<li>Polls</li>
					<li>News</li>
					<li>Bonus Points</li>
					<li>User profiles</li>
					<li>Achievements</li>
				</ul>
				<h4 id="support">Support</h4>
				<ul>
					<li>Custom pages: rules, FAQ, Wikis</li>
					<li>Helpdesk</li>
					<li>Staff</li>
				</ul>
				<h4 id="platform-management">Platform Management</h4>
				<ul>
					<li>Logs</li>
					<li>
						Access Restrictions
						<ul>
							<li>Client Blacklist</li>
							<li>Whitelisted Image URLs</li>
							<li>Blocked IPs</li>
						</ul>
					</li>
					<li>
						Torrents
						<ul>
							<li>Moderation</li>
							<li>Classification: categories, resolutions, regions, distributions</li>
						</ul>
					</li>
					<li>Peers</li>
					<li>
						Users
						<ul>
							<li>Search</li>
							<li>Applications, Invitations</li>
							<li>Keys: API, passkeys, RSS keys, 2FA, ...</li>
							<li>Groups (roles)</li>
							<li>Notifications (alerts)</li>
							<li>Messages</li>
						</ul>
					</li>
				</ul>
				<h4 id="integrations">Integrations</h4>
				<ul>
					<li>
						Torrent API: <a
							href="https://github.com/HDInnovations/UNIT3D-Community-Edition/wiki/Torrent-API-(UNIT3D-v8.x.x)"
							>https://github.com/HDInnovations/UNIT3D-Community-Edition/wiki/Torrent-API-(UNIT3D-v8.x.x)</a
						>
					</li>
					<li>
						Other metadata API like <a href="https://www.themoviedb.org/"
							>https://www.themoviedb.org/</a
						>
					</li>
				</ul>
				<h2 id="unit3d-review">UNIT3D Review</h2>
				<h3 id="code-quality-and-structure">Code Quality and Structure</h3>
				<p>
					UNIT3D boasts a well-organized codebase, adhering to modern PHP development standards. The
					use of Laravel as the underlying framework ensures a modular structure, making it easier
					for developers to extend and customize the platform. Code readability is generally high,
					with well-commented sections that clarify complex logic.
				</p>
				<h3 id="documentation-and-user-guides">Documentation and User Guides</h3>
				<p>
					The <a href="https://github.com/HDInnovations/UNIT3D-Community-Edition/wiki"
						>documentation</a
					> for UNIT3D system dependencies is comprehensive, covering local development and basic server
					management. However, there is room for improvement in terms of end user guides, tutorials,
					examples, installation for production and troubleshooting guides.
				</p>
				<h3 id="community-support-and-activity">Community Support and Activity</h3>
				<p>
					UNIT3D has an active and growing community. The project&#39;s GitHub repository shows
					regular commits, indicating ongoing development. There are also Discord channels for
					sponsors where they and developers discuss issues, share tips, and contribute to the
					project&#39;s roadmap. You can also support UNIT3D development via <a
						href="https://polar.sh/HDInnovations">https://polar.sh/HDInnovations</a
					>.
				</p>
				<h3 id="contribution-guidelines-and-license">Contribution Guidelines and License</h3>
				<p>
					UNIT3D is licensed under the AGPL-3.0 license license. The <a
						href="https://github.com/HDInnovations/UNIT3D-Community-Edition/blob/master/CONTRIBUTING.md"
						>contribution guidelines</a
					> are well-documented, with clear instructions on how to fork the repository, submit pull requests,
					and report issues.
				</p>
				<h3 id="installation-process-overview">Installation Process Overview</h3>
				<p>
					UNIT3D offers an <a href="https://github.com/HDInnovations/UNIT3D-Installer">installer</a
					>. At the time of this writing it supports:
				</p>
				<ul>
					<li>Ubuntu 22.04 LTS (Jammy Jellyfish).</li>
					<li>Ubuntu 20.04 LTS (Focal Fossa)</li>
				</ul>
				<p>
					We followed the instructions and the process was easy and fast. We will describe the
					process in detail in the installation tutorial. Hopefully, that will make the process even
					easier for other users.
				</p>
				<h2 id="tutorial-setting-up-unit3d-on-a-digital-ocean-droplet">
					Tutorial: Setting Up UNIT3D on a Digital Ocean Droplet
				</h2>
				<p>
					To install the software we have followed the steps described in the official installer:
				</p>
				<p>
					<a href="https://github.com/HDInnovations/UNIT3D-Installer"
						>https://github.com/HDInnovations/UNIT3D-Installer</a
					>.
				</p>
				<h3 id="requirements">Requirements</h3>
				<p>
					Although you can just execute the installer directly you will need to create some services
					during the installation. We would recommend to fulfill all the requirements before
					executing the installer, that would make the process faster and you can avoid some
					mistakes we made.
				</p>
				<p>Let&#39;s review what you will need:</p>
				<ul>
					<li>Server (virtual machine)</li>
					<li>External Services</li>
					<li>System requirements (software installed on the server)</li>
				</ul>
				<h4 id="hardware-requirements-server-">Hardware Requirements (server)</h4>
				<p>
					We opted for using a Digital Ocean droplet just because we are used to their interface and
					it&#39;s straightforward. Feel free to use your favorite provider.
				</p>
				<p>
					In our first attempt we used the minimum size image. However it was too small. The server
					had problems building the frontend and that&#39;s one of the last steps in the
					installation. Finally we used a VM (Digital Ocean call them droplets) with these
					characteristics:
				</p>
				<ul>
					<li>Image: <strong>Ubuntu 22.04 (LTS) x64</strong></li>
					<li>Size: <strong>1 vCPU; 2GB / 50GB Disk; ($12/month)</strong></li>
				</ul>
				<h4 id="external-services">External Services</h4>
				<ul>
					<li>
						Domain: We registered a new one only for this purpose: <a
							href="https://unit3d-demo.com/">https://unit3d-demo.com/</a
						>.
					</li>
					<li>
						DNS: Since We are using Digital Ocean, we only needed to assign the the Digital
						Ocean&#39;s name servers to the domain.
					</li>
					<li>
						Email delivery service: We just picked up one from the list of supported services by
						UNIT3D. We selected <a href="https://postmarkapp.com/">https://postmarkapp.com/</a>.
					</li>
				</ul>
				<p>
					How to register the domain, setup the DNS and the email service is out of the scope of
					this article. Anyway it depends on your providers.
				</p>
				<h4 id="system-requirements">System Requirements</h4>
				<p>
					The installer installs all the system dependencies that you need, like MySQL, Redis,
					etcetera. You only need a fresh Ubuntu server using one of these versions:
				</p>
				<ul>
					<li>Ubuntu 22.04 LTS (Jammy Jellyfish).</li>
					<li>Ubuntu 20.04 LTS (Focal Fossa)</li>
				</ul>
				<h4 id="information-needed">Information needed</h4>
				<p>
					During the installation process you will need to respond to some questions. The following
					are the main values you will have to provide:
				</p>
				<p>Droplet:</p>
				<ul>
					<li>Root password.</li>
					<li>Hostname: <code>unit3d-demo</code>.</li>
				</ul>
				<p>Postmark (sign up):</p>
				<ul>
					<li>Username.</li>
					<li>Email.</li>
					<li>Password.</li>
				</ul>
				<p>UNIT3D Platform Owner:</p>
				<ul>
					<li>Username: We used <code>unit3d-owner</code>.</li>
					<li>Email.</li>
					<li>Password.</li>
				</ul>
				<p>MySQL:</p>
				<ul>
					<li>Root password.</li>
					<li>UNIT3D user: username (<code>unit3d</code>) and password.</li>
				</ul>
				<p>SMTP Configuration:</p>
				<ul>
					<li>Driver: smtp.</li>
					<li>Server: <code>smtp.postmarkapp.com</code>.</li>
					<li>Port: <code>587</code>.</li>
					<li>Username: A token provided by postmarkapp.</li>
					<li>Password: Same as username.</li>
				</ul>
				<p>
					TMDB (<a href="https://www.themoviedb.org/">themoviedb.org</a>, a service to get metadata
					about movies):
				</p>
				<ul>
					<li>API key.</li>
				</ul>
				<p>Used Versions:</p>
				<ul>
					<li>OS: Ubuntu 22.04 LTS (Jammy Jellyfish)</li>
					<li>PHP: 8.3.10</li>
					<li>Database: 8.0.39-0ubuntu0.22.04.1</li>
					<li>Laravel: 11.5.0</li>
					<li>UNIT3D Community Edition: v8.1.3</li>
					<li>Installation dir: <code>/var/www/html</code></li>
				</ul>
				<p>Let&#39;s install the software step by step.</p>
				<h3 id="step-1-create-the-droplet-in-digital-ocean">
					Step 1. Create the Droplet in Digital Ocean
				</h3>
				<p>We decided to create a new project so we can assign resources to this project:</p>

				<Image
					src="/images/posts/review-and-setup-guide-for-unit3d/02-create-droplet-12-dollars.png"
					alt="Create a new 12-dollar droplet in Digital Ocean"
				/>

				<p>
					Before continuing with the tutorial make sure your root domain and <code>www</code> subdomain
					are pointing to the droplet&#39;s IP.
				</p>

				<CodeBlock
					lang="console"
					code={`ping unit3d-demo.com
PING unit3d-demo.com (134.122.65.71) 56(84) bytes of data.\n
ping <www.unit3d-demo.com>
PING unit3d-demo.com (134.122.65.71) 56(84) bytes of data.`}
				/>

				<p>Also, check that you can login using SSH:</p>

				<CodeBlock lang="console" code={`ssh root@134.122.65.71`} />

				<h3 id="step-2-update-the-server">Step 2. Update the Server</h3>
				<p>This is only a recommendation before running the installer.</p>

				<CodeBlock
					lang="console"
					code={`sudo apt-get update
Hit:1 http://mirrors.digitalocean.com/ubuntu jammy InRelease
Hit:2 https://repos.insights.digitalocean.com/apt/do-agent main InRelease
Hit:3 http://mirrors.digitalocean.com/ubuntu jammy-updates InRelease
Hit:4 https://repos-droplet.digitalocean.com/apt/droplet-agent main InRelease
Hit:5 http://mirrors.digitalocean.com/ubuntu jammy-backports InRelease
Hit:6 http://security.ubuntu.com/ubuntu jammy-security InRelease
Reading package lists... Done`}
				/>

				<h3>Step 3. Run the UNIT3D Installer</h3>

				<CodeBlock
					lang="console"
					code={`sudo apt -y install git
git clone https://github.com/HDInnovations/UNIT3D-Installer.git installer
cd installer
sudo ./install.sh`}
				/>

				<p>The installer has some steps:</p>
				<ul>
					<li>Validate Installer Policies</li>
					<li>Server Setup</li>
					<li>Prerequisites</li>
					<li>Database Setup</li>
					<li>Php Setup (PHP &amp; PHP-FPM Configuration)</li>
					<li>Nginx Setup (Nginx Setup &amp; Configurations)</li>
					<li>Unit3d Setup (UNIT3D-Community-Edition Settings and Configuration)</li>
				</ul>
				<p>First, an assistant will run some checks and it will ask your preferences:</p>

				<Image
					src="/images/posts/review-and-setup-guide-for-unit3d/03-installer.png"
					alt="UNIT3D Installer"
				/>

				<p>
					All settings are really easy, specially if you already have all the tokes and password for
					integrations with external services. When you finish the initial questionnaire you will
					reach the following confirmation point:
				</p>

				<Image
					src="/images/posts/review-and-setup-guide-for-unit3d/04-last-step-installer.png"
					alt="UNIT3D Installer"
				/>

				<h3 id="step-4-login-page">Step 4. Login Page</h3>
				<p>That&#39;s it. If all went fine during the installation you can load the login page:</p>

				<Image
					src="/images/posts/review-and-setup-guide-for-unit3d/unit3d-login-page.png"
					alt="UNIT3D Login Page"
				/>

				<p>You can use the owner account credentials you provided during the installation.</p>

				<Callout type="info">
					If the official demo is down you can apply for signing up in our demo on: <a
						href="https://www.unit3d-demo.com/application"
						>https://www.unit3d-demo.com/application</a
					>. You don't need to provide real data, just a valid email so we can confirm it manually.
					We want to highlight, however, that we may shut down this demo at any time.
				</Callout>

				<h3 id="troubleshooting">Troubleshooting</h3>
				<p>During the installation we had a couple of issues.</p>
				<p>
					<strong>First</strong>, we chose to use HTTPs but the domain was not pointing the
					droplet&#39;s IP. The generation of the Let&#39;s Encrypt certificates with certbot failed
					because it was not able to reach the server to check the challenge. Once we fixed the DNS
					we could not continue on that point because other steps like inserting some values in the
					database failed.
					<strong
						>The installation process does not allow to go back or reset to the initial state</strong
					>. We needed to create a new droplet.
				</p>
				<p>
					<strong>Second</strong>, the initial server was too small and it stuck at building the
					frontend app. We got this error:
				</p>

				<CodeBlock
					lang="console"
					code={`[Warning] $ vite build
error: script "build" was terminated by signal SIGKILL (Forced Quit)
Killed`}
				/>

				<p>
					The problem was solved by increasing the droplet size. Anyway, It was too small to host
					all the services UNIT3D requires. Currently, with no users, the <strong>CPU Usage</strong>
					is at almost <strong>30%</strong> using a 1 vCPU; 2GB RAM instance.
				</p>
				<p>Finally, we also saw a warning in the Laravel logs.</p>
				<pre><code class="lang-text"
						>Base <span class="hljs-keyword">table</span> or <span class="hljs-comment"
							>view not found: 1146 Table</span
						> <span class="hljs-comment">'unit3d.torrents'</span>
</code></pre>
				<p>
					We opened an <a
						href="https://github.com/HDInnovations/UNIT3D-Community-Edition/issues/4048">issue</a
					>. However, we checked it and the table was there and the application seems to work fine.
				</p>
				<h2 id="user-interface">User Interface</h2>
				<p>After installing the application, we were using it for a while. We:</p>
				<ul>
					<li>Uploaded a torrent.</li>
					<li>Tried to send an invitation.</li>
				</ul>
				<p>
					The application has a lot of features and it can be a little bit overwhelming the first
					time you use it, specially if you are not used to the BitTorrent index terminology. We
					could not send an invitation even with the owner account because you need to give some
					points to the account to enable the user to send invitations. Without a basic knowledge
					about the common features in indexes it can be tough to understand what some features are
					or how to customize the index to your needs. Fortunately the maintainers offer install and
					tuning services.
				</p>
				<h2 id="conclusion">Conclusion</h2>
				<p>
					UNIT3D stands out as a fully-featured BitTorrent index, offering a wide array of
					functionalities that cater to both developers and community moderators. Its robust
					codebase and ease of installation are significant advantages, though newcomers may find
					the platform&#39;s complexity daunting. The lack of extensive documentation on best
					practices within the BitTorrent community is a challenge, but with support from active
					maintainers, users can still achieve a high level of customization and control.
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
