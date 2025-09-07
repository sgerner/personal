<script>
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
    let showFullDetails = $state(false);
    $effect(() => { showFullDetails = false; });

    function truncate(text, max = 140) {
        if (!text) return '';
        if (text.length <= max) return text;
        return text.slice(0, max).trimEnd() + '…';
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="fixed inset-0 z-[1000] flex items-center justify-center bg-surface-900/70 backdrop-blur-xs"
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

			<!-- Caption -->
			<div class="absolute inset-x-0 bottom-24 md:bottom-4 z-10 mx-auto w-[min(92%,900px)]">
				<div class="rounded-lg bg-black/60 p-3 text-white shadow-lg backdrop-blur-sm">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							{#if currentImage.title}
								<h3 class="text-base font-semibold leading-tight">{currentImage.title}</h3>
							{/if}
							{#if currentImage.description}
								<p class="mt-1 text-sm leading-snug">
									{#if showFullDetails}
										{currentImage.description}
									{:else}
										{truncate(currentImage.description, 140)}
									{/if}
								</p>
							{/if}
						</div>
						{#if currentImage.description && currentImage.description.length > 140}
							<button
								class="btn btn-sm preset-tonal-surface-500 whitespace-nowrap"
								on:click={() => (showFullDetails = !showFullDetails)}
							>
								{showFullDetails ? 'Less' : 'More'}
							</button>
						{/if}
					</div>
				</div>
			</div>
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
