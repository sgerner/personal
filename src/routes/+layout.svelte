<script>
	import '../app.css';
	import { afterNavigate } from '$app/navigation';
	import { images } from '$lib/stores/images.js';
	import NavBar from '$lib/components/nav/NavBar.svelte';
	import Footer from '$lib/components/nav/Footer.svelte';
	import BackgroundRotator from '$lib/components/ui/BackgroundRotator.svelte';

	let { data, children } = $props();

	$effect(() => {
		images.init(data.images);
	});

	let backgroundPool = $derived.by(() => {
		const preferred = $images.images.filter((image) =>
			(image.tags || []).some(
				(tag) =>
					typeof tag === 'string' &&
					['landscape', 'nature', 'architecture'].includes(tag.toLowerCase())
			)
		);

		return (preferred.length > 0 ? preferred : $images.images).slice(0, 12);
	});

	afterNavigate(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
		setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
	<link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<div class="relative isolate min-h-screen">
	<BackgroundRotator pool={backgroundPool} intervalMs={30000} />
	<div class="site-ambient pointer-events-none fixed inset-0 z-[1]" aria-hidden="true"></div>

	<div class="relative z-10 flex min-h-screen">
		<NavBar />

		<!-- Main Content Area -->
		<div class="relative mb-16 flex min-h-screen max-w-full flex-grow flex-col md:mb-0 md:ml-4">
			<!-- Add padding-bottom on mobile to avoid overlap with the bottom nav bar -->
			<main class="flex-grow">
				{@render children?.()}
			</main>
			<Footer />
		</div>
	</div>
</div>
