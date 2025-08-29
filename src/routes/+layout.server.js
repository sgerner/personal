// @ts-nocheck
import { IMAGES_INDEX_URL, IMAGES_BASE_URL } from '$lib/config/site';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
	try {
		const response = await fetch(IMAGES_INDEX_URL);
		if (!response.ok) {
			console.error(`Failed to fetch image index: ${response.statusText}`);
			return { images: [], tags: [] };
		}
		const images = await response.json();

		// Prepend base URL to each image URL
		const imagesWithAbsoluteUrls = images.map((image) => {
			const urls = {};
			for (const key in image.urls) {
				urls[key] = `${IMAGES_BASE_URL}${image.urls[key]}`;
			}
			return { ...image, urls };
		});

		// Derive unique tags
		const tags = [...new Set(imagesWithAbsoluteUrls.flatMap((img) => img.tags))];

		return {
			images: imagesWithAbsoluteUrls,
			tags
		};
	} catch (error) {
		console.error(`Error fetching image index: ${error}`);
		return { images: [], tags: [] };
	}
}
