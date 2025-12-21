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
				<p>Hello, Torrust community!</p>

				<p>
					We're excited to share some news about a new tool we've been developing: the <a
						href="https://github.com/torrust/torrust-tracker-deployer"
						><strong>Torrust Tracker Deployer</strong></a
					>. While it's not quite finished yet (we're close!), we wanted to give you an early
					preview of what we're building and why.
				</p>

				<Callout type="warning">
					<strong>Work in Progress</strong>: This project is nearing completion but not yet ready
					for production use. Repository:
					<a href="https://github.com/torrust/torrust-tracker-deployer"
						>github.com/torrust/torrust-tracker-deployer</a
					>
				</Callout>

				<h2 id="the-challenge">The Challenge</h2>

				<p>
					A while back, we published a comprehensive tutorial on <a
						href="/blog/deploying-torrust-to-production">deploying Torrust to production</a
					>. The tutorial covered all the necessary steps to get the Torrust Tracker running on a
					virtual machine with proper security, SSL certificates, and production-ready
					configurations.
				</p>

				<p>
					While the tutorial is thorough and the process isn't particularly complex, it does involve
					many manual steps. You need to configure Docker, set up Nginx, obtain SSL certificates
					from Let's Encrypt, configure the tracker itself, and ensure everything is properly
					networked. It's the kind of task that becomes tedious when you need to do it multiple
					times or want to quickly spin up a new instance for testing.
				</p>

				<h2 id="our-solution">Our Solution: The Torrust Tracker Deployer</h2>

				<p>
					The <a href="https://github.com/torrust/torrust-tracker-deployer"
						>Torrust Tracker Deployer</a
					> is our answer to this problem. The goal is simple: make deploying the Torrust Tracker as easy
					as running a single command.
				</p>

				<p>
					Instead of following a lengthy manual process, you'll be able to deploy a fully
					configured, production-ready Torrust Tracker to your virtual machine with minimal
					interaction. The tool handles all the heavy lifting—from system dependencies to SSL
					certificates to tracker configuration.
				</p>

				<h2 id="design-philosophy">Design Philosophy</h2>

				<p>
					When we started this project, we made a conscious decision about scope and focus. Rather
					than creating an incredibly flexible deployment tool that can handle every possible
					configuration and deployment scenario, we opted for simplicity.
				</p>

				<p>
					The deployer comes with a pre-configured setup that we believe covers 99% of use cases.
					This means:
				</p>

				<ul>
					<li>Sensible default configurations that work out of the box</li>
					<li>Minimal user input required during deployment</li>
					<li>Focus on getting a working tracker deployed quickly</li>
					<li>Optimized for the most common deployment scenario: a single virtual machine</li>
				</ul>

				<p>
					If you need a highly customized deployment or want to configure every aspect of your
					setup, the manual deployment tutorial is still available. But for those who want to get
					started quickly with a solid, production-ready configuration, the deployer is the way to
					go.
				</p>

				<h2 id="who-should-use">Who Should Use the Deployer?</h2>

				<p>
					The deployer is designed for a specific use case and audience. Here's how to decide if
					it's right for you:
				</p>

				<h3 id="ideal-for">Ideal For</h3>

				<ul>
					<li>
						<strong>Docker-based deployments</strong>: The deployer uses Docker for all services,
						making updates and version management straightforward
					</li>
					<li>
						<strong>VM deployments</strong>: You want to run your tracker on a virtual machine
						(cloud or local)
					</li>
					<li>
						<strong>Integrated monitoring</strong>: You want Prometheus and Grafana set up alongside
						your tracker
					</li>
					<li>
						<strong>Quick setup</strong>: You have average infrastructure knowledge and want to
						speed up the initial installation process
					</li>
					<li>
						<strong>Standard configurations</strong>: You're comfortable with sensible defaults and
						don't need extensive customization upfront
					</li>
					<li>
						<strong>Learning and documentation</strong>: You want to understand tracker
						infrastructure requirements and see how to integrate with third-party tools
					</li>
				</ul>

				<h3 id="not-recommended-for">Not Recommended For</h3>

				<ul>
					<li>
						<strong>Bare-metal performance optimization</strong>: If you're deploying on bare metal
						and need to tune every aspect for maximum performance, the Docker overhead (though
						minimal) might not be acceptable
					</li>
					<li>
						<strong>Non-Docker deployments</strong>: If you don't want to use Docker, this tool
						isn't for you
					</li>
					<li>
						<strong>Complete beginners</strong>: The deployer requires average infrastructure
						knowledge—it's not designed for users with no experience managing servers
					</li>
					<li>
						<strong>Highly specialized setups</strong>: If you need very specific, non-standard
						infrastructure configurations, the manual approach gives you more control
					</li>
				</ul>

				<h3 id="bonus-value">Bonus Value: Living Documentation</h3>

				<p>
					Beyond deployment, the tool serves another purpose: <strong
						>living, working documentation</strong
					> of the tracker's infrastructure requirements. By examining the deployer's configuration and
					generated files, you can:
				</p>

				<ul>
					<li>Understand what the tracker needs to run properly</li>
					<li>See how to integrate with Prometheus, Grafana, and MySQL</li>
					<li>Learn Docker Compose configurations that work</li>
					<li>Use it as a starting point, then customize to your specific needs</li>
				</ul>

				<p>Think of it as a reference implementation that you can learn from and adapt.</p>

				<Callout type="info">
					<strong>Docker Choice</strong>: We chose Docker because it makes updating the tracker and
					its dependencies much easier. Yes, there's a small performance overhead, but the
					operational simplicity and update safety are worth the trade-off for most deployments.
				</Callout>

				<h2 id="scope-and-limitations">
					Scope and Limitations: A Deployment Tool, Not a Management Platform
				</h2>

				<p>
					It's important to understand what this tool is—and what it isn't. The Torrust Tracker
					Deployer is a
					<strong>single-use deployment tool</strong>, not an ongoing infrastructure management
					platform.
				</p>

				<h3 id="what-it-does">What It Does</h3>

				<p>
					The deployer's job is to get your Torrust Tracker up and running quickly and correctly. It
					handles:
				</p>

				<ul>
					<li>Initial infrastructure provisioning</li>
					<li>Service installation and configuration</li>
					<li>Getting everything running and verified</li>
					<li>Setting up the initial monitoring and database stack</li>
				</ul>

				<p>
					Think of it as an expert installation assistant—it does the heavy lifting of getting your
					tracker deployed, but then hands over control to you.
				</p>

				<h3 id="what-it-doesnt-do">What It Doesn't Do</h3>

				<p>
					Once your tracker is deployed, ongoing infrastructure management becomes <strong
						>your responsibility</strong
					>
					as a system administrator. The deployer does not handle:
				</p>

				<ul>
					<li>Checking and managing backups</li>
					<li>Ongoing monitoring and alerting</li>
					<li>Operating system updates and patches</li>
					<li>Security audits and hardening</li>
					<li>Performance tuning and optimization</li>
					<li>Troubleshooting production issues</li>
					<li>Scaling infrastructure as needs grow</li>
				</ul>

				<Callout type="warning">
					<strong>System Administration Required</strong>: This is a deployment tool, not a managed
					service. You'll need basic system administration knowledge to maintain your tracker after
					deployment. Make sure you have backups, monitoring, and maintenance procedures in place.
				</Callout>

				<p>
					This focused approach keeps the tool simple and reliable. Rather than trying to be a
					comprehensive infrastructure management platform (which would add enormous complexity), we
					concentrate on doing one thing well: getting your tracker deployed correctly.
				</p>

				<h2 id="architecture-approach">Architecture: DDD for Infrastructure</h2>

				<p>
					One aspect that makes this project unique is that it's not a conventional infrastructure
					tool. We've applied
					<strong>Domain-Driven Design (DDD)</strong> principles to infrastructure automation—an approach
					more commonly seen in business applications than DevOps tooling.
				</p>

				<h3 id="domain-first-thinking">Domain-First Thinking</h3>

				<p>
					In our architecture, the <strong>domain</strong> represents the core concepts we care about:
				</p>

				<ul>
					<li>Services and their configurations</li>
					<li>Dependencies between components</li>
					<li>Deployment constraints and requirements</li>
					<li>Infrastructure states and transitions</li>
					<li>Business rules for deployments</li>
				</ul>

				<p>
					These domain concepts live in the heart of the application, independent of any specific
					technology.
				</p>

				<h3 id="tools-as-infrastructure">Tools as Infrastructure Layer</h3>

				<p>
					Tools like OpenTofu and Ansible are <strong>implementation details</strong> that live in the
					DDD infrastructure layer. This means:
				</p>

				<ul>
					<li>The domain doesn't know or care about OpenTofu or Ansible</li>
					<li>We could swap these tools for alternatives without changing domain logic</li>
					<li>The core business rules remain stable even as tooling evolves</li>
					<li>Testing is easier because domain logic is isolated from external dependencies</li>
				</ul>

				<p>
					This separation creates a more maintainable codebase where deployment logic is expressed
					in terms of domain concepts (what we're deploying and why) rather than tool-specific
					commands (how to use OpenTofu or Ansible).
				</p>

				<Callout type="info">
					<strong>Why This Matters</strong>: By treating infrastructure tools as interchangeable
					implementation details, we gain flexibility and longevity. The ecosystem of infrastructure
					tools is constantly evolving, but our domain concepts remain stable. This architecture
					allows us to adopt new tools or techniques without rewriting the entire system.
				</Callout>

				<h2 id="development-journey">The Development Journey: Three Iterations</h2>

				<p>
					Getting to the current Rust implementation wasn't a straight path. We took a deliberate,
					iterative approach, building two proof of concepts (PoCs) before settling on the final
					architecture. Each iteration taught us valuable lessons and helped us validate different
					approaches.
				</p>

				<h3 id="poc-1-bash">1. Bash/OpenTofu/cloud-init PoC</h3>

				<p>
					<strong>Repository:</strong>
					<a href="https://github.com/torrust/torrust-tracker-deploy-bash-poc"
						>torrust-tracker-deploy-bash-poc</a
					>
				</p>

				<p>
					<strong>Technologies:</strong> Bash scripts, OpenTofu, cloud-init, Docker Compose<br />
					<strong>Focus:</strong> Infrastructure as Code with libvirt/KVM and cloud deployment<br />
					<strong>Status:</strong> ✅ Historical reference - Completed its research goals
				</p>

				<p>
					This was our first exploration into automated deployment. We wanted to understand the
					basics of infrastructure provisioning and validate that we could automate the deployment
					workflow. The simplicity of Bash made it easy to prototype quickly, and OpenTofu gave us a
					taste of declarative infrastructure management.
				</p>

				<h3 id="poc-2-perl">2. Perl/Ansible PoC</h3>

				<p>
					<strong>Repository:</strong>
					<a href="https://github.com/torrust/torrust-tracker-deploy-perl-poc"
						>torrust-tracker-deploy-perl-poc</a
					>
				</p>

				<p>
					<strong>Technologies:</strong> Perl, OpenTofu, Ansible, libvirt/KVM, cloud-init, Docker
					Compose<br />
					<strong>Focus:</strong> Declarative configuration management with mature automation tools<br
					/>
					<strong>Status:</strong> ✅ Historical reference - Completed its research goals
				</p>

				<p>
					The second iteration introduced Ansible for configuration management, which gave us better
					structure and reusability. We explored how established DevOps tools handle complex
					deployments and learned about the trade-offs between declarative and imperative
					approaches. Perl served as the orchestration layer, coordinating between different tools.
				</p>

				<h3 id="final-rust">3. Torrust Tracker Deployer (Production)</h3>

				<p>
					<strong>Repository:</strong>
					<a href="https://github.com/torrust/torrust-tracker-deployer">torrust-tracker-deployer</a>
				</p>

				<p>
					<strong>Technologies:</strong> Rust, OpenTofu, Ansible, LXD, cloud-init, Docker Compose<br
					/>
					<strong>Focus:</strong> Type-safe, performance-oriented deployment tooling<br />
					<strong>Status:</strong> 🚀 Production-ready - Active development
				</p>

				<p>
					Armed with insights from both PoCs, we built the production version in Rust. The choice of
					Rust wasn't arbitrary—it aligns with the Torrust ecosystem (the tracker itself is written
					in Rust) and provides the type safety, performance, and reliability we need for a
					production deployment tool. We kept the best parts of our previous iterations (OpenTofu
					for infrastructure, Ansible for configuration, Docker Compose for service orchestration)
					while wrapping everything in a robust, well-tested Rust application.
				</p>

				<p>
					This iterative approach allowed us to learn, experiment, and validate our ideas before
					committing to the final implementation. While it took more time upfront, it resulted in a
					much better end product.
				</p>

				<h2 id="ai-assisted-development">AI-Assisted Development: A First for Torrust</h2>

				<p>
					Beyond the architectural innovation of applying DDD to infrastructure, this project
					represents another first for the Torrust organization: it's the <strong
						>first project entirely developed using AI agents</strong
					>.
				</p>

				<h3 id="human-vs-ai">A Different Approach</h3>

				<p>
					Up until now, all code in the Torrust Tracker has been human-crafted. We've used
					traditional development practices with careful, manual code writing. For the deployer, we
					took the opposite approach—<strong
						>100% of the code lines have been generated by AI agents</strong
					>.
				</p>

				<p>
					But let's be clear: this doesn't mean we were just "vibe coding" or blindly accepting
					whatever the AI produced. Far from it.
				</p>

				<h3 id="disciplined-ai-development">Disciplined AI Development</h3>

				<p>Using AI agents effectively requires discipline and infrastructure:</p>

				<ul>
					<li>
						<strong>Careful code review</strong>: Every line generated by AI agents was reviewed by
						humans. We examined the code for correctness, style, and alignment with our
						architecture.
					</li>
					<li>
						<strong>Extensive documentation</strong>: We maintained comprehensive documentation that
						proved invaluable when working with agents. Clear specifications and architectural
						decisions help AI agents generate better code.
					</li>
					<li>
						<strong>Testing-first mindset</strong>: We put special effort into building a robust E2E
						test suite. These tests give us confidence that agent-generated changes work correctly
						and don't break existing functionality.
					</li>
				</ul>

				<h3 id="testing-challenges">The Testing Challenge</h3>

				<p>Building a reliable test suite for this project was particularly challenging:</p>

				<ul>
					<li>
						<strong>Docker inside VMs</strong>: Testing deployment means running Docker containers
						inside virtual machines
					</li>
					<li>
						<strong>Docker in Docker</strong>: Some scenarios require nested Docker environments
					</li>
					<li>
						<strong>CI/CD compatibility</strong>: We spent considerable effort finding
						virtualization tools that work reliably on GitHub runners, allowing us to run
						comprehensive tests on every push and pull request
					</li>
				</ul>

				<p>
					These testing challenges were especially difficult to solve, but they were crucial.
					Without a solid test suite, working with AI agents would have been much riskier.
				</p>

				<Callout type="info">
					<strong>AI as a Tool, Not a Replacement</strong>: Our experience shows that AI agents can
					be incredibly productive when combined with strong engineering practices. The key is
					treating AI as a powerful tool that still requires human oversight, clear specifications,
					and comprehensive testing.
				</Callout>

				<h2 id="unexpected-complexity">Unexpected Complexity</h2>

				<p>
					We'll be honest: this project turned out to be more complex than we initially anticipated.
					What started as a straightforward automation tool has grown into a substantial codebase.
				</p>

				<p>
					To give you an idea of the scope, here's a comparison of the deployer codebase versus the
					tracker itself:
				</p>

				<h3 id="deployer-stats">Torrust Tracker Deployer</h3>

				<CodeBlock
					lang="text"
					code={`     928 text files.
     804 unique files.                                          
     126 files ignored.

-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
XML                              1          28461              6         131175
Rust                           523          11407          28515          54315
Markdown                       200          16861              6          41777
Text                             2             36              0           8689
JSON                            26              0              0           6828
YAML                            34            298            444           1400
Bourne Shell                     5             74             82            251
HCL                              4             39             46            204
TOML                             6             36             12            175
Dockerfile                       3             35             88             97
-------------------------------------------------------------------------------
SUM:                           804          57247          29199         244911
-------------------------------------------------------------------------------`}
				/>

				<h3 id="tracker-stats">Torrust Tracker</h3>

				<CodeBlock
					lang="text"
					code={`     593 text files.
     541 unique files.                                          
      63 files ignored.

-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Rust                           433          10170           9754          41429
Markdown                        37            670              0           1660
TOML                            33            117             20            990
SVG                              2             34              0            948
YAML                            10            129             14            674
JSON                             8              0              0            563
Bourne Shell                     9             38             15            104
Containerfile                    1             31             15             99
C                                1             21              2             86
SQL                              6              7              0             60
make                             1              6              0             11
-------------------------------------------------------------------------------
SUM:                           541          11223           9820          46624
-------------------------------------------------------------------------------`}
				/>

				<p>
					Yes, you read that right—the deployer codebase has actually surpassed the tracker itself
					in terms of lines of code! This might seem counterintuitive at first, but it reflects the
					complexity involved in automating system configuration, handling various edge cases,
					managing infrastructure as code, and ensuring reliable deployments across different
					environments.
				</p>

				<Callout type="info">
					<strong>Note</strong>: Much of the deployer's size comes from comprehensive testing,
					extensive documentation, infrastructure definitions, and automation scripts. It's not just
					about deploying a tracker—it's about doing it reliably, safely, and repeatably.
				</Callout>

				<h2 id="current-status">Current Status and Timeline</h2>

				<p>
					The Torrust Tracker Deployer is currently under active development and <strong
						>nearing completion</strong
					>. We've made significant progress, with the core functionality already in place.
				</p>

				<h3 id="whats-done">What's Already Working ✅</h3>

				<p>The foundation is solid. Here's what we've completed:</p>

				<ul>
					<li>
						<strong>Main application scaffolding</strong> (89% complete) - Console commands, logging,
						and presentation layer
					</li>
					<li>
						<strong>Infrastructure provider support</strong> - Both LXD and Hetzner Cloud providers are
						fully implemented
					</li>
					<li>
						<strong>Complete deployment workflow</strong> - You can deploy the full Torrust Tracker
						stack including:
						<ul>
							<li>Torrust Tracker (HTTP and UDP)</li>
							<li>MySQL database</li>
							<li>Prometheus for metrics collection</li>
							<li>Grafana for visualization</li>
						</ul>
					</li>
					<li>
						<strong>Core commands</strong>:
						<ul>
							<li><code>create</code> - Create deployment environment definition</li>
							<li><code>provision</code> - Create infrastructure resources (VMs)</li>
							<li><code>configure</code> - Install dependencies and configure services</li>
							<li><code>release</code> - Deploy application releases</li>
							<li><code>run</code> - Start and run deployed services</li>
							<li><code>test</code> - Verify deployment</li>
							<li><code>destroy</code> - Clean up resources</li>
						</ul>
					</li>
				</ul>

				<h3 id="deployment-options">Deployment Options</h3>

				<p>The deployer currently supports multiple deployment scenarios:</p>

				<h4 id="hetzner-cloud">Hetzner Cloud (Production)</h4>

				<p>
					<strong>Status:</strong> ✅ Fully working and production-ready<br />
					Our primary target is Hetzner Cloud, a reliable European cloud provider. This is the recommended
					option for production deployments. For current pricing information, visit
					<a href="https://www.hetzner.com/cloud/">hetzner.com/cloud</a>.
				</p>

				<h4 id="lxd-local">LXD (Local/Testing)</h4>

				<p>
					<strong>Status:</strong> ✅ Fully working, but intended for testing<br />
					The LXD provider allows you to deploy locally on your development machine or in CI environments.
					While it works perfectly, it's primarily intended for:
				</p>

				<ul>
					<li>Running E2E tests during development</li>
					<li>Quick local demos and experimentation</li>
					<li>Learning how the deployer works without cloud costs</li>
				</ul>

				<p>
					It's not recommended for production use, but it's great for getting started quickly if you
					have the dependencies installed.
				</p>

				<h4 id="pre-provisioned">Pre-Provisioned VMs</h4>

				<p>
					<strong>Status:</strong> ✅ Supported<br />
					Already have a VM from another provider? No problem. You can register pre-provisioned instances
					with the deployer and use it for everything except the initial VM creation (configuration, release,
					run, etc.). This is perfect if:
				</p>

				<ul>
					<li>You already have a VM you want to use</li>
					<li>Your hosting provider isn't supported yet</li>
					<li>You prefer to manage infrastructure provisioning yourself</li>
				</ul>

				<h4 id="future-providers">Future Providers</h4>

				<p>
					Adding new cloud providers is straightforward—we use OpenTofu, and it only requires adding
					two templates for each new provider. If there's demand for specific providers (AWS,
					DigitalOcean, Linode, etc.), they can be added relatively easily.
				</p>

				<h3 id="whats-remaining">What's Remaining 🚧</h3>

				<p>We're in the final stretch with just a few remaining items:</p>

				<ul>
					<li>
						<strong>Docker image for the deployer</strong> - To make installation even simpler
					</li>
					<li>
						<strong>Additional console commands</strong>:
						<ul>
							<li><code>show</code> - Display deployment status</li>
							<li><code>list</code> - List all deployments</li>
						</ul>
					</li>
					<li>
						<strong>HTTPS support</strong> - SSL/TLS certificates for:
						<ul>
							<li>HTTP tracker</li>
							<li>Tracker API</li>
							<li>Grafana dashboard</li>
						</ul>
					</li>
					<li>
						<strong>Backup and recovery</strong> - Database backups and disaster recovery procedures
					</li>
					<li><strong>Verbosity levels</strong> - Enhanced output control for debugging</li>
				</ul>

				<p>
					We expect to have a stable, production-ready release with these features completed in
					approximately one month (around late February 2025). The repository is public, and you're
					welcome to follow along with development or even try it out, but please be aware that it's <strong
						>not yet finished</strong
					> and some features are still being polished.
				</p>

				<p>
					You can track detailed progress on our <a
						href="https://github.com/torrust/torrust-tracker-deployer/issues/1">official roadmap</a
					>.
				</p>

				<Callout type="warning">
					<strong>Almost There, But Not Yet Ready</strong>: While we're close to completion, the
					deployer is not yet ready for production use. APIs, configurations, and deployment
					processes may still change before the stable release.
				</Callout>

				<h2 id="comprehensive-documentation">Comprehensive Documentation</h2>

				<p>
					One aspect we're particularly proud of is the quality and breadth of documentation. We've
					invested heavily in making the deployer easy to understand, use, and contribute to.
				</p>

				<h3 id="internal-documentation">Internal Development Documentation</h3>

				<p>For developers and contributors, we maintain extensive internal documentation:</p>

				<ul>
					<li>
						<strong>Architectural Decision Records (ADRs)</strong>: Every significant decision has
						been documented, explaining not just what we did but why we chose that approach
					</li>
					<li>
						<strong>Technical guides</strong>: Deep dives into the architecture, domain model, and
						implementation details
					</li>
					<li>
						<strong>Manual testing guides</strong>: Step-by-step procedures for verifying
						functionality when automated tests aren't sufficient
					</li>
					<li>
						<strong>Contributing guidelines</strong>: Clear instructions on how to get started, code
						standards, and the development workflow
					</li>
				</ul>

				<h3 id="user-documentation">User-Facing Documentation</h3>

				<p>
					For end users, we provide clear, practical documentation that helps you get started
					quickly and understand how to use the deployer effectively.
				</p>

				<h3 id="helpful-program">Self-Documenting Program Design</h3>

				<p>
					Following Rust philosophy, the program itself is designed to be helpful and guide you
					through the deployment process:
				</p>

				<ul>
					<li>
						<strong>Clear guidance</strong>: The tool tells you what to do next at each step of the
						deployment
					</li>
					<li>
						<strong>Actionable error messages</strong>: When something goes wrong, the deployer
						doesn't just tell you what failed—it suggests how to fix it
					</li>
					<li>
						<strong>Progressive disclosure</strong>: Information is presented when you need it, not
						all at once
					</li>
					<li>
						<strong>Helpful defaults</strong>: Sensible default values with explanations of what
						they mean
					</li>
				</ul>

				<p>
					This attention to user experience means you spend less time reading documentation and more
					time getting things done.
				</p>

				<Callout type="info">
					<strong>Documentation as Code</strong>: Our documentation lives in the repository
					alongside the code, versioned and reviewed just like any other contribution. This ensures
					it stays accurate and up-to-date as the project evolves.
				</Callout>

				<h2 id="what-to-expect">What to Expect</h2>

				<p>When the deployer is ready, you can expect:</p>

				<ul>
					<li>
						<strong>Simple Installation</strong>: A straightforward installation process that gets
						you up and running quickly
					</li>
					<li>
						<strong>Fast Deployment</strong>: Complete deployment in approximately 1-2 minutes
						<ul>
							<li>LXD (local): Less than 45 seconds, with provisioning taking about 30 seconds</li>
							<li>
								Cloud providers: Potentially even faster for provisioning, with
								configuration/release/run taking less than a minute depending on instance size and
								bandwidth
							</li>
						</ul>
					</li>
					<li>
						<strong>Automated Configuration</strong>: All the tedious setup steps from the manual
						tutorial handled automatically
					</li>
					<li>
						<strong>Production Ready</strong>: SSL certificates, proper security configurations, and
						optimized settings out of the box
					</li>
					<li>
						<strong>Easy Updates</strong>: Simplified process for updating your tracker to newer
						versions
					</li>
					<li>
						<strong>Comprehensive Documentation</strong>: Clear guides on how to use the deployer
						and customize configurations
					</li>
				</ul>

				<p>
					Compare this to the manual deployment process, which involves following a lengthy tutorial
					with many steps and can take several hours to complete. The deployer reduces that to
					minutes.
				</p>

				<h3 id="prerequisites">Prerequisites</h3>

				<p>To use the deployer, you'll need:</p>

				<h4 id="common-dependencies">Common Dependencies</h4>

				<ul>
					<li><strong>OpenTofu</strong> - For infrastructure provisioning</li>
					<li><strong>Ansible</strong> - For configuration management</li>
				</ul>

				<p>
					Don't worry if you don't have these installed—the deployer includes a console command to
					help you install them and check if they're available on your system.
				</p>

				<p>
					<em
						>Note: A Docker image is also planned, which would eliminate the need to install
						dependencies on your machine. However, this feature is not yet implemented.</em
					>
				</p>

				<h4 id="provider-requirements">Provider Requirements</h4>

				<p>Depending on your chosen provider, you'll need provider-specific credentials:</p>

				<ul>
					<li>
						<strong>Hetzner Cloud</strong>: A Hetzner account, a project, and an API token. The
						Hetzner documentation explains how to obtain these. You'll provide the API token when
						creating your deployment environment.
					</li>
					<li>
						<strong>LXD</strong>: LXD installed and configured on your local machine
					</li>
					<li>
						<strong>Pre-provisioned VM</strong>: SSH access to your existing VM
					</li>
				</ul>

				<Callout type="warning">
					<strong>Security Note</strong>: The deployer runs entirely on your local machine—your API
					tokens never leave your computer. However, make sure your data folder has proper
					permissions so nobody can access your credentials. Since this is a single-use tool, you
					can backup your environment definition after deployment and securely remove everything
					from your local machine, keeping the backup in a safe place.
				</Callout>

				<h3 id="error-handling">Error Handling and Recovery</h3>

				<p>
					Given that the entire deployment process takes less than a minute, we've opted for
					simplicity over complex recovery mechanisms. If something goes wrong, the recommended
					approach is to destroy the environment and start fresh—it's faster than trying to recover
					from a failed state.
				</p>

				<p>That said, we've built in comprehensive observability:</p>

				<ul>
					<li>
						<strong>Excellent logging and tracing</strong>: You can see exactly what happened and
						where things went wrong
					</li>
					<li>
						<strong>Human-readable state</strong>: All internal state is persisted in JSON format—no
						cryptic binary formats
					</li>
					<li>
						<strong>Build artifacts preserved</strong>: Final OpenTofu and Ansible files are saved
						in a "build" folder for inspection
					</li>
					<li>
						<strong>Manual intervention possible</strong>: If you want to continue manually, you can
						run the Ansible playbooks yourself—they're idempotent, so it's safe to run them again
					</li>
					<li>
						<strong>Clear failure states</strong>: When a command fails, the environment enters a
						"failed" state with a detailed description of the problem
					</li>
				</ul>

				<p>
					The state machine prevents continuing with normal commands after a failure, but since the
					whole process only takes a minute, there's really no need to try to recover—just destroy
					and redeploy.
				</p>

				<h2 id="getting-involved">Getting Involved</h2>

				<p>
					We're always excited to have community involvement in Torrust projects. If you're
					interested in the deployer:
				</p>

				<ul>
					<li>
						<strong>Check out the repository</strong>: Visit
						<a href="https://github.com/torrust/torrust-tracker-deployer"
							>github.com/torrust/torrust-tracker-deployer</a
						> to see the code
					</li>
					<li>
						<strong>Star the repo</strong>: Show your interest and stay updated on releases
					</li>
					<li>
						<strong>Follow development</strong>: Watch for issues, pull requests, and discussions
					</li>
					<li>
						<strong>Provide feedback</strong>: Once we release a beta version, we'd love to hear
						about your deployment experiences
					</li>
					<li>
						<strong>Get help</strong>: If you need assistance, have questions, or want to share your
						experience, open an
						<a href="https://github.com/torrust/torrust-tracker-deployer/issues">issue</a>
						or start a
						<a href="https://github.com/torrust/torrust-tracker-deployer/discussions">discussion</a> in
						the GitHub repository
					</li>
				</ul>

				<h2 id="conclusion">Conclusion</h2>

				<p>
					The Torrust Tracker Deployer represents our commitment to making the Torrust ecosystem
					more accessible and easier to use. While the journey has been more complex than
					anticipated, we're nearly at the finish line and believe the result will be worth the
					effort.
				</p>

				<p>
					Deployment shouldn't be a barrier to running your own tracker. With this tool, we're
					working to remove that barrier and make it possible for anyone to deploy a
					production-quality BitTorrent tracker in minutes rather than hours.
				</p>

				<p>
					We're in the final stretch of development, and we'll keep you updated as we approach the
					stable release. We can't wait to see what you build with it!
				</p>

				<p>Happy tracking!</p>

				<hr />

				<p>
					<em>
						Have questions or feedback? Open an <a
							href="https://github.com/torrust/torrust-tracker-deployer/issues">issue</a
						>
						or start a
						<a href="https://github.com/torrust/torrust-tracker-deployer/discussions">discussion</a>
						in the deployer repository, or join the broader conversation in the
						<a href="https://github.com/torrust/torrust-tracker/discussions">tracker discussions</a
						>.
					</em>
				</p>
			</div>
		</div>
	</PagesWrapper>
	<PrevNextPost currentPage={currentPost.slug} {allPosts} />
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
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h2 {
		font-size: 1.8rem;
		font-weight: bold;
		padding-top: 1.5rem;
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
