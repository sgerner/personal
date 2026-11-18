<script>
	import { images } from '$lib/stores/images.js';
	import Seo from '$lib/components/meta/Seo.svelte';
	import FilterChips from '$lib/components/gallery/FilterChips.svelte';
	import GalleryGrid from '$lib/components/gallery/GalleryGrid.svelte';
	import GalleryMap from '$lib/components/gallery/GalleryMap.svelte';
	import { LayoutGrid, Map as MapIcon } from '@lucide/svelte';

	let activeTags = $state([]);
	const views = [
		{ value: 'grid', label: 'Grid', icon: LayoutGrid },
		{ value: 'map', label: 'Map', icon: MapIcon }
	];
	let view = $state('grid');
	let sourceImages = $derived($images.images);
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
				<fieldset
					class="flex gap-1 rounded-md border border-white/20 bg-[#14121d]/80 p-1.5 shadow-xl backdrop-blur-lg"
				>
					<legend class="sr-only">Gallery view</legend>
					{#each views as { value, label, icon: Icon } (value)}
						<label class="w-24">
							<input
								class="peer sr-only"
								type="radio"
								name="gallery-view"
								{value}
								bind:group={view}
							/>
							<span
								class="flex cursor-pointer items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium text-white transition-colors peer-checked:bg-primary-500 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-300"
							>
								<Icon size={16} aria-hidden="true" />
								{label}
							</span>
						</label>
					{/each}
				</fieldset>
			</div>

			<p class="mt-3 text-xs tracking-[0.2em] text-white/80 uppercase">
				{filteredImages.length} photographs
			</p>
		</div>
	</header>

	<!-- Filter chips -->
	<div class="sticky top-0 z-20 mb-5 px-4 pt-3">
		<FilterChips
			allTags={$images.tags}
			bind:activeTags
			showAll={true}
			single={true}
			{tagCounts}
			totalCount={sourceImages.length}
		/>
	</div>

	<!-- Content -->
	<div class="px-3 pb-12 sm:px-4">
		{#if view === 'grid'}
			{#if filteredImages.length > 0}
				<GalleryGrid images={filteredImages} />
			{:else}
				<div class="rounded-lg border border-white/10 bg-black/30 p-12 text-center text-white/80">
					No photographs match that filter yet.
				</div>
			{/if}
		{:else}
			<GalleryMap images={filteredImages} />
		{/if}
	</div>
</div>
