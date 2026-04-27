export const metadata = {
	title: 'How nf_conntrack Overflow Causes Intermittent UDP Tracker Downtime with Docker',
	slug: 'nf-conntrack-overflow-docker-udp-tracker',
	contributor: 'Jose Celano',
	contributorSlug: 'jose-celano',
	date: '2026-04-27T12:00:00.000Z',
	coverImage:
		'/images/posts/nf-conntrack-overflow-docker-udp-tracker/nf-conntrack-overflow-docker-udp-tracker.webp',
	excerpt:
		'A subtle Linux kernel resource exhaustion silently drops UDP packets when running a BitTorrent tracker behind Docker bridge networking. No application error, no socket counter — just intermittent timeouts and a self-recovery cycle. Here is how to diagnose it, fix it, and make sure the fix survives a reboot.',
	tags: ['BitTorrent', 'Tracker', 'Networking', 'Docker', 'Linux', 'Deployment']
};
