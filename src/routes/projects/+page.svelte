<script>
	import Seo from '$lib/components/meta/Seo.svelte';
	import ProjectCard from '$lib/components/projects/ProjectCard.svelte';
	import GalleryLightbox from '$lib/components/gallery/GalleryLightbox.svelte';

	const projects = [
		{
			title: 'Safe Spokes',
			description: 'A digital road id bracelet for cyclists.',
			tags: ['SvelteKit', 'Svelte 5', 'Tailwind', 'Skeleton UI', 'Supabase'],
			githubUrl: 'https://github.com/sgerner/3fp-road-id',
			demoUrl: 'https://3fp-road-id.vercel.app/',
			image: '/projects/safe-spokes.png'
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
	const projectImages = projects.map(p => ({ ...p, urls: { original: p.image } }));
</script>

<Seo title="Projects" description="A selection of personal and professional projects." />

{#if lightboxIndex !== null}
	<GalleryLightbox
		images={projectImages}
		startIndex={lightboxIndex}
		on:close={() => (lightboxIndex = null)}
	/>
{/if}

<div class="container mx-auto p-4">
	<header class="mx-auto flex h-[30dvh] max-w-prose flex-wrap content-center text-left">
		<h1 class="w-full h1 text-white drop-shadow-sm">Projects</h1>
		<h5 class=" h5 text-secondary-500 uppercase drop-shadow-sm">Programming</h5>
	</header>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project, i}
			<ProjectCard {...project} on:view={() => lightboxIndex = i} />
		{/each}
	</div>
</div>
