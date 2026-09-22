<script>
	import { images } from '$lib/stores/images.js';
	import Seo from '$lib/components/meta/Seo.svelte';
	import FilterChips from '$lib/components/gallery/FilterChips.svelte';
	import GalleryGrid from '$lib/components/gallery/GalleryGrid.svelte';
	import GalleryMap from '$lib/components/gallery/GalleryMap.svelte';
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
	import { LayoutGrid, Map as MapIcon } from '@lucide/svelte';

	let activeTags = $state([]);
	let view = $state('grid'); // 'grid' | 'map'
	let collection = $state('featured'); // 'featured' | 'all'

	let featuredImages = $derived.by(() => {
		const explicitlyFeatured = $images.images.filter(
			(image) =>
				image.featured === true || image.isFeatured === true || image.collection === 'featured'
		);
		return (
			explicitlyFeatured.length > 0 ? explicitlyFeatured : $images.images.slice(0, 18)
		).filter(Boolean);
	});

	let sourceImages = $derived(collection === 'featured' ? featuredImages : $images.images);
	let filteredImages = $derived.by(() => {
		if (activeTags.length === 0) return sourceImages;
		return sourceImages.filter((img) => (img.tags || []).some((t) => activeTags.includes(t)));
	});

	let tagCounts = $derived.by(() => {
		const counts = {};
		for (const image of sourceImages) {
			for (const tag of image.tags || []) {
				counts[tag] = (counts[tag] || 0) + 1;
			}
		}
		return counts;
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
						class="relative flex gap-1 rounded-md border border-white/20 bg-surface-100/30 p-1.5 shadow-xl backdrop-blur-lg dark:bg-surface-800/60"
					>
						<SegmentedControl.Indicator class="rounded-sm bg-primary-500 shadow-lg" />
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

			<div
				class="mx-auto mt-4 flex w-fit items-center gap-1 rounded-md border border-white/15 bg-black/35 p-1 backdrop-blur-lg"
				aria-label="Photography collection"
			>
				<button
					type="button"
					aria-pressed={collection === 'featured'}
					class="rounded-sm px-4 py-2 text-sm font-semibold transition {collection === 'featured'
						? 'bg-secondary-500 text-black shadow-lg'
						: 'text-white/70 hover:bg-white/10 hover:text-white'}"
					onclick={() => {
						collection = 'featured';
						activeTags = [];
					}}
				>
					Featured
				</button>
				<button
					type="button"
					aria-pressed={collection === 'all'}
					class="rounded-sm px-4 py-2 text-sm font-semibold transition {collection === 'all'
						? 'bg-secondary-500 text-black shadow-lg'
						: 'text-white/70 hover:bg-white/10 hover:text-white'}"
					onclick={() => (collection = 'all')}
				>
					All photos
				</button>
			</div>

			<p class="mt-3 text-xs tracking-[0.2em] text-white/50 uppercase">
				{filteredImages.length}
				{collection === 'featured' ? 'selected photographs' : 'photographs'}
			</p>
		</div>
	</header>

	<!-- Filter chips -->
	<div class="sticky top-0 z-20 mb-5 px-4 pt-3">
		<FilterChips
			allTags={sourceImages.length === $images.images.length
				? $images.tags
				: new Set(sourceImages.flatMap((image) => image.tags || []))}
			bind:activeTags
			showAll={true}
			single={true}
			{tagCounts}
			totalCount={sourceImages.length}
		/>
	</div>

	<!-- Content -->
	<main class="px-3 pb-12 sm:px-4">
		{#if view === 'grid'}
			{#if filteredImages.length > 0}
				<GalleryGrid images={filteredImages} />
			{:else}
				<div class="rounded-lg border border-white/10 bg-black/30 p-12 text-center text-white/70">
					No photographs match that filter yet.
				</div>
			{/if}
		{:else}
			<GalleryMap images={filteredImages} />
		{/if}
	</main>
</div>
