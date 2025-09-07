<script>
	import GlassPanel from '$lib/components/ui/GlassPanel.svelte';
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

<GlassPanel>
	<div class="flex flex-wrap justify-center gap-2">
		{#if showAll}
			<button
				type="button"
				class={`chip px-2 capitalize ${activeTags.length === 0 ? 'preset-filled-tertiary-500' : 'preset-outlined-tertiary-500'}`}
				onclick={clearAll}
			>
				<span class="font-bold">All</span>
				<span class="opacity-80">{totalCount}</span>
			</button>
		{/if}
		{#each Array.from(allTags) as tag}
			<button
				type="button"
				class={`chip px-2 capitalize ${activeTags.includes(tag) ? 'preset-filled-tertiary-500' : 'preset-outlined-tertiary-500'}`}
				onclick={() => toggleTag(tag)}
			>
				<span class="font-bold">{tag}</span>
				<span class="opacity-80">{tagCounts?.[tag] ?? 0}</span>
			</button>
		{/each}
	</div>
</GlassPanel>
