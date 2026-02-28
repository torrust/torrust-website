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
					I spent several months building the
					<a href="https://github.com/torrust/torrust-tracker-deployer">Torrust Tracker Deployer</a>
					without writing a single line of code directly. Every line of Rust, every configuration file,
					every refactoring plan — all of it came from a GitHub Copilot agent. I reviewed, directed, steered,
					and approved. But I did not type the code.
				</p>
				<p>
					That experience turned out to teach me something more interesting than how to use agents
					effectively as a developer. It changed how we think about <strong
						>who our software is for</strong
					>.
				</p>
				<p>
					This article tells two stories. The first is about building <em>with</em> AI agents: how I
					worked with them day to day, what went wrong with remote agents, and what I learned from
					micromanaging them in a complex infrastructure project. The second is about building
					<em>for</em> AI agents: the gradual realisation that agents — not humans — would become the
					primary operators of the deployer, and everything we changed in the product because of that.
				</p>
				<p>
					If you're not yet familiar with the deployer itself, you may want to read the earlier
					articles in this series first:
					<a href="/blog/introducing-the-torrust-tracker-deployer"
						>Introducing the Torrust Tracker Deployer</a
					>
					and
					<a href="/blog/deploying-torrust-to-production">Deploying Torrust to Production</a>.
				</p>

				<h2 id="part-1-building-with-agents">Part 1 — Building the deployer with AI agents</h2>

				<h3 id="how-i-worked-with-agents">How I worked with agents</h3>
				<p>
					I used a single tool throughout: GitHub Copilot, running inside Visual Studio Code. Never
					more than three agents active simultaneously. No Claude Code, no Cursor, no remote
					pipelines beyond what Copilot offers out of the box.
				</p>
				<p>Over time I settled into three distinct working modes:</p>

				<h4 id="mode-1-pair-programming">Mode 1: Pair programming for planning and design</h4>
				<p>
					When I needed to plan a feature, define an architecture, or design a refactoring strategy,
					I would work conversationally with a single agent. This is the mode that feels most like
					having a senior colleague to think out loud with. I describe the problem, the agent
					suggests approaches, we debate trade-offs, and eventually we arrive at a plan. The agent
					is not executing anything here — it is just helping me think.
				</p>
				<p>
					This mode worked extremely well. Agents are patient, thorough, and will consider angles
					you might miss. Architecture sessions that would have taken me days of reading and
					thinking alone got compressed into focused conversations.
				</p>

				<h4 id="mode-2-local-agents-with-limited-permissions">
					Mode 2: Local agents with limited permissions
				</h4>
				<p>
					For actual implementation tasks, I assigned work to local agents but deliberately limited
					what they were allowed to do autonomously. The agent could write code, run tests, and
					propose commits — but I reviewed every step before it proceeded. I treated the agent like
					a junior developer working in a pair: capable and fast, but not yet trusted with full
					autonomy.
				</p>
				<p>
					This ended up being the natural working mode for two reasons. First, it is simply the
					easiest way to work — having the agent local means no external runner setup, no shared
					environment limitations, and no delays. Second, the nature of this project meant most
					tasks required constant steering regardless. The agent would drift, take a wrong
					assumption, or produce code that compiled but missed the intent. Staying close to the work
					and reviewing each step was not overhead — it was the actual job.
				</p>
				<p>
					I do allow the agent to interact with LXD directly — creating and destroying virtual
					machines, running provisioning commands — but under supervision. I control which commands
					the agent is permitted to run. Because LXD runs locally on my development machine, VMs can
					be created and destroyed quickly with no cloud cost and no lasting consequences. That
					makes it safe to grant the agent meaningful permissions while still retaining oversight.
				</p>

				<h4 id="mode-3-remote-copilot">Mode 3: Remote Copilot (tried, abandoned)</h4>
				<p>
					At the start of the project, I also tried GitHub Copilot's remote agent mode — assigned
					tasks run on GitHub's shared runners without requiring my machine to be involved. It
					seemed appealing as a way to parallelize work.
				</p>
				<p>It did not work well for this project, for two distinct reasons.</p>

				<h3 id="why-remote-copilot-failed">Why remote Copilot did not work for this project</h3>

				<h4 id="vm-connectivity">Problem 1: Nested virtualisation on shared runners</h4>
				<p>
					The integration tests launch real virtual machines using LXD. This requires nested
					virtualisation — running a hypervisor inside the already-virtualised environment that
					GitHub's shared runners provide. Shared runners do not support this. The LXD VMs would
					start but network connectivity inside the VM would fail, causing tests to error in ways
					that never occur locally.
				</p>
				<p>
					This is a hard constraint, not a configuration problem. There is no way to make nested
					virtualisation work on standard shared runners without switching to self-hosted runners or
					a different test strategy.
				</p>

				<h4 id="timeout-loops">Problem 2: The pre-commit timeout loop</h4>
				<p>
					The project has thorough pre-commit hooks: Rust compilation, clippy, tests, linters, spell
					checking. On my local machine these take over five minutes to complete. On the shared
					runners they take even longer.
				</p>
				<p>
					GitHub Copilot's remote task timeout is shorter than that. The agent would trigger a
					commit, the pre-commit hooks would start running, the timeout would fire before they
					finished, and Copilot would conclude the commit had failed. It would then try again. And
					again. An infinite retry loop, each attempt interrupted mid-commit, making no forward
					progress.
				</p>
				<p>
					The root cause is that the timeout fires before the pre-commit hooks complete, but the
					agent interprets this as a failure rather than a timeout — so it retries rather than
					waiting or reporting the problem.
				</p>

				<Callout type="info">
					<strong>Lesson:</strong> Remote agents have real constraints for infrastructure projects. If
					your tests require specialised environments (VMs, hardware, unusual networking), or if your
					pre-commit checks are slow, local agents with human review will serve you better than remote
					pipelines. The alternative is self-hosted runners or your own agent infrastructure — but that
					is a significant investment in itself.
				</Callout>

				<h2 id="part-2-the-shift">Part 2 — The shift: agents are the users</h2>
				<p>
					The project started in September 2025. The initial decision — to build a console CLI — was
					obvious. Infrastructure tooling lives in the terminal. You provision a server by running
					commands. A CLI is the natural fit.
				</p>
				<p>
					Over the following months, something shifted in how we thought about the tool. Not in how
					it worked, but in who we imagined using it.
				</p>
				<p>
					The realisation came gradually: in a world where people interact with their computers
					through AI agents, <strong>nobody is going to use this CLI directly</strong>. They will
					ask their agent to deploy the tracker. The human remains the end user — the person who
					wants a working tracker — but the <em>operator</em> of the deployer is increasingly likely to
					be an agent.
				</p>
				<p>
					Once you frame it that way, a new question becomes urgent: <strong
						>what does an agent need from this tool?</strong
					> And more importantly: are we giving it those things?
				</p>
				<p>
					We added a dedicated section to the project roadmap: section 11, "Improve AI agent
					experience". It was the first time we had explicitly committed to treating agents as a
					first-class user group. You can follow the full roadmap at
					<a href="https://github.com/torrust/torrust-tracker-deployer/issues/1">GitHub issue #1</a
					>.
				</p>

				<h2 id="part-3-rethinking-ux">Part 3 — Rethinking UX for AI agents</h2>
				<p>
					Before getting into the specific changes we made, it is worth explaining the thinking that
					shaped them. Some of our assumptions about UX turned out to be correct; others needed
					revising.
				</p>

				<h3 id="human-ux-agent-ux">What human UX and agent UX have in common</h3>
				<p>
					The deployer's CLI was already built with careful attention to usability. Every command
					was designed to be:
				</p>
				<ul>
					<li><strong>Self-explanatory</strong> — commands and options describe what they do</li>
					<li><strong>Self-discoverable</strong> — the app tells you what you can do next</li>
					<li><strong>Observable</strong> — output shows what is happening at every step</li>
					<li><strong>Explanatory on failure</strong> — errors describe what went wrong and why</li>
					<li><strong>Helpful after failure</strong> — errors suggest how to continue</li>
					<li>
						<strong>State-aware</strong> — the user always knows where they are in the workflow
					</li>
				</ul>
				<p>
					All of these principles benefit agents just as much as humans. Clear errors, structured
					output, helpful hints — an agent consuming these is in a much stronger position than one
					left to guess from cryptic messages. As the Tinybird team put it later (more on this in
					Part 5): <em
						>"When an AI agent runs your CLI and gets a cryptic error, it hallucinates a fix. That's
						bad for agents, and it's equally bad for humans debugging at 2am."</em
					>
				</p>

				<h3 id="token-cost">The cost of self-discovery</h3>
				<p>
					This is not actually a new problem. Software development has always had a high onboarding
					cost — for humans, the currency is time and cognitive load rather than tokens, but the
					tension is the same. Good engineering teams have always wrestled with two competing
					pressures:
				</p>
				<ul>
					<li>
						Write documentation to reduce the time new contributors spend learning how things work.
					</li>
					<li>
						Keep that documentation maintained — because stale docs that no longer reflect the code
						are worse than no docs at all.
					</li>
				</ul>
				<p>
					The classic answer has always been: give people the exact context they need for the
					specific task they are about to do, rather than front-loading everything or leaving them
					to discover it themselves. Good onboarding is targeted, not exhaustive.
				</p>
				<p>
					Agents make this tension sharper because the budget is explicit. Every round-trip —
					running a command to discover what options it takes, reading the man page, trying a flag —
					consumes tokens. If an agent has to explore the interface to learn how to use the app, it
					burns through context before doing any real work. The cost of self-discovery is measurable
					in a way that it never quite was for human developers.
				</p>
				<p>
					The implication is the same one good engineering teams have always acted on: a compact,
					targeted reference loaded at the start of a task is more efficient than relying on
					self-discovery — whether the learner is a new hire or an AI agent.
				</p>

				<h3 id="docs-maintenance">The documentation maintenance problem, now worse</h3>
				<p>
					Working with AI agents is generating a new category of documentation — skills, prompt
					files, schema exports, context files — much of it written for agents to consume rather
					than humans to read. This creates a version of the old documentation problem, but
					potentially worse: documentation that humans struggle to review, produced faster than any
					team can meaningfully maintain.
				</p>
				<p>
					If an agent can change code faster than any human, but nothing forces it to update the
					related documentation, we will end up exactly where we have always ended up: outdated docs
					that nobody trusts. The speed advantage of agents makes this worse, not better.
				</p>
				<p>
					Some teams are now arguing that agents should learn to use software the same way a senior
					developer would — by reading the code itself, exploring the interface, building
					understanding from first principles rather than from documentation. There is something
					appealing about this: it sidesteps the maintenance problem entirely. No docs, no stale
					docs.
				</p>
				<p>
					But this argument has never worked at scale for humans, and it is unlikely to work for
					agents either. A senior developer joining a large project does not learn it by reading
					every file — they get onboarded, they get context, they get pointed at the right parts.
					"Code over documentation" from the Agile Manifesto never meant no documentation. It meant:
					prefer working software over comprehensive documentation, and write documentation that
					earns its maintenance cost.
				</p>
				<p>
					The right answer for agents is the same as for humans: write documentation that is
					targeted, close to the code, and easy to update alongside the code it describes. Skills
					stored in the repository and referenced from <code>AGENTS.md</code> are one concrete attempt
					at this — they live where the code lives, so the same pull request that changes a feature can
					update the skill that describes it.
				</p>

				<h3 id="interface-question">The interface question: CLI, REST, or GraphQL?</h3>
				<p>
					We discussed whether a CLI was even the right kind of interface for agents to interact
					with. Three options were on the table:
				</p>
				<ul>
					<li>
						<strong>CLI</strong>: natural fit — agents run in terminals, and the deployer already
						had one. But agents have to parse text output and infer meaning from exit codes.
					</li>
					<li>
						<strong>REST API</strong>: a standard programmatic interface with structured JSON
						responses.
					</li>
					<li>
						<strong>GraphQL</strong>: self-describing schema — an agent can query the schema itself
						to discover what the API can do, similar in spirit to an MCP server.
					</li>
				</ul>
				<p>
					GraphQL's self-describing quality was attractive. But all three options share a
					fundamental limitation.
				</p>

				<h3 id="workflows">Interfaces do not convey workflows by default</h3>
				<p>
					A GraphQL schema and a REST API reference list available operations with no inherent
					ordering. A CLI <code>--help</code> output works the same way by default — but a CLI has
					more room to do better. A well-designed CLI can include a top-level help section that
					describes the deployment workflow explicitly, output state-aware hints after each command
					("next step: run <code>provision</code>"), or fail with errors that name the missing
					prerequisite step. The deployer does this.
				</p>
				<p>The deployer has a mandatory deployment sequence:</p>
				<pre><code>create → provision → configure → run</code></pre>
				<p>
					You cannot provision a server before creating it. You cannot run services before
					configuring them. The point is not that no interface can express this — it is that
					expressing sequential workflows requires deliberate design effort on top of whatever
					interface you choose. It does not come for free with GraphQL's self-describing schema, a
					REST reference, or a default <code>--help</code> output. An agent using any of these interfaces
					without that extra design work still needs separate documentation to understand the required
					sequencing.
				</p>

				<h3 id="agents-can-program">Where agents genuinely differ: they can program</h3>
				<p>
					So far the picture has been mostly one of continuity: agents benefit from the same UX
					principles as humans, they share the same tension between documentation and
					self-discovery, and they need workflow context just as a new developer would. In many
					ways, designing for agents means applying good software design principles more rigorously,
					not inventing new ones.
				</p>
				<p>
					But there is one capability that sets agents meaningfully apart from human users: they can
					parse structured output instantly, call APIs, and — most importantly — <strong
						>write and execute code</strong
					> as part of completing a task. A human using a CLI reads the output and decides what to do
					next. An agent can do that too, but it can also write a small program on the spot to automate
					the next ten steps, handle errors programmatically, and compose the tool with other systems
					— all without leaving the task.
				</p>
				<p>
					When a human uses a CLI, they run commands one by one and read the output. When an agent
					needs to accomplish something, it often writes a small program — a bash script, a Python
					script, a Rust binary — to compose operations and handle results systematically. Some
					projects are even exploring REPL environments for agents: stateful shells with variables
					and memory, letting agents build up automation incrementally.
				</p>
				<p>
					This capability changes what the most useful interface actually is. The natural
					conclusion: <strong
						>give agents an environment where they can interact with your application through a
						program</strong
					>. Don't just make your commands easier to parse — give them a library they can code
					against.
				</p>
				<p>That is the core reason we built the SDK.</p>

				<h3 id="training-agents">How do you "train" an agent to use your app?</h3>
				<p>
					During our weekly development meetings, this question came up repeatedly. The options we
					considered:
				</p>
				<ul>
					<li>
						<strong>RAG (Retrieval-Augmented Generation)</strong>: feed the agent relevant
						documentation at query time from a vector database
					</li>
					<li>
						<strong>Custom knowledge bases</strong>: curate a structured corpus the agent queries
					</li>
				</ul>
				<p>
					Both are valid approaches. But we kept returning to one observation: LLMs are evolving
					fast, and new models are released frequently. New models are likely being trained on
					public GitHub repositories — including ours.
				</p>
				<p>
					The simpler bet: <strong>just wait for the next model</strong>. As long as your project is
					public and your documentation is good, the LLMs will eventually incorporate your changes
					through their regular training cycles. No custom pipeline required.
				</p>
				<p>This works for us because:</p>
				<ul>
					<li>The repository is public</li>
					<li>Development pace on the deployer is measured — LLMs can keep up with our changes</li>
				</ul>
				<p>
					It would break down if you were evolving faster than new model releases. But for this
					project, the cadence works in our favour.
				</p>

				<h2 id="part-4-what-we-built">Part 4 — What we actually built</h2>
				<p>
					The thinking in Part 3 led to a series of concrete changes. Here is what we built and why.
				</p>

				<h3 id="skills">4.1 — Skills for focused context</h3>
				<p>
					As the project grew, <code>AGENTS.md</code> — the file that tells agents about the project —
					became too long. In long conversations, loading the entire file at the start pollutes the context
					window with information unrelated to the current task. Agent quality degrades.
				</p>
				<p>
					We adopted the <a href="https://agentskills.io/">agentskills.io</a> specification. The
					idea: move per-task instructions out of <code>AGENTS.md</code> and into individual skill files.
					When an agent starts a task, it loads only the skill relevant to that task — getting focused,
					actionable instructions without the noise of everything else.
				</p>
				<p>
					For example: a skill for "add a new command", a skill for "write an integration test", a
					skill for "deploy using the SDK". Each one contains exactly what an agent needs for that
					specific task.
				</p>

				<Callout type="info">
					An honest caveat: it doesn't always work perfectly. Agents sometimes don't trigger the
					right skill, or forget to search for available skills before starting. Human steering is
					still required. But when it works, the quality improvement is noticeable.
				</Callout>

				<h3 id="template-headers">4.2 — AI-discoverable headers in template files</h3>
				<p>
					There are three distinct scenarios in which an agent might interact with this project:
				</p>
				<ol>
					<li>
						<strong>Contributor agent</strong>: working on the deployer codebase itself — adding
						features, writing tests, refactoring
					</li>
					<li>
						<strong>Deployment agent</strong>: helping an end-user deploy the Torrust Tracker using
						the deployer
					</li>
					<li>
						<strong>Maintenance agent</strong>: helping an end-user maintain a server after the
						tracker has already been deployed
					</li>
				</ol>
				<p>
					The third scenario is the tricky one. Once the deployer has run, it leaves behind rendered
					artifacts: Docker Compose files, environment files, Ansible configuration. A maintenance
					agent only has those files as context. It has no idea where they came from, what tool
					generated them, or where to find documentation.
				</p>
				<p>
					Our solution: embed a small documentation header in every template file. When the deployer
					renders a template, the header is included in the output. The header tells the agent:
				</p>
				<ul>
					<li>This file was generated by the Torrust Tracker Deployer</li>
					<li>Where to find the source template</li>
					<li>Where to find documentation and support</li>
				</ul>
				<p>
					This allows an agent encountering a rendered file for the first time to discover the
					source, fetch the relevant documentation, and continue with full context — without any
					human having to explain the provenance.
				</p>

				<h3 id="configuration-tooling">
					4.3 — Giving agents tools to understand the configuration
				</h3>
				<p>
					The deployer's <code>create</code> command takes a JSON file as input: the full configuration
					for the tracker environment (server specs, domain, enabled services, networking, and so on).
					Getting that configuration right is the most demanding part of a deployment.
				</p>
				<p>We built three complementary tools to help agents handle this:</p>

				<h4 id="questionnaire-skill">Questionnaire skill</h4>
				<p>
					A structured skill that guides an agent through the right questions to ask the user before
					generating a configuration: what domain will the tracker run on? Which cloud provider?
					Which services should be enabled? The agent interviews the user, collects the answers, and
					then produces a valid config file — rather than guessing at values and generating
					something that fails at deployment time.
				</p>

				<h4 id="json-schema">JSON schema for the configuration</h4>
				<p>
					The environment configuration has a formal JSON schema that can be generated and injected
					directly into the agent's context. The agent immediately knows which fields are required
					versus optional, what types each field expects, and what values are valid — without
					needing to read prose documentation or iterate through trial and error.
				</p>

				<h4 id="json-cli-docs">Machine-readable CLI documentation</h4>
				<p>
					The deployer uses the <a href="https://docs.rs/clap">Clap</a> crate for CLI argument parsing.
					We added a command to export the entire CLI documentation as structured JSON, generated automatically
					from the Clap definitions. An agent can load this JSON at the start of a conversation and immediately
					know every command, every subcommand, every flag and option — with no exploration required.
				</p>
				<p>
					This solves the <em>learning problem</em>: injecting the JSON docs is cheaper in tokens
					than exploring the interface. But it does not solve the <em>integration problem</em>: the
					agent knows how to run commands, but cannot easily build pipelines that compose the
					deployer with other systems. For that, we needed the SDK.
				</p>

				<h3 id="json-output">4.4 — JSON output for all commands</h3>
				<p>
					Every command in the deployer now accepts a <code>--json</code> flag that switches its
					output from human-readable text to structured JSON. This covers
					<code>create</code>, <code>provision</code>, <code>configure</code>, <code>show</code>,
					<code>list</code>, <code>run</code>, <code>test</code>, and more.
				</p>
				<p>
					For agents using the CLI path, this eliminates text parsing entirely. The agent gets a
					typed document it can read directly, not a wall of formatted output designed for human
					eyes.
				</p>

				<h3 id="sdk">4.5 — The SDK: a library for agents who write code</h3>
				<p>
					The SDK is the most significant addition for agent users. The design principle is stated
					directly in the pull request that introduced it:
				</p>
				<blockquote>
					"The CLI is designed for humans; the SDK is designed for programs and AI agents that need
					reliability, composability, and type safety."
				</blockquote>
				<p>
					Instead of shelling out to CLI commands and parsing text output, an agent can write a Rust
					program that calls the SDK directly. The benefits:
				</p>
				<ul>
					<li>
						<strong>No text parsing</strong> — operations return typed Rust values, not strings
					</li>
					<li>
						<strong>No exit code inference</strong> — errors are typed <code>Result</code> variants
						with domain-specific names like <code>EnvironmentAlreadyExists</code> and
						<code>EnvironmentNotFound</code>
					</li>
					<li>
						<strong>Structured progress events</strong> — long-running operations like
						<code>provision</code> and <code>configure</code> emit step-by-step progress events via
						a <code>CommandProgressListener</code>, so the agent knows what is happening without
						scraping stdout
					</li>
					<li>
						<strong>Compiler-enforced correctness</strong> — the type system catches mistakes before execution
					</li>
					<li>
						<strong>Config builder</strong> — the <code>EnvironmentCreationConfigBuilder</code>
						guides the agent to a valid configuration through method chaining and type constraints, rather
						than requiring a correctly-shaped JSON file
					</li>
				</ul>
				<p>
					The SDK also enables something the CLI cannot: <strong>integrations</strong>. Sometimes an
					agent does not just want to invoke the deployer — it wants to fetch information from
					another system and pipe it into a deployment workflow. With the Rust SDK, the agent can
					write a program that talks to multiple systems and composes them with the deployer using
					the full power of a typed programming language. That is impossible with a pure CLI
					approach.
				</p>
				<p>
					An agent can read just the SDK's public interface — the types, structs, traits, and method
					signatures — and understand how to use the deployer in a few minutes. This is the same
					self-describing quality that made GraphQL attractive, but expressed through Rust's type
					system, with the additional benefit of compiler support.
				</p>

				<p>The full picture for an agent starting from scratch:</p>

				<table>
					<thead>
						<tr>
							<th>Artefact</th>
							<th>What it gives the agent</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>JSON CLI docs</td>
							<td>Complete command reference, zero exploration needed</td>
						</tr>
						<tr>
							<td>JSON schema for the config</td>
							<td>Exact structure and valid values for the <code>create</code> input file</td>
						</tr>
						<tr>
							<td>Questionnaire skill</td>
							<td>Guidance on what to ask the user to produce a valid config</td>
						</tr>
						<tr>
							<td>Rust SDK + config builder</td>
							<td>Typed programmatic control, enabling integrations across systems</td>
						</tr>
					</tbody>
				</table>

				<h3 id="structured-errors">4.6 — Typed, machine-readable errors</h3>
				<p>
					The deployer's error output for agents goes beyond a message and an exit code. Errors are
					typed — both in the Rust SDK (as enum variants like <code>EnvironmentAlreadyExists</code>
					and <code>EnvironmentNotFound</code>) and in the CLI's JSON output mode, where each error
					carries a machine-readable code alongside the human-readable explanation.
				</p>
				<p>
					This matters because an agent that receives a typed error can make an informed decision
					about how to recover — retry with different parameters, report a specific problem to the
					user, or branch to an alternative path — without having to parse free-form text and guess
					at the cause. Structured errors are a first-class part of the agent-friendly interface,
					not an afterthought.
				</p>

				<h3 id="deferred-features">4.7 — Deferred for post-v1</h3>
				<p>Some ideas were recognised as valuable but deferred to keep v1 scope manageable:</p>
				<ul>
					<li>
						<strong>MCP server</strong>: expose the deployer's capabilities as MCP tools, letting
						any LLM interact with it natively without needing a CLI or SDK wrapper
					</li>
					<li>
						<strong>Dry-run mode</strong>: already partially addressed by the existing
						<code>validate</code> and <code>render</code> commands
					</li>
				</ul>

				<h2 id="part-5-industry-validation">Part 5 — Others reached the same conclusions</h2>
				<p>
					While we were working through these ideas, other teams were independently arriving at the
					same place.
				</p>
				<p>
					In February 2026, Tinybird published a post titled
					<a href="https://www.tinybird.co/blog/deprecating-tinybird-code">
						"We built our own AI coding agent. Here's why we're sunsetting it."
					</a>
					The story is striking: they built a full-featured custom agent for their CLI — capable of schema
					design, query optimisation, testing, and deployment — and then deprecated it.
				</p>
				<p>Their conclusion:</p>
				<blockquote>
					"We shouldn't be building an agent. We should be making Tinybird work with every agent."
				</blockquote>
				<p>And their final principle:</p>
				<blockquote>
					"Don't build custom agents. Make your platform work with all of them."
				</blockquote>
				<p>What they found actually works — and it maps almost exactly to our list:</p>
				<ul>
					<li>A well-designed CLI with clear, machine-parseable error messages</li>
					<li>A typed SDK with discoverable methods</li>
					<li>Skills that encode domain expertise and load on demand</li>
					<li>Documentation that is both human-readable and machine-parseable</li>
					<li>An MCP server to expose platform capabilities to any LLM</li>
				</ul>
				<p>
					The Next.js team
					<a href="https://nextjs.org/blog/agentic-future">arrived at the same place</a>
					when they sunset their in-browser agent: treat agents as first-class users of your platform
					and meet them where they are.
				</p>
				<p>
					The convergence matters. Multiple teams, working independently, went through the phase of
					building custom agent wrappers — and all concluded the same thing: invest in good
					primitives, not custom agents. Different paths, different lessons learned along the way —
					teams who built and sunset their own agents likely learned things we did not. But seeing
					the same conclusions validated from multiple directions independently is what gives those
					conclusions weight.
				</p>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					Two stories, one insight: <strong
						>building with agents teaches you how to build for them.</strong
					>
				</p>
				<p>
					Using GitHub Copilot agents to build the deployer forced us to confront what it actually
					means for software to be agent-friendly. The friction we experienced as developers — the
					context window problems, the need for focused instructions, the struggle with opaque
					errors — was exactly the friction our users' agents would experience when trying to use
					the tool.
				</p>
				<p>
					The primitives that matter are not exotic. They are the same things that make tools good
					for humans, with a few additions specific to how agents work: skills for focused context,
					machine-readable schemas and documentation, structured output, typed SDKs that encode
					workflows, and errors that explain rather than confuse.
				</p>
				<p>The underlying principle is simple:</p>
				<blockquote>
					Agents are not a special case. They are users who can program. Design your tools
					accordingly.
				</blockquote>
				<p>
					Next steps for the deployer: an MCP server, expanded SDK coverage, and eval frameworks to
					measure how well agents perform end-to-end deployment tasks. If you are interested in
					contributing or following the progress, the roadmap lives at
					<a href="https://github.com/torrust/torrust-tracker-deployer/issues/1">
						torrust/torrust-tracker-deployer
					</a>.
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

	h3 {
		font-size: 1.5rem;
		font-weight: bold;
		padding-top: 1.25rem;
	}

	h4 {
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
		color: var(--color-link);
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

	blockquote {
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

	pre {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1rem 0;

		code {
			background: none;
			padding: 0;
		}
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
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
	.content-preview > h4 {
		margin-bottom: 1rem;
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
