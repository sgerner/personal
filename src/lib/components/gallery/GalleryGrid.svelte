<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import GalleryLightbox from './GalleryLightbox.svelte';

	let { images = [] } = $props();
	let selectedIndex = $state(null);

	function openLightbox(index) {
		selectedIndex = index;
	}

	function closeLightbox() {
		selectedIndex = null;
	}

	function getSrcSet(urls) {
		if (!urls) return '';
		// Encode each URL to handle special characters like commas in filenames.
		return `
			${encodeURI(urls.sm)} 640w,
			${encodeURI(urls.md)} 768w,
			${encodeURI(urls.lg)} 1024w,
			${encodeURI(urls.xl)} 1280w
		`;
	}
</script>

<div class="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
	{#each images as image, i (image.id)}
		<div
			class="mb-4 break-inside-avoid"
			in:fly={{ y: 20, duration: 300, easing: quintOut, delay: 100 }}
		>
			<button
				class="block w-full h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
				on:click={() => openLightbox(i)}
				aria-label="View image {image.title || i + 1} in lightbox"
			>
				<picture>
					<source srcset={getSrcSet(image.urls)} type="image/webp" />
					<img
						src={encodeURI(image.urls.md || image.urls.original)}
						alt={image.title || image.description}
						class="w-full h-full object-cover"
						loading="lazy"
						decoding="async"
						draggable="false"
						crossorigin="anonymous"
					/>
				</picture>
			</button>
		</div>
	{/each}
</div>

{#if selectedIndex !== null}
	<GalleryLightbox images={images} startIndex={selectedIndex} on:close={closeLightbox} />
{/if}
