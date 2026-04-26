<script>
	let { pool = [], intervalMs = 10000, enableVignette = true } = $props();

	let imageIndex = $state(0);
	let activeLayer = $state(0);
	let layerUrls = $state(['', '']);
	let shuffledPool = $state([]);

	function getImageUrl(image) {
		if (!image || !image.urls) return '';
		const url = image.urls.xl || image.urls.lg || image.urls.md || image.urls.original || '';
		return url;
	}

	// Watch for pool changes and initialize
	$effect(() => {
		if (pool.length > 0 && shuffledPool.length === 0) {
			shuffledPool = [...pool].sort(() => Math.random() - 0.5);
			layerUrls = [
				getImageUrl(shuffledPool[0]),
				shuffledPool.length > 1 ? getImageUrl(shuffledPool[1]) : ''
			];
		}
	});

	// Handle rotation interval
	$effect(() => {
		if (shuffledPool.length <= 1) return;

		const interval = setInterval(() => {
			imageIndex = (imageIndex + 1) % shuffledPool.length;
			const nextUrl = getImageUrl(shuffledPool[imageIndex]);
			const nextLayer = 1 - activeLayer;

			// Update the hidden layer's URL first
			if (nextLayer === 0) {
				layerUrls = [nextUrl, layerUrls[1]];
			} else {
				layerUrls = [layerUrls[0], nextUrl];
			}

			// Then swap active layer
			activeLayer = nextLayer;
		}, intervalMs);

		return () => clearInterval(interval);
	});
</script>

<div class="pointer-events-none fixed inset-0 z-[-10] bg-black">
	{#if shuffledPool.length > 0}
		<div
			class="bg-layer"
			class:visible={activeLayer === 0}
			style:background-image={layerUrls[0] ? `url("${layerUrls[0]}")` : 'none'}
		></div>
		<div
			class="bg-layer"
			class:visible={activeLayer === 1}
			style:background-image={layerUrls[1] ? `url("${layerUrls[1]}")` : 'none'}
		></div>
	{/if}

	{#if enableVignette}
		<div
			class="absolute inset-0 z-10 bg-black/20 [box-shadow:inset_0_0_10vmin_rgba(0,0,0,0.5)]"
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
