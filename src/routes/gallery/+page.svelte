<script>
	import { images } from '$lib/stores/images.js';
	import Seo from '$lib/components/meta/Seo.svelte';
	import FilterChips from '$lib/components/gallery/FilterChips.svelte';
	import GalleryGrid from '$lib/components/gallery/GalleryGrid.svelte';
	import { writable } from 'svelte/store';

	let { data } = $props(); // from +layout.server.js

	let activeTags = $state([]);
	let filteredImages = $state([]);
	let layout = $state('masonry'); // masonry or justified
	let allTagCounts = $state({});

	$effect(() => {
		if (activeTags.length === 0) {
			filteredImages = $images.images;
		} else {
			// OR filter: include image if it has any selected tag
			filteredImages = $images.images.filter((img) =>
				(img.tags || []).some((t) => activeTags.includes(t))
			);
		}
	});

	$effect(() => {
		const counts = {};
		for (const img of $images.images) {
			for (const t of img.tags || []) {
				counts[t] = (counts[t] || 0) + 1;
			}
		}
		allTagCounts = counts;
	});
</script>

<Seo title="Gallery" description="A collection of photography by Steven Gerner." />

<div class="container mx-auto p-4">
	<header class="mx-auto mb-8 flex max-w-prose flex-col content-center">
		<h1 class="h1 text-white drop-shadow-sm">Photography</h1>
		<h5 class=" h5 text-secondary-500 uppercase drop-shadow-sm">Gallery</h5>
	</header>
	<div class="mb-8">
        <FilterChips
            allTags={$images.tags}
            bind:activeTags
            showAll={true}
            single={true}
            tagCounts={allTagCounts}
            totalCount={$images.images.length}
        />
	</div>
	<div>
		<GalleryGrid images={filteredImages} />
	</div>
</div>
