import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://api.github.com';
const ORG_NAME = 'torrust';
const CONSTANTS_FILE = 'src/lib/constants/constants.ts';

type Contributor = {
	login: string;
	avatar_url: string;
	html_url: string;
};

type Repo = {
	name: string;
	fork: boolean;
	archived: boolean;
};

async function fetchWithAuth(url: string): Promise<Response> {
	const headers: HeadersInit = {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'Torrust-Website-Contributors-Script'
	};

	// Use GITHUB_TOKEN if available for higher rate limits
	const token = process.env.GITHUB_TOKEN;
	if (token) {
		// GitHub supports both formats: 'token xxx' for classic, 'Bearer xxx' for fine-grained
		headers.Authorization = `token ${token}`;
		console.log('✓ Using GitHub token for authentication');
	} else {
		console.log('Using anonymous GitHub API (rate limit: 60 requests/hour)');
		console.log('  Set GITHUB_TOKEN environment variable for higher limits');
	}

	return fetch(url, { headers });
}

async function fetchRepos(): Promise<string[]> {
	console.log(`\nFetching repositories from ${ORG_NAME} organization...`);
	const response = await fetchWithAuth(`${BASE_URL}/orgs/${ORG_NAME}/repos?per_page=100`);

	if (!response.ok) {
		const errorBody = await response.text();
		console.error(`Response status: ${response.status} ${response.statusText}`);
		console.error(`Error details: ${errorBody}`);
		throw new Error(`Failed to fetch repos: ${response.statusText}`);
	}

	const repos: Repo[] = await response.json();
	const filteredRepos = repos.filter((repo) => !repo.fork && !repo.archived);
	console.log(
		`✓ Found ${repos.length} repositories (${filteredRepos.length} after excluding forks and archived)`
	);

	return filteredRepos.map((repo) => repo.name);
}

async function fetchContributorsForRepo(repoName: string): Promise<Contributor[]> {
	try {
		const response = await fetchWithAuth(
			`${BASE_URL}/repos/${ORG_NAME}/${repoName}/contributors?per_page=100`
		);

		if (!response.ok) {
			console.error(`✗ Failed to fetch contributors for ${repoName}: ${response.statusText}`);
			return [];
		}

		// Check if response has content before parsing
		const text = await response.text();
		if (!text || text.trim().length === 0) {
			console.error(`✗ Empty response for ${repoName}`);
			return [];
		}

		try {
			return JSON.parse(text);
		} catch (parseError) {
			console.error(
				`✗ Invalid JSON for ${repoName}:`,
				parseError instanceof Error ? parseError.message : parseError
			);
			return [];
		}
	} catch (error) {
		console.error(
			`✗ Error fetching contributors for ${repoName}:`,
			error instanceof Error ? error.message : error
		);
		return [];
	}
}

async function fetchAllContributors(): Promise<Contributor[]> {
	const repos = await fetchRepos();

	console.log('\nFetching contributors from all repositories...');
	const contributorPromises = repos.map(async (repo) => {
		const contributors = await fetchContributorsForRepo(repo);
		console.log(`  ✓ ${repo}: ${contributors.length} contributors`);
		return contributors;
	});

	const contributorArrays = await Promise.all(contributorPromises);
	const allContributors = contributorArrays.flat();

	// Deduplicate by login
	const uniqueContributors = Array.from(new Map(allContributors.map((c) => [c.login, c])).values());

	console.log(`\n✓ Total unique contributors: ${uniqueContributors.length}`);
	return uniqueContributors;
}

function updateConstantsFile(contributors: Contributor[]): void {
	const filePath = path.resolve(CONSTANTS_FILE);

	if (!fs.existsSync(filePath)) {
		throw new Error(`Constants file not found: ${CONSTANTS_FILE}`);
	}

	let content = fs.readFileSync(filePath, 'utf-8');

	// Find the defaultContributorsList array
	const startMarker = 'export const defaultContributorsList = [';
	const startIndex = content.indexOf(startMarker);

	if (startIndex === -1) {
		throw new Error('Could not find defaultContributorsList in constants.ts');
	}

	// Find the closing bracket for the array
	let bracketCount = 0;
	let endIndex = startIndex + startMarker.length;
	let inString = false;
	let stringChar = '';

	for (let i = endIndex; i < content.length; i++) {
		const char = content[i];

		if ((char === '"' || char === "'") && content[i - 1] !== '\\') {
			if (!inString) {
				inString = true;
				stringChar = char;
			} else if (char === stringChar) {
				inString = false;
			}
		}

		if (!inString) {
			if (char === '[') bracketCount++;
			if (char === ']') {
				if (bracketCount === 0) {
					endIndex = i + 2; // Include '];'
					break;
				}
				bracketCount--;
			}
		}
	}

	// Format contributors list
	const contributorEntries = contributors
		.map((c) => `\t{\n\t\tlogin: '${c.login}',\n\t\tavatar_url: '${c.avatar_url}'\n\t}`)
		.join(',\n');

	const newList = `export const defaultContributorsList = [\n${contributorEntries}\n];`;

	// Replace the old list with the new one
	const newContent = content.substring(0, startIndex) + newList + content.substring(endIndex);

	fs.writeFileSync(filePath, newContent, 'utf-8');
	console.log(`\n✅ Updated ${CONSTANTS_FILE}`);
}

async function main() {
	try {
		console.log('🚀 Updating contributors list...');
		const contributors = await fetchAllContributors();
		updateConstantsFile(contributors);
		console.log('✅ Contributors list updated successfully!');
	} catch (error) {
		console.error('❌ Error updating contributors:', error);
		process.exit(1);
	}
}

main();
