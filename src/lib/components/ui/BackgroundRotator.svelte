<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	let { pool = [], intervalMs = 10000, enableVignette = true } = $props();

	let imageIndex = $state(0);
	let activeLayer = $state(0);
	let layerUrls = $state(['', '']);
	let shuffledPool = $state([]);

	function getImageUrl(image) {
		if (!image || !image.urls) return '';
		return image.urls.xl || image.urls.lg || image.urls.md || image.urls.original;
	}

	onMount(() => {
		if (pool.length === 0) return;

		// Randomize the order of the images
		shuffledPool = [...pool].sort(() => Math.random() - 0.5);

		// Set initial state
		layerUrls[0] = getImageUrl(shuffledPool[0]);
		if (shuffledPool.length > 1) {
			layerUrls[1] = getImageUrl(shuffledPool[1]);
		}

		const intervalId = setInterval(() => {
			// Determine next image and inactive layer
			const nextImageIndex = (imageIndex + 1) % shuffledPool.length;
			const inactiveLayer = 1 - activeLayer;

			// Update the URL of the layer that is currently hidden
			layerUrls[inactiveLayer] = getImageUrl(shuffledPool[nextImageIndex]);

			// Swap the active layer, triggering the CSS transition
			activeLayer = inactiveLayer;
			imageIndex = nextImageIndex;
		}, intervalMs);

		return () => {
			clearInterval(intervalId);
		};
	});
</script>

<div class="fixed inset-0 z-[-1] bg-black">
	{#if shuffledPool.length > 0}
		<div
			class="bg-layer"
			class:visible={activeLayer === 0}
			style:background-image="url('{layerUrls[0]}')"
		></div>
		<div
			class="bg-layer"
			class:visible={activeLayer === 1}
			style:background-image="url('{layerUrls[1]}')"
		></div>
	{/if}

	{#if enableVignette}
		<div
			class="absolute inset-0 bg-black/20 [box-shadow:inset_0_0_10vmin_rgba(0,0,0,0.5)]"
		></div>
	{/if}
</div>

<style>
	.bg-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		opacity: 0;
		transition:
			opacity 3s linear,
			filter 1s linear;
		will-change: opacity;
	}
	.bg-layer.visible {
		opacity: 1;
	}

	:global(html[data-mode='dark']) .bg-layer {
		filter: brightness(0.8);
	}

	:global(html[data-mode='light']) .bg-layer {
		filter: brightness(1.2);
	}
</style>