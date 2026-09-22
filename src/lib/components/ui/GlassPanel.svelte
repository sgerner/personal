<script>
	let { class: className = '', children } = $props();
</script>

<div class="editorial-surface mx-auto w-full max-w-4xl rounded-lg p-4 {className}">
	{@render children?.()}
</div>
