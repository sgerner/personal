<script>
	import '../app.css';
	import { images } from '$lib/stores/images.js';
	import NavBar from '$lib/components/nav/NavBar.svelte';
	import Footer from '$lib/components/nav/Footer.svelte';
	import BackgroundRotator from '$lib/components/ui/BackgroundRotator.svelte';

	let { data, children } = $props();

	images.init(data.images);

	function handleContextMenu(event) {
		if (event.target.tagName === 'IMG') {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<div on:contextmenu={handleContextMenu} class="h-screen">
	<BackgroundRotator pool={$images.images} intervalMs={30000} />

	<div class="flex">
		<NavBar />

		<!-- Main Content Area -->
		<div
			class="z-10 mb-36 flex h-screen min-h-screen max-w-full flex-grow flex-col overflow-y-auto md:mb-0 md:ml-20"
		>
			<!-- Add padding-bottom on mobile to avoid overlap with the bottom nav bar -->
			<main class="flex-grow">
				{@render children?.()}
			</main>
			<Footer />
		</div>
	</div>
</div>
