<script>
	import Seo from '$lib/components/meta/Seo.svelte';
	import ProjectCard from '$lib/components/projects/ProjectCard.svelte';
	import GalleryLightbox from '$lib/components/gallery/GalleryLightbox.svelte';

	const projects = [
		{
			title: 'Farin.app',
			description: 'The Operating System for Food.',
			tags: ['SaaS', 'Food Tech'],
			demoUrl: 'https://farin.app',
			image: '/projects/farin-app.png'
		},
		{
			title: '3 Feet Please',
			description: 'An event, volunteer, and advocacy hub for cyclists.',
			tags: ['SvelteKit', 'Svelte 5', 'Tailwind', 'Skeleton UI', 'Supabase'],
			githubUrl: 'https://github.com/sgerner/3fp-road-id',
			demoUrl: 'https://3fp-road-id.vercel.app/',
			image: '/projects/3fp-org.png'
		},
		{
			title: 'Turnleaf',
			description:
				'An offline-first EPUB reader for Kavita with paginated reading, progress sync, and native mobile storage.',
			tags: ['Svelte 5', 'TypeScript', 'Capacitor', 'EPUB.js', 'SQLite'],
			githubUrl: 'https://github.com/sgerner/turnleaf',
			image: '/projects/turnleaf.png',
			imageFit: 'contain'
		},
		{
			title: 'Bookward',
			description:
				'A self-hosted, explainable book discovery system built around your reading history and trusted sources.',
			tags: ['SvelteKit', 'FastAPI', 'SQLite', 'Embeddings', 'Self-hosted'],
			githubUrl: 'https://github.com/sgerner/bookward',
			image: '/projects/bookward.png'
		},
		{
			title: 'Memory Hub',
			description:
				'Personal memory hub stack for agents, ingestion, embeddings, enrichment, and operator tooling.',
			tags: ['Python', 'Postgres', 'Ollama', 'MCP', 'Svelte 5'],
			githubUrl: 'https://github.com/sgerner/memory-hub',
			image: '/projects/memory-hub.png'
		},
		{
			title: 'Feed Me Maybe',
			description: 'A self-hosted, AI-powered RSS reader built with SvelteKit and SQLite.',
			tags: ['SvelteKit', 'SQLite', 'AI', 'PWA', 'Tailwind'],
			githubUrl: 'https://github.com/sgerner/feed-me-maybe',
			image: '/projects/feed-me-maybe.png'
		},
		{
			title: 'Dear Robot',
			description: 'A self-hosted, AI-first email client with IMAP, SMTP, and SvelteKit.',
			tags: ['SvelteKit', 'SQLite', 'AI', 'IMAP', 'SMTP'],
			githubUrl: 'https://github.com/sgerner/dear-robot',
			image: '/projects/dear-robot.png'
		},
		{
			title: 'Complete Streets',
			description: 'Advocacy Website for a Complete Streets Program.',
			tags: ['SvelteKit', 'Svelte 5', 'Tailwind', 'Skeleton UI'],
			githubUrl: 'https://github.com/sgerner/complete-streets',
			demoUrl: 'https://complete-streets.vercel.app/',
			image: '/projects/complete-streets.png'
		},
		{
			title: 'Volunteer Sign-up App',
			description: 'A digital volunteer sign-up app for cyclists.',
			tags: ['SvelteKit', 'Svelte 4', 'Tailwind', 'Skeleton UI', 'Airtable'],
			githubUrl: 'https://github.com/sgerner/tbag-airtable-volunteer-form',
			demoUrl: 'https://tbag-volunteer.vercel.app/',
			image: '/projects/tbag-volunteer.png'
		},
		{
			title: 'Cycling Advocacy Policy Prioritizer',
			description: 'A tool to help cyclists prioritize advocacy policies.',
			tags: ['SvelteKit', 'Svelte 5', 'Tailwind', 'Skeleton UI', 'Supabase'],
			githubUrl: 'https://github.com/sgerner/tempe-bike-policies',
			demoUrl: 'https://tempe-bike-policies.vercel.app/',
			image: '/projects/policy-prioritizer.png'
		},
		{
			title: 'Bike Count App',
			description: 'A tool to digitize bike counts.',
			tags: ['SvelteKit', 'Svelte 4', 'Tailwind', 'Skeleton UI', 'Supabase'],
			githubUrl: 'https://github.com/sgerner/bikecount',
			demoUrl: 'https://bikecount.vercel.app/',
			image: '/projects/bikecount.png'
		}
	];

	let lightboxIndex = $state(null);
	const projectImages = projects.map((p) => ({ ...p, urls: { original: p.image } }));
</script>

<Seo title="Projects" description="A selection of personal and professional projects." />

{#if lightboxIndex !== null}
	<GalleryLightbox
		images={projectImages}
		startIndex={lightboxIndex}
		on:close={() => (lightboxIndex = null)}
	/>
{/if}

<div class="container mx-auto px-4 pb-16 sm:px-6">
	<header
		class="mx-auto flex max-w-5xl flex-col justify-end border-b border-white/20 py-16 text-left sm:py-20"
	>
		<p class="mb-3 text-xs font-bold tracking-[0.3em] text-secondary-300 uppercase">
			Selected builds
		</p>
		<h1 class="w-full text-5xl font-black tracking-tight text-white drop-shadow-sm sm:text-7xl">
			Projects
		</h1>
		<div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<p class="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
				Tools, products, and experiments across memory, media, food, and mobility.
			</p>
		</div>
	</header>

	<div class="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project, i}
			<ProjectCard {...project} on:view={() => (lightboxIndex = i)} />
		{/each}
	</div>
</div>
