// JS only; remove TS annotations
import { writable } from 'svelte/store';

function createImageStore() {
	const { subscribe, set } = writable({
		images: [],
		tags: new Set(),
		ready: false
	});

	return {
		subscribe,
		init: (initialImages) => {
			if (!initialImages || initialImages.length === 0) {
				set({ images: [], tags: new Set(), ready: true });
				return;
			}
			const tags = new Set(initialImages.flatMap((img) => img.tags));
			set({ images: initialImages, tags, ready: true });
		}
	};
}

export const images = createImageStore();

// Returns a filtered list of images suitable for hero backgrounds.
export function getRotationPool(allImages, tag = '') {
    // Note: This is a placeholder for a more sophisticated "hero-safe" logic.
    // For now, we'll just filter by tag if provided.
    if (tag) {
        return allImages.filter(img => img.tags.includes(tag));
    }
    return allImages;
}
