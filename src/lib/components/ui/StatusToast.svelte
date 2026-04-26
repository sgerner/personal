<script>
	import { status } from '$lib/stores/status';
	import { fade } from 'svelte/transition';

	const kind = $derived($status.kind || 'success');
	const cls = $derived.by(() => {
		const base = 'rounded-md px-4 py-2 shadow-lg';
		if (kind === 'error') return `${base} bg-red-600 text-white`;
		if (kind === 'info') return `${base} bg-blue-600 text-white`;
		return `${base} bg-green-600 text-white`;
	});
</script>

{#if $status.visible}
	<div class="fixed top-4 right-4 z-50" transition:fade={{ duration: 150 }}>
		<div class={cls} aria-live="polite" role="status">
			{$status.message}
		</div>
	</div>
{/if}
