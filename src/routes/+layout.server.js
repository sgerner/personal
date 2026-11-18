import { IMAGES_INDEX_URL, IMAGES_BASE_URL } from '$lib/config/site';

const manifestTtl = 60_000;
let cachedManifest;
let expiresAt = 0;
let pendingManifest;

async function fetchManifest(fetch) {
	const response = await fetch(IMAGES_INDEX_URL, { signal: AbortSignal.timeout(5000) });
	if (!response.ok) {
		throw new Error(`Image index returned ${response.status}`);
	}

	const manifest = await response.json();
	if (!Array.isArray(manifest)) throw new Error('Image index must be an array');

	return manifest.flatMap((image) => {
		if (!image?.id || !image.urls || typeof image.urls !== 'object') return [];
		const urls = Object.fromEntries(
			Object.entries(image.urls)
				.filter(([, path]) => typeof path === 'string' && path.startsWith('/'))
				.map(([size, path]) => [size, `${IMAGES_BASE_URL}${path}`])
		);
		if (!urls.md && !urls.original) return [];
		const tags = Array.isArray(image.tags)
			? image.tags.filter((tag) => typeof tag === 'string')
			: [];
		return [{ ...image, urls, tags }];
	});
}

function getPublicManifest(fetch) {
	if (Date.now() < expiresAt) return cachedManifest;

	pendingManifest ??= fetchManifest(fetch)
		.then((images) => {
			cachedManifest = images;
			expiresAt = Date.now() + manifestTtl;
			return images;
		})
		.finally(() => {
			pendingManifest = undefined;
		});

	return pendingManifest;
}

export async function load({ fetch, route }) {
	const isAdmin = route.id === '/admin';
	let allImages;
	try {
		allImages = await (isAdmin ? fetchManifest(fetch) : getPublicManifest(fetch));
	} catch (error) {
		console.error('Error fetching image index:', error);
		allImages = (isAdmin ? undefined : cachedManifest) ?? [];
	}

	if (isAdmin || route.id === '/gallery') {
		return { images: allImages, tags: [...new Set(allImages.flatMap((image) => image.tags))] };
	}

	const backgroundImages = allImages.filter((image) =>
		image.tags.some((tag) => ['landscape', 'nature', 'architecture'].includes(tag.toLowerCase()))
	);
	const images = (backgroundImages.length ? backgroundImages : allImages).slice(0, 12);
	return { images, tags: [] };
}
