<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { editingImage } from '$lib/stores/modal';
	import EditImageModal from '$lib/components/admin/EditImageModal.svelte';
	import StatusToast from '$lib/components/ui/StatusToast.svelte';
	import { flash } from '$lib/stores/status';
	import GlassPanel from '$lib/components/ui/GlassPanel.svelte';
	import { Pencil, Trash2 } from '@lucide/svelte';

	let geoFilter = 'all'; // 'all' | 'with' | 'without'
	$: imagesFiltered = $page.data.images.filter((img) => {
		const lat = img?.gps?.lat;
		const lon = img?.gps?.lon;
		const hasGPS =
			typeof lat === 'number' &&
			typeof lon === 'number' &&
			!Number.isNaN(lat) &&
			!Number.isNaN(lon) &&
			!(lat === 0 && lon === 0);
		if (geoFilter === 'with') return hasGPS;
		if (geoFilter === 'without') return !hasGPS;
		return true;
	});
</script>

<EditImageModal />
<StatusToast />

<div class="container mx-auto p-4">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="h1 text-white">Admin</h1>
		<form method="POST" action="/admin/login?/logout" use:enhance>
			<button type="submit" class="btn preset-outlined-surface-500">Logout</button>
		</form>
	</div>

	<div class="mb-6 flex flex-wrap items-center gap-3">
		<button
			class={`btn ${geoFilter === 'all' ? 'preset-tonal-secondary' : 'preset-outlined-surface-500'}`}
			on:click={() => (geoFilter = 'all')}
		>
			All
		</button>
		<button
			class={`btn ${geoFilter === 'with' ? 'preset-tonal-secondary' : 'preset-outlined-surface-500'}`}
			on:click={() => (geoFilter = 'with')}
		>
			Has GPS
		</button>
		<button
			class={`btn ${geoFilter === 'without' ? 'preset-tonal-secondary' : 'preset-outlined-surface-500'}`}
			on:click={() => (geoFilter = 'without')}
		>
			No GPS
		</button>
		<div class="ml-auto">
			<button
				class="btn preset-filled-primary-500"
				on:click={() =>
					editingImage.set({
						mode: 'create',
						title: '',
						description: '',
						tags: [],
						urls: {},
						gps: null
					})}
			>
				Upload New Image
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each imagesFiltered as image (image.id)}
			<GlassPanel>
				<div class="group relative">
					<img src={image.urls.thumb} alt={image.title} class="h-48 w-full object-cover" />
					<div class="absolute top-2 right-2 flex space-x-2">
						<button
							on:click={() => editingImage.set(image)}
							class="btn-icon preset-filled-secondary-500"
						>
							<Pencil size={20} />
						</button>
						<form
							method="POST"
							action="?/delete"
							use:enhance={({ cancel }) => {
								if (!confirm('Delete this image? This cannot be undone.')) {
									cancel();
									return;
								}
								return async ({ result, update }) => {
									if (result.type === 'success') {
										flash('Image deleted', 'success');
										try {
											await update({ invalidateAll: true, reset: false });
										} catch {}
									} else if (result.type === 'failure') {
										flash(result.data?.error || 'Delete failed', 'error');
									} else if (result.type === 'error') {
										flash(result.error?.message || 'Delete error', 'error');
									}
								};
							}}
						>
							<input type="hidden" name="id" value={image.id} />
							<button type="submit" class="btn-icon preset-filled-error-500">
								<Trash2 size={20} />
							</button>
						</form>
					</div>
				</div>
				<div class="p-4">
					<h5 class="h5">{image.title}</h5>
					<p>{image.description}</p>
				</div>
			</GlassPanel>
		{/each}
	</div>
</div>
