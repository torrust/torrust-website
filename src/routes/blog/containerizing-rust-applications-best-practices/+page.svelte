<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';
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
					BitTorrent, an age-old protocol, is a powerful way to share data over the internet. In our
					journey to building robust BitTorrent projects, we&#39;ve chosen the Rust programming
					language for its memory safety and concurrency features. To streamline the development and
					distribution of our projects, we&#39;ve also employed Docker and Podman.
				</p>
				<p>
					In this post, we&#39;ll dive deep into the best practices we&#39;ve adopted for
					dockerizing our Rust applications.
				</p>
				<p>
					Our <a href="https://docs.docker.com/engine/reference/builder/">Containerfiles</a>,
					<em>commonly called a <code>&quot;Dockerfile&quot;</code></em>, are stored in the roots of
					our two main rust repositories, for reference:
				</p>
				<ul>
					<li>
						Torrust-Tracker <a
							href="https://github.com/torrust/torrust-tracker/blob/develop/Containerfile"
							>Containerfile</a
						>.
					</li>
					<li>
						Torrust-Index <a
							href="https://github.com/torrust/torrust-index/blob/develop/Containerfile"
							>Containerfile</a
						>.
					</li>
				</ul>
				<h3 id="example">Example</h3>
				<p>
					All of the examples included in this blog post are publicly available in our &quot;<a
						href="https://github.com/torrust/containerizing-rust-apps-examples"
						>Containerizing Rust Apps Examples</a
					>&quot; GitHub Repository.
				</p>
				<blockquote>
					<p>
						<strong><em>Please Note:</em></strong> The actual <code>Containerfile</code> for the
						<strong>Tracker</strong>
						and <strong>Index</strong> services builds images for both <code>debug</code> and
						<code>release</code>
						modes. For learning purposes we are using a simplified version here which only builds the
						<code>release</code> mode:
					</p>
				</blockquote>

				<CodeBlock
					lang="dockerfile"
					code={`# Extracted example of our Containerfile.\n
## Base Builder Image
FROM rust:bookworm as chef
WORKDIR /tmp
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN cargo binstall --no-confirm cargo-chef cargo-nextest\n
## Tester Image
FROM rust:slim-bookworm as tester
WORKDIR /tmp
RUN apt-get update; apt-get install -y curl; apt-get autoclean
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN cargo binstall --no-confirm cargo-nextest\n
## Su Exe Compile
FROM docker.io/library/gcc:bookworm as gcc
COPY ./contrib/dev-tools/su-exec/ /usr/local/src/su-exec/
RUN cc -Wall -Werror -g /usr/local/src/su-exec/su-exec.c -o /usr/local/bin/su-exec; chmod +x /usr/local/bin/su-exec\n
## Chef Prepare (look at project and see wat we need)
FROM chef AS recipe
WORKDIR /build/src
COPY . /build/src
RUN cargo chef prepare --recipe-path /build/recipe.json\n
## Cook (release)
FROM chef AS dependencies
WORKDIR /build/src
COPY --from=recipe /build/recipe.json /build/recipe.json
RUN cargo chef cook --tests --benches --examples --workspace --all-targets --all-features --recipe-path /build/recipe.json --release
RUN cargo nextest archive --tests --benches --examples --workspace --all-targets --all-features --archive-file /build/temp.tar.zst --release  ; rm -f /build/temp.tar.zst\n
## Build Archive (release)
FROM dependencies AS build
WORKDIR /build/src
COPY . /build/src
RUN cargo nextest archive --tests --benches --examples --workspace --all-targets --all-features --archive-file /build/full-example.tar.zst --release\n
# Extract and Test (release)
FROM tester as test
WORKDIR /test
COPY . /test/src
COPY --from=build \
  /build/full-example.tar.zst \
  /test/full-example.tar.zst
RUN cargo nextest run --workspace-remap /test/src/ --extract-to /test/src/ --no-run --archive-file /test/full-example.tar.zst
RUN cargo nextest run --workspace-remap /test/src/ --target-dir-remap /test/src/target/ --cargo-metadata /test/src/target/nextest/cargo-metadata.json --binaries-metadata /test/src/target/nextest/binaries-metadata.json\n
RUN mkdir -p /app/bin/; cp -l /test/src/target/release/full-example /app/bin/full-example
RUN chown -R root:root /app; chmod -R u=rw,go=r,a+X /app; chmod -R a+x /app/bin\n
## Runtime
FROM gcr.io/distroless/cc-debian12:debug as runtime
RUN ["/busybox/cp", "-sp", "/busybox/sh","/busybox/cat","/busybox/ls","/busybox/env", "/bin/"]
COPY --from=gcc --chmod=0555 /usr/local/bin/su-exec /bin/su-exec
ARG USER_ID=1000
COPY --chmod=0555 ./share/container/entry_script_sh /usr/local/bin/entry.sh
ENTRYPOINT ["/usr/local/bin/entry.sh"]\n
## Release Runtime
FROM runtime as release
COPY --from=test /app/ /usr/
CMD ["/usr/bin/full-example"]`}
				/>

				<p>
					The real version in production contains some duplicate stages to build the <code
						>debug</code
					> mode. Those stages are almost identical to the ones in this example and are therefore omitted.
					Only some flags and names change.
				</p>
				<p>
					Don&#39;t be scared of the example, next we will go through all the lines and explain what
					they do, but before doing that, we will explain some basic concepts and the patterns
					applied one by one.
				</p>
				<h2 id="requirements">Requirements</h2>
				<p>In order to run some of the examples in this article you will need to install:</p>
				<ul>
					<li>
						<a href="https://docs.docker.com/get-docker/">Docker version 24.0.6, build ed223bc</a>
					</li>
				</ul>
				<h2 id="we-use-docker-oci-containers">We Use Docker (OCI) Containers</h2>
				<p>
					The standardized <a href="https://opencontainers.org/">Open Container Initiative (OCI)</a>
					allows Torrust the possibility of reliable and cross-platform distribution and deployment of
					our Software.
				</p>
				<p>
					This allows for administrators who may be interested in our software to quickly and easily
					test-out our software and see if it suits their needs. It also allows administrators to
					more easily deploy our software, as most of the web-hosting systems have great support for
					OCI Containers.
				</p>
				<p>
					In addition, our End-to-End testing infrastructure is made easier by using a <a
						href="https://docs.docker.com/compose/">docker-compose</a
					> configuration, that is taking advantage of our docker containers.
				</p>
				<h2 id="basic-dockerized-rust-application">Basic Dockerized Rust Application</h2>
				<p>The simplest Dockerfile for a Rust application is as follows:</p>

				<CodeBlock
					lang="dockerfile"
					code={`# We start from full base defacto Debian image
FROM rust:latest
WORKDIR /app
RUN cargo init
RUN cargo build --release
CMD ["./target/release/app"]`}
				/>

				<p>And you can build the image and run it with:</p>

				<CodeBlock
					lang="console"
					code={`docker build -t docker-rust-app-basic .
docker run --rm -it docker-rust-app-basic\n
Hello, world!`}
				/>

				<p>That creates a docker image which is <strong>1.39 GB</strong>!.</p>

				<CodeBlock
					lang="console"
					code={`$ docker image ls | grep docker-rust-app-basic
docker-rust-app-basic                            latest          7294f20bb52c   2 minutes ago   1.39GB`}
				/>

				<p>
					We are going to see how to improve that and other things like common patters, good
					practices and other considerations.
				</p>
				<h2 id="use-multi-stage-builds-to-minimize-the-image-size">
					Use Multi-Stage Builds to Minimize the Image Size
				</h2>
				<p>A common pattern to build smaller docker images is to use multi-stage Dockerfiles.</p>
				<p>
					You can compile your application with all of the Rust tooling and then use the final
					binary in a slim operating system. This image does not contain the common packages
					contained in the default tag and only contains the minimal packages needed to run your
					compiled Rust application.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`# This is the first stage. This image is used to compile the Rust application.
FROM rust:bookworm as builder
WORKDIR /app
RUN cargo init
# Install the package in the current directory
RUN cargo install --path .
CMD ["./target/release/app"]\n
# This is the production stage.
# The slim image does not contain the common packages contained in the default tag and only contains the minimal packages needed to run rust.
FROM debian:bookworm-slim
COPY --from=builder /usr/local/cargo/bin/app /usr/local/bin/app
CMD ["app"]`}
				/>

				<p>The example is very easy and you can build and run the image with:</p>

				<CodeBlock
					lang="console"
					code={`docker build -t docker-rust-app-multi-stage .
docker run --rm -it docker-rust-app-multi-stage
Hello, world!
$ docker image ls | grep docker-rust-app-multi-stage
docker-rust-app-multi-stage                             latest          bc3ae797b55e   11 seconds ago   84.7MB`}
				/>

				<p>As you can see this new image is only 84.7MB. That&#39;s a huge improvement!</p>
				<h2 id="image-variants">Image Variants</h2>
				<p>
					As you can see in our <code>Containerfile</code>, the images we are using are the
					following:
				</p>
				<h3 id="rust-bookworm">rust:bookworm</h3>
				<pre><code class="lang-Dockerfile"
						><span class="hljs-selector-tag">FROM</span> <span class="hljs-selector-tag">rust</span
						><span class="hljs-selector-pseudo">:bookworm</span>
</code></pre>
				<p>
					At the time of writing this article the latest release is <a
						href="https://www.debian.org/releases/bookworm/">Debian 12.2</a
					>. It is also (currently) known as stable or by its codename &quot;Bookworm&quot;. You
					will see that we use that one because it is the latest one.
				</p>
				<h3 id="rust-slim-bookworm">rust:slim-bookworm</h3>
				<pre><code class="lang-Dockerfile"
						><span class="hljs-selector-tag">FROM</span> <span class="hljs-selector-tag">rust</span
						><span class="hljs-selector-pseudo">:slim-bookworm</span>
</code></pre>
				<p>
					Images with the <code>slim</code> suffix do not contain the common packages contained in the
					default tag and only contain the minimal packages needed to run rust. We are using it for the
					&quot;tester&quot; stage.
				</p>
				<h3 id="gcc-bookworm">gcc:bookworm</h3>
				<pre><code class="lang-Dockerfile"
						><span class="hljs-keyword">FROM</span> docker.io<span class="hljs-regexp"
							>/library/g</span
						>cc:bookworm
</code></pre>
				<p>
					The GCC image is used to compile an small C program which is a simple tool that just
					executes a program with different privileges. When we start the container we run it with a
					USER ID passed by an environment variable and not with <code>root</code> privileges.
				</p>
				<h3 id="cc-debian12-debug">cc-debian12:debug</h3>
				<pre><code class="lang-Dockerfile"
						>FROM gcr.<span class="hljs-built_in">io</span>/gcr.<span class="hljs-built_in">io</span
						>/distroless/cc-debian12:<span class="hljs-built_in">debug</span>
</code></pre>
				<p>
					And finally a &quot;Distroless&quot; container image is used for runtime. <a
						href="https://github.com/GoogleContainerTools/distroless#why-should-i-use-distroless-images"
						>Why should you use distroless images?</a
					>.
				</p>
				<ul>
					<li>They are small.</li>
					<li>They only have what you need to run your app.</li>
					<li>They reduce the risk of vulnerabilities.</li>
				</ul>

				<Callout type="info">
					We use the `:debug` variant of the distroless cc, as it includes the busybox binary,
					giving us a shell that is needed to run the entry-script. We will explain this later.
				</Callout>

				<h2 id="introduction-to-docker-layers-cache">Introduction To Docker Layers Cache</h2>
				<p>
					Caching is a pivotal aspect of optimizing Docker builds, especially with Rust projects.
					Proper caching ensures faster builds, as unchanged dependencies don&#39;t have to be
					recompiled. By leveraging Docker&#39;s layer caching mechanism, we can effectively cache
					Rust dependencies and speed up our Docker builds.
				</p>
				<p>
					Docker uses a layered filesystem to store images. Each layer is a set of changes to the
					filesystem. When you create a new container, you add a new writable layer on top of the
					underlying layers. This layer is often called the &quot;container layer&quot;. All changes
					made to the running container, such as writing new files, modifying existing files, and
					deleting files, are written to this thin writable container layer.
				</p>
				<h2 id="caching-cargo-dependencies">Caching cargo dependencies</h2>
				<p>
					A common pattern used in all languages is to separate the dependencies installation from
					the application build. This is done to take advantage of the Docker layer caching
					mechanism. The dependencies installation is done in a separate layer, and the application
					build is done in a separate layer. This way, if the application code changes, the
					dependencies installation layer is not rebuilt, and only the application build layer is
					rebuilt.
				</p>
				<p>
					This improves build times because dependencies installation is usually a time-consuming
					process and it is something you normally do not change often. The application build, on
					the other hand, is something you change often, and it is usually a quick process.
				</p>
				<p>
					Docker build is executed in the order that you define instructions so you put things that
					change less frequently at the beginning of the Dockerfile and things that change more
					frequently at the end of the Dockerfile.
				</p>
				<p>There are two levels of dependencies:</p>
				<ul>
					<li>
						System dependencies. For instance <code>SQLite</code>, <code>curl</code> and other libraries
						your application depends on.
					</li>
					<li>
						Rust dependencies. These are the Rust packages that you want to install using cargo.
						Rust packages are called <code>crates</code> and you can find them on
						<a href="https://crates.io/">https://crates.io/</a>
					</li>
				</ul>
				<h3 id="demonstration-of-caching-cargo-dependencies-using-a-custom-solution">
					Demonstration of Caching Cargo Dependencies Using a Custom Solution
				</h3>
				<p>
					First we demonstrate how cargo dependencies caching works but showing a custom solution:
				</p>
				<p>
					We first create an <strong>empty application configuration</strong> which uses the same dependencies.
					We build the application, downloading and building all the dependencies and creating a docker
					cache layer.
				</p>
				<p>
					Then we build the application. With these layers yo do not need to re-build the
					dependencies when you change the application code.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`FROM rust:latest as builder\n
WORKDIR /app\n
# Copy over the manifest files
COPY Cargo.toml Cargo.lock /app/\n
# Create a dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() { println!(\"if you see this, the build broke\"); }" > src/main.rs\n
# This build step will cache the dependencies as they're not changed
RUN cargo build --release\n
# Now, remove the dummy main.rs and copy your source code
COPY . /app\n
# You'll need to update the last modified of the main.rs file to inform cargo to rebuild it
RUN touch -a -m ./src/main.rs\n
# Build the application for release. Since dependencies are cached, this will only build your code
RUN cargo build --release\n
CMD ["./target/release/custom-dependencies-cache"]`}
				/>

				<p>
					Instead of this custom solution, we use and recommend <a
						href="https://github.com/LukeMathWalker/cargo-chef">cargo chef</a
					> which is a cargo-subcommand that specializes in speeding up Rust Docker builds using Docker
					layer caching.
				</p>
				<h3 id="caching-cargo-dependencies-with-cargo-chef">
					Caching Cargo Dependencies With Cargo Chef
				</h3>
				<p>
					In this example, we show how to use <a href="https://github.com/LukeMathWalker/cargo-chef"
						>cargo chef</a
					>, that we prefer to use.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`FROM rust:latest as chef\n
WORKDIR /app\n
# Install cargo-chef
RUN cargo install cargo-chef --locked\n
# Examines your project and builds a recipe that captures the set of information required to build your dependencies
FROM chef AS planner\n
COPY . .\n
RUN cargo chef prepare --recipe-path recipe.json\n
FROM chef AS builder\n
COPY --from=planner /app/recipe.json recipe.json\n
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json\n
COPY . .\n
# Build the application for release. Since dependencies are cached, this will only build your code
RUN cargo build --release\n
CMD ["./target/release/dependencies-cache-with-cargo-chef"]`}
				/>

				<p>
					While it does more or less the same as the custom solution. It caches dependencies in a
					separate layer and has some other <a
						href="https://github.com/LukeMathWalker/cargo-chef#benefits-of-cargo-chef">benefits</a
					>.
				</p>
				<h2 id="installing-rust-binaries-with-cargo-binstall">
					Installing Rust Binaries With Cargo Binstall
				</h2>
				<p>
					<code>cargo binstall</code> is a cargo subcommand that allows installing Rust binaries as an
					alternative to building from source (via cargo install) or manually downloading packages.
				</p>
				<p>
					Cargo Binstall repo: <a href="https://github.com/cargo-bins/cargo-binstall"
						>https://github.com/cargo-bins/cargo-binstall</a
					>.
				</p>
				<p>
					We are using it to install <code>cargo chef</code> and <code>cargo nextest</code> packages
					easily.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`FROM rust:latest
WORKDIR /app
# Install \`cargo binstall\`
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
# Install Rust binaries with \`cargo binstall\`
RUN cargo binstall --no-confirm cargo-chef cargo-nextest
RUN cargo chef --version && cargo nextest --version
RUN cargo init
RUN cargo build --release
CMD ["./target/release/app"]`}
				/>

				<h2 id="archiving-and-reusing-builds-with-cargo-nextest">
					Archiving And Reusing Builds With Cargo Nextest
				</h2>
				<p><a href="https://nexte.st/">cargo-nextest</a> is a Rust test runner.</p>
				<p>
					It has a subcommand <code>cargo nextest archive</code> that can archive builds artifacts. This
					is useful to separate the &quot;build&quot; phase from the &quot;run&quot; phase.
				</p>
				<p>
					In the <a href="https://nexte.st/book/reusing-builds.html">official documentation</a> they
					describe some use cases like:
				</p>
				<ul>
					<li>
						<strong>Cross-compilation</strong>. The build machine has a different architecture, or
						runs a different operating system, from the target machine.
					</li>
					<li>
						<strong>Test partitioning</strong>. Build once on the build machine, then partition test
						execution across multiple target machines.
					</li>
					<li>
						<strong>Saving execution time</strong> on more valuable machines. For example, build tests
						on a regular machine, then run them on a machine with a GPU attached to it.
					</li>
				</ul>
				<p>We are using it for two reasons:</p>
				<ul>
					<li>
						<strong>Test partitioning</strong>. We build the application in a docker stage and then
						run the tests in another stage. This way we can separate the build and test phases.
					</li>
					<li>
						<strong>Passing the binary to the next stage</strong>. After building the application we
						archive the build artifacts and then we extract them in the next stage to run the tests.
						Finally we copy the binary to the final &quot;runtime&quot; stage.
					</li>
				</ul>

				<CodeBlock
					lang="dockerfile"
					code={`## First stage to install the nextest tool
FROM rust:latest as nextest
RUN cargo install cargo-nextest --locked\n
## Second stage to build the application and package it with nextest
FROM nextest AS builder
WORKDIR /build/src
COPY . /build/src
RUN cargo build
# We archive the build artifacts to reuse them in the next stage
# NOTICE: the application must contains at least one integration test in order
# include the binary in the archive.
# See: https://github.com/nextest-rs/nextest/issues/423
RUN cargo nextest archive --tests --benches --examples --workspace --all-targets --all-features --archive-file /build/archiving-and-reusing-builds.tar.zst
CMD ["/build/src/target/debug/archiving-and-reusing-builds"]\n
## Third stage to test the application
FROM nextest AS tester
WORKDIR /test
COPY . /test/src/
COPY --from=builder \
    /build/archiving-and-reusing-builds.tar.zst \
    /test/archiving-and-reusing-builds.tar.zst
# We extract the build artifacts from the archive
RUN cargo nextest run --workspace-remap /test/src/ --extract-to /test/src/ --no-run --archive-file /test/archiving-and-reusing-builds.tar.zst
# We run the tests. We override the default target-dir to use the application binary,
# otherwise it would be created in a temporary directory and we wouldn't be able to
# copy it in the next stage.
RUN cargo nextest run --workspace-remap /test/src/ --target-dir-remap /test/src/target/ --cargo-metadata /test/src/target/nextest/cargo-metadata.json --binaries-metadata /test/src/target/nextest/binaries-metadata.json
RUN mkdir -p /app/bin/; cp -l /test/src/target/debug/archiving-and-reusing-builds /app/bin/archiving-and-reusing-builds
CMD ["/app/bin/archiving-and-reusing-builds"]\n
## Fourth stage to run the application in production
FROM nextest AS runtime
WORKDIR /app
# We take the application binary from the tester stage to ensure the binary we
# use has passed the tests.
COPY --from=tester /app/bin/archiving-and-reusing-builds /app/
CMD ["/app/archiving-and-reusing-builds"]`}
				/>

				<Callout type="info">
					<strong>NOTICE</strong>: The application must contain at least one integration test in
					order include the binary in the archive. See this
					<a href="https://github.com/nextest-rs/nextest/issues/423">issue</a> for more info.
				</Callout>

				<h2 id="running-container-without-sudo">Running Container Without Sudo</h2>
				<p>
					By default docker is installed and runs containers as <code>root</code>. If you build this
					image:
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`FROM rust:latest
WORKDIR /app
RUN cargo init
RUN cargo build --release
CMD ["./target/release/app"]`}
				/>

				<p>And you run it with the following command:</p>

				<CodeBlock
					lang="console"
					code={`docker build -t docker-rust-app-running-with-root .
docker run --rm -it docker-rust-app-running-with-root whoami`}
				/>

				<p>You will see it is executed as <code>root</code>.</p>
				<p>You should not execute containers as <code>root</code> because of:</p>
				<ol>
					<li>
						<p>
							<strong>The Principle of Least Privilege</strong>: This is a security concept that
							encourages the minimal user permission level necessary to perform a task. Running
							containers as root goes against this principle because if a process inside the
							container can run with root privileges, it can execute any command inside the
							container, which could be dangerous if the container gets compromised.
						</p>
					</li>
					<li>
						<p>
							<strong>Host System Vulnerability</strong>: Containers are designed to be isolated
							from the host system. However, there are ways that a container could potentially
							interact with the host, particularly if there are misconfigurations or vulnerabilities
							in the container runtime or the host&#39;s kernel. A container running as root might
							be able to exploit such vulnerabilities to gain control over the host system.
						</p>
					</li>
					<li>
						<p>
							<strong>Immutable Infrastructure</strong>: Containers are often used as part of an
							immutable infrastructure, where container images are pre-built and should not change.
							Running as root makes it easier to make changes to the running container, which can
							lead to &quot;configuration drift&quot; and unexpected behavior.
						</p>
					</li>
					<li>
						<p>
							<strong>Accidental Damage</strong>: Even if an attacker does not compromise the
							container, running as root increases the risk of accidental damage by the
							container&#39;s own applications or administrators. For example, a poorly crafted
							command could delete critical files or disrupt important processes.
						</p>
					</li>
				</ol>
				<p>
					There are some ways to avoid running the container as <code>root</code>. We will see all
					of them.
				</p>
				<h3 id="use-the-user-instruction">Use the <code>USER</code> instruction</h3>

				<CodeBlock
					lang="dockerfile"
					code={`FROM rust:latest\n
WORKDIR /app\n
RUN cargo init
RUN cargo build --release\n
USER www-data\n
CMD ["./target/release/app"]`}
				/>

				<p>
					You can add the <code>USER</code> instruction before the last command. In that example we
					know that the base image already contains the user <code>www-data</code>.
				</p>

				<CodeBlock
					lang="console"
					code={`docker run --rm -it docker-rust-app-running-with-root cat /etc/passwd | grep www-data
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`}
				/>

				<p>But you can also create a specific user for your application:</p>

				<CodeBlock
					lang="dockerfile"
					code={`FROM rust:latest\n
WORKDIR /app\n
RUN cargo init
RUN cargo build --release\n
RUN groupadd -r appuser
RUN useradd -r -u 1001 -g appuser appuser\n
USER appuser\n
CMD ["./target/release/app"]`}
				/>

				<p>
					Using the <code>USER</code> instruction is considered a good practice because by default
					the container will not run as root. In that example, docker will run the container as the
					user with the ID <code>1001</code>.
				</p>

				<Callout type="info">
					The Linux Standard Base Core Specification defines three different ranges for user IDs,
					the value from 0 to 99, 100 to 999, and 1000 and above. The first two ranges are reserved
					for system users. All the regular users start from 1000. It's also important to note that
					the user ID 0 is reserved for the root user and Linux kernel uses the user id and group id
					to handle the permissions. The host machine and the docker container might have the same
					user ID but different usernames.
				</Callout>

				<p>
					If you run that container, <code>appuser</code> will have the same permissions as the user
					<code>1001</code> in the host system, whatever it is the name of that user in the host machine.
				</p>
				<h3 id="use-the-docker-run-user-argument">
					Use The <code>docker run --user</code> Argument
				</h3>
				<p>
					You can also overwrite the user running the container with the argument <code>--user</code
					>:
				</p>

				<CodeBlock
					lang="console"
					code={`docker run --user www-data --rm -it docker-rust-app-running-with-root whoami
www-data`}
				/>

				<p>
					In this example, even though the image is executed as root by default, it will be executed
					as the <code>www-data</code> user.
				</p>
				<p>Notice you can even use a non-existing user in both the host and the docker image.</p>

				<CodeBlock
					lang="console"
					code={`
$ docker run --user 1001 --rm -it docker-rust-app-running-with-root bash
I have no name!@895b0f6a3dbb:/app$`}
				/>

				<p>
					All these solutions work but they all have a drawback: you need to know the user ID at
					build time (when you build the docker image). You usually want to run the container in
					different environments and sometimes you want to use a different user ID for each
					environment. For example:
				</p>
				<ul>
					<li>
						<strong>For development</strong>: If you are using Ubuntu, your user ID is probably
						<code>1000</code>. When you run the container locally you want to run it using that ID,
						so that you don&#39;t have any problems with permissions.
					</li>
					<li>
						<strong>For CI</strong>: The servers you are using for continuous integration (for
						instance, GitHub runners) might use an specif user. You could use some cache folders and
						maybe you need to use the same user ID as the CI server.
					</li>
					<li>
						<strong>For production</strong>: You could create a specific user for your application
						and use that user ID.
					</li>
				</ul>
				<p>
					With the proposed solutions you would need to rebuild the docker image so that the user ID
					inside the container is the same as the host user ID.
				</p>
				<h3 id="create-the-user-at-runtime">Create The User At Runtime</h3>
				<p>
					There is al alternative to the previous solutions that makes it possible to <strong
						>run the container with different user IDs without rebuilding the image</strong
					>.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Compile su-exec
FROM docker.io/library/gcc:bookworm as gcc
COPY ./contrib/dev-tools/su-exec/ /usr/local/src/su-exec/
RUN cc -Wall -Werror -g /usr/local/src/su-exec/su-exec.c -o /usr/local/bin/su-exec; chmod +x /usr/local/bin/su-exec\n
## Application
FROM rust:bookworm as builder
WORKDIR /app
RUN cargo init
RUN cargo build --release
CMD ["./target/release/app"]\n
## Runtime
FROM gcr.io/distroless/cc-debian12:debug as runtime
RUN ["/busybox/cp", "-sp", "/busybox/sh","/busybox/cat","/busybox/ls","/busybox/env", "/bin/"]\n
COPY --from=builder /app/target/release/app /usr/local/bin/app
COPY --from=gcc --chmod=0555 /usr/local/bin/su-exec /bin/su-exec
COPY --chmod=0555 ./share/container/entry_script_sh /usr/local/bin/entry.sh\n
ENTRYPOINT ["/usr/local/bin/entry.sh"]
CMD ["/usr/local/bin/app"]`}
				/>

				<p>
					This is the approach we use in Torrust. You run the docker as <code>root</code> but we always
					use an entrypoint. That entrypoint creates a new user with an ID provided as an environment
					variable.
				</p>
				<p>
					The <code>entry.sh</code> script is always called when you run the container because it is
					defined as an <code>ENTRYPOINT</code>. This &quot;middleware&quot; script creates the user
					if it does not exist, and then runs the application using the
					<a href="https://github.com/ncopa/su-exec">su-exec</a> program to change the user ID it is
					executed with.
				</p>
				<p>
					<strong
						>For those who are interested here is our: <a
							href="https://github.com/torrust/torrust-tracker/blob/develop/share/container/entry_script_sh"
							>entry script</a
						>.</strong
					>
				</p>
				<p>As you can read on the su-exec documentation:</p>

				<Callout type="info">
					"su-exec" is a simple tool that will simply execute a program with different privileges.
					The program will be executed directly and not run as a child, like su and sudo does, which
					avoids TTY and signal issues (see below). Notice that su-exec depends on being run by the
					root user, non-root users do not have permission to change uid/gid.
				</Callout>

				<p>
					The advantage of this approach is that you don&#39;t have to worry about the user ID when
					you build the docker image. You can run the container as root and then use the entrypoint
					to create the user and run the application with that user.
				</p>
				<p>
					The entrypoint also ensures that the application is executed with the correct permissions.
					You cannot run the application as root unless you explicitly set the environment variable <code
						>USER_ID</code
					>
					to <code>0</code>.
				</p>
				<p>
					If you want to contribute to Torrust we think that we could simplify the Containerfile if
					the &quot;su-exec&quot; command were available in Rust. Because we could reuse one of the
					Rust docker images we are using for other docker stages.
				</p>
				<h2 id="decomposing-the-torrust-tracker-containerfile">
					Decomposing the Torrust Tracker Containerfile
				</h2>
				<p>
					Finally we can explain line by line what the <a
						href="https://github.com/torrust/torrust-tracker/blob/develop/Containerfile"
						>Torrust Tracker Containerfile</a
					> does.
				</p>
				<p>
					Rust apps can be built in <code>debug</code> or <code>release</code> mode. The
					<code>Containerfile</code>
					builds both modes and then it runs the tests for both modes. We have removed the
					<code>debug</code>
					mode to keep the example short. But it is almost the same code. For the
					<code>release</code>
					mode the flag <code>--release</code> is added to some commands.
				</p>
				<p>We can abstract away the stages:</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Base Builder Image
FROM rust:bookworm as chef
# Install tools needed to build the application: cargo-chef cargo-nextest\n
## Tester Image
FROM rust:slim-bookworm as tester
# Install tools needed to test the application: cargo-nextest\n
## Su Exe Compile
FROM docker.io/library/gcc:bookworm as gcc
# Compile the su-exec program which is used at runtime to change the user running the container.\n
## Chef Prepare (look at project and see wat we need)
FROM chef AS recipe
# Prepare the info needed to build and cache cargo dependencies\n
## Cook (release)
FROM chef AS dependencies
# Re-hydrate the minimum project skeleton identified by \`cargo chef prepare\` and build it to cache dependencies\n
## Build Archive (release)
FROM dependencies AS build
# build and archive the application\n
# Extract and Test (release)
FROM tester as test
# Extract the application from the archived artifacts and run the tests.
# And copy the binary to an specified location so it can be used in the \`release\`
# stage.\n
## Runtime
FROM gcr.io/distroless/cc-debian12:debug as runtime
# Minimal image to run the app in production.
# Includes the entrypoint to setup and run the application with a different user Id.\n
## Release Runtime
FROM runtime as release
# Runtime for release mode. It copies the binary from the \`test\` stage and runs it
# via the entrypoint added in the \`runtime\` stage.`}
				/>

				<p>Let's see each stage individually.</p>

				<p>
					First, we have a base builder image where we install basic tools to build the application.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Base Builder Image
FROM rust:bookworm as chef
WORKDIR /tmp
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN cargo binstall --no-confirm cargo-chef cargo-nextest`}
				/>

				<p>
					There is nothing really strange here. We use the latest Debian “bookworm” at the time of
					writing this article. And we also use <code>binstall</code> to install the binaries, since
					both of these binaries are written in Rust.
				</p>
				<p>
					The next stage is the base Tester Image. It only installs <code>cargo-nextest</code> to
					run the tests. We also use the Debian “bookworm” but the <code>slim</code> variant, since we
					don&#39;t need too much to only run the tests.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Base Tester Image
FROM rust:slim-bookworm as tester
WORKDIR /tmp
RUN apt-get update; apt-get install -y curl; apt-get autoclean
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN cargo binstall --no-confirm cargo-nextest`}
				/>

				<p>
					The following is another stage used just to compile the small program <a
						href="https://github.com/ncopa/su-exec">su-exec</a
					> that we use to change the user ID when we run the container. The program is written in C
					code, so we only need a C compiler.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Su Exe Compile
FROM docker.io/library/gcc:bookworm as gcc
COPY ./contrib/dev-tools/su-exec/ /usr/local/src/su-exec/
RUN cc -Wall -Werror -g /usr/local/src/su-exec/su-exec.c -o /usr/local/bin/su-exec; chmod +x /usr/local/bin/su-exec`}
				/>

				<p>
					From this point, we start building the application. First, we build the dependencies and
					we cache them into an independent stage.
				</p>
				<p>
					The first stage is only to &quot;build the recipe&quot; which is the name that <code
						>cargo chef</code
					> gives to the process of collecting all the information needed to build the application dependencies.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Chef Prepare (look at project and see wat we need)
FROM chef AS recipe
WORKDIR /build/src
COPY . /build/src
RUN cargo chef prepare --recipe-path /build/recipe.json`}
				/>

				<p>
					Then, cargo dependencies are built using using the recipe created in the previous stage. <code
						>cargo nextest</code
					> has a subcommand to generate and archive the artifact of the build. We are using it to package
					and pass the application from one stage to another.
				</p>
				<p>
					Dependencies are archived but they are not used independently. That line just tests that
					the dependencies could be archived.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Cook (release)
FROM chef AS dependencies
WORKDIR /build/src
COPY --from=recipe /build/recipe.json /build/recipe.json
RUN cargo chef cook --tests --benches --examples --workspace --all-targets --all-features --recipe-path /build/recipe.json --release
RUN cargo nextest archive --tests --benches --examples --workspace --all-targets --all-features --archive-file /build/temp.tar.zst --release  ; rm -f /build/temp.tar.zst`}
				/>

				<p>
					In the following stage we build the application. The <code>cargo nextest archive</code> command
					builds and archives the application.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Build Archive (release)
FROM dependencies AS build
WORKDIR /build/src
COPY . /build/src
RUN cargo nextest archive --tests --benches --examples --workspace --all-targets --all-features --archive-file /build/full-example.tar.zst --release`}
				/>

				<p>
					Now, that we have successfully built the application, we can run the tests. We extract the
					application from the archived artifacts and run the tests.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Extract and Test (release)
FROM tester as test
WORKDIR /test
COPY . /test/src
COPY --from=build \
  /build/full-example.tar.zst \
  /test/full-example.tar.zst
# It compiles without running the tests to make sure there are no problems with
# the archive.
RUN cargo nextest run --workspace-remap /test/src/ --extract-to /test/src/ --no-run --archive-file /test/full-example.tar.zst
# We actually run the tests
RUN cargo nextest run --workspace-remap /test/src/ --target-dir-remap /test/src/target/ --cargo-metadata /test/src/target/nextest/cargo-metadata.json --binaries-metadata /test/src/target/nextest/binaries-metadata.json
# We copy the application binary to a specified location so we can get it from
# there in the final runtime stage.
RUN mkdir -p /app/bin/; cp -l /test/src/target/release/full-example /app/bin/full-example
# Since we use su-exec. We need to run the container as root.
RUN chown -R root:root /app; chmod -R u=rw,go=r,a+X /app; chmod -R a+x /app/bin`}
				/>

				<p>
					Once the application has been built and tested we prepare the runtime. We start from a
					minimum &quot;distroless&quot; image variant. We add an entrypoint to setup the
					application and also to make sure we don&#39;t use the <code>root</code> user to run it.
					The entrypoint just runs the application provided as an argument, in our case, our
					application in <code>debug</code> or <code>release</code> mode, depending of which one you
					want to run.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Runtime
FROM gcr.io/"distroless/cc-debian12:debug as runtime
RUN ["/busybox/cp", "-sp", "/busybox/sh","/busybox/cat","/busybox/ls","/busybox/env", "/bin/"]
COPY --from=gcc --chmod=0555 /usr/local/bin/su-exec /bin/su-exec
ARG USER_ID=1000
COPY --chmod=0555 ./share/container/entry_script_sh /usr/local/bin/entry.sh
ENTRYPOINT ["/usr/local/bin/entry.sh"]`}
				/>

				<p>
					Finally, we add the <code>CMD</code> instruction so we can execute the application. The
					entrypoint script only runs the application you pass as the first argument. This stage is
					not merge into the previous because in the final version there are two final runtimes:
					<code>debug</code>
					and <code>release</code>.
				</p>

				<CodeBlock
					lang="dockerfile"
					code={`## Release Runtime
FROM runtime as release
COPY --from=test /app/ /usr/
CMD ["/usr/bin/full-example"]`}
				/>

				<h2 id="other-good-practices">Other Good Practices</h2>
				<ul>
					<li>
						<strong>Minimalism</strong>: We strive to keep our Dockerfiles lean by only including
						essential components.
					</li>
					<li>
						<strong>Explicit versions</strong>: At least with the minor version number, so you do
						not get unexpected broken compatibility but you can apply security and bug patches.
					</li>
					<li>
						<strong>Regular Updates</strong>: Periodically updating the base image and dependencies
						to benefit from security patches and updates.
					</li>
					<li>
						<strong>Health Checks</strong>: Implementing Docker health checks to monitor the state
						and health of our containerized application.
					</li>
				</ul>
				<h2 id="other-considerations">Other Considerations</h2>
				<ul>
					<li>
						Since we are using <code>su-exec</code> we need to run the containers as root. We have
						not checked if this configuration works when you setup docker in
						<a href="https://docs.docker.com/engine/security/rootless/">Rootless mode</a>.
					</li>
					<li>
						Also, although we mostly mention docker in this article, the <code>Containerfile</code>
						works with other tools to manage containers like
						<a href="https://podman.io/">Podman</a>.
					</li>
				</ul>
				<h2 id="links">Links</h2>
				<p>Simple tutorials:</p>
				<ul>
					<li>
						<a href="https://tms-dev-blog.com/lean-docker-image-for-rust-backend/"
							>Docker image for Rust backend: learn how to</a
						>
					</li>
					<li>
						<a href="https://collabnix.com/getting-started-with-rust-and-docker/"
							>Getting Started with Rust and Docker</a
						>
						by <a href="https://collabnix.com/author/ajeetraina/">Ajeet Raina</a>.
					</li>
					<li>
						<a href="https://tutorialedge.net/rust/rust-docker-tutorial/">Rust Docker Tutorial</a>.
					</li>
					<li>
						<a href="https://docs.docker.com/language/rust/build-images/">Build your Rust image</a>
					</li>
				</ul>
				<p>Comprehensive articles like this:</p>
				<ul>
					<li>
						<a href="https://dev.to/rogertorres/first-steps-with-docker-rust-30oi"
							>First steps with Docker + Rust</a
						>
						by <a href="https://dev.to/rogertorres">Roger Torres</a>.
					</li>
				</ul>
				<p>Demos:</p>
				<ul>
					<li>
						<a href="https://github.com/hseeberger/hello-rs"
							>Simple dockerized Rust/Axum based HTTP server for demo purposes</a
						>
						by <a href="https://github.com/hseeberger"> Heiko Seeberger</a>.
					</li>
				</ul>
				<p>Development using Docker:</p>
				<ul>
					<li>
						<a href="https://www.youtube.com/watch?v=kh1GMRFkzT4&amp;t=2s"
							>Rust Development with Docker</a
						>.
					</li>
					<li>
						<a href="https://docs.docker.com/language/rust/develop/"
							>Develop your Rust application</a
						>
					</li>
				</ul>
				<p>Deployments using docker:</p>
				<ul>
					<li>
						<a
							href="https://medium.com/@anirudhmurali/how-i-deployed-a-rust-web-app-using-the-rocket-framework-with-docker-424da99b1d8a"
							>How I deployed a Rust web-app using the Rocket framework with Docker</a
						>
					</li>
					<li>
						<a href="https://www.koyeb.com/tutorials/deploy-a-rust-web-app-with-rocket"
							>Deploy a Rust Web App With Rocket</a
						>.
					</li>
				</ul>
				<p>Minimum sized container images:</p>
				<ul>
					<li>
						<a href="https://github.com/johnthagen/min-sized-rust#containers">min-sized-rust</a> by
						<a href="https://github.com/johnthagen">johnthagen</a>.
					</li>
				</ul>
				<p>Caching dependencies:</p>
				<ul>
					<li>
						<a href="https://blog.logrocket.com/packaging-a-rust-web-service-using-docker/"
							>Packaging a Rust web service using Docker</a
						>.
					</li>
					<li>
						<a
							href="https://dev.to/mgattozzi/plumbing-the-deps-of-the-crate-caching-rust-docker-builds-2e48"
							>Plumbing the Deps of the Crate: Caching Rust Docker Builds</a
						>.
					</li>
					<li>
						<a
							href="https://stackoverflow.com/questions/58473606/cache-rust-dependencies-with-docker-build"
							>Cache Rust dependencies with Docker build</a
						>.
					</li>
				</ul>
				<p>Don&#39;t run containers as root:</p>
				<ul>
					<li>
						<a
							href="https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user"
							>Manage Docker as a non-root user</a
						>.
					</li>
					<li>
						<a href="https://docs.docker.com/engine/security/rootless/"
							>Run the Docker daemon as a non-root user (Rootless mode)</a
						>.
					</li>
					<li>
						<a href="https://docs.docker.com/engine/security/#docker-daemon-attack-surface"
							>Docker daemon attack surface</a
						>.
					</li>
					<li>
						<a
							href="https://www.howtogeek.com/devops/why-processes-in-docker-containers-shouldnt-run-as-root/"
							>Why Processes In Docker Containers Shouldn&#39;t Run as Root</a
						>.
					</li>
					<li>
						<a href="https://www.clickittech.com/devops/docker-security-best-practices/"
							>The Ultimate Docker Security Best Practices for Your Node.js Application</a
						>.
					</li>
					<li>
						<a
							href="https://stackoverflow.com/questions/68155641/should-i-run-things-inside-a-docker-container-as-non-root-for-safety"
							>Should I run things inside a docker container as non root for safety?</a
						>.
					</li>
					<li>
						<a
							href="https://betterprogramming.pub/running-a-container-with-a-non-root-user-e35830d1f42a"
							>Docker Tips: Running a Container With a Non Root User</a
						>
						by <a href="https://lucjuggery.medium.com/">Luc Juggery</a>.
					</li>
					<li>
						<a
							href="https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md"
							>Basic Setup and Use of Podman in a Rootless environment</a
						>.
					</li>
					<li>
						<a
							href="https://medium.com/@mccode/understanding-how-uid-and-gid-work-in-docker-containers-c37a01d01cf"
							>Understanding how uid and gid work in Docker containers</a
						>.
					</li>
				</ul>
				<h2 id="conclusion">Conclusion</h2>
				<p>We hope you find this guide useful. Let us know what you think about it!</p>
				<p>
					We want this article to be a collective effort to document good practices about Rust and
					Containers, so we would like to have reviews, comments, new sections, etcetera.
				</p>
				<p>If you see something wrong or you want to contribute by:</p>
				<ul>
					<li>Adding new sections.</li>
					<li>Fixing typos.</li>
					<li>Making it clearer.</li>
					<li>Adding links.</li>
					<li>Or whatever you think it could be interesting to have,</li>
				</ul>
				<p>
					please open an <a href="https://github.com/torrust/torrust-website/issues">issue</a> or a
					<a href="https://github.com/torrust/torrust-website/pulls">PR</a>.
				</p>
				<p>
					If you have any questions or issues please open an issue on the corresponding repository:
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
