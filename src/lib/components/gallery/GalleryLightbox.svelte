<script>
	// @ts-nocheck
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { X, ChevronLeft, ChevronRight } from '@lucide/svelte';

	let { images = [], startIndex = 0 } = $props();
	const dispatch = createEventDispatcher();

	let currentIndex = $state(startIndex);

	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prevImage() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			dispatch('close');
		} else if (event.key === 'ArrowRight') {
			nextImage();
		} else if (event.key === 'ArrowLeft') {
			prevImage();
		}
	}

	function getImageUrl(image) {
		if (!image) return '';
		// Handle both local static paths and the processed image object structure
		if (typeof image === 'string') return image;
		if (image.urls) return image.urls.xl || image.urls.lg || image.urls.original;
		return '';
	}

	const currentImage = $derived(images[currentIndex]);
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/70 backdrop-blur-xs"
	on:click={() => dispatch('close')}
	transition:fade={{ duration: 200 }}
>
	<!-- Main Image -->
	<div class="relative flex h-full w-full items-center justify-center p-2" on:click|stopPropagation>
		{#if currentImage}
			<img
				src={getImageUrl(currentImage)}
				alt={currentImage.title || 'Bakery Image'}
				class="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
				draggable="false"
			/>
		{/if}
	</div>

	<!-- Close Button -->
	<button
		class="variant-filled absolute top-4 right-4 z-10 btn-icon btn"
		on:click|stopPropagation={() => dispatch('close')}
		aria-label="Close lightbox"
	>
		<X />
	</button>

	<!-- Prev Button -->
	{#if images.length > 1}
		<button
			class="variant-filled absolute top-1/2 left-4 z-10 btn-icon btn h-16 w-16 -translate-y-1/2 text-white"
			on:click|stopPropagation={prevImage}
			aria-label="Previous image"
		>
			<ChevronLeft />
		</button>
	{/if}

	<!-- Next Button -->
	{#if images.length > 1}
		<button
			class="variant-filled absolute top-1/2 right-4 z-10 btn-icon btn h-16 w-16 -translate-y-1/2 text-white"
			on:click|stopPropagation={nextImage}
			aria-label="Next image"
		>
			<ChevronRight />
		</button>
	{/if}
</div>