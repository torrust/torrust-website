<script lang="ts">
	let { data } = $props();
	let { currentPost, allPosts } = data;
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
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
				<p>Hello Bittorrent-in-Rust Community!</p>
				<p>
					At Torrust, we&#39;re committed to enhancing the BitTorrent ecosystem within the Rust
					community. Today, we&#39;re excited to introduce a Bencode to JSON converter:
				</p>
				<p><a href="https://github.com/torrust/bencode2json">bencode2json</a></p>
				<p>
					It&#39;s a new crate designed to simplify the conversion of Bencode data into JSON format.
					This tool not only supports our Tracker but also aims to benefit the wider Rust community
					involved in BitTorrent projects.
				</p>
				<p>Here’s a quick example to show how straightforward it is to use:</p>

				<CodeBlock lang="bash" code={`echo "4:spam" | cargo run "spam"`} />

				<p>
					For non UTF-8 Bencoded strings, we represent them as byte sequences enclosed in
					HTML-styled tags <code>&lt;hex&gt;...&lt;/hex&gt;</code>;
				</p>

				<CodeBlock
					lang="bash"
					code={`printf "d3:bar2:\xFF\xFEe" | cargo run {"bar":"<hex>fffe</hex>"}`}
				/>

				<h2 id="why-it-is-useful">Why It Is Useful</h2>
				<p>
					Bencode is the encoding format used by BitTorrent, while JSON is a widely-used data
					interchange format. Converting Bencode to JSON can facilitate easier data manipulation,
					debugging, and integration with modern web applications. Here are a few reasons why <code
						>bencode2json</code
					> is valuable:
				</p>
				<ul>
					<li>
						<strong>Interoperability</strong>: JSON is supported by most programming languages and
						libraries, making it easier to work with Bencoded data in diverse environments.
					</li>
					<li>
						<strong>Readability</strong>: JSON is often easier to read and understand compared to
						Bencode, especially for developers unfamiliar with the latter.
					</li>
					<li>
						<strong>Integration</strong>: Many web services and APIs utilize JSON, so having Bencode
						data readily available in this format can simplify integrations and data exchanges.
					</li>
				</ul>
				<h2 id="how-you-can-use-it">How You Can Use It</h2>
				<p>
					Using <code>bencode2json</code> is straightforward. Here&#39;s a quick guide on how to get
					started:
				</p>
				<h3 id="installation">Installation</h3>
				<p>Add the crate to your <code>Cargo.toml</code>:</p>

				<CodeBlock lang="toml" code={`[dependencies] bencode2json = "0.1.0"`} />

				<h3 id="basic-usage">Basic Usage</h3>
				<p>Here&#39;s a simple example of how to convert Bencode to JSON:</p>

				<CodeBlock
					lang="rust"
					code={`use bencode2json::try_bencode_to_json;\n
fn main() { 
  use torrust_bencode2json::{try_bencode_to_json};\n
  let result = try_bencode_to_json(b"d4:spam4:eggse").unwrap();\n
  assert_eq!(result, r#"{"spam":"eggs"}"#);
}`}
				/>

				<h3>Advance Usage</h3>
				<p>
					<code>bencode2json</code> supports any kind of input and output that implement Read or Write
					traits, meaning you can read from stdin and write to stdout or from/to files.
				</p>

				<CodeBlock
					lang="rust"
					code={`use bencode2json::parsers::{BencodeParser};\n
let mut output = String::new();\n
let mut parser = BencodeParser::new(&b"4:spam"[..]);\n
parser
  .write_str(&mut output)
  .expect("Bencode to JSON conversion failed");\n
println!("{output}"); // It prints the JSON string: "spam"`}
				/>

				<h3 id="using-the-console-app">Using the Console App</h3>
				<p>The package provides a console command too. You can install it with:</p>

				<CodeBlock lang="bash" code={`cargo install torrust-bencode2json`} />

				<p>And execute it to convert a torrent file into JSON.</p>

				<CodeBlock lang="bash" code={`cat ./sample.torrent | cargo run | jq`} />

				<p>
					<a href="https://jqlang.github.io/jq/">jq</a> is jq is a lightweight and flexible command-line
					JSON processor. Make sure you have it installed.
				</p>
				<h3 id="performance">Performance</h3>
				<p>
					The converter only generates temporary in-memory representations for strings, ensuring
					memory consumption is proportional to the size of the largest Bencoded string. This design
					makes bencode2json efficient for both small and large datasets.
				</p>
				<h3 id="how-you-can-contribute">How You Can Contribute</h3>
				<p>
					We&#39;re excited to see how the community can help improve bencode2json. Here are some
					ways you can get involved:
				</p>
				<ul>
					<li>
						Feature Requests: If you have ideas for features or improvements, please open an issue
						on the GitHub repository.
					</li>
					<li>
						Code Contributions: Help us build an opposite converter, JSON to Bencode, by submitting
						a pull request. This could greatly enhance the functionality of the crate and provide a
						complete solution for working with these data formats.
					</li>
					<li>
						Documentation: Contributing to the documentation is always valuable. Clear examples and
						explanations help other users understand and utilize the crate effectively.
					</li>
					<li>
						Feedback: Share your experience using bencode2json. Your feedback will help us make it
						even better!
					</li>
				</ul>
				<h2 id="conclusion">Conclusion</h2>
				<p>
					<code>bencode2json</code> is a step forward in bridging the gap between Bencode and JSON within
					the BitTorrent ecosystem in Rust. We encourage everyone to try it out, contribute, and join
					us in fostering a collaborative environment for Rust developers. Happy coding!
				</p>
				<p>
					Check out the <a href="https://github.com/torrust/bencode2json"
						>bencode2json GitHub repository</a
					> to get started and contribute to the project. Let&#39;s make working with BitTorrent in Rust
					easier together!
				</p>
				<h2 id="acknowledgments">Acknowledgments</h2>
				<p>
					This implementation is basically a port to Rust from <a
						href="https://gist.github.com/camilleoudot/840929699392b3d25afbec25d850c94a"
						>https://gist.github.com/camilleoudot/840929699392b3d25afbec25d850c94a</a
					> with some changes like:
				</p>
				<ul>
					<li>It does not use magic numbers (explicit enum for states).</li>
					<li>It prints non UTF-8 string in hexadecimal.</li>
				</ul>
				<p>
					The idea of using hexadecimal format <code>&lt;hex&gt;ff&lt;/hex&gt;</code> for non UTF-8
					string came from the bencode online repo by
					<a href="https://github.com/Chocobo1">@Chocobo1</a>.
				</p>
				<p>
					We also want to thank <a href="https://github.com/da2ce7">@da2ce7</a> for his feedback and
					review that has improved this project significantly.
				</p>
				<p>
					If you have any questions or issues regarding this post, please <a
						href="https://github.com/torrust/bencode2json/issues/new">open an issue</a
					>.
				</p>
				<p>We very welcome any contributions to the project!</p>
			</div>
		</div></PagesWrapper
	>
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
		color: rgba(255, 49, 0, 1);
	}

	.content-preview > p,
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
			align-items: flex-start; // Ensures items align properly
			flex-wrap: wrap;
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
