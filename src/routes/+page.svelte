<script>
	// @ts-nocheck
	import Seo from '$lib/components/meta/Seo.svelte';
	import GlassPanel from '$lib/components/ui/GlassPanel.svelte';
	import GalleryLightbox from '$lib/components/gallery/GalleryLightbox.svelte';
	import { SITE_TITLE, SITE_TAGLINE, SOCIAL_LINKS } from '$lib/config/site';
	import {
		ArrowRight,
		Mail,
		Instagram,
		Facebook,
		Youtube,
		Github,
		BookUser,
		Bike,
		BookHeart
	} from '@lucide/svelte';

	const socialIcons = {
		email: { icon: Mail, label: 'Email' },
		instagram: { icon: Instagram, label: 'Instagram' },
		facebook: { icon: Facebook, label: 'Facebook' },
		github: { icon: Github, label: 'GitHub' },
		storygraph: { icon: BookUser, label: 'StoryGraph' },
		goodreads: { icon: BookHeart, label: 'Goodreads' },
		strava: { icon: Bike, label: 'Strava' },
		youtube: { icon: Youtube, label: 'YouTube' }
	};

	const bakeryImages = [
		'/bakery/avocado.jpg',
		'/bakery/baguette.jpg',
		'/bakery/cinnamon-roll.jpeg',
		'/bakery/kouign-amann.jpg',
		'/bakery/sourdough.png'
	];

	let lightboxIndex = $state(null);
</script>

<Seo />

{#if lightboxIndex !== null}
	<GalleryLightbox
		images={bakeryImages}
		startIndex={lightboxIndex}
		on:close={() => (lightboxIndex = null)}
	/>
{/if}

<div class="container mx-auto flex flex-col gap-4 space-y-8 p-4">
	<!-- Hero -->
	<div class="mx-auto flex h-[50dvh] max-w-prose flex-wrap content-center items-center">
		<h1 class="h1 text-white drop-shadow-sm">Hi, I'm Steven.</h1>
		<h5 class="text-center h5 text-secondary-500 uppercase drop-shadow-sm">
			{SITE_TAGLINE}
		</h5>
	</div>
	<!-- About Section -->
	<GlassPanel>
		<div class="grid grid-cols-1 items-center gap-4 p-4 md:grid-cols-3">
			<div class="md:col-span-2">
				<h2 class="h2">{SITE_TITLE}</h2>
				<div class="max-w-xl space-y-4 text-lg">
					<p>
						I'm a baker, cycling advocate, and photographer who plays with technology based in
						Tempe, AZ.
					</p>
				</div>
				<div class="mt-4">
					<div class="flex max-w-xl flex-wrap gap-2">
						{#each Object.entries(SOCIAL_LINKS) as [key, href]}
							{@const social = socialIcons[key]}
							{#if social}
								<a
									{href}
									target="_blank"
									rel="noopener noreferrer"
									class="btn border border-secondary-500/20 hover:preset-filled-secondary-500"
								>
									<svelte:component this={social.icon} class="h-4 w-4" />
									<span>{social.label}</span>
								</a>
							{/if}
						{/each}
					</div>
				</div>
			</div>
			<div class="flex justify-center">
				<div class="h-48 w-48 items-center justify-center">
					<img
						src="/steven.jpg"
						alt="Portrait"
						class="rounded-full border border-surface-200 bg-tertiary-500"
					/>
				</div>
			</div>
		</div>
	</GlassPanel>

	<!-- Bakery Section -->
	<GlassPanel>
		<div class="p-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="flex hidden justify-center md:block">
					<div class="h-62 w-62 items-center justify-center">
						<img
							src="/ButteredUpBakery_ColorYellow_Circle.png"
							alt="Buttered Up Bakery Logo"
							class="rounded-full"
						/>
					</div>
				</div>
				<div class="md:col-span-2">
					<div class="mt-4">
						<h5 class="mb-2 h5 text-sm text-secondary-500 uppercase">Food That Makes You Happy</h5>
						<h2 class="mb-2 h2">Buttered Up Bakery</h2>
						<p class="mx-auto max-w-prose text-lg">
							Delightful Pastries Crafted with Love! Indulge at my bakery in handcrafted pastries,
							breads, and sandwiches.
						</p>
					</div>
					<a
						href="https://butteredupbakery.com"
						target="_blank"
						rel="noopener noreferrer"
						class="mt-6 btn preset-filled-secondary-500 btn-lg"
					>
						<span>Visit the Bakery</span>
						<ArrowRight />
					</a>
				</div>
			</div>
			<div class="mx-auto mt-6 w-full">
				<div class="overflow-x-auto pb-2">
					<div class="flex gap-2">
						{#each bakeryImages as src, i}
							<div class="w-32 flex-shrink-0">
								<button on:click={() => (lightboxIndex = i)} class="w-full focus:outline-none">
									<img
										{src}
										alt="Bakery item {i + 1}"
										class="aspect-square w-full rounded-lg object-cover shadow-md transition-transform hover:scale-105 focus:ring-2 focus:ring-primary-500"
									/>
								</button>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</GlassPanel>
</div>
