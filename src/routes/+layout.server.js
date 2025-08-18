// @ts-nocheck
import { IMAGES_INDEX_URL } from '$lib/config/site';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
	try {
		const response = await fetch(IMAGES_INDEX_URL);
		if (!response.ok) {
			console.error(`Failed to fetch image index: ${response.statusText}`);
			return { images: [], tags: [] };
		}
		const images = await response.json();

		// Derive unique tags
		const tags = [...new Set(images.flatMap((img) => img.tags))];

		return {
			images,
			tags
		};
	} catch (error) {
		console.error(`Error fetching image index: ${error}`);
		return { images: [], tags: [] };
	}
}
