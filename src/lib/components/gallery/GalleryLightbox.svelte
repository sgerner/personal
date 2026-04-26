<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { X, ChevronLeft, ChevronRight, Info } from '@lucide/svelte';

	let { images = [], startIndex = 0 } = $props();
	const dispatch = createEventDispatcher();

	let currentIndex = $state(0);

	$effect(() => {
		currentIndex = startIndex;
	});
	let showDetails = $state(false); // toggled via info button
	let imgVisible = $state(true);

	// Close details panel when navigating
	$effect(() => {
		currentIndex;
		showDetails = false;
	});

	const currentImage = $derived(images[currentIndex]);
	const hasDetails = $derived(!!(currentImage?.description || currentImage?.tags?.length));

	// Preload upcoming and previous images
	const preloadIndices = $derived.by(() => {
		if (images.length <= 1) return [];
		const next1 = (currentIndex + 1) % images.length;
		const next2 = (currentIndex + 2) % images.length;
		const prev = (currentIndex - 1 + images.length) % images.length;
		return [...new Set([next1, next2, prev])];
	});

	function getImageUrl(image) {
		if (!image) return '';
		if (typeof image === 'string') return image;
		if (image.urls) return image.urls.xl || image.urls.lg || image.urls.original;
		return '';
	}

	async function navigate(direction) {
		// Reduce the "empty" duration. We still want a quick fade-out/in
		// but pre-loading will make the "in" part much faster.
		imgVisible = false;
		await new Promise((r) => setTimeout(r, 80));
		currentIndex = (currentIndex + direction + images.length) % images.length;
		imgVisible = true;
	}

	function nextImage() {
		navigate(1);
	}
	function prevImage() {
		navigate(-1);
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			if (showDetails) showDetails = false;
			else dispatch('close');
		} else if (event.key === 'ArrowRight') nextImage();
		else if (event.key === 'ArrowLeft') prevImage();
		else if (event.key === 'i') showDetails = !showDetails;
	}

	// Touch swipe support
	let touchStartX = 0;
	function onTouchStart(e) {
		touchStartX = e.touches[0].clientX;
	}
	function onTouchEnd(e) {
		const delta = e.changedTouches[0].clientX - touchStartX;
		if (Math.abs(delta) > 50) delta < 0 ? nextImage() : prevImage();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Full-screen backdrop -->
<div
	class="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md"
	onclick={() => {
		if (showDetails) showDetails = false;
		else dispatch('close');
	}}
	onkeydown={handleKeydown}
	ontouchstart={onTouchStart}
	ontouchend={onTouchEnd}
	role="dialog"
	aria-modal="true"
	aria-label="Image lightbox"
	tabindex="-1"
	transition:fade={{ duration: 200 }}
>
	<!-- ── Preload upcoming images ── -->
	<div class="hidden" aria-hidden="true">
		{#each preloadIndices as idx}
			<img src={getImageUrl(images[idx])} alt="" />
		{/each}
	</div>

	<!-- ── Full-screen image ── -->
	{#if currentImage && imgVisible}
		<img
			src={getImageUrl(currentImage)}
			alt={currentImage.title || currentImage.description || 'Gallery image'}
			class="absolute inset-0 h-full w-full object-contain p-8"
			draggable="false"
			transition:fade={{ duration: 120 }}
		/>
	{/if}

	<!-- ── Top bar: counter + close ── -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b
	            from-black/60 to-transparent px-4 py-3"
	>
		<!-- Counter -->
		{#if images.length > 1}
			<span
				class="pointer-events-auto rounded-full border border-white/15 bg-black/50 px-3
			             py-1 text-xs font-medium text-white/80 backdrop-blur-md"
			>
				{currentIndex + 1} / {images.length}
			</span>
		{:else}
			<span></span>
		{/if}

		<!-- Close -->
		<button
			class="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full
			       border border-white/15 bg-black/50 text-white shadow-lg
			       backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/20
			       focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
			onclick={(e) => {
				e.stopPropagation();
				dispatch('close');
			}}
			aria-label="Close lightbox"
		>
			<X size={16} />
		</button>
	</div>

	<!-- ── Bottom bar: always-visible title + info toggle ── -->
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 z-20
		       bg-gradient-to-t from-black/80 via-black/30 to-transparent"
		onclick={(e) => e.stopPropagation()}
		role="presentation"
	>
		<!-- Expanded details panel -->
		{#if showDetails && hasDetails}
			<div
				class="pointer-events-auto px-5 pt-4 pb-2"
				transition:fly={{ y: 16, duration: 250 }}
				onclick={(e) => e.stopPropagation()}
				role="presentation"
			>
				{#if currentImage.description}
					<p class="max-w-2xl text-sm leading-relaxed text-white/80">
						{currentImage.description}
					</p>
				{/if}
				{#if currentImage.tags?.length}
					<div class="mt-2 flex flex-wrap gap-1.5">
						{#each currentImage.tags as tag}
							<span
								class="rounded-full border border-white/10 bg-white/15 px-2.5
							             py-0.5 text-xs font-medium text-white/70
							             capitalize backdrop-blur-sm"
							>
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Title row + info button -->
		<div class="pointer-events-auto flex items-end justify-between gap-3 px-5 pt-3 pb-5">
			<div class="min-w-0">
				{#if currentImage?.title}
					<h3 class="truncate text-sm leading-snug font-semibold text-white drop-shadow-md">
						{currentImage.title}
					</h3>
				{/if}
				<!-- Collapsed tag preview (first tag only, fades when details open) -->
				{#if !showDetails && currentImage?.tags?.length}
					<span class="mt-0.5 inline-block text-xs text-white/50 capitalize">
						{currentImage.tags[0]}{currentImage.tags.length > 1
							? ` +${currentImage.tags.length - 1}`
							: ''}
					</span>
				{/if}
			</div>

			{#if hasDetails}
				<button
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
					       border border-white/20 shadow backdrop-blur-md transition-all duration-200
					       focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none
					       {showDetails
						? 'bg-white text-black hover:bg-white/80'
						: 'bg-black/50 text-white hover:bg-white/20'}"
					onclick={(e) => {
						e.stopPropagation();
						showDetails = !showDetails;
					}}
					aria-label={showDetails ? 'Hide details' : 'Show details'}
					aria-pressed={showDetails}
				>
					<Info size={14} />
				</button>
			{/if}
		</div>
	</div>

	<!-- ── Prev / Next ── -->
	{#if images.length > 1}
		<button
			class="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center
			       justify-center rounded-full border border-white/15 bg-black/50
			       text-white shadow-xl backdrop-blur-md transition-all duration-200
			       hover:scale-110 hover:bg-white/20 focus-visible:ring-2
			       focus-visible:ring-white/60 focus-visible:outline-none active:scale-95"
			onclick={(e) => {
				e.stopPropagation();
				prevImage();
			}}
			aria-label="Previous image"
		>
			<ChevronLeft size={20} />
		</button>

		<button
			class="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center
			       justify-center rounded-full border border-white/15 bg-black/50
			       text-white shadow-xl backdrop-blur-md transition-all duration-200
			       hover:scale-110 hover:bg-white/20 focus-visible:ring-2
			       focus-visible:ring-white/60 focus-visible:outline-none active:scale-95"
			onclick={(e) => {
				e.stopPropagation();
				nextImage();
			}}
			aria-label="Next image"
		>
			<ChevronRight size={20} />
		</button>
	{/if}
</div>
