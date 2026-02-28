<script>
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import GalleryLightbox from './GalleryLightbox.svelte';

	let { images = [] } = $props();
	let selectedIndex = $state(null);

	// Randomize images once per filter change
	let randomizedImages = $derived.by(() => {
		const copy = [...images];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	});

	// Track which images have finished loading
	let loadedSet = $state(new Set());

	$effect(() => {
		// Reset loaded set when images change
		loadedSet = new Set();
	});

	function onImageLoad(id) {
		loadedSet = new Set([...loadedSet, id]);
	}

	function openLightbox(index) {
		selectedIndex = index;
	}

	function closeLightbox() {
		selectedIndex = null;
	}

	function getSrcSet(urls) {
		if (!urls) return '';
		return `
			${encodeURI(urls.sm)} 640w,
			${encodeURI(urls.md)} 768w,
			${encodeURI(urls.lg)} 1024w,
			${encodeURI(urls.xl)} 1280w
		`;
	}

	// Assign deterministic aspect ratio classes based on index for visual variety
	const aspectPatterns = [
		'aspect-[3/4]', // tall portrait
		'aspect-[4/3]', // landscape
		'aspect-square', // square
		'aspect-[2/3]', // tall
		'aspect-[16/9]', // wide
		'aspect-[3/4]',
		'aspect-square',
		'aspect-[4/3]'
	];

	function getAspect(i) {
		return aspectPatterns[i % aspectPatterns.length];
	}
</script>

<div class="columns-1 gap-3 sm:columns-2 md:columns-3 lg:columns-4">
	{#each randomizedImages as image, i (image.id)}
		{@const isLoaded = loadedSet.has(image.id)}
		{@const aspect = getAspect(i)}
		<div
			class="mb-3 break-inside-avoid"
			in:fly={{ y: 30, duration: 400, easing: quintOut, delay: Math.min(i * 40, 600) }}
		>
			<button
				class="group relative block w-full overflow-hidden rounded-xl shadow-lg transition-all
				       duration-500 hover:scale-[1.02] hover:shadow-2xl focus-visible:ring-2
				       focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900
				       focus-visible:outline-none {aspect}"
				onclick={() => openLightbox(i)}
				aria-label="View {image.title || `image ${i + 1}`} in lightbox"
			>
				<!-- Skeleton placeholder: shown while loading -->
				{#if !isLoaded}
					<div
						class="absolute inset-0 {aspect} skeleton w-full"
						aria-hidden="true"
						transition:fade={{ duration: 200 }}
					></div>
				{/if}

				<picture class="block h-full w-full">
					<source srcset={getSrcSet(image.urls)} type="image/webp" />
					<img
						src={encodeURI(image.urls.md || image.urls.original)}
						alt={image.title || image.description}
						class="h-full w-full object-cover transition-all duration-700
						       group-hover:scale-105 group-hover:brightness-90
						       {isLoaded ? 'opacity-100' : 'opacity-0'}"
						loading="lazy"
						decoding="async"
						draggable="false"
						crossorigin="anonymous"
						onload={() => onImageLoad(image.id)}
					/>
				</picture>

				<!-- Cinematic hover overlay with title -->
				<div
					class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t
					       from-black/70 via-black/10 to-transparent
					       opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				>
					<div class="p-3 pb-4">
						{#if image.title}
							<p class="line-clamp-2 text-sm leading-snug font-semibold text-white drop-shadow-md">
								{image.title}
							</p>
						{/if}
						{#if image.tags?.length}
							<p class="mt-1 text-xs tracking-wide text-white/70 uppercase">
								{image.tags[0]}
							</p>
						{/if}
					</div>
				</div>
			</button>
		</div>
	{/each}
</div>

{#if selectedIndex !== null}
	<GalleryLightbox images={randomizedImages} startIndex={selectedIndex} on:close={closeLightbox} />
{/if}
