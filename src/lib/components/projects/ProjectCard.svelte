<script>
	import { Github } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let {
		title = 'Project Title',
		description = 'A brief one-line description of the project.',
		tags = ['Svelte', 'Tailwind', 'Vercel'],
		githubUrl = '#',
		demoUrl = null,
		image = null
	} = $props();
</script>

<div
	class="flex h-full flex-col rounded-lg border border-surface-500/50 bg-surface-100/50 p-4 shadow-lg backdrop-blur-xs dark:bg-surface-800/50"
>
	<header class="">
		<h4 class="h4">{title}</h4>
	</header>
	<div class="flex-grow">
		<p>{description}</p>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each tags as tag}
				<span class="chip preset-tonal-primary">{tag}</span>
			{/each}
		</div>
	</div>
	{#if image}
		<button on:click={() => dispatch('view')} class="mt-4 focus:outline-none">
			<img
				src={image}
				alt={title}
				class="rounded-lg shadow-md transition-transform hover:scale-105 focus:ring-2 focus:ring-primary-500"
			/>
		</button>
	{/if}

	<footer class="mt-4 flex items-center justify-center space-x-4">
		{#if githubUrl}
			<a
				href={githubUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn preset-filled-secondary-500 btn-sm"
			>
				<Github />
			</a>
		{/if}
		{#if demoUrl}
			<a href={demoUrl} target="_blank" rel="noopener noreferrer" class="btn preset-filled">
				Demo
			</a>
		{/if}
	</footer>
</div>
