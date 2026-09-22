<script>
	import { ExternalLink, Github } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let {
		title = 'Project Title',
		description = 'A brief one-line description of the project.',
		tags = ['Svelte', 'Tailwind', 'Vercel'],
		githubUrl = null,
		demoUrl = null,
		image = null,
		imageFit = 'cover'
	} = $props();
</script>

<div
	class="editorial-surface flex h-full flex-col rounded-lg p-4 transition hover:-translate-y-1 hover:border-secondary-500/50 dark:hover:border-secondary-400/50"
>
	<header class="">
		<h4 class="h4 text-slate-950 dark:text-white">{title}</h4>
	</header>
	<div class="flex-grow">
		<p class="text-slate-600 dark:text-white/75">{description}</p>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each tags as tag}
				<span class="chip rounded-sm preset-tonal-primary">{tag}</span>
			{/each}
		</div>
	</div>
	{#if image}
		<button
			type="button"
			onclick={() => dispatch('view')}
			class="mt-4 block w-full overflow-hidden rounded-md border border-slate-900/10 bg-slate-100 focus-visible:outline-none dark:border-white/10 dark:bg-slate-950/80"
			aria-label={`Open ${title} screenshot`}
		>
			<img
				src={image}
				alt={title}
				class="block aspect-[16/10] h-full w-full transition-transform hover:scale-[1.02] {imageFit ===
				'contain'
					? 'object-contain'
					: 'object-cover'}"
			/>
		</button>
	{/if}

	<footer class="mt-4 flex items-center justify-center space-x-4">
		{#if githubUrl}
			<a
				href={githubUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn flex items-center gap-2 preset-filled-secondary-500 btn-sm"
				aria-label={`View ${title} on GitHub`}
			>
				<Github size={16} />
				<span>Code</span>
			</a>
		{/if}
		{#if demoUrl}
			<a
				href={demoUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn flex items-center gap-2 preset-filled btn-sm"
				aria-label={`Open ${title} demo`}
			>
				Live demo
				<ExternalLink size={14} />
			</a>
		{/if}
	</footer>
</div>
