<script>
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { SvelteMap } from 'svelte/reactivity';
	import GalleryLightbox from './GalleryLightbox.svelte';

	let { images = [] } = $props();
	let selectedIndex = $state(null);

	// Keep the incoming order stable so visitors can build a visual memory of the archive.
	let displayImages = $derived(images);

	const imageStatus = new SvelteMap();

	function openLightbox(index) {
		selectedIndex = index;
	}

	function closeLightbox() {
		selectedIndex = null;
	}

	const responsiveWidths = { sm: 640, md: 768, lg: 1024, xl: 1280 };

	function getSrcSet(urls) {
		return Object.entries(responsiveWidths)
			.filter(([size]) => urls[size])
			.map(([size, width]) => `${encodeURI(urls[size])} ${width}w`)
			.join(', ');
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
	{#each displayImages as image, i (image.id)}
		{@const status = imageStatus.get(image)}
		{@const aspect = getAspect(i)}
		<div
			class="mb-3 break-inside-avoid"
			in:fly={{ y: 30, duration: 400, easing: quintOut, delay: Math.min(i * 40, 600) }}
		>
			<button
				class="group relative block w-full overflow-hidden rounded-md shadow-lg transition-all
				       duration-500 hover:scale-[1.02] hover:shadow-2xl focus-visible:ring-2
				       focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900
				       focus-visible:outline-none {aspect}"
				onclick={() => openLightbox(i)}
				aria-label="View {image.title || `image ${i + 1}`} in lightbox{status === 'failed'
					? ' (thumbnail unavailable)'
					: ''}"
			>
				<!-- Skeleton placeholder: shown while loading -->
				{#if !status}
					<div
						class="absolute inset-0 {aspect} skeleton w-full"
						aria-hidden="true"
						transition:fade={{ duration: 200 }}
					></div>
				{:else if status === 'failed'}
					<span
						class="absolute inset-0 grid place-items-center bg-slate-900 px-4 text-sm text-white"
					>
						Thumbnail unavailable
					</span>
				{/if}

				<picture class="block h-full w-full">
					<source srcset={getSrcSet(image.urls)} type="image/webp" />
					<img
						src={encodeURI(image.urls.md || image.urls.original)}
						alt={image.title || image.description}
						class="h-full w-full object-cover transition-all duration-700
						       group-hover:scale-105 group-hover:brightness-90
						       {status === 'loaded' ? 'opacity-100' : 'opacity-0'}"
						loading="lazy"
						decoding="async"
						draggable="false"
						crossorigin="anonymous"
						onload={() => imageStatus.set(image, 'loaded')}
						onerror={() => imageStatus.set(image, 'failed')}
						{@attach (element) => {
							if (element.complete) {
								imageStatus.set(image, element.naturalWidth > 0 ? 'loaded' : 'failed');
							}
						}}
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
	<GalleryLightbox images={displayImages} startIndex={selectedIndex} onclose={closeLightbox} />
{/if}
