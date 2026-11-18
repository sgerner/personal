<script>
	import { editingImage } from '$lib/stores/modal';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { flash } from '$lib/stores/status';
	import { Wand2 } from '@lucide/svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import 'leaflet/dist/leaflet.css';

	let { allowedTags = [] } = $props();

	let errorMessage = $state('');
	let pending = $state(false);
	let latLocal = $state('');
	let lonLocal = $state('');
	let searchQuery = $state('');
	let gpsJustApplied = $state(false);
	let MapComponent = $state();
	let tagsLocal = $state([]);

	function toggleTag(tag) {
		if (tagsLocal.includes(tag)) {
			tagsLocal = tagsLocal.filter((t) => t !== tag);
		} else {
			tagsLocal = [...tagsLocal, tag];
		}
	}
	const isCreate = $derived(!$editingImage?.id);
	let filePreview = $state('');
	const bgUrl = $derived(filePreview || $editingImage?.urls?.md || '');

	onMount(async () => {
		MapComponent = (await import('./Map.svelte')).default;
	});

	onDestroy(() => URL.revokeObjectURL(filePreview));

	$effect(() => {
		if (!$editingImage) return;
		const g = $editingImage.gps;
		if (g && typeof g.lat === 'number' && typeof g.lon === 'number') {
			latLocal = g.lat;
			lonLocal = g.lon;
		} else {
			latLocal = '';
			lonLocal = '';
		}
		tagsLocal = Array.isArray($editingImage.tags)
			? allowedTags.filter((t) =>
					$editingImage.tags.some((s) => String(s).toLowerCase() === t.toLowerCase())
				)
			: [];
	});

	async function searchLocation() {
		if (searchQuery.length < 3) return;
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
		);
		const data = await response.json();
		if (data && data.length > 0) {
			const { lat, lon } = data[0];
			latLocal = parseFloat(lat);
			lonLocal = parseFloat(lon);
		}
	}

	function closeModal() {
		URL.revokeObjectURL(filePreview);
		filePreview = '';
		errorMessage = '';
		searchQuery = '';
		editingImage.set(null);
	}

	function handleEscape(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleFileChange(event) {
		URL.revokeObjectURL(filePreview);
		const file = event.currentTarget.files[0];
		filePreview = file ? URL.createObjectURL(file) : '';
	}

	function applyMapLocation({ lat, lng }) {
		latLocal = Number(lat.toFixed(6));
		lonLocal = Number(lng.toFixed(6));
		gpsJustApplied = true;
		setTimeout(() => (gpsJustApplied = false), 2000);
	}

	function applyGpsToSearch() {
		if (!Number.isFinite(latLocal) || !Number.isFinite(lonLocal)) return;
		searchQuery = `${latLocal.toFixed(4)}, ${lonLocal.toFixed(4)}`;
	}
</script>

{#if $editingImage}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onkeydown={handleEscape}
		role="dialog"
		aria-modal="true"
		aria-labelledby="image-editor-title"
		tabindex="-1"
	>
		<div
			class="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-surface-500/30 bg-surface-900/90 shadow-2xl md:flex-row"
			style={`background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${bgUrl}'); background-size: cover; background-position: center;`}
		>
			<!-- Left side: Form -->
			<div class="flex-1 overflow-y-auto bg-black/40 p-6 backdrop-blur-md md:p-8">
				<h2 id="image-editor-title" class="mb-6 h2 font-bold text-white">
					{isCreate ? 'Add' : 'Edit'} Image
				</h2>

				{#if errorMessage}
					<div class="alert variant-filled-error mb-6">{errorMessage}</div>
				{/if}

				<form
					method="POST"
					action={isCreate ? '?/upload' : '?/update'}
					enctype="multipart/form-data"
					use:enhance={() => {
						pending = true;
						errorMessage = '';
						return async ({ result, update }) => {
							pending = false;
							if (result.type === 'success') {
								flash('Image saved', 'success');
								try {
									await update();
								} catch {
									/* empty */
								}
								closeModal();
							} else if (result.type === 'failure') {
								errorMessage = result.data?.error || 'Validation failed';
							} else if (result.type === 'error') {
								errorMessage = result.error?.message || 'Server error';
							}
						};
					}}
					class="space-y-6"
				>
					<input type="hidden" name="id" value={$editingImage.id || ''} />
					<input type="hidden" name="tags" value={tagsLocal.join(',')} />

					<div>
						<label class="mb-1 block text-white">
							<span class="mb-1 block">Title:</span>
							<input
								type="text"
								name="title"
								placeholder="Image title"
								value={$editingImage.title || ''}
								class="input preset-filled-surface-900-100"
								required
							/>
						</label>
					</div>

					<div>
						<label class="mb-1 block text-white">
							<span class="mb-1 block">Description:</span>
							<textarea
								name="description"
								rows="3"
								placeholder="Describe this scene..."
								class="textarea preset-filled-surface-900-100"
								>{$editingImage.description || ''}</textarea
							>
						</label>
					</div>
					<div>
						<span class="mb-1 block font-medium text-white">Categories:</span>
						<div class="flex flex-wrap gap-1">
							{#each allowedTags as tag}
								<button
									type="button"
									class={`chip capitalize ${tagsLocal.includes(tag) ? 'preset-filled-tertiary-500' : 'preset-outlined-tertiary-500 bg-white/70 dark:bg-black/50'}`}
									onclick={() => toggleTag(tag)}
								>
									<span>{tag}</span>
								</button>
							{/each}
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="mb-1 block text-white">
								<span class="mb-1 block">Latitude:</span>
								<input
									type="number"
									name="lat"
									step="any"
									placeholder="0.0000"
									bind:value={latLocal}
									class="input preset-filled-surface-900-100"
								/>
							</label>
						</div>
						<div>
							<label class="mb-1 block text-white">
								<span class="mb-1 block">Longitude:</span>
								<input
									type="number"
									name="lon"
									step="any"
									placeholder="0.0000"
									bind:value={lonLocal}
									class="input preset-filled-surface-900-100"
								/>
							</label>
						</div>
					</div>

					{#if isCreate}
						<div class="space-y-2">
							<label class="mb-1 block text-white">
								<span class="mb-1 block">Upload Image:</span>
								<input
									type="file"
									name="image"
									accept="image/*"
									required
									onchange={handleFileChange}
									class="input preset-filled-surface-900-100"
								/>
							</label>
						</div>
					{/if}

					<div class="flex items-center gap-4 pt-4">
						<button
							type="submit"
							class="btn flex-1 preset-filled-primary-500 font-bold"
							disabled={pending}
						>
							{#if pending}
								<Progress value={null} size="sm" class="w-full" />
							{:else}
								Save Changes
							{/if}
						</button>
						<button
							type="button"
							class="preset-outlined-white btn"
							onclick={closeModal}
							disabled={pending}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>

			<!-- Right side: Map -->
			<div class="relative hidden flex-1 flex-col bg-surface-900/40 md:flex">
				<div class="absolute inset-0 flex flex-col">
					<div class="z-10 border-b border-white/10 bg-black/60 p-4 backdrop-blur-md">
						<div class="flex gap-2">
							<input
								type="text"
								placeholder="Search for a location..."
								class="input flex-1 preset-filled-surface-900-100 !py-1 text-sm"
								bind:value={searchQuery}
								onkeydown={(e) => e.key === 'Enter' && searchLocation()}
							/>
							<button class="btn preset-filled-secondary-500 btn-sm" onclick={searchLocation}>
								Go
							</button>
						</div>
						{#if gpsJustApplied}
							<p class="mt-2 text-xs font-medium text-green-400" transition:fade>
								✓ Location updated from map
							</p>
						{/if}
					</div>

					<div class="flex-1 bg-surface-800">
						{#if MapComponent}
							<MapComponent
								lat={latLocal || 0}
								lon={lonLocal || 0}
								onLocationChange={applyMapLocation}
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center text-white/30">
								Loading interactive map...
							</div>
						{/if}
					</div>

					<div class="z-10 border-t border-white/10 bg-black/60 p-4 text-center backdrop-blur-md">
						<p class="mb-2 text-[10px] tracking-widest text-white/50 uppercase">
							Pro Tip: Click the map to set GPS
						</p>
						<button
							class="btn flex w-full items-center justify-center gap-2 preset-outlined-tertiary-500 btn-sm"
							onclick={applyGpsToSearch}
						>
							<Wand2 size={12} />
							<span>Sync search with coords</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
