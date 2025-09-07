<script>
	import { images } from '$lib/stores/images.js';
	import Seo from '$lib/components/meta/Seo.svelte';
	import FilterChips from '$lib/components/gallery/FilterChips.svelte';
	import GalleryGrid from '$lib/components/gallery/GalleryGrid.svelte';
	import GalleryMap from '$lib/components/gallery/GalleryMap.svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import { LayoutGrid, Map as MapIcon } from '@lucide/svelte';
	import { writable } from 'svelte/store';

	let { data } = $props(); // from +layout.server.js

	let activeTags = $state([]);
	let filteredImages = $state([]);
	let layout = $state('masonry'); // masonry or justified
	let view = $state('grid'); // 'grid' | 'map'
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
	<header class="mx-auto mb-8 flex max-w-prose items-center justify-between gap-4">
		<div>
			<h1 class="h1 text-white drop-shadow-sm">Photography</h1>
			<h5 class="h5 text-secondary-500 uppercase drop-shadow-sm">Gallery</h5>
		</div>
		<div class="hidden lg:block">
			<!-- Desktop view toggle (beside heading) -->
			<Segment
				name="view"
				value={view}
				onValueChange={(e) => (view = e.value)}
				classes="!p-0 rounded-lg bg-surface-100/50 backdrop-blur-xs dark:bg-surface-800/30"
			>
				<Segment.Item value="grid">
					<div class="flex items-center gap-2">
						<LayoutGrid size={16} />
						<span>Grid</span>
					</div>
				</Segment.Item>
				<Segment.Item value="map">
					<div class="flex items-center gap-2">
						<MapIcon size={16} />
						<span>Map</span>
					</div>
				</Segment.Item>
			</Segment>
		</div>
	</header>
	<!-- Mobile view toggle (below heading) -->
	<div class="mx-auto mb-4 w-fit md:hidden">
		<Segment
			name="view-mobile"
			value={view}
			onValueChange={(e) => (view = e.value)}
			classes="!p-0 rounded-lg bg-surface-100/50 backdrop-blur-xs dark:bg-surface-800/30"
		>
			<Segment.Item value="grid">
				<div class="flex items-center gap-2">
					<LayoutGrid size={16} />
					<span>Grid</span>
				</div>
			</Segment.Item>
			<Segment.Item value="map">
				<div class="flex items-center gap-2">
					<MapIcon size={16} />
					<span>Map</span>
				</div>
			</Segment.Item>
		</Segment>
	</div>
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
		{#if view === 'grid'}
			<GalleryGrid images={filteredImages} />
		{:else}
			<GalleryMap images={filteredImages} />
		{/if}
	</div>
</div>
