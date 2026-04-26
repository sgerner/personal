<script>
	import { images } from '$lib/stores/images.js';
	import Seo from '$lib/components/meta/Seo.svelte';
	import FilterChips from '$lib/components/gallery/FilterChips.svelte';
	import GalleryGrid from '$lib/components/gallery/GalleryGrid.svelte';
	import GalleryMap from '$lib/components/gallery/GalleryMap.svelte';
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
	import { LayoutGrid, Map as MapIcon } from '@lucide/svelte';

	let { data: _data } = $props();

	let activeTags = $state([]);
	let filteredImages = $state([]);
	let view = $state('grid'); // 'grid' | 'map'
	let allTagCounts = $state({});

	$effect(() => {
		if (activeTags.length === 0) {
			filteredImages = $images.images;
		} else {
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

<div class="min-h-screen">
	<!-- Cinematic header -->
	<header class="relative px-4 pt-8 pb-6 text-center">
		<div class="mx-auto max-w-7xl">
			<!-- Title block -->
			<div class="mb-8">
				<p
					class="mb-1 text-xs font-semibold tracking-[0.3em] text-primary-400 uppercase opacity-80"
				>
					Portfolio
				</p>
				<h1 class="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl">
					Photography
				</h1>
				<p class="mt-1 text-sm font-medium tracking-[0.2em] text-secondary-400 uppercase">
					Gallery
				</p>
			</div>

			<!-- View toggle -->
			<div class="flex justify-center pb-2">
				<SegmentedControl name="view" value={view} onValueChange={(e) => (view = e.value)}>
					<SegmentedControl.Control
						class="relative flex gap-1 rounded-xl border border-white/20 bg-surface-100/30 p-1.5 shadow-xl backdrop-blur-lg dark:bg-surface-800/60"
					>
						<SegmentedControl.Indicator class="rounded-lg bg-primary-500 shadow-lg" />
						<SegmentedControl.Item value="grid" class="z-10 w-24">
							<SegmentedControl.ItemHiddenInput />
							<SegmentedControl.ItemText
								class="flex cursor-pointer items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-white transition-colors"
							>
								<LayoutGrid size={16} />
								<span>Grid</span>
							</SegmentedControl.ItemText>
						</SegmentedControl.Item>
						<SegmentedControl.Item value="map" class="z-10 w-24">
							<SegmentedControl.ItemHiddenInput />
							<SegmentedControl.ItemText
								class="flex cursor-pointer items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-white transition-colors"
							>
								<MapIcon size={16} />
								<span>Map</span>
							</SegmentedControl.ItemText>
						</SegmentedControl.Item>
					</SegmentedControl.Control>
				</SegmentedControl>
			</div>
		</div>
	</header>

	<!-- Filter chips -->
	<div class="top-0 z-20 px-4 pt-2 pb-4 md:sticky">
		<FilterChips
			allTags={$images.tags}
			bind:activeTags
			showAll={true}
			single={true}
			tagCounts={allTagCounts}
			totalCount={$images.images.length}
		/>
	</div>

	<!-- Content -->
	<main class="px-3 pb-12 sm:px-4">
		{#if view === 'grid'}
			<GalleryGrid images={filteredImages} />
		{:else}
			<GalleryMap images={filteredImages} />
		{/if}
	</main>
</div>
