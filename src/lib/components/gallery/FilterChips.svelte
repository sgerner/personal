<script>
	let { allTags = [], activeTags = $bindable() } = $props();

	function toggleTag(tag) {
		const index = activeTags.indexOf(tag);
		if (index === -1) {
			activeTags = [...activeTags, tag];
		} else {
			activeTags = activeTags.filter((t) => t !== tag);
		}
	}
</script>

<div class="flex flex-wrap justify-center gap-2">
	{#each Array.from(allTags) as tag}
		<button
			type="button"
			class="chip"
			class:variant-filled={activeTags.includes(tag)}
			on:click={() => toggleTag(tag)}
		>
			<span>{tag}</span>
		</button>
	{/each}
</div>
