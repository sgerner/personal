<script>
  import { status } from '$lib/stores/status';
  import { fade } from 'svelte/transition';

  $: kind = $status.kind || 'success';
  $: base = 'rounded-md px-4 py-2 shadow-lg';
  $: cls = kind === 'error'
    ? `${base} bg-red-600 text-white`
    : kind === 'info'
    ? `${base} bg-blue-600 text-white`
    : `${base} bg-green-600 text-white`;
</script>

{#if $status.visible}
  <div class="fixed right-4 top-4 z-50" transition:fade={{ duration: 150 }}>
    <div class={cls} aria-live="polite" role="status">
      {$status.message}
    </div>
  </div>
{/if}

