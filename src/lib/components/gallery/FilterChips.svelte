<script>
	let {
		allTags = [],
		activeTags = $bindable(),
		showAll = true,
		tagCounts = {},
		totalCount = 0,
		single = false
	} = $props();

	function toggleTag(tag) {
		const isSelected = activeTags.includes(tag);
		if (single) {
			activeTags = isSelected ? [] : [tag];
			return;
		}
		const index = activeTags.indexOf(tag);
		if (index === -1) {
			activeTags = [...activeTags, tag];
		} else {
			activeTags = activeTags.filter((t) => t !== tag);
		}
	}

	function clearAll() {
		activeTags = [];
	}
</script>

<div
	class="mx-auto flex max-w-6xl flex-nowrap items-center justify-start gap-1.5 overflow-x-auto rounded-md bg-white/60 p-2 shadow-sm shadow-black/5 backdrop-blur-md md:flex-wrap md:justify-center dark:bg-slate-950/55 dark:shadow-black/15"
	aria-label="Filter gallery by tag"
>
	{#if showAll}
		<button
			type="button"
			aria-pressed={activeTags.length === 0}
			class="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold capitalize transition-colors duration-200
		       {activeTags.length === 0
				? 'border-secondary-500/50 bg-secondary-500 text-slate-950 shadow-sm dark:bg-secondary-400'
				: 'border-slate-900/10 bg-slate-900/5 text-slate-700 hover:border-secondary-500/50 hover:bg-secondary-500/15 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:border-secondary-400/50 dark:hover:bg-secondary-400/15 dark:hover:text-white'}"
			onclick={clearAll}
		>
			All
			<span class="text-xs font-normal opacity-65">{totalCount}</span>
		</button>
	{/if}
	{#each Array.from(allTags) as tag}
		<button
			type="button"
			aria-pressed={activeTags.includes(tag)}
			class="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold capitalize transition-colors duration-200
		       {activeTags.includes(tag)
				? 'border-secondary-500/50 bg-secondary-500 text-slate-950 shadow-sm dark:bg-secondary-400'
				: 'border-slate-900/10 bg-slate-900/5 text-slate-700 hover:border-secondary-500/50 hover:bg-secondary-500/15 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:border-secondary-400/50 dark:hover:bg-secondary-400/15 dark:hover:text-white'}"
			onclick={() => toggleTag(tag)}
		>
			{tag}
			<span class="text-xs font-normal opacity-65">{tagCounts?.[tag] ?? 0}</span>
		</button>
	{/each}
</div>
