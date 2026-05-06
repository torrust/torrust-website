export const metadata = {
	title: 'How We Fixed a One-Core Packet Processing Bottleneck in Torrust Tracker',
	slug: 'how-we-fixed-a-one-core-packet-processing-bottleneck-in-torrust-tracker',
	contributor: 'Jose Celano',
	contributorSlug: 'jose-celano',
	date: '2026-05-06T12:00:00.000Z',
	coverImage:
		'/images/posts/how-we-fixed-a-one-core-packet-processing-bottleneck-in-torrust-tracker/one-core-packet-processing-bottleneck-cover.webp',
	excerpt:
		'We investigated a one-core softirq hotspot in the Torrust Tracker demo, ran isolated HTTP/3 and RPS/RFS experiments, and documented why better CPU distribution did not fully solve overall host load.',
	tags: ['Tracker Demo', 'Performance', 'Linux Networking', 'Softirq', 'RPS/RFS']
};
