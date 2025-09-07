<script>
	let { class: className = '' } = $props();
</script>

<div
	class="mx-auto w-full max-w-4xl rounded-lg border border-surface-200/50 bg-surface-100/50 p-4 shadow-lg backdrop-blur-xs dark:border-surface-700/50 dark:bg-surface-800/30 {className}"
>
	<slot />
</div>
