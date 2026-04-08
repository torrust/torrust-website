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
				<Callout type="info">
					<strong>Update (April 2026):</strong> We now have the
					<a href="/blog/deploying-torrust-tracker-with-the-deployer">Torrust Tracker Deployer</a>,
					a tool that automates most of the steps described in this guide. If you are starting a new
					deployment, we recommend reading
					<a href="/blog/deploying-torrust-tracker-with-the-deployer"
						>Deploying the Torrust Tracker Demo with the Torrust Tracker Deployer</a
					>
					instead. This guide remains useful as a reference for understanding what the deployer does under
					the hood, or for deploying on providers the deployer does not yet support.
				</Callout>

				<h2 id="introduction">Introduction</h2>
				<p>
					Welcome to our guide on deploying a BitTorrent Index and Tracker. We&#39;ll walk you
					through each step, explaining the process in a user-friendly manner, so you can understand
					the magic behind hosting a powerful, Rust-based application on the cloud.
				</p>
				<p>
					This guide provides detailed, technical steps for deploying your Rust-based BitTorrent
					Index and Tracker on a Digital Ocean droplet. You&#39;ll find precise commands and
					configurations to ensure a smooth, efficient setup.
				</p>
				<p>
					You can find the docker compose configuration used in this guide on the following GitHub
					repo:
				</p>
				<p>
					<a href="https://github.com/torrust/torrust-compose/tree/main/droplet"
						>https://github.com/torrust/torrust-compose/tree/main/droplet</a
					>
				</p>
				<p>
					Although we are using a droplet, this tutorial is intended to be so generic that you
					should be able to setup the services in any virtual machine with docker and docker
					compose.
				</p>
				<p>This tutorial is based on the Digital Ocean tutorial:</p>
				<p>
					<a
						href="https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose"
						>How To Secure a Containerized Node.js Application with Nginx, Let&#39;s Encrypt, and
						Docker Compose</a
					>.
				</p>
				<p>
					We have only changed the docker compose configuration and some steps to configure the <strong
						>Torrust Index and Tracker</strong
					> instead of the sample node application.
				</p>
				<p>
					After finishing this tutorial you will have these public services available (with your own
					domain):
				</p>
				<ul>
					<li>
						Torrust Index: <a href="https://index.torrust-demo.com"
							>https://index.torrust-demo.com</a
						>
					</li>
					<li>
						Torrust HTTP Tracker: <a href="https://tracker.torrust-demo.com/announce"
							>https://tracker.torrust-demo.com/announce</a
						>
					</li>
					<li>
						Torrust UDP Tracker: <a href="udp://tracker.torrust-demo.com:6969/announce"
							>udp://tracker.torrust-demo.com:6969/announce</a
						>
					</li>
				</ul>
				<h2 id="requirements">Requirements</h2>
				<p>You will need:</p>
				<ul>
					<li>A Digital Ocean account.</li>
					<li>A Digital Ocean virtual machine (droplet) with Ubuntu 22.04.2 LTS.</li>
					<li>Docker, Docker Compose, SQLite3 and Git installed on the server.</li>
				</ul>
				<p>We will explain how to install the required dependencies in the Ubuntu server.</p>
				<h3 id="server">Server</h3>
				<p>A Digital Ocean Droplet with a configuration similar to this:</p>
				<ul>
					<li><strong>Datacenter</strong>: Frankfurt (FRA1).</li>
					<li><strong>Image</strong>: Ubuntu 22.04 (LTS) x64.</li>
					<li><strong>Droplet Type</strong>: Shared CPU (Basic).</li>
					<li><strong>CPU options</strong>: Regular (Disk Type: SSD).</li>
				</ul>
				<p>Resources:</p>
				<ul>
					<li>1 GB/1CPU.</li>
					<li>25 GB SS Disk.</li>
					<li>1000 GB transfer.</li>
				</ul>
				<p>Features:</p>
				<ul>
					<li>Backups enabled.</li>
					<li>With improved metrics monitoring and alerting.</li>
				</ul>
				<h3 id="software">Software</h3>
				<ul>
					<li>Ubuntu 22.04.2 LTS (already installed in the droplet)</li>
					<li>Docker version 24.0.7, build afdd53b.</li>
					<li>Docker Compose version v2.3.3.</li>
					<li>
						SQLite3 version 3.37.2 2022-01-06 13:25:41
						872ba256cbf61d9290b571c0e6d82a20c224ca3ad82971edc46b29818d5dalt1.
					</li>
					<li>Git version 2.34.1 (only for the installation).</li>
				</ul>
				<p>The Docker images used by this tutorial are:</p>

				<CodeBlock
					lang="bash"
					code={`$ docker images --digests
REPOSITORY          TAG               DIGEST                                                                    IMAGE ID       CREATED       SIZE
torrust/tracker     develop           sha256:5589eaf57af277feda6eca6f841859fd2aa05af7deafca546ad0a17fe36d8e51   c42f0cce3304   4 days ago    160MB
nginx               mainline-alpine   sha256:3923f8de8d2214b9490e68fd6ae63ea604deddd166df2755b788bef04848b9bc   01e5c69afaf6   2 weeks ago   42.6MB
torrust/index       develop           sha256:69b12dfcb9c47267bd314f4869dfce7585d3f2b172200ef0d7d7bb776e209fe6   a3db4d4e5d6a   2 weeks ago   64.9MB
torrust/index-gui   develop           sha256:b30deb84cdee8fa34e4d3783ce2f467542e6fdc13a14dd6bbed879e2e2b82bcb   4f6e446cb009   2 weeks ago   175MB`}
				/>

				<Callout type="info">
					We will update them to use a concrete tag v3.0 after releasing it.
				</Callout>

				<h3 id="domain">Domain</h3>
				<p>You will need a domain. We are using &quot;torrust-demo.com&quot; in this tutorial.</p>
				<h2 id="initial-server-setup">Initial Server Setup</h2>
				<p>
					Starting off, we&#39;ll set up a virtual server using Ubuntu 22.04. Think of it as
					preparing a new computer for your application, ensuring it&#39;s ready to run smoothly.
				</p>
				<p>
					This section covers the initial configuration of your Ubuntu 22.04 server, focusing on
					essential security and performance optimizations.
				</p>

				<Callout type="info">
					Disclaimer: For the initial server setup we only highlight the main points. We provide the
					links to Digital Ocean tutorials where you will find detailed information.
				</Callout>

				<p>
					Please refer to <a href="https://docs.digitalocean.com/">Digital Ocean Documentation</a> for
					more information about how to create projects and droplets. Projects are the way DO (Digital
					Ocean) organizes resources (virtual machines, databases, domains, etc.). We have a project called
					&quot;torrust-demo.com&quot;.
				</p>
				<p>
					Once you have created your project and droplet you can follow the <a
						href="https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04"
						>Digital Ocean guide to setup a new Ubuntu server</a
					>.
				</p>
				<p>For this tutorial we have used our demo environment.</p>
				<p>In this first step you will:</p>
				<ul>
					<li>Create a virtual machine (droplet).</li>
					<li>Access the virtual machine using the <code>root</code> account.</li>
					<li>Create a new user <code>torrust</code>.</li>
					<li>Access the server using the new account <code>torrust</code>.</li>
				</ul>
				<p>
					After creating the droplet you should be able to connect by using SSH with the <code
						>root</code
					> account providing the password you set during the droplet creation:
				</p>

				<CodeBlock lang="bash" code={`ssh root@139.59.150.216`} />

				<p>After logging in you can create the new user account:</p>

				<CodeBlock
					lang="bash"
					code={`adduser torrust
usermod -aG sudo torrust`}
				/>

				<p>The user is added to the sudo group you can can execute command as root when needed.</p>
				<h3 id="setup-ssh-keys">Setup SSH Keys</h3>
				<p>
					Security is key! Setting up SSH keys is like creating a special passcode for safe and
					secure access to your server.
				</p>
				<p>
					Follow the <a
						href="https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-22-04"
						>Digital Ocean tutorial</a
					> to establish secure SSH key authentication, enhancing the security of your server connections.
				</p>
				<p>You have to generate a new key and copy it to the server:</p>

				<CodeBlock
					lang="bash"
					code={`ssh-copy-id -i ~/.ssh/torrust_rsa.pub torrust@139.59.150.216`}
				/>

				<p>If all went fine you should be able to login to the server with your SSH key.</p>

				<CodeBlock lang="bash" code={`ssh torrust@139.59.150.216`} />

				<h3 id="install-docker">Install Docker</h3>
				<p>
					Docker is a tool that lets you run applications in a consistent environment. It&#39;s like
					having a universal app runner that works the same everywhere.
				</p>
				<p>
					You can also follow the DO guide: <a
						href="https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04"
						>How To Install and Use Docker on Ubuntu 22.04</a
					>.
				</p>
				<p>In short, you only need to execute some commands:</p>

				<CodeBlock
					lang="bash"
					code={`sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker`}
				/>

				<p>
					If you want to execute docker without sudo you will need to execute some more commands:
				</p>

				<CodeBlock
					lang="bash"
					code={`sudo usermod -aG docker \${USER}
su - \${USER}`}
				/>

				<p>Make sure docker is running with <code>docker run hello-world</code>.</p>
				<h3 id="install-docker-compose">Install Docker Compose</h3>
				<p>
					Docker Compose helps in running complex apps easily. It&#39;s like a recipe that tells
					Docker how to prepare and serve your app.
				</p>
				<p>
					You can follow the Digital Ocean Tutorial: <a
						href="https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04"
						>How To Install and Use Docker Compose on Ubuntu 22.04</a
					>
				</p>

				<CodeBlock
					lang="bash"
					code={`mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose`}
				/>

				<p>
					And also make sure it&#39;s installed correctly with <code>docker compose version</code>.
				</p>
				<h3 id="install-sqlite">Install SQLite</h3>
				<p>
					SQLite is a simple database system. You won&#39;t needed if you use MySQL for both the
					Index and Tracker. In this tutorial we will use it.
				</p>

				<CodeBlock
					lang="bash"
					code={`sudo apt update
sudo apt install sqlite3`}
				/>

				<p>You can check if it&#39;s installed correctly with <code>sqlite3 --version</code>.</p>
				<p>You can execute queries to get the Tracker or Index data connecting with:</p>

				<CodeBlock
					lang="bash"
					code={`$ sqlite3 ./storage/index/lib/database/sqlite3.db
SQLite version 3.37.2 2022-01-06 13:25:41
Enter ".help" for usage hints.
sqlite>`}
				/>

				<p>Some useful commands are:</p>
				<ul>
					<li><code>.help</code>: show help.</li>
					<li><code>.tables</code>: list tables.</li>
					<li><code>.quit</code>: exit.</li>
				</ul>
				<h2 id="setup-the-dns">Setup The DNS</h2>
				<p>
					Before running the application we have to setup the DNS. You can load the application
					using your domain instead of the droplet IP.
				</p>

				<Callout type="info">
					The droplet has an IP that can be used to setup the DNS, but we recommend using an
					reserved IP. You can link the reserved IP to the droplet.
				</Callout>

				<p>
					First at all, you need to change your name servers and use the ones from Digital Ocean.
					You have to find out how to do that in your domain provider.
				</p>
				<p>
					Then you need to create two <code>A</code> records to point the domains to the droplet IP (or
					the reserved IP if you are using one).
				</p>
				<p>Here is how the DNS configuration looks like for our demo:</p>

				<Image
					src="/images/posts/deploying-torrust-to-production/dns-configuration.png"
					alt="Create"
				/>

				<h3 id="bep-34">BEP 34</h3>
				<p>
					As you can see in our DNS configuration we have a <code>TXT</code> record for the tracker with
					this value:
				</p>
				<pre><code class="lang-text"
						><span class="hljs-selector-tag">BITTORRENT</span> <span class="hljs-selector-tag"
							>UDP</span
						><span class="hljs-selector-pseudo">:6969</span> <span class="hljs-selector-tag"
							>TCP</span
						><span class="hljs-selector-pseudo">:443</span>
</code></pre>
				<p>
					That record implements the <a href="https://www.bittorrent.org/beps/bep_0034.html"
						>BEP 34 DNS Tracker Preferences</a
					>.
				</p>
				<p>
					That allows administrators to declare the port and the service priorities for a tracker
					domain. In our case, we have two different trackers running on ports <code>6969</code> and
					<code>443</code> and we prioritize the UDP tracker.
				</p>
				<p>
					Some services related to tracker (for instance <a href="https://newtrackon.com"
						>https://newtrackon.com</a
					>) use this DNS record to verify tracker URLs.
				</p>
				<h2 id="install-the-application">Install The Application</h2>
				<p>
					First, we will install the application on port <code>80</code> because we need a live app
					to generate the HTTPs certificates with Let&#39;s Encrypt. Once we generate the
					certificates we can change the configuration to serve the application on port
					<code>443</code>.
				</p>
				<h3 id="without-certificates">Without certificates</h3>
				<p>
					We&#39;ll start by launching your app in a basic, non-secure mode. Initial deployment
					steps will be covered, focusing on functionality before implementing SSL/TLS certificates.
					We need to run the application in order to generate certificates with Let&#39;s Encrypt.
				</p>
				<p>
					First, we need to get the docker compose configuration. You can download it directly from
					the <a href="https://github.com/torrust/torrust-compose">Torrust Compose GitHub repo</a> or
					you can use Git:
				</p>

				<CodeBlock
					lang="bash"
					code={`cd \\
  && mkdir -p github/torrust \\
  && cd github/torrust/ \\
  && git clone --single-branch --branch main https://github.com/torrust/torrust-compose.git \\
  && cd torrust-compose/ \\
  && git status \\
  && cd droplet/`}
				/>

				<p>
					If you use Git you will need to install it in the server. Follow the <a
						href="https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-22-04"
						>&quot;How To Install Git on Ubuntu 22.04&quot;</a
					> guide.
				</p>
				<p>After cloning the repository you have to run the install script:</p>

				<CodeBlock
					lang="bash"
					code={`$ ./bin/install.sh
Creating compose .env './.env'
Creating proxy config file: './storage/proxy/etc/nginx-conf/nginx.conf'
Creating index database: './storage/index/lib/database/sqlite3.db'
Creating index configuration: './storage/index/etc/index.toml'
Creating tracker database: './storage/tracker/lib/database/sqlite3.db'
Creating tracker configuration: './storage/tracker/etc/tracker.toml'`}
				/>

				<p>The script will create some needed directories and empty SQLite databases:</p>

				<CodeBlock
					lang="bash"
					code={`$ tree storage/
storage/
├── certbot
│   ├── etc
│   └── lib
├── dhparam
├── index
│   ├── etc
│   │   └── index.toml
│   └── lib
│       └── database
│           └── sqlite3.db
├── proxy
│   ├── etc
│   │   └── nginx-conf
│   │       └── nginx.conf
│   └── webroot
└── tracker
    ├── etc
    │   └── tracker.toml
    └── lib
        └── database
            └── sqlite3.db\n
17 directories, 5 files`}
				/>

				<p>
					Now you can continue with some customizations. You can adjust the default configuration
					for all services or leave the default values. But at least you must change the domain and
					the secrets.
				</p>
				<p>First open the <code>.env</code> file and find these environment variables:</p>
				<ul>
					<li><code>TORRUST_INDEX_GUI_API_BASE_URL</code></li>
					<li><code>TORRUST_INDEX_CONFIG_OVERRIDE_TRACKER__TOKEN</code></li>
					<li><code>TORRUST_INDEX_CONFIG_OVERRIDE_AUTH__SECRET_KEY</code></li>
					<li><code>TORRUST_TRACKER_CONFIG_OVERRIDE_HTTP_API__ACCESS_TOKENS__ADMIN</code></li>
				</ul>
				<p>Replace the value for <code>TORRUST_INDEX_GUI_API_BASE_URL</code> with your domain:</p>
				<pre><code class="lang-text"
						><span class="hljs-attr">TORRUST_INDEX_GUI_API_BASE_URL</span>=<span class="hljs-string"
							>'http://index.your-domain.com/api/v1'</span
						>
</code></pre>
				<p>
					In <code>storage/index/etc/index.toml</code> replace the default tracker URL to be included
					in torrents with yours:
				</p>

				<CodeBlock
					lang="bash"
					code={`[tracker]
url = "udp://tracker.torrust-demo.com:6969"`}
				/>

				<CodeBlock
					lang="bash"
					code={`[tracker]
url = "udp://tracker.your-domain.com:6969"`}
				/>

				<p>You can generate the Tracker API token and the Auth Secret Key with:</p>

				<CodeBlock
					lang="bash"
					code={`gpg --armor --gen-random 1 40
jcrmbzlGyeP7z53TUQtXmtltMb5TubsIE9e0DPLnS4Ih29JddQw5JA==`}
				/>

				<p>
					You also need to change Nginx configuration <code
						>share/container/default/config/nginx.conf</code
					> to set your domain.
				</p>

				<Callout type="info">
					NOTICE: We are not sending emails from the application because user&#39;s email validation
					is disabled on registration for the demo. If you want to enable email validation you will
					need to provide the SMTP configuration including the password in the <code
						>storage/index/etc/index.toml</code
					> config file.
				</Callout>

				<p>Now, you should be able to run the application with the following command:</p>

				<CodeBlock lang="bash" code={`docker compose up --build --detach`} />

				<p>
					If you have reached this point, congratulations! you already have these live services:
				</p>
				<ul>
					<li>
						Torrust Index: <a href="http://index.your-domain.com">http://index.your-domain.com</a>
					</li>
					<li>
						Torrust HTTP Tracker: <a href="http://tracker.your-domain.com/announce"
							>http://tracker.your-domain.com/announce</a
						>
					</li>
					<li>
						Torrust UDP Tracker: <a href="udp://tracker.your-domain.com:6969/announce"
							>udp://tracker.your-domain.com:6969/announce</a
						>
					</li>
				</ul>
				<p>
					In the next sections we will describe how to use Let&#39;s Encrypt to generate
					certificates to use HTTPs for the Index website and HTTP Tracker.
				</p>
				<h3 id="generate-certificates-with-let-s-encrypt">
					Generate Certificates With Let&#39;s Encrypt
				</h3>
				<p>
					Let&#39;s Encrypt provides free certificates. You&#39;ll learn how to obtain and configure
					Let&#39;s Encrypt SSL certificates for secure HTTPS connections.
				</p>
				<p>
					First, you need to log in the &quot;certbot&quot; container. <a
						href="https://certbot.eff.org/">Certbot</a
					> is a free, open source software tool for automatically (using Let’s Encrypt certificates)
					enable HTTPS.
				</p>

				<CodeBlock lang="bash" code={`docker compose run --entrypoint /bin/sh certbot`} />

				<Callout type="info">
					Notice that the previous command recreates the docker containers so you site will be down
					for some seconds.
				</Callout>

				<p>
					Once you are logged in the certbot container you need to execute these certbot commands to
					generate the staging certificates:
				</p>

				<CodeBlock
					lang="bash"
					code={`certbot certonly --webroot --webroot-path=/var/www/html --email email@example.com --agree-tos --no-eff-email --staging -d index.torrust-demo.com
certbot certonly --webroot --webroot-path=/var/www/html --email email@example.com --agree-tos --no-eff-email --staging -d tracker.torrust-demo.com`}
				/>

				<p>Replace <code>email@example.com</code> with your email.</p>
				<p>
					For the production certificates you can execute the same command but removing the flag <code
						>--staging</code
					>:
				</p>

				<CodeBlock
					lang="bash"
					code={`certbot certonly --webroot --webroot-path=/var/www/html --email email@example.com --agree-tos --no-eff-email --force-renewal -d index.torrust-demo.com
certbot certonly --webroot --webroot-path=/var/www/html --email email@example.com --agree-tos --no-eff-email --force-renewal -d tracker.torrust-demo.com`}
				/>

				<p>
					In the directory <code>storage/certbot/etc/live</code> you should have at least one directory
					per domain.
				</p>
				<h3 id="change-nginx-configuration-to-use-certificates">
					Change Nginx Configuration To Use Certificates
				</h3>
				<p>
					Once we have the certificates, we&#39;ll tell our server (Nginx) to use them, ensuring a
					secure website. Detailed steps to modify your Nginx configuration for SSL implementation
					will be provided.
				</p>
				<h4 id="generate-the-diffie-hellman-key">Generate The Diffie-Hellman Key</h4>

				<CodeBlock
					lang="bash"
					code={`sudo openssl dhparam -out /home/torrust/github/torrust/torrust-compose/droplet/storage/dhparam/dhparam-2048.pem 2048`}
				/>

				<h4 id="update-nginx-configuration">Update Nginx Configuration</h4>
				<p>
					Edit the file <code>./storage/proxy/etc/nginx-conf/nginx.conf</code> and uncomment all the commented
					lines for HTTPs servers:
				</p>

				<Callout type="warning">
					Notice: you have to edit the file <code>./storage/proxy/etc/nginx-conf/nginx.conf</code>
					not the file <code>share/container/default/config/nginx.conf</code>.
				</Callout>

				<CodeBlock
					lang="nginx"
					code={`server
{
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name index.torrust-demo.com;\n
  server_tokens off;\n
  ssl_certificate /etc/letsencrypt/live/index.torrust-demo.com-0001/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/index.torrust-demo.com-0001/privkey.pem;\n
  ssl_buffer_size 8k;\n
  ssl_dhparam /etc/ssl/certs/dhparam-2048.pem;\n
  ssl_protocols TLSv1.2;
  ssl_prefer_server_ciphers on;\n
  ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;\n
  ssl_ecdh_curve secp384r1;
  ssl_session_tickets off;\n
  ssl_stapling on;
  ssl_stapling_verify on;
  resolver 8.8.8.8;\n
  location ^~/api/
  {
    rewrite ^/api/(.*)$ /$1 break;
    try_files $uri @index;
  }\n
  location /
  {
    try_files $uri @index-gui;
  }\n
  location @index
  {
    proxy_pass http://index:3001;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src * data: 'unsafe-eval' 'unsafe-inline'" always;
    #add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    # enable strict transport security only if you understand the implications
  }\n
  location @index-gui
  {
    proxy_pass http://index-gui:3000;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src * data: 'unsafe-eval' 'unsafe-inline'" always;
    #add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    # enable strict transport security only if you understand the implications
  }\n
  root /var/www/html;
  index index.html index.htm index.nginx-debian.html;
}\n
server
{
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name tracker.torrust-demo.com;\n
  server_tokens off;\n
  ssl_certificate /etc/letsencrypt/live/tracker.torrust-demo.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/tracker.torrust-demo.com/privkey.pem;\n
  ssl_buffer_size 8k;\n
  ssl_dhparam /etc/ssl/certs/dhparam-2048.pem;\n
  ssl_protocols TLSv1.2;
  ssl_prefer_server_ciphers on;\n
  ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;\n
  ssl_ecdh_curve secp384r1;
  ssl_session_tickets off;\n
  ssl_stapling on;
  ssl_stapling_verify on;
  resolver 8.8.8.8;\n
  location /api/
  {
    try_files $uri @tracker-api;
  }\n
  location /
  {
    try_files $uri @tracker-http;
  }\n
  location @tracker-api
  {
    proxy_pass http://tracker:1212;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src * data: 'unsafe-eval' 'unsafe-inline'" always;
    #add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    # enable strict transport security only if you understand the implications
  }\n
  location @tracker-http
  {
    proxy_pass http://tracker:7070;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src * data: 'unsafe-eval' 'unsafe-inline'" always;
    #add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    # enable strict transport security only if you understand the implications\n
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }\n
  root /var/www/html;
  index index.html index.htm index.nginx-debian.html;
}`}
				/>

				<p>Make sure you also change the domains:</p>
				<ul>
					<li>index.torrust-demo.com</li>
					<li>tracker.torrust-demo.com</li>
				</ul>
				<p>You also have to change the API base URL in the <code>.env</code> file:</p>
				<pre><code class="lang-text"
						>TORRUST_INDEX_GUI_API_BASE_URL=http<span class="hljs-variable">s:</span>//<span
							class="hljs-built_in">index</span
						>.torrust-demo.<span class="hljs-keyword">com</span>/api/v1
</code></pre>
				<p>
					Replace it from <code>http://index.torrust-demo.com/api/v1</code> to
					<code>https://index.torrust-demo.com/api/v1</code>.
				</p>
				<p>
					After changing the Nginx configuration and <code>.env</code> file you need to recreate containers:
				</p>

				<CodeBlock lang="bash" code={`docker compose up -d --force-recreate`} />

				<p>
					If you only change the Nginx configuration you can execute the following to reload Nginx
					configuration:
				</p>

				<CodeBlock lang="bash" code={`docker compose --ansi never restart proxy`} />

				<h3 id="setup-cronjob-to-renew-certificates">Setup Cronjob To Renew Certificates</h3>
				<p>
					Certificates expire, so we&#39;ll set up an automatic renewal system, like a subscription
					that renews itself. We will set up an automate SSL certificate renewal using cronjobs to
					maintain continuous security.
				</p>
				<p>We will use crontab to execute a command every day:</p>

				<CodeBlock lang="bash" code={`sudo crontab -e`} />

				<p>Add the following crontab line:</p>

				<CodeBlock
					lang="text"
					code={`0 12 * * * /home/torrust/github/torrust/torrust-compose/droplet/bin/ssl_renew.sh >> /var/log/cron.log 2>&1`}
				/>

				<p>You can check the cronjob output with:</p>

				<CodeBlock lang="bash" code={`tail -f /var/log/cron.log`} />

				<p>
					After generating the certificates and renewing them you should have a certbot directory
					structure similar to this:
				</p>

				<CodeBlock
					lang="bash"
					code={`$ sudo tree storage/certbot/
[sudo] password for torrust:
storage/certbot/
├── etc
│   ├── accounts
│   │   ├── acme-staging-v02.api.letsencrypt.org
│   │   │   └── directory
│   │   │       └── b39c03e978*****df8366ab6539
│   │   │           ├── meta.json
│   │   │           ├── private_key.json
│   │   │           └── regr.json
│   │   └── acme-v02.api.letsencrypt.org
│   │       └── directory
│   │           └── 441a435b0f8*****cc6dd22f34468
│   │               ├── meta.json
│   │               ├── private_key.json
│   │               └── regr.json
│   ├── archive
│   │   ├── index.torrust-demo.com
│   │   │   ├── cert1.pem
│   │   │   ├── chain1.pem
│   │   │   ├── fullchain1.pem
│   │   │   └── privkey1.pem
│   │   ├── index.torrust-demo.com-0001
│   │   │   ├── cert1.pem
│   │   │   ├── cert2.pem
│   │   │   ├── chain1.pem
│   │   │   ├── chain2.pem
│   │   │   ├── fullchain1.pem
│   │   │   ├── fullchain2.pem
│   │   │   ├── privkey1.pem
│   │   │   └── privkey2.pem
│   │   └── tracker.torrust-demo.com
│   │       ├── cert1.pem
│   │       ├── cert2.pem
│   │       ├── cert3.pem
│   │       ├── chain1.pem
│   │       ├── chain2.pem
│   │       ├── chain3.pem
│   │       ├── fullchain1.pem
│   │       ├── fullchain2.pem
│   │       ├── fullchain3.pem
│   │       ├── privkey1.pem
│   │       ├── privkey2.pem
│   │       └── privkey3.pem
│   ├── live
│   │   ├── README
│   │   ├── index.torrust-demo.com
│   │   │   ├── README
│   │   │   ├── cert.pem -> ../../archive/index.torrust-demo.com/cert1.pem
│   │   │   ├── chain.pem -> ../../archive/index.torrust-demo.com/chain1.pem
│   │   │   ├── fullchain.pem -> ../../archive/index.torrust-demo.com/fullchain1.pem
│   │   │   └── privkey.pem -> ../../archive/index.torrust-demo.com/privkey1.pem
│   │   ├── index.torrust-demo.com-0001
│   │   │   ├── README
│   │   │   ├── cert.pem -> ../../archive/index.torrust-demo.com-0001/cert2.pem
│   │   │   ├── chain.pem -> ../../archive/index.torrust-demo.com-0001/chain2.pem
│   │   │   ├── fullchain.pem -> ../../archive/index.torrust-demo.com-0001/fullchain2.pem
│   │   │   └── privkey.pem -> ../../archive/index.torrust-demo.com-0001/privkey2.pem
│   │   └── tracker.torrust-demo.com
│   │       ├── README
│   │       ├── cert.pem -> ../../archive/tracker.torrust-demo.com/cert3.pem
│   │       ├── chain.pem -> ../../archive/tracker.torrust-demo.com/chain3.pem
│   │       ├── fullchain.pem -> ../../archive/tracker.torrust-demo.com/fullchain3.pem
│   │       └── privkey.pem -> ../../archive/tracker.torrust-demo.com/privkey3.pem
│   ├── renewal
│   │   ├── index.torrust-demo.com-0001.conf
│   │   ├── index.torrust-demo.com.conf
│   │   └── tracker.torrust-demo.com.conf
│   └── renewal-hooks
│       ├── deploy
│       ├── post
│       └── pre
└── lib\n
22 directories, 49 files`}
				/>

				<h2 id="exposed-services">Exposed services</h2>
				<p>After finishing the installation the main available services are:</p>
				<ul>
					<li>
						The Index: <a href="http://index.torrust-demo.com/">http://index.torrust-demo.com/</a>
					</li>
					<li>
						The HTTP Tracker: <a href="https://tracker.torrust-demo.com/announce"
							>https://tracker.torrust-demo.com/announce</a
						>
					</li>
					<li>
						The UDP Tracker: <a href="udp://tracker.torrust-demo.com:6969/announce"
							>udp://tracker.torrust-demo.com:6969/announce</a
						>
					</li>
				</ul>
				<p>
					But there are some other exposed ports. In addition to the SSH port (22), when you run the
					container you&#39;ll expose all the following ports on the server:
				</p>
				<ul>
					<li>80 (proxy)</li>
					<li>443 (proxy)</li>
					<li>3001 (index-gui)</li>
					<li>3000 (index)</li>
					<li>6969 (tracker)</li>
					<li>7070 (tracker)</li>
					<li>1212 (tracker)</li>
				</ul>
				<p>You should have access to all exposed services by default.</p>
				<p>
					You should be able to access the services directly (with no proxy) connecting to the
					containers:
				</p>
				<ul>
					<li>
						Index GUI (webapp): <a href="http://index.torrust-demo.com:3000"
							>http://index.torrust-demo.com:3000</a
						>
					</li>
					<li>
						Index (API): <a href="http://tracker.torrust-demo.com:3001"
							>http://tracker.torrust-demo.com:3001</a
						>
					</li>
					<li>
						Tracker (HTTP): <a href="http://tracker.torrust-demo.com:7070/announce"
							>http://tracker.torrust-demo.com:7070/announce</a
						>
					</li>
					<li>Tracker (UDP): udp://tracker.torrust-demo.com:6969</li>
					<li>
						Tracker (API): <a href="http://tracker.torrust-demo.com:1212"
							>http://tracker.torrust-demo.com:1212</a
						>
					</li>
				</ul>
				<p>
					But you should also be able to connect to all services except the UDP Tracker via the
					Nginx proxy both with HTTP or HTTPs:
				</p>
				<p>HTTP access to services via proxy:</p>
				<ul>
					<li>
						Index GUI (webapp): <a href="http://index.torrust-demo.com"
							>http://index.torrust-demo.com</a
						>
					</li>
					<li>
						<p>
							Index (API): <a href="http://index.torrust-demo.com/api"
								>http://index.torrust-demo.com/api</a
							>
						</p>
					</li>
					<li>
						<p>
							Tracker (HTTP): <a href="http://tracker.torrust-demo.com/announce"
								>http://tracker.torrust-demo.com/announce</a
							>
						</p>
					</li>
					<li>
						Tracker (API): <a href="http://tracker.torrust-demo.com/api"
							>http://tracker.torrust-demo.com/api</a
						>
					</li>
				</ul>
				<p>HTTPs access to services via proxy:</p>
				<ul>
					<li>
						Index GUI (webapp): <a href="https://index.torrust-demo.com"
							>https://index.torrust-demo.com</a
						>
					</li>
					<li>
						<p>
							Index (API): <a href="https://index.torrust-demo.com/api"
								>https://index.torrust-demo.com/api</a
							>
						</p>
					</li>
					<li>
						<p>
							Tracker (HTTP): <a href="https://tracker.torrust-demo.com/announce"
								>https://tracker.torrust-demo.com/announce</a
							>
						</p>
					</li>
					<li>
						Tracker (API): <a href="https://tracker.torrust-demo.com/api"
							>https://tracker.torrust-demo.com/api</a
						>
					</li>
				</ul>
				<p>
					You can disable both, direct access to the container (without using the Nginx proxy) and
					also access without certificates (HTTP). In that case you only need to expose port: <code
						>443</code
					>
					and <code>6969</code>. In order to do that you will need to enable a firewall on the
					server or the Digital Ocean firewall.
				</p>

				<Callout type="info">
					Notice: The UDP tracker is not available via the proxy. If you want all requests to go
					through the proxy you need to change the Nginx configuration to set up a UDP proxy. There
					is a discussion on the Tracker repository on GitHub about how to setup the proxy for the
					UDP tracker.
				</Callout>

				<h3 id="firewall">Firewall</h3>
				<p>
					By default there is no firewall on the server. If you want to enable the firewall you have
					two options:
				</p>
				<ul>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-22-04"
							>Setup your own firewall on the server</a
						>.
					</li>
					<li>
						<a
							href="https://docs.digitalocean.com/products/networking/firewalls/getting-started/quickstart/"
							>Enable the Digital Ocean firewall</a
						>.
					</li>
				</ul>
				<p>You can enable the UFW firewall on the server by following the Digital Ocean guide:</p>
				<p>
					<a
						href="https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-22-04"
						>How To Set Up a Firewall with UFW on Ubuntu 22.04</a
					>.
				</p>
				<p>
					For example, you can allow only the ports <code>22</code>, <code>43</code> and
					<code>6969</code> with the following command:
				</p>

				<CodeBlock
					lang="bash"
					code={`sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 443
sudo ufw allow 6969/udp
sudo ufw enable
sudo ufw status verbose`}
				/>

				<Callout type="info">
					However, there is a problem with setting up your own firewall. By default, Docker
					manipulates iptables to set up network isolation. However, this can interfere with UFW. To
					fix this, you need to tell Docker not to modify iptables.
				</Callout>

				<h3 id="health-checks">Health checks</h3>
				<p>Some services expose public health check endpoints.</p>
				<p>Via proxy (HTTP):</p>
				<ul>
					<li>
						Index API: <a href="http://index.torrust-demo.com/api/health_check"
							>http://index.torrust-demo.com/api/health_check</a
						>
					</li>
					<li>
						Tracker API: <a href="http://tracker.torrust-demo.com/api/health_check"
							>http://tracker.torrust-demo.com/api/health_check</a
						>
					</li>
					<li>
						Tracker HTTP: <a href="http://tracker.torrust-demo.com/health_check"
							>http://tracker.torrust-demo.com/health_check</a
						>
					</li>
				</ul>
				<p>Via proxy (HTTPs):</p>
				<ul>
					<li>
						Index: <a href="https://index.torrust-demo.com/api/health_check"
							>https://index.torrust-demo.com/api/health_check</a
						>
					</li>
					<li>
						Tracker API: <a href="https://tracker.torrust-demo.com/api/health_check"
							>https://tracker.torrust-demo.com/api/health_check</a
						>
					</li>
					<li>
						Tracker HTTPs: <a href="https://tracker.torrust-demo.com/health_check"
							>https://tracker.torrust-demo.com/health_check</a
						>
					</li>
				</ul>
				<p>Direct access:</p>
				<ul>
					<li>
						Index API: <a href="http://tracker.torrust-demo.com:3001/health_check"
							>http://tracker.torrust-demo.com:3001/health_check</a
						>
					</li>
					<li>
						Tracker API: <a href="http://tracker.torrust-demo.com:1212/health_check"
							>http://tracker.torrust-demo.com:1212/health_check</a
						>
					</li>
					<li>
						Tracker HTTP: <a href="http://tracker.torrust-demo.com:7070/health_check"
							>http://tracker.torrust-demo.com:7070/health_check</a
						>
					</li>
				</ul>

				<Callout type="info">
					These endpoints are very useful to test if your installation is OK.
				</Callout>

				<h2 id="troubleshooting">Troubleshooting</h2>
				<p>
					You might have problems setting up the application. There are some useful things you
					should know in order to be able to address potential problems.
				</p>
				<p>
					First, it might be useful to enable the debug logging for some services. Both the Index
					and the Tracker have a configuration option <code>log_level = &quot;info&quot;</code>. You
					can change the logging level to <code>debug</code> or even <code>trace</code>.
				</p>
				<p>Configuration files are located in:</p>
				<ul>
					<li><code>./storage/index/etc/index.toml</code>.</li>
					<li><code>./storage/tracker/etc/tracker.toml</code>.</li>
				</ul>
				<p>If you change the config files you will need to restart the services:</p>

				<CodeBlock lang="bash" code={`docker compose restart`} />

				<p>You can also check the logs of any service with:</p>

				<CodeBlock
					lang="bash"
					code={`docker compose logs proxy
docker compose logs certbot
docker compose logs index
docker compose logs index-gui
docker compose logs tracker`}
				/>

				<p>If you change the config files you will need to restart the services.</p>
				<p>
					You can also enable the debug for the Nginx proxy. Edit the file <code
						>./storage/proxy/etc/nginx-conf/nginx.conf</code
					>
					and add <code>error_log</code> to the server configuration:
				</p>

				<CodeBlock
					lang="nginx"
					code={`server
{
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name index.torrust-demo.com;\n
    error_log /var/log/nginx/error.log debug;\n
    ...
}`}
				/>

				<p>If your server does not have too much disk space you could run out of disk space.</p>
				<p>
					Docker stores the logs in a separate directory, if you want to truncate the logs you can
					find them first with:
				</p>

				<CodeBlock
					lang="bash"
					code={`sudo : > $(docker inspect --format='{{.LogPath}}' tracker)
-bash: /var/lib/docker/containers/397484cca9572d98524e4f81095bb27f90c349306c39bc517afe5bcb3a6d7f5e/397484cca9572d98524e4f81095bb27f90c349306c39bc517afe5bcb3a6d7f5e-json.log: Permission denied`}
				/>

				<p>And then truncate the file with:</p>

				<CodeBlock
					lang="bash"
					code={`sudo truncate -s 0 /var/lib/docker/containers/397484cca9572d98524e4f81095bb27f90c349306c39bc517afe5bcb3a6d7f5e/397484cca9572d98524e4f81095bb27f90c349306c39bc517afe5bcb3a6d7f5e-json.log`}
				/>

				<p>
					The docker compose configuration sets a limit on the number of log files and their size.
				</p>
				<p>Finally, if you need some URL to test the HTTP tracker you can use these ones:</p>
				<ul>
					<li>
						Announce request: <a
							href="https://tracker.torrust-demo.com/announce?info_hash=%44%3C%76%02%B4%FD%E8%3D%11%54%D6%D9%DA%48%80%84%18%B1%81%B6&amp;peer_addr=2.137.87.41&amp;downloaded=0&amp;uploaded=0&amp;peer_id=-qB00000000000000001&amp;port=17548&amp;left=0&amp;event=completed&amp;compact=0"
							>https://tracker.torrust-demo.com/announce?info_hash=%44%3C%76%02%B4%FD%E8%3D%11%54%D6%D9%DA%48%80%84%18%B1%81%B6&amp;peer_addr=2.137.87.41&amp;downloaded=0&amp;uploaded=0&amp;peer_id=-qB00000000000000001&amp;port=17548&amp;left=0&amp;event=completed&amp;compact=0</a
						>
					</li>
					<li>
						Scrape request: <a
							href="https://tracker.torrust-demo.com/scrape?info_hash=%44%3C%76%02%B4%FD%E8%3D%11%54%D6%D9%DA%48%80%84%18%B1%81%B6"
							>https://tracker.torrust-demo.com/scrape?info_hash=%44%3C%76%02%B4%FD%E8%3D%11%54%D6%D9%DA%48%80%84%18%B1%81%B6</a
						>
					</li>
				</ul>
				<p>The infohash used is <code>443C7602B4FDE83D1154D6D9DA48808418B181B6</code>.</p>
				<h2 id="maintenance">Maintenance</h2>
				<h3 id="backups">Backups</h3>
				<p>All the data used by the application is in the <code>storage</code> folder.</p>
				<p>We are using SQLite so the only thing we need to do is to backup the database files.</p>
				<ul>
					<li>Index database: <code>index/lib/database/sqlite3.db</code></li>
					<li>Tracker database: <code>tracker/lib/database/sqlite3.db</code></li>
				</ul>
				<p>
					We enabled backups for the droplet when we created it. Droplet backups are generated once
					per week. You should setup a better backup policy or use a MySQL service that provides
					backup. An easy way to increase the number of backups would be to mount a volume and
					periodically backup the files you want to backup, for example the database files or the
					configuration files.
				</p>
				<p>
					Alternatively, you can use <a
						href="https://docs.digitalocean.com/developer-center/droplets-and-volumes-backups-with-snapshooter/"
						>SnapShooter to backup droplets and volumes</a
					>.
				</p>
				<p>How to setup a proper backup policy is out of the scope of this tutorial.</p>
				<h3 id="monitoring">Monitoring</h3>
				<p>
					It&#39;s important to know the state of your services. Digital Ocean allow you to set:
				</p>
				<ul>
					<li>Resource alerts</li>
					<li>Uptime checks</li>
				</ul>
				<p>We have set up both.</p>
				<p>
					With the &quot;resource alerts&quot; you can be notified when the droplet is having
					trouble with the resources (memory, CPU, disk or bandwidth).
				</p>

				<Image
					src="/images/posts/deploying-torrust-to-production/digital-ocean-monitoring-resource-alerts.png"
					alt="Create"
				/>

				<p>And "uptime checks" can be used to monitor the state of the services.</p>

				<Image
					src="/images/posts/deploying-torrust-to-production/digital-ocean-monitoring-uptime.png"
					alt="Create"
				/>

				<p>We used the health check endpoints for some services like APIs and the HTTP tracker.</p>
				<h2 id="cost">Cost</h2>
				<ul>
					<li>
						Basic droplet (1GB/1CPU, 25GB SSD Disk, 1000GB transfer): <strong>$6</strong> per month.
					</li>
					<li>Weekly droplet backup: <strong>$1.20</strong> per month.</li>
					<li>Reserved IP: <strong>$5.00</strong> per month.</li>
					<li>Domain: depends on your provider.</li>
				</ul>
				<p>Total cost: <strong>$12.2</strong> per month.</p>
				<p>
					See <a href="https://www.digitalocean.com/pricing">Digital Ocean pricing</a> for more information.
				</p>
				<h2 id="other-considerations">Other Considerations</h2>
				<h3 id="adding-the-tracker-to-public-lists">Adding The Tracker To Public Lists</h3>
				<p>
					If you are interested in, you can add your tracker to some tracker lists, for example: <a
						href="https://newtrackon.com">https://newtrackon.com</a
					>.
				</p>
				<h3 id="sending-emails">Sending Emails</h3>
				<p>
					We have not enabled email verification. If you enable it you will need to configure the
					SMTP server in the Index configuration:
				</p>

				<CodeBlock
					lang="toml"
					code={`[mail]
email_verification_enabled = false
from = "example@email.com"
reply_to = "noreply@email.com"
username = ""
password = ""
server = "mailcatcher"
port = 1025`}
				/>

				<h3 id="docker-image-tags">Docker Image Tags</h3>
				<p>
					We have used the <code>develop</code> tag for the Docker images. We will update this guide
					to use version <code>v3.0</code> once it&#39;s released.
				</p>
				<h2 id="links">Links</h2>
				<ul>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose"
							>How To Secure a Containerized Node.js Application with Nginx, Let&#39;s Encrypt, and
							Docker Compose</a
						>
					</li>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04"
							>Initial Server Setup with Ubuntu 22.04</a
						>
					</li>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-22-04"
							>How to Set Up SSH Keys on Ubuntu 22.04</a
						>
					</li>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04"
							>How To Install and Use Docker on Ubuntu 22.04</a
						>
					</li>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04"
							>How To Install and Use Docker Compose on Ubuntu 22.04</a
						>
					</li>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-22-04"
							>How To Set Up a Firewall with UFW on Ubuntu 22.04</a
						>
					</li>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-22-04"
							>How To Install Git on Ubuntu 22.04</a
						>
					</li>
					<li>
						<a
							href="https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-22-04"
							>How To Set Up a Firewall with UFW on Ubuntu 22.04</a
						>
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0034.html"
							>BEP 34 DNS Tracker Preferences</a
						>
					</li>
					<li><a href="https://letsencrypt.org/">https://letsencrypt.org/</a></li>
					<li><a href="https://certbot.eff.org/">https://certbot.eff.org/</a></li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/issues/11"
							>UDP Tracker with Nginx proxy</a
						>
					</li>
					<li>
						<a href="https://docs.digitalocean.com/products/images/backups/details/features/"
							>Digital Ocean - Backups Features</a
						>.
					</li>
					<li>
						<a
							href="https://docs.digitalocean.com/developer-center/droplets-and-volumes-backups-with-snapshooter/"
							>Droplets and Volumes Backups with SnapShooter</a
						>
					</li>
					<li><a href="https://www.digitalocean.com/pricing">Digital Ocean pricing</a></li>
				</ul>
				<h2 id="conclusion">Conclusion</h2>
				<p>
					With containerization, having a production ready Index and Tracker with Torrust is very
					easy. Containerization allows you to install the application in many different hosting
					providers with no effort.
				</p>
				<p>
					It also allows you to keep your production environment up to date, because it&#39;s also
					possible to easily update the docker images.
				</p>
				<p>
					And finally, you can also scale up your production environment as long as the demand
					increases. For example, just increasing the droplet size.
				</p>
				<p>We hope you find this guide useful. Let us know what you think about it!</p>
				<ul>
					<li>Do you think the process is to complex?</li>
					<li>Do you think the process could be improved or simplified?</li>
					<li>Is there something missing you want to know about?</li>
				</ul>
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
						Torrust Index: <a href="https://github.com/torrust/torrust-index-backend/issues"
							>https://github.com/torrust/torrust-index-backend/issues</a
						>
					</li>
					<li>
						Torrust Website: <a href="https://github.com/torrust/torrust-index-frontend/issues"
							>https://github.com/torrust/torrust-index-frontend/issues</a
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
