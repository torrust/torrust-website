<script>
	import TableOfContents from '$lib/components/atoms/TableOfContents.svelte'; // Adjust the path if needed
	import Table from '$lib/components/atoms/Table.svelte';

	// Array of section objects with display names and IDs
	let sections = [
		{ name: 'Why BitTorrent?', id: 'bitTorrent' },
		{ name: 'Why Torrust', id: 'whyTorrust' },
		{ name: 'The Team', id: 'team' },
		{ name: 'Contributors', id: 'contributors' },
		{ name: 'Sponsors', id: 'sponsors' }
	];

	let activeSection = '';

	const tableHeadings = [
		{ displayName: 'Feature', fieldName: 'feature' },
		{ displayName: 'BitTorrent', fieldName: 'bittorrent' },
		{ displayName: 'IPFS', fieldName: 'ipfs' }
	];

	const tableData = [
		{
			feature: 'File Identification',
			bittorrent: 'By location (via torrents and trackers)',
			ipfs: 'By content (using cryptographic hashes)'
		},
		{
			feature: 'File Availability',
			bittorrent: 'Depends on seeders',
			ipfs: 'Persisted via pinning or multiple nodes'
		},
		{
			feature: 'Architecture',
			bittorrent: 'Peer-to-peer, maximally decentralized	',
			ipfs: 'Peer-to-peer, with global content addressing'
		},
		{
			feature: 'File Hosting',
			bittorrent: 'Temporary (as long as seeders exist)',
			ipfs: 'Permanent (with pinning services)'
		},
		{
			feature: 'Resource Use',
			bittorrent: 'Lightweight',
			ipfs: 'More resource-intensive'
		},
		{
			feature: 'Use of DHT',
			bittorrent: 'For finding peers',
			ipfs: 'For finding content providers'
		},
		{
			feature: 'Security',
			bittorrent: 'Less focused on content validation',
			ipfs: 'Cryptographic validation of all content'
		}
	];
</script>

<div>
	<h1>About</h1>
	<div class="layout">
		<div class="toc">
			<TableOfContents {sections} {activeSection} />
		</div>
		<div class="content">
			<h2 id="bitTorrent">Why BitTorrent?</h2>

			<p>
				In a world driven by digital content, the BitTorrent protocol remains a cornerstone for
				decentralized, efficient file sharing. While newer technologies such as IPFS and cloud
				storage solutions have emerged, BitTorrent continues to serve a critical role in enabling
				large-scale data distribution with unparalleled efficiency and scalability.
			</p>

			<h3 id="bitTorrentProtocol">Why does the BitTorrent protocol still matter?</h3>

			<p>
				Despite the rise of centralized alternatives and new distributed systems, the BitTorrent
				protocol remains a key player in the digital landscape. Its decentralized nature ensures
				that users maintain control over data distribution, making it a critical tool in today's
				interconnected world. The focus on distributing content without over-reliance on a single
				server continues to make BitTorrent relevant for various use cases, from media sharing to
				large-scale software updates.
			</p>

			<p>
				In the rapidly evolving landscape of digital technology, the BitTorrent protocol remains a
				cornerstone for distributed file sharing. Despite the emergence of newer technologies like
				the
				<a href="https://ipfs.tech/">InterPlanetary File System</a>
				(IPFS) and centralized cloud storage solutions such as Dropbox, Google Drive, and Amazon S3,
				BitTorrent continues to hold significant relevance. Here's why maintaining and enhancing BitTorrent
				is not just worthwhile but essential.
			</p>

			<p>
				<img src="images/net.jpeg" alt="A network with interconnected wires" />
			</p>

			<h3 id="efficiency">Efficiency and scalability</h3>

			<p>
				BitTorrent excels in efficiently distributing large files across the internet. By allowing
				users to download and upload pieces of files simultaneously from multiple sources, it
				minimizes server load and avoids bottlenecks. This peer-to-peer approach scales naturally
				with the number of users, making it exceptionally effective for sharing large datasets,
				media files, and software distributions.
			</p>

			<h3 id="currentUses">Current use cases</h3>

			<p>
				<strong>Media Distribution:</strong> Independent creators and open-source projects often use
				BitTorrent to distribute content without incurring high bandwidth costs.
			</p>

			<p>
				<strong>Software Updates:</strong> Some companies distribute updates and patches for their software
				via BitTorrent to reduce the strain on their servers.
			</p>

			<p>
				<strong>Data Archiving:</strong> Academic and research institutions use BitTorrent for archiving
				and sharing large datasets and publications.
			</p>

			<h3 id="futureUses">Future use cases</h3>

			<p>
				<strong>Decentralized Internet:</strong> BitTorrent can play a crucial role in the development
				of a decentralized web, where content is distributed and accessed without centralized control.
			</p>

			<p>
				<strong>Blockchain and Cryptocurrency:</strong> Integrating BitTorrent with blockchain technology
				could lead to innovative content distribution models, rewarding content creators and sharers
				directly.
			</p>

			<p>
				<strong>Emergency Communications:</strong> In scenarios where traditional communication infrastructures
				fail, BitTorrent can facilitate the sharing of information and emergency updates.
			</p>

			<h3 id="btIpfs">BT vs. IPFS</h3>

			<p>
				BitTorrent and IPFS are both decentralized file-sharing technologies, but they differ
				fundamentally in how they operate.
			</p>

			<p>
				The key differences are:: 1. <strong>Content Addressing</strong>: BitTorrent identifies
				files by their location on specific peers, while IPFS uses content-addressing, meaning files
				are found by their unique cryptographic hash, regardless of their location. 2.
				<strong>Architecture</strong>: BitTorrent focuses on maximizing decentralization with
				seeders and leechers. IPFS builds a global namespace where files are persistently available
				as long as they are "pinned." 3. <strong>File Availability</strong>: In BitTorrent, content
				is only available as long as seeders are present. In contrast, IPFS ensures availability by
				storing content through pinning services and distributed nodes. 4.
				<strong>Protocol Overhead</strong>: BitTorrent is more lightweight in resource consumption
				compared to IPFS, which can be more intensive due to its routing mechanisms and use of
				Distributed Hash Tables (DHT).
			</p>
			<p>Here’s a comparison table for key features:</p>

			<Table tableHeading={tableHeadings} {tableData} />

			<h3 id="btCs">BT vs. centralized solutions</h3>

			<p>
				Centralized cloud storage services like Dropbox, Google Drive, and Amazon S3 offer
				convenience and integration with various applications. However, they rely on central
				servers, which can become points of failure or targets for censorship. BitTorrent's
				decentralized nature inherently protects against these issues, offering resilience and
				freedom from control by any single entity.
			</p>

			<h3 id="conclusion">Conclusion</h3>

			<p>
				The continued relevance of BitTorrent lies in its unparalleled efficiency, scalability, and
				its foundation for a more decentralized internet. While newer technologies like IPFS offer
				compelling advancements, BitTorrent's unique strengths in supporting dynamic content and its
				established infrastructure make it irreplaceable. As digital content continues to grow in
				size and volume, the importance of efficient, decentralized distribution networks becomes
				ever more critical. Investing in the maintenance and improvement of BitTorrent is not just
				about preserving a technology; it's about sustaining a vision for an open, scalable, and
				resilient internet.
			</p>

			<h2 id="whyTorrust">Why Torrust</h2>

			<p>
				Developing new tools for BitTorrent in modern programming languages like Rust, along with
				more contemporary interfaces, is essential for several reasons. These developments not only
				align with current technological trends but also address evolving user needs and security
				concerns. Here are some key points illustrating the necessity of these advancements:
			</p>

			<h3 id="performanceEfficiency">Performance & Efficiency</h3>

			<ul>
				<li>
					<strong>High Performance:</strong> Rust offers exceptional speed and efficiency, which can
					significantly improve the performance of BitTorrent tools. Its focus on concurrency and memory
					safety allows for the development of high-speed data transmission tools without the common
					pitfalls of memory leaks and crashes.
				</li>
				<li>
					<strong>Resource Optimization:</strong> Modern devices vary widely in their capabilities. Developing
					new tools in Rust can help optimize resource use, making BitTorrent more accessible on a wider
					range of devices, from high-end servers to low-powered IoT devices.
				</li>
			</ul>

			<h3 id="securityReliability">Security & Reliability</h3>

			<ul>
				<li>
					<strong>Memory Safety:</strong> Rust's emphasis on memory safety without a garbage collector
					minimizes common security vulnerabilities found in other languages, such as buffer overflows
					and dangling pointers. This is crucial for peer-to-peer networks that are inherently exposed
					to data from untrusted sources.
				</li>
				<li>
					<strong>Dependability:</strong> By leveraging Rust's type system and ownership model, developers
					can build more reliable applications that are less prone to crashes and unexpected behavior,
					enhancing the user experience.
				</li>
			</ul>

			<h3 id="userExperience">User Experience & Accessibility</h3>

			<ul>
				<li>
					<strong>Modern Interfaces:</strong> Updating BitTorrent clients with modern, user-friendly
					interfaces can make the technology more accessible to a broader audience, encouraging adoption.
					Simplifying the user experience without compromising on advanced features appeals to both novice
					and experienced users.
				</li>
				<li>
					<strong>Cross-Platform Compatibility:</strong>Developing with modern frameworks and
					languages supports better cross-platform compatibility, ensuring a consistent and
					functional experience across various operating systems and devices.
				</li>
			</ul>

			<h3 id="futureProofing">Future-Proofing & Innovation</h3>

			<ul>
				<li>
					<strong>Adapting to Technological Advances:</strong> The digital landscape is constantly evolving.
					Developing new tools with modern languages ensures compatibility with the latest technologies
					and standards, making BitTorrent more adaptable and future-proof.
				</li>
				<li>
					<strong>Encouraging Innovation:</strong>By embracing modern programming paradigms and
					languages, the BitTorrent ecosystem can stimulate innovation, leading to the development
					of new features, improved efficiency, and potentially new use cases for distributed file
					sharing.
				</li>
			</ul>

			<h3 id="integration">Integration & Interoperability</h3>

			<ul>
				<li>
					<strong>Blockchain & Beyond:</strong>The integration of BitTorrent with emerging
					technologies like blockchain and decentralized finance (DeFi) requires a modern approach
					to ensure seamless interoperability and to unlock new functionalities and business models.
				</li>
				<li>
					<strong>Ecosystem Synergy:</strong>Developing tools in languages like Rust promotes
					synergy within the ecosystem, as Rust is increasingly used in networked applications,
					cryptocurrency platforms, and other areas relevant to BitTorrent's growth and integration.
				</li>
			</ul>

			<p>
				In conclusion, the development of new BitTorrent tools in Rust and the focus on modern
				interfaces is not merely a pursuit of technological modernization. It's a strategic move to
				enhance performance, security, user experience, and future readiness, ensuring that
				BitTorrent remains a vital part of the internet's infrastructure.
			</p>

			<p>
				You can learn more by reading our blog article <a
					href="torrust-enhancing-the-bittorrent-ecosystem"
					>Torrust - Enhancing the BitTorrent Ecosystem</a
				>.
			</p>

			<h2 id="team">The Team</h2>

			<p>
				<a target="_blank" href="https://github.com/torrust">Torrust</a>
				is an open-source initiative founded by
				<a href="https://github.com/mickvandijke">@mickvandijke</a>
				in 2021. It began by forking
				<a target="_blank" href="https://github.com/naim94a">@naim94a</a>’s UDP tracker project, and
				including some packages from <a href="https://github.com/greatest-ape">@greatest-ape</a>’s
				<a target="_blank" href="https://github.com/greatest-ape/aquatic">Aquatic</a>
				repo. Since 2012, <a target="_blank" href="https://github.com/naim94a">@naim94a</a>
				had been advancing the tracker. In August 2022,
				<a target="_blank" href="https://nautilus-cyberneering.de"> Nautilus Cyberneering</a> joined
				the project, attracted by the community's interest and its alignment with their goals.
			</p>

			<p>
				Over the past two years, Torrust has made considerable strides in becoming a leading
				solution within the BitTorrent open-source community. Using cutting-edge languages and
				tools, we've built a modern, reliable tracker and index. With version 3.0.0, we are setting
				the stage for future web3 projects that require decentralized file-sharing.
			</p>

			<p>Beyond product development, our efforts include:</p>
			<ul>
				<li>Improving BitTorrent documentation</li>
				<li>Supporting Rust-based BitTorrent projects</li>
				<li>Participating in protocol discussions</li>
			</ul>

			and contributing articles to further the ecosystem. In addition to building great software,
			we’ve focused on fostering a welcoming environment for contributors. Whether it’s a small typo
			fix or a significant pull request, we ensure a smooth and positive experience. We take pride
			in our extensive documentation and prompt feedback, making it easy for anyone to get involved.

			<p>
				Many people have contributed in the past regularly. In the last months this have been the
				core development team.
			</p>
			<ul>
				<li><a href="https://github.com/da2ce7">@da2ce7</a></li>
				<li><a href="https://github.com/cgbosse">@cgbosse</a></li>
				<li><a href="https://github.com/grmbyrn">@grmbyrn</a></li>
				<li><a href="https://github.com/mario-nt">@mario-nt</a></li>
				<li><a href="https://github.com/josecelano">@josecelano</a></li>
			</ul>

			<h2 id="contributors">Contributors</h2>

			<p>We extend our gratitude to:</p>

			<p></p>
			<ul>
				<li><a target="_blank" href="https://github.com/naim94a">@naim94a</a></li>
				<li><a href="https://github.com/MCM-Mike">@MCM-Mike</a></li>
				<li><a href="https://github.com/mickvandijke">@mickvandijke</a></li>
				<li><a href="https://github.com/greatest-ape">@greatest-ape</a></li>
				<li><a href="https://github.com/Power2All">@Power2All</a></li>
				<li><a href="https://github.com/hungfnt">@hungfnt</a></li>
				<li><a href="https://github.com/alexohneander">@alexohneander</a></li>
				<li><a href="https://github.com/Aimless321">@Aimless321</a></li>
				<li><a href="https://github.com/Aimless321">@GGLinnk</a></li>
				<li><a href="https://github.com/makefu">@makefu</a></li>
				<li><a href="https://github.com/pcarles">@pcarles</a></li>
				<li><a href="https://github.com/postmeback">@postmeback</a></li>
				<li><a href="https://github.com/ldpr">@ldpr</a></li>
				<li><a href="https://github.com/ty5e3a45">@ty5e3a45</a></li>
			</ul>

			and all contributors for their invaluable input—whether in coding, opening issues, submitting
			pull requests, or improving documentation.

			<h2 id="sponsors">Sponsors</h2>

			<p>
				<a target="_blank" href="https://nautilus-cyberneering.de"> Nautilus Cyberneering</a> is dedicated
				to creating new Open Source Ecosystems. They define Open Source Ecosystems as vibrant communities
				of users and creators who collaboratively develop open source software that is secure, respectful,
				and adds value for future generations. This approach is what they term Cyberneering. With a focus
				on software and hardware development within these ecosystems, their aim is to produce technology
				that adheres to these principles.
			</p>

			<p>
				Their activities encompass developing open source software with an emphasis on security,
				community engagement, and long-term value. This includes a commitment to software that
				respects user privacy and is designed with future generations in mind. Nautilus
				Cyberneering's approach combines innovation in the cybernetic field with open source
				philosophy, fostering environments where collaborative development can thrive.
			</p>
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

	h2:not(:first-of-type) {
		padding-top: 1.5rem; /* Add top padding to all h2 elements except the first one */
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
			gap: 2rem;
			padding-inline: 9.25rem;
		}

		.content {
			margin-top: 0rem;
		}

		h1 {
			padding-top: 8rem;
		}
	}
</style>
