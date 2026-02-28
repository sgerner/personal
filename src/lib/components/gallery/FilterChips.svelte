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
	class="mx-auto flex max-w-fit flex-wrap justify-center gap-1.5 rounded-2xl
            border border-white/10 bg-black/30 p-1.5 shadow-lg backdrop-blur-md"
>
	{#if showAll}
		<button
			type="button"
			class="chip px-3 py-1 text-sm font-semibold capitalize transition-all duration-200
			       {activeTags.length === 0
				? 'scale-[1.03] preset-filled-secondary-500 shadow-md'
				: 'hover:preset-tonal-secondary-500 preset-outlined-surface-500 opacity-70 hover:opacity-100'}"
			onclick={clearAll}
		>
			All
			<span class="ml-1 text-xs font-normal opacity-70">{totalCount}</span>
		</button>
	{/if}
	{#each Array.from(allTags) as tag}
		<button
			type="button"
			class="chip px-3 py-1 text-sm font-semibold capitalize transition-all duration-200
			       {activeTags.includes(tag)
				? 'scale-[1.03] preset-filled-secondary-500 shadow-md'
				: 'hover:preset-tonal-secondary-500 preset-outlined-surface-500 opacity-70 hover:opacity-100'}"
			onclick={() => toggleTag(tag)}
		>
			{tag}
			<span class="ml-1 text-xs font-normal opacity-70">{tagCounts?.[tag] ?? 0}</span>
		</button>
	{/each}
</div>
