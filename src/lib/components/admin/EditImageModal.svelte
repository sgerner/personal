<script>
	import { editingImage } from '$lib/stores/modal';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { onMount, createEventDispatcher } from 'svelte';
	import { flash } from '$lib/stores/status';
	import { Wand2 } from '@lucide/svelte';
	import { Progress, FileUpload } from '@skeletonlabs/skeleton-svelte';
	import IconDropzone from '@lucide/svelte/icons/image-plus';
	import IconFile from '@lucide/svelte/icons/paperclip';
	import 'leaflet/dist/leaflet.css';

	let { images = [], onSave = (_img) => {}, onCancel = () => {} } = $props();
	const dispatch = createEventDispatcher();

	let formElement = $state();
	let errorMessage = $state('');
	let pending = $state(false);
	let latLocal = $state('');
	let lonLocal = $state('');
	let searchQuery = $state('');
	let gpsJustApplied = $state(false);
	let MapComponent = $state();
	let tagsLocal = $state([]);
	let allowedTags = $derived($images.tags || []);

	function toggleTag(tag) {
		if (tagsLocal.includes(tag)) {
			tagsLocal = tagsLocal.filter((t) => t !== tag);
		} else {
			tagsLocal = [...tagsLocal, tag];
		}
	}
	let _isCreate = $state(false);
	let filePreview = $state('');
	let bgUrl = $state('');

	onMount(async () => {
		await import('leaflet');
		MapComponent = (await import('./Map.svelte')).default;
	});

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
		_isCreate = !$editingImage.id;
		bgUrl = filePreview || ($editingImage.urls && $editingImage.urls.md) || '';
	});

	async function searchLocation() {
		if (searchQuery.length < 3) return;
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
		);
		const data = await response.json();
		if (data && data.length > 0) {
			const { lat, lon } = data[0];
			latLocal = parseFloat(lat);
			lonLocal = parseFloat(lon);
		}
	}

	function closeModal() {
		editingImage.set(null);
	}

	function handleEscape(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleFileChange(e) {
		const files =
			e?.detail?.files ||
			e?.detail?.acceptedFiles ||
			e?.details?.acceptedFiles ||
			e?.files ||
			e?.acceptedFiles ||
			[];
		const f = files[0];
		if (!f) return;
		filePreview = URL.createObjectURL(f);
		bgUrl = filePreview;
	}

	function handleMapClick(e) {
		latLocal = parseFloat(e.latlng.lat.toFixed(6));
		lonLocal = parseFloat(e.latlng.lng.toFixed(6));
		gpsJustApplied = true;
		setTimeout(() => (gpsJustApplied = false), 2000);
	}

	function applyGpsToSearch() {
		if (!latLocal || !lonLocal) return;
		searchQuery = `${latLocal.toFixed(4)}, ${lonLocal.toFixed(4)}`;
	}
</script>

{#if $editingImage}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
		transition:fade={{ duration: 200 }}
		onkeydown={handleEscape}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative w-full max-w-4xl rounded-2xl border border-surface-500/30 bg-surface-900/90 shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh]"
			style={`background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${bgUrl}'); background-size: cover; background-position: center;`}
		>
			<!-- Left side: Form -->
			<div class="flex-1 p-6 md:p-8 bg-black/40 backdrop-blur-md overflow-y-auto">
				<h2 class="h2 mb-6 text-white font-bold">{_isCreate ? 'Add' : 'Edit'} Image</h2>

				{#if errorMessage}
					<div class="alert variant-filled-error mb-6">{errorMessage}</div>
				{/if}

				<form
					bind:this={formElement}
					method="POST"
					action="?/saveImage"
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
						<label class="block text-white mb-1">
							<span class="block mb-1">Title:</span>
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
						<label class="block text-white mb-1">
							<span class="block mb-1">Description:</span>
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
						<span class="block text-white font-medium mb-1">Categories:</span>
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
							<label class="block text-white mb-1">
								<span class="block mb-1">Latitude:</span>
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
							<label class="block text-white mb-1">
								<span class="block mb-1">Longitude:</span>
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

					{#if _isCreate}
						<div class="space-y-2">
							<label class="block text-white mb-1">
								<span class="block mb-1">Upload Image:</span>
								<FileUpload
									name="file"
									accept="image/*"
									maxFiles={1}
									onFileChange={handleFileChange}
									class="bg-white/5 border-dashed border-white/20"
								>
									{#snippet item(file)}
										<div class="flex items-center gap-2 text-white">
											<IconFile size={16} />
											<span class="text-sm truncate">{file.name}</span>
										</div>
									{/snippet}
									{#snippet placeholder()}
										<div class="flex flex-col items-center py-4 text-white/60">
											<IconDropzone size={32} class="mb-2" />
											<p class="text-sm">Click or drag image to upload</p>
										</div>
									{/snippet}
								</FileUpload>
							</label>
						</div>
					{/if}

					<div class="flex items-center gap-4 pt-4">
						<button
							type="submit"
							class="btn preset-filled-primary-500 flex-1 font-bold"
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
							class="btn preset-outlined-white"
							onclick={closeModal}
							disabled={pending}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>

			<!-- Right side: Map -->
			<div class="hidden md:flex flex-1 flex-col bg-surface-900/40 relative">
				<div class="absolute inset-0 flex flex-col">
					<div class="p-4 bg-black/60 backdrop-blur-md z-10 border-b border-white/10">
						<div class="flex gap-2">
							<input
								type="text"
								placeholder="Search for a location..."
								class="input preset-filled-surface-900-100 flex-1 !py-1 text-sm"
								bind:value={searchQuery}
								onkeydown={(e) => e.key === 'Enter' && searchLocation()}
							/>
							<button class="btn preset-filled-secondary-500 btn-sm" onclick={searchLocation}>
								Go
							</button>
						</div>
						{#if gpsJustApplied}
							<p class="text-xs text-green-400 mt-2 font-medium" transition:fade>
								✓ Location updated from map
							</p>
						{/if}
					</div>

					<div class="flex-1 bg-surface-800">
						{#if MapComponent}
							<MapComponent lat={latLocal || 0} lon={lonLocal || 0} on:click={handleMapClick} />
						{:else}
							<div class="w-full h-full flex items-center justify-center text-white/30">
								Loading interactive map...
							</div>
						{/if}
					</div>

					<div class="p-4 bg-black/60 backdrop-blur-md z-10 border-t border-white/10 text-center">
						<p class="text-[10px] text-white/50 uppercase tracking-widest mb-2">
							Pro Tip: Click the map to set GPS
						</p>
						<button
							class="btn btn-sm preset-outlined-tertiary-500 w-full flex items-center justify-center gap-2"
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
