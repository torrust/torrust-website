<script>
	import TableOfContents from '$lib/components/atoms/TableOfContents.svelte'; // Adjust the path if needed

	// Array of section objects with display names and IDs
	let sections = [
		{ name: 'Why BitTorrent?', id: 'bitTorrent' },
		{ name: 'Why does the BitTorrent protocol still matter?', id: 'bitTorrentProtocol' },
		{ name: 'Efficiency and scalability', id: 'efficiency' },
		{ name: 'Current use cases', id: 'currentUses' },
		{ name: 'Future use cases', id: 'futureUses' },
		{ name: 'BT vs. IPFS', id: 'btIpfs' },
		{ name: 'BT vs. centralized solutions', id: 'btCs' },
		{ name: 'Conclusion', id: 'conclusion' },
		{ name: 'Why Torrust', id: 'whyTorrust' },
		{ name: 'Performance & Efficiency', id: 'performanceEfficiency' },
		{ name: 'Security & Reliability', id: 'securityReliability' },
		{ name: 'User Experience & Accessibility', id: 'userExperience' },
		{ name: 'Future-Proofing & Innovation', id: 'futureProofing' },
		{ name: 'Integration & Interoperability', id: 'integration' },
		{ name: 'The Team', id: 'team' },
		{ name: 'Collaborators', id: 'collaborators' },
		{ name: 'Sponsors', id: 'sponsors' }
	];

	let activeSection = '';
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

			<h2 id="bitTorrentProtocol">Why does the BitTorrent protocol still matter?</h2>

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
				the InterPlanetary File System (IPFS) and centralized cloud storage solutions such as
				Dropbox, Google Drive, and Amazon S3, BitTorrent continues to hold significant relevance.
				Here's why maintaining and enhancing BitTorrent is not just worthwhile but essential.
			</p>
			<h2 id="efficiency">Efficiency and scalability</h2>

			<p>
				BitTorrent excels in efficiently distributing large files across the internet. By allowing
				users to download and upload pieces of files simultaneously from multiple sources, it
				minimizes server load and avoids bottlenecks. This peer-to-peer approach scales naturally
				with the number of users, making it exceptionally effective for sharing large datasets,
				media files, and software distributions.
			</p>
			<h2 id="currentUses">Current use cases</h2>

			<p>
				Media Distribution: Independent creators and open-source projects often use BitTorrent to
				distribute content without incurring high bandwidth costs.
			</p>
			<p>
				Software Updates: Some companies distribute updates and patches for their software via
				BitTorrent to reduce the strain on their servers.
			</p>
			<p>
				Data Archiving: Academic and research institutions use BitTorrent for archiving and sharing
				large datasets and publications.
			</p>
			<h2 id="futureUses">Future use cases</h2>

			<p>
				Decentralized Internet: BitTorrent can play a crucial role in the development of a
				decentralized web, where content is distributed and accessed without centralized control.
			</p>
			<p>
				Blockchain and Cryptocurrency: Integrating BitTorrent with blockchain technology couldlead
				to innovative content distribution models, rewarding content creators and sharers directly.
			</p>
			<p>
				Emergency Communications: In scenarios where traditional communication infrastructures fail,
				BitTorrent can facilitate the sharing of information and emergency updates.
			</p>
			<h2 id="btIpfs">BT vs. IPFS</h2>

			<p>
				While both BitTorrent and IPFS facilitate decentralized file sharing, they operate
				differently. IPFS addresses content by hashes, ensuring that users access the exact content
				regardless of its location. This approach is ideal for immutable content distribution but
				might not be as efficient as BitTorrent for mutable or dynamically updated content.
			</p>
			<h2 id="btCs">BT vs. centralized solutions</h2>

			<p>
				Centralized cloud storage services like Dropbox, Google Drive, and Amazon S3 offer
				convenience and integration with various applications. However, they rely on central
				servers, which can become points of failure or targets for censorship. BitTorrent's
				decentralized nature inherently protects against these issues, offering resilience and
				freedom from control by any single entity.
			</p>
			<h2 id="conclusion">Conclusion</h2>

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
			<h2 id="performanceEfficiency">Performance & Efficiency</h2>

			<ul>
				<li>
					<strong>High Performance:</strong> Rust offers exceptional speed and efficiency, which can
					significantly improve the performance of BitTorrent tools. Its focus on concurrency and memory
					safety allows for the development of high-speed data transmission tools without the common
					pitfalls of memory leaks and crashes.
				</li>
				<li>
					<strong>Resource Optimisation:</strong> Modern devices vary widely in their capabilities. Developing
					new tools in Rust can help optimize resource use, making BitTorrent more accessible on a wider
					range of devices, from high-end servers to low-powered IoT devices.
				</li>
			</ul>
			<h2 id="securityReliability">Security & Reliability</h2>

			<ul>
				<li>
					<strong>Memory Safety: </strong> Rust's emphasis on memory safety without a garbage collector
					minimizes common security vulnerabilities found in other languages, such as buffer overflows
					and dangling pointers. This is crucial for peer-to-peer networks that are inherently exposed
					to data from untrusted sources.
				</li>
				<li>
					<strong>Dependability: </strong> By leveraging Rust's type system and ownership model, developers
					can build more reliable applications that are less prone to crashes and unexpected behavior,
					enhancing the user experience.
				</li>
			</ul>
			<h2 id="userExperience">User Experience & Accessibility</h2>

			<ul>
				<li>
					<strong>Modern Interfaces: </strong> Updating BitTorrent clients with modern, user-friendly
					interfaces can make the technology more accessible to a broader audience, encouraging adoption.
					Simplifying the user experience without compromising on advanced features appeals to both novice
					and experienced users.
				</li>
				<li>
					<strong>Cross-Platform Compatibility: </strong>Developing with modern frameworks and
					languages supports better cross-platform compatibility, ensuring a consistent and
					functional experience across various operating systems and devices.
				</li>
			</ul>
			<h2 id="futureProofing">Future-Proofing & Innovation</h2>

			<ul>
				<li>
					<strong>Adapting to Technological Advances: </strong> The digital landscape is constantly evolving.
					Developing new tools with modern languages ensures compatibility with the latest technologies
					and standards, making BitTorrent more adaptable and future-proof.
				</li>
				<li>
					<strong>Encouraging Innovation: </strong>By embracing modern programming paradigms and
					languages, the BitTorrent ecosystem can stimulate innovation, leading to the development
					of new features, improved efficiency, and potentially new use cases for distributed file
					sharing.
				</li>
			</ul>
			<h2 id="integration">Integration & Interoperability</h2>

			<ul>
				<li>
					<strong>Blockchain & Beyond: </strong>The integration of BitTorrent with emerging
					technologies like blockchain and decentralized finance (DeFi) requires a modern approach
					to ensure seamless interoperability and to unlock new functionalities and business models.
				</li>
				<li>
					<strong>Ecosystem Synergy: </strong>Developing tools in languages like Rust promotes
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
			<h2 id="team">The Team</h2>

			<p>TODO</p>

			<h2 id="collaborators">Collaborators</h2>

			<p>TODO</p>

			<h2 id="sponsors">Sponsors</h2>
			<p>
				Nautilus Cyberneering is dedicated to creating new Open Source Ecosystems. They define Open
				Source Ecosystems as vibrant communities of users and creators who collaboratively develop
				open source software that is secure, respectful, and adds value for future generations. This
				approach is what they term Cyberneering. With a focus on software and hardware development
				within these ecosystems, their aim is to produce technology that adheres to these
				principles.
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
		margin-top: 3rem;
	}

	h1 {
		padding-top: 4rem;
		font-size: 2.25rem;
	}

	h2 {
		font-size: 1.875rem;
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
