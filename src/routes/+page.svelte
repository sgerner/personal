<script>
	import Seo from '$lib/components/meta/Seo.svelte';
	import GalleryLightbox from '$lib/components/gallery/GalleryLightbox.svelte';
	import { SITE_TITLE, SITE_TAGLINE, SOCIAL_LINKS } from '$lib/config/site';
	import {
		ArrowRight,
		ArrowDown,
		Mail,
		Instagram,
		Facebook,
		Youtube,
		Github,
		BookUser,
		Bike,
		BookHeart,
		Croissant,
		Camera,
		Code2,
		ExternalLink
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	const socialIcons = {
		email: { icon: Mail, label: 'Email', color: 'hover:preset-filled-primary-500' },
		instagram: { icon: Instagram, label: 'Instagram', color: 'hover:preset-filled-secondary-500' },
		facebook: { icon: Facebook, label: 'Facebook', color: 'hover:preset-filled-primary-500' },
		github: { icon: Github, label: 'GitHub', color: 'hover:preset-filled-tertiary-500' },
		storygraph: { icon: BookUser, label: 'StoryGraph', color: 'hover:preset-filled-secondary-500' },
		goodreads: { icon: BookHeart, label: 'Goodreads', color: 'hover:preset-filled-primary-500' },
		strava: { icon: Bike, label: 'Strava', color: 'hover:preset-filled-secondary-500' },
		youtube: { icon: Youtube, label: 'YouTube', color: 'hover:preset-filled-tertiary-500' }
	};

	const passions = [
		{ icon: Croissant, label: 'Baker', desc: 'Artisan breads & pastries' },
		{ icon: Bike, label: 'Cyclist', desc: 'Advocacy & adventure' },
		{ icon: Camera, label: 'Photographer', desc: 'Capturing light & life' },
		{ icon: Code2, label: 'Builder', desc: 'Tech that delights' }
	];

	const bakeryImages = [
		'/bakery/avocado.jpg',
		'/bakery/baguette.jpg',
		'/bakery/cinnamon-roll.jpeg',
		'/bakery/kouign-amann.jpg',
		'/bakery/sourdough.png'
	];

	let lightboxIndex = $state(null);

	// Scroll-reveal
	let heroVisible = $state(false);
	let aboutVisible = $state(false);
	let passionsVisible = $state(false);
	let bakeryVisible = $state(false);

	let aboutRef = $state(null);
	let passionsRef = $state(null);
	let bakeryRef = $state(null);

	onMount(() => {
		// Hero animates in immediately
		requestAnimationFrame(() => {
			heroVisible = true;
		});

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target === aboutRef) aboutVisible = true;
						if (entry.target === passionsRef) passionsVisible = true;
						if (entry.target === bakeryRef) bakeryVisible = true;
					}
				});
			},
			{ threshold: 0.15 }
		);

		if (aboutRef) observer.observe(aboutRef);
		if (passionsRef) observer.observe(passionsRef);
		if (bakeryRef) observer.observe(bakeryRef);

		return () => observer.disconnect();
	});

	function scrollToAbout() {
		aboutRef?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<Seo />

{#if lightboxIndex !== null}
	<GalleryLightbox
		images={bakeryImages}
		startIndex={lightboxIndex}
		on:close={() => (lightboxIndex = null)}
	/>
{/if}

<!-- ═══════════════════════════════════════════════ HERO ══ -->
<section
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
>
	<!-- Subtle animated radial pulse behind text -->
	<div
		class="pointer-events-none absolute inset-0 flex items-center justify-center"
		aria-hidden="true"
	>
		<div
			class="bg-gradient-radial h-[500px] w-[500px] rounded-full from-secondary-500/10 via-transparent to-transparent blur-3xl"
		></div>
	</div>

	<!-- Overline -->
	<div
		class="mb-6 flex items-center gap-3 transition-all duration-700 ease-out"
		class:opacity-0={!heroVisible}
		class:translate-y-4={!heroVisible}
		style="transition-delay: 100ms"
	>
		<span class="h-px w-10 bg-secondary-400/70"></span>
		<span class="text-xs font-bold tracking-[0.25em] text-secondary-400 uppercase"
			>Tempe, Arizona</span
		>
		<span class="h-px w-10 bg-secondary-400/70"></span>
	</div>

	<!-- Main headline -->
	<h1
		class="mb-4 text-6xl font-black tracking-tight text-white drop-shadow-xl transition-all duration-700 ease-out sm:text-7xl md:text-8xl lg:text-9xl"
		class:opacity-0={!heroVisible}
		class:translate-y-6={!heroVisible}
		style="transition-delay: 250ms; text-shadow: 0 4px 40px rgba(0,0,0,0.5);"
	>
		Hi, I'm&nbsp;<span
			class="bg-gradient-to-r from-secondary-300 to-primary-300 bg-clip-text text-transparent"
			>Steven.</span
		>
	</h1>

	<!-- Tagline -->
	<p
		class="mb-10 text-lg font-semibold tracking-[0.2em] text-white/80 uppercase drop-shadow transition-all duration-700 ease-out sm:text-xl"
		class:opacity-0={!heroVisible}
		class:translate-y-6={!heroVisible}
		style="transition-delay: 400ms"
	>
		{SITE_TAGLINE}
	</p>

	<!-- CTA buttons -->
	<div
		class="flex flex-wrap justify-center gap-3 transition-all duration-700 ease-out"
		class:opacity-0={!heroVisible}
		class:translate-y-6={!heroVisible}
		style="transition-delay: 550ms"
	>
		<button
			onclick={scrollToAbout}
			class="btn rounded-full preset-filled-secondary-500 px-7 py-3 text-sm font-bold shadow-lg shadow-secondary-500/30 transition hover:scale-105 active:scale-95"
		>
			About Me
		</button>
		<a
			href="/gallery"
			class="btn rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/20 active:scale-95"
		>
			View Gallery
		</a>
	</div>

	<!-- Scroll indicator -->
	<button
		onclick={scrollToAbout}
		class="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition hover:text-white/80"
		class:opacity-0={!heroVisible}
		style="transition: opacity 1s ease; transition-delay: 900ms; opacity: {heroVisible ? 1 : 0}"
		aria-label="Scroll down"
	>
		<span class="text-xs tracking-widest uppercase">Explore</span>
		<ArrowDown class="h-5 w-5 animate-bounce" />
	</button>
</section>

<!-- ═══════════════════════════════════════════════ ABOUT ══ -->
<section bind:this={aboutRef} class="px-4 py-20">
	<div
		class="mx-auto max-w-4xl transition-all duration-700 ease-out"
		class:opacity-0={!aboutVisible}
		class:translate-y-10={!aboutVisible}
	>
		<!-- Glass card -->
		<div
			class="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md md:p-12 dark:border-white/10 dark:bg-black/30"
		>
			<!-- Decorative gradient blob -->
			<div
				class="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-secondary-500/20 blur-3xl"
				aria-hidden="true"
			></div>
			<div
				class="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl"
				aria-hidden="true"
			></div>

			<div class="relative grid grid-cols-1 items-center gap-10 md:grid-cols-3">
				<!-- Avatar -->
				<div class="flex justify-center">
					<div class="relative">
						<!-- Glow ring -->
						<div
							class="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-secondary-400 to-primary-400 opacity-40 blur-xl"
						></div>
						<img
							src="/steven.jpg"
							alt="Portrait of Steven Gerner"
							class="relative h-44 w-44 rounded-full border-4 border-white/30 object-cover shadow-2xl"
						/>
					</div>
				</div>

				<!-- Bio -->
				<div class="md:col-span-2">
					<p class="mb-1 text-xs font-bold tracking-[0.2em] text-secondary-400 uppercase">
						Get to know me
					</p>
					<h2 class="mb-4 text-4xl font-black text-white">{SITE_TITLE}</h2>
					<p class="mb-6 text-lg leading-relaxed text-white/80">
						I'm a baker, cycling advocate, and photographer who plays with technology — based in
						Tempe, AZ. I love crafting things with my hands, whether it's sourdough, code, or a
						perfect shot.
					</p>

					<!-- Social links -->
					<div class="flex flex-wrap gap-2">
						{#each Object.entries(SOCIAL_LINKS) as [key, href]}
							{@const social = socialIcons[key]}
							{#if social}
								{@const SocialIcon = social.icon}
								<a
									{href}
									target="_blank"
									rel="noopener noreferrer"
									class="btn rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition duration-200 hover:scale-105 hover:border-white/40 hover:bg-white/20 active:scale-95"
								>
									<SocialIcon class="h-4 w-4" />
									<span>{social.label}</span>
								</a>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════ PASSIONS ══ -->
<section bind:this={passionsRef} class="px-4 pb-20">
	<div class="mx-auto max-w-4xl">
		<div
			class="mb-10 text-center transition-all duration-700 ease-out"
			class:opacity-0={!passionsVisible}
			class:translate-y-8={!passionsVisible}
		>
			<p class="mb-2 text-xs font-bold tracking-[0.2em] text-secondary-400 uppercase">What I do</p>
			<h2 class="text-3xl font-black text-white">Passion projects</h2>
		</div>

		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each passions as passion, i}
				{@const PassionIcon = passion.icon}
				<div
					class="group flex flex-col items-center rounded-2xl border border-white/15 bg-white/8 p-6 text-center backdrop-blur-sm transition-all duration-500 ease-out hover:scale-105 hover:border-secondary-400/50 hover:bg-white/15 dark:border-white/10 dark:bg-black/30"
					class:opacity-0={!passionsVisible}
					class:translate-y-8={!passionsVisible}
					style="transition-delay: {i * 100 + 200}ms"
				>
					<div
						class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-500/20 text-secondary-300 transition-all duration-300 group-hover:bg-secondary-500/40 group-hover:text-white"
					>
						<PassionIcon class="h-6 w-6" />
					</div>
					<p class="font-bold text-white">{passion.label}</p>
					<p class="mt-1 text-xs text-white/60">{passion.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════ BAKERY ══ -->
<section bind:this={bakeryRef} class="px-4 pb-24">
	<div
		class="mx-auto max-w-4xl transition-all duration-700 ease-out"
		class:opacity-0={!bakeryVisible}
		class:translate-y-10={!bakeryVisible}
	>
		<div
			class="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-black/30"
		>
			<!-- Warm accent blob -->
			<div
				class="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"
				aria-hidden="true"
			></div>

			<div class="grid grid-cols-1 gap-0 md:grid-cols-2">
				<!-- Text side -->
				<div class="flex flex-col justify-center p-8 md:p-12">
					<p class="mb-2 text-xs font-bold tracking-[0.2em] text-secondary-400 uppercase">
						Food that makes you happy
					</p>
					<h2 class="mb-4 text-4xl font-black text-white">Buttered Up Bakery</h2>
					<p class="mb-8 text-lg leading-relaxed text-white/80">
						Delightful pastries crafted with love. Indulge in my handcrafted breads, pastries, and
						sandwiches — made fresh every day in Tempe, AZ.
					</p>
					<a
						href="https://butteredupbakery.com"
						target="_blank"
						rel="noopener noreferrer"
						class="btn w-fit rounded-full border border-amber-400/50 bg-amber-500/20 px-7 py-3 text-sm font-bold text-amber-200 backdrop-blur-sm transition hover:scale-105 hover:bg-amber-500/40 active:scale-95"
					>
						<Croissant class="h-4 w-4" />
						<span>Visit the Bakery</span>
						<ExternalLink class="h-3 w-3 opacity-60" />
					</a>
				</div>

				<!-- Image mosaic side -->
				<div class="flex flex-col gap-0">
					<!-- Logo + image strip stack -->
					<div class="flex h-full flex-col">
						<!-- Bakery logo centered at top of image column on mobile -->
						<div class="flex items-center justify-center bg-black/20 p-6 md:hidden">
							<img
								src="/ButteredUpBakery_ColorYellow_Circle.png"
								alt="Buttered Up Bakery Logo"
								class="h-24 w-24 drop-shadow-xl"
							/>
						</div>
						<!-- Image strip -->
						<div class="flex flex-1 overflow-x-auto">
							<div class="flex min-w-full gap-1 p-3">
								{#each bakeryImages as src, i}
									<button
										onclick={() => (lightboxIndex = i)}
										class="group relative min-w-[7rem] flex-1 overflow-hidden rounded-xl focus:outline-none"
										aria-label="View bakery image {i + 1}"
									>
										<img
											{src}
											alt="Bakery item {i + 1}"
											class="aspect-square h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
										/>
										<!-- Hover overlay -->
										<div
											class="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10 group-focus:ring-2 group-focus:ring-secondary-400"
										></div>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
