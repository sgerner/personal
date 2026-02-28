<script>
	import { images } from '$lib/stores/images.js';
	import Seo from '$lib/components/meta/Seo.svelte';
	import FilterChips from '$lib/components/gallery/FilterChips.svelte';
	import GalleryGrid from '$lib/components/gallery/GalleryGrid.svelte';
	import GalleryMap from '$lib/components/gallery/GalleryMap.svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import { LayoutGrid, Map as MapIcon } from '@lucide/svelte';

	let { data } = $props();

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
	<header class="relative px-4 pt-8 pb-6">
		<div class="mx-auto flex max-w-7xl items-end justify-between gap-4">
			<!-- Title block -->
			<div>
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

			<!-- View toggle — desktop -->
			<div class="hidden shrink-0 pb-1 sm:block">
				<Segment
					name="view"
					value={view}
					onValueChange={(e) => (view = e.value)}
					classes="!p-0.5 rounded-xl bg-surface-100/20 backdrop-blur-md dark:bg-surface-800/40 border border-white/10"
				>
					<Segment.Item value="grid">
						<div class="flex items-center gap-1.5 px-1 {view === 'grid' ? '' : 'text-white'}">
							<LayoutGrid size={14} />
							<span class="text-sm">Grid</span>
						</div>
					</Segment.Item>
					<Segment.Item value="map">
						<div class="flex items-center gap-1.5 px-1 {view === 'map' ? '' : 'text-white'}">
							<MapIcon size={14} />
							<span class="text-sm">Map</span>
						</div>
					</Segment.Item>
				</Segment>
			</div>
		</div>

		<!-- Mobile view toggle -->
		<div class="mt-4 flex justify-center sm:hidden">
			<Segment
				name="view-mobile"
				value={view}
				onValueChange={(e) => (view = e.value)}
				classes="!p-0.5 rounded-xl bg-surface-100/20 backdrop-blur-md dark:bg-surface-800/40 border border-white/10"
			>
				<Segment.Item value="grid">
					<div class="flex items-center gap-1.5 px-1 {view === 'grid' ? '' : 'text-white'}">
						<LayoutGrid size={14} />
						<span class="text-sm">Grid</span>
					</div>
				</Segment.Item>
				<Segment.Item value="map">
					<div class="flex items-center gap-1.5 px-1 {view === 'map' ? '' : 'text-white'}">
						<MapIcon size={14} />
						<span class="text-sm">Map</span>
					</div>
				</Segment.Item>
			</Segment>
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
