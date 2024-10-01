<script lang="ts">
	import TableOfContents from '$lib/components/atoms/TableOfContents.svelte'; // Adjust the path if needed

	// Array of section objects with display names and IDs
	let sections = [
		{ name: 'Why Contribute to our Project?', id: 'whyContribute' },
		{ name: 'How to contribute?', id: 'howContribute' },
		{ name: 'Torrent Knowledge Base', id: 'knowledgeBase' },
		{ name: 'Resources', id: 'resources' }
	];

	let activeSection = '';
</script>

<div>
	<h1>Community</h1>
	<div class="layout">
		<div>
			<TableOfContents {sections} {activeSection} />
		</div>
		<div class="content">
			<h2 id="whyContribute">Why Contribute to our Project?</h2>

			<p>
				At Torrust, we aim to build a decentralized and transparent ecosystem for BitTorrent
				technology. By contributing to our project, you're joining a passionate community of
				developers and users who value open-source software, innovation, and collaboration. Whether
				you're a Rust enthusiast, a BitTorrent advocate, or simply looking to improve your skills,
				your contributions will help shape the future of this project and the broader file-sharing
				infrastructure.
			</p>

			<ul class="list">
				<li>Modern development with Rust</li>
				<li>Comprehensive and detailed documentation</li>
				<li>Commitment to high-quality code</li>
				<li>Extensive test coverage</li>
				<li>Long-term project sustainability</li>
				<li>Open to sponsorship opportunities</li>
			</ul>

			<h3 id="embraceRust">Embrace Rust: a language of choice</h3>

			<p>
				Why Rust? We’ve chosen Rust for its unmatched safety, performance, and reliability. If you
				share a passion for writing efficient, modern code, you’ll feel right at home here. Our
				project provides a great platform for Rust developers to innovate and push boundaries.
			</p>

			<h3 id="codeQuality">Prioritizing Code Quality</h3>

			<p>
				We hold ourselves to the highest coding standards. Every contribution undergoes a thorough
				review process to ensure robustness and maintainability. Rather than rushing new features,
				we focus on refining existing functionality to ensure long-term stability.
			</p>

			<p>
				With a rigorous suite of automated tests, we ensure that our software remains stable and
				regression-free. Your contributions will help maintain this legacy of quality.
			</p>

			<h3 id="welcomingCommunity">A welcoming community for newcomers</h3>

			<p>
				We pride ourselves on being inclusive and supportive, especially for those new to
				open-source contributions. You’ll find a wealth of documentation, clear explanations of
				concepts, and a community ready to assist you as you get started.
			</p>

			<p>
				Whether you’re looking to improve your Rust skills, learn more about open-source
				development, or share your expertise, we’re here to help you grow.
			</p>

			<h3 id="influenceDirection">Influence the Project’s Future</h3>

			<p>
				As an open-source project, your feedback, contributions, and ideas are crucial. Whether
				you're interested in improving our tracker or enhancing the index, you have the opportunity
				to directly shape the project’s roadmap.
			</p>

			<p>
				When you contribute, you become a key part of the Torrust community. Together, we’re
				building software that will leave a lasting impact.
			</p>

			<h3 id="joinUs">Join us today</h3>

			<p>
				By contributing to our project, you're not just writing code; you're joining a movement
				dedicated to creating something truly outstanding with Rust. Together, we can build software
				that's not only powerful and efficient but also accessible and enjoyable for everyone in the
				open-source community.
			</p>

			<h2 id="howContribute">How to contribute?</h2>

			<p>
				There are many ways to get involved with Torrust. Whether you're a seasoned developer or a
				newcomer, your contributions are welcome. Here are some ways you can contribute:
			</p>

			<ul class="list">
				<li>Submit bug reports</li>
				<li>Request new features</li>
				<li>
					Contribute to the code. Feel free to ask how if you don't find issues suitable for you
				</li>
				<li>Review and improve documentation</li>
				<li>Provide financial support through sponsorship</li>
				<li>Engage in community discussions</li>
			</ul>

			<h2 id="knowledgeBase">Torrent Knowledge Base</h2>

			<h3 id="whatAreTorrents">What Are Torrents?</h3>

			<p>
				A <strong>torrent</strong> is a small file that contains metadata about the files and folders
				to be shared and information about the network of computers that share these files. It's used
				with BitTorrent protocol, which enables fast and efficient distribution of large files over the
				internet by allowing users to connect directly to each other to download and upload portions
				of the file simultaneously. This decentralized method of sharing files reduces the load on any
				single server and can lead to faster download speeds for the users involved. Torrents themselves
				do not contain the actual content being shared, only the information needed to find and download
				the content from peers in the BitTorrent network.
			</p>

			<h3 id="whatIsTracker">What Is a Tracker?</h3>

			<p>
				A <strong>BitTorrent tracker</strong> is a server that facilitates communication between peers
				using the BitTorrent protocol. When you open a torrent file with a BitTorrent client, the tracker
				is contacted to help find other users who are sharing the same files. It does not store or distribute
				the content itself but keeps track of the IP addresses of the peers in the swarm (the group of
				computers involved in sharing a particular file). The tracker responds to requests from clients
				with a list of peers, allowing them to connect directly to each other to start downloading and
				uploading pieces of the file. Essentially, the tracker acts as a central hub that enables peers
				to find each other, significantly improving the efficiency and speed of file distribution.
			</p>

			<h3 id="whatIsTorrentIndex">What Is a Torrent Index?</h3>

			<p>
				A <strong>BitTorrent index</strong> site is a website that lists torrent files for download.
				These sites serve as search engines or directories for finding specific files or content within
				the BitTorrent network. Users can search for and download torrent files based on various categories
				such as movies, music, software, games, and more. Each torrent file listed on an index site contains
				metadata about the content it represents, such as the file name, size, and the address of the
				tracker managing the distribution of the content.
			</p>

			<p>
				BitTorrent index sites do not host the content files themselves; instead, they provide the
				torrent files which users can then open with their BitTorrent clients to download the actual
				content from other peers in the network. These sites play a crucial role in the BitTorrent
				ecosystem by making it easier for users to find and access content distributed via
				BitTorrent.
			</p>

			<h3 id="listOfProjects">List of projects using BitTorrent</h3>

			<ul>
				<li>WebTorrent:</li>
				<ul>
					<li>
						<a href="https://webtorrent.io/faq">https://webtorrent.io/faq</a>
					</li>
				</ul>
				<li>Others:</li>
				<ul>
					<li>
						<a href="https://github.com/urbanguacamole/torrent-paradise">torrent-paradise</a>
					</li>
					<li>
						<a href="https://academictorrents.com/">https://academictorrents.com/</a>
					</li>
					<li>
						<a href="https://github.com/bigscience-workshop/petals"
							>https://github.com/bigscience-workshop/petals</a
						>
					</li>
				</ul>
			</ul>

			<h2 id="resources">Resources</h2>

			<ul>
				<li>Discussions</li>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions">Tracker</a>
						<a href="https://github.com/torrust/torrust-index/discussions">Index</a>
						<a href="https://github.com/torrust/torrust-index-gui/discussions">Index GUI</a>
					</li>
				</ul>
				<li>Documentation</li>
				<ul>
					<li>
						<a href="https://docs.rs/torrust-tracker/latest/torrust_tracker/">Tracker</a>
						<a href="https://docs.rs/torrust-index/latest/torrust_tracker/">Index</a>
						<a href="https://github.com/torrust/torrust-index-gui/tree/develop/docs">Index GUI</a>
					</li>
				</ul>
			</ul>
		</div>
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	h1,
	.layout {
		padding-inline: 1.5rem;
	}

	.layout {
		margin-top: 4rem;
	}

	.content {
		margin-top: 2rem;
	}

	h1 {
		padding-top: 1rem;
		font-size: 2.25rem;
	}

	h2 {
		padding-top: 0.5rem;
		font-size: 1.8rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem; /* Add top padding to all h2 elements except the first one */
	}

	h3 {
		padding-top: 2rem;
		font-size: 1.3rem;
	}

	p {
		font-size: 1rem;
		padding-top: 1.5rem;
		color: rgba(245, 245, 245, 0.8);
	}

	@include for-desktop-up {
		h1,
		.layout {
			display: flex;
			padding-inline: 9.25rem;
			gap: 2rem;
		}

		.content {
			margin-top: 0rem;
		}

		h1 {
			padding-top: 8rem;
		}
	}
</style>
