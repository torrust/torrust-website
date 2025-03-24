import { getMetadata } from '$lib/data/metadata'; // Import your getMetadata function
import { json } from '@sveltejs/kit';

export const GET = async () => {
	try {
		// Get metadata using your function
		const allPosts = getMetadata();

		// Sort posts by date (assuming your metadata has a date field)
		const sortedPosts = allPosts.sort((a, b) => {
			const dateA = new Date(a.date); // Adjust this based on your metadata structure
			const dateB = new Date(b.date);

			if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
				console.error('Invalid date found:', a.date, b.date);
				return 0;
			}

			return dateB.getTime() - dateA.getTime();
		});

		// If no posts found, return a 404
		if (!sortedPosts.length) {
			return { status: 404 };
		}

		// Return sorted posts as JSON
		return json(sortedPosts);
	} catch (err) {
		// Handle any errors that occur when fetching metadata
		console.error('Error fetching metadata:', err);
		return { status: 500, body: { error: 'Internal server error' } };
	}
};
