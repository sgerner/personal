<script>
	import { editingImage } from '$lib/stores/modal';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { flash } from '$lib/stores/status';
	import { Wand2 } from '@lucide/svelte';
	import { Progress, TagsInput, FileUpload } from '@skeletonlabs/skeleton-svelte';
	import IconDropzone from '@lucide/svelte/icons/image-plus';
	import IconFile from '@lucide/svelte/icons/paperclip';
	import IconRemove from '@lucide/svelte/icons/circle-x';
	import 'leaflet/dist/leaflet.css';

	let formElement;
	let errorMessage = '';
	let pending = false;
	let latLocal = '';
	let lonLocal = '';
	let searchQuery = '';
	let gpsJustApplied = false;
	let MapComponent;
	let tagsLocal = [];
	let isCreate = false;
	let filePreview = '';
	let bgUrl = '';

	onMount(async () => {
		await import('leaflet');
		MapComponent = (await import('./Map.svelte')).default;
	});

	$: if ($editingImage) {
		const g = $editingImage.gps;
		if (g && typeof g.lat === 'number' && typeof g.lon === 'number') {
			latLocal = g.lat;
			lonLocal = g.lon;
		} else {
			latLocal = '';
			lonLocal = '';
		}
		tagsLocal = Array.isArray($editingImage.tags) ? [...$editingImage.tags] : [];
		isCreate = !$editingImage.id;
		bgUrl = filePreview || ($editingImage.urls && $editingImage.urls.md) || '';
	}

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
		errorMessage = '';
		const name = f.name || '';
		const base = name.replace(/\.[^\.]+$/, '');
		const display = base
			.replace(/[_\-.]+/g, ' ')
			.trim()
			.split(/\s+/)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
		const ti = formElement?.querySelector('#title');
		if (ti && !ti.value) ti.value = display;
	}
</script>

<svelte:window on:keydown={handleEscape} />

{#if $editingImage}
	<div
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
	>
		<div
			class="w-full max-w-lg card rounded-lg preset-outlined-surface-500 px-4 py-2 shadow-xl"
			role="document"
			style={`background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${bgUrl}'); background-size: cover; background-position: center;`}
		>
			<h2 class="mb-4 h2 text-white">{$editingImage.id ? 'Edit Image' : 'New Image'}</h2>
			<form
				bind:this={formElement}
				method="POST"
				action="?/update"
				enctype="multipart/form-data"
				use:enhance={() => {
					pending = true;
					errorMessage = '';
					return async ({ result, update, action }) => {
						pending = false;
						const isSuggest = action?.search?.includes('/suggest');
						const isUpload = action?.search?.includes('/upload');
						if (result.type === 'success') {
							errorMessage = '';
							if (isSuggest) {
								const s = result.data?.suggestions || {};
								if (s.title) {
									const ti = formElement.querySelector('#title');
									if (ti) ti.value = s.title;
								}
								if (s.description) {
									const ta = formElement.querySelector('#description');
									if (ta) ta.value = s.description;
								}
								if (s.tags && Array.isArray(s.tags)) {
									tagsLocal = s.tags;
								}
								if (s.gps && typeof s.gps.lat === 'number' && typeof s.gps.lon === 'number') {
									latLocal = s.gps.lat;
									lonLocal = s.gps.lon;
									gpsJustApplied = true;
									setTimeout(() => (gpsJustApplied = false), 1500);
								}
								flash('Suggestions applied', 'success');
							} else {
								if (isUpload) {
									flash('Image uploaded', 'success');
								} else {
									flash('Image updated', 'success');
								}
								try {
									await update({ invalidateAll: true, reset: false });
								} catch {}
								closeModal();
							}
						} else if (result.type === 'failure') {
							errorMessage = result.data?.error || 'Update failed';
						} else if (result.type === 'error') {
							errorMessage = result.error?.message || 'Unexpected error';
						}
					};
				}}
				class="space-y-4"
			>
				{#if !$editingImage.id}
					<div class="rounded-lg bg-surface-100-900">
                        <FileUpload
                            name="image"
                            accept="image/*"
                            maxFiles={1}
                            subtext="Attach one image."
                            allowDrop
                            onFileChange={(e) => handleFileChange(e)}
                            onFileAccept={(e) => handleFileChange(e)}
                            onFileReject={() => {
                                errorMessage = 'Unsupported file. Please choose an image.';
                            }}
                            classes="w-full"
                        >
							{#snippet iconInterface()}<IconDropzone class="size-8" />{/snippet}
							{#snippet iconFile()}<IconFile class="size-4" />{/snippet}
							{#snippet iconFileRemove()}<IconRemove class="size-4" />{/snippet}
                        </FileUpload>
					</div>
				{:else}
					<input type="hidden" name="id" value={$editingImage.id} />
					<input type="hidden" name="image_url" value={$editingImage.urls.sm} />
				{/if}
				<div>
					<label for="title" class="block text-white">Title:</label>
					<input
						type="text"
						id="title"
						name="title"
						value={$editingImage.title || ''}
						required
						class="input preset-filled-surface-900-100"
					/>
				</div>
				<div>
					<label for="description" class="block text-white">Description:</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						class="textarea preset-filled-surface-900-100"
						>{$editingImage.description || ''}</textarea
					>
				</div>
				<div>
					<label for="tags" class="block text-white">Tags:</label>
					<div class="rounded-lg bg-surface-900-100">
						<TagsInput
							name="tags_display"
							value={tagsLocal}
							onValueChange={(e) => (tagsLocal = e.value)}
							placeholder="Add Tag..."
						/>
						<input type="hidden" id="tags" name="tags" value={tagsLocal.join(', ')} />
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div class="hidden">
						<label for="lat" class="block text-white">Latitude:</label>
						<input
							type="number"
							step="any"
							id="lat"
							name="lat"
							bind:value={latLocal}
							class="input preset-filled-surface-900-100"
						/>
					</div>
					<div class="hidden">
						<label for="lon" class="block text-white">Longitude:</label>
						<input
							type="number"
							step="any"
							id="lon"
							name="lon"
							bind:value={lonLocal}
							class="input preset-filled-surface-900-100"
						/>
					</div>
				</div>
				<div>
					<label for="search" class="block text-white">Search Location:</label>
					<div class="flex space-x-2">
						<input
							type="text"
							id="search"
							bind:value={searchQuery}
							on:keydown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									searchLocation();
								}
							}}
							class="input preset-filled-surface-900-100"
						/>
						<button type="button" on:click={searchLocation} class="btn preset-filled-primary-500"
							>Search</button
						>
					</div>
				</div>
				{#if MapComponent}
					<div
						class={`rounded-lg ${gpsJustApplied ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-black/50' : ''}`}
					>
						<svelte:component this={MapComponent} bind:lat={latLocal} bind:lon={lonLocal} />
					</div>
				{/if}
				{#if errorMessage}
					<div class="rounded-md bg-red-600/20 px-3 py-2 text-red-200" aria-live="polite">
						{errorMessage}
					</div>
				{/if}
				{#if pending}
					<div class="py-2">
						<Progress value={null} />
					</div>
				{:else}
					<div class="flex justify-between space-x-2">
						<div>
							<button
								type="submit"
								formaction="?/suggest"
								class="btn preset-filled-secondary-500"
								title="Suggest metadata"
								disabled={!$editingImage.id && !filePreview}
							>
								<Wand2 size={18} />
								<span class="ml-1">Suggest</span>
							</button>
						</div>
						<div class="ml-auto flex space-x-2">
							<button type="button" on:click={closeModal} class="btn preset-tonal-error"
								>Cancel</button
							>
							{#if !$editingImage.id}
								<button
									type="submit"
									class="variant-filled-primary btn preset-filled-primary-500"
									formaction="?/upload"
									disabled={!filePreview}
								>
									Upload
								</button>
							{:else}
								<button type="submit" class="variant-filled-primary btn preset-filled-primary-500">
									Update
								</button>
							{/if}
						</div>
					</div>
				{/if}
			</form>
		</div>
	</div>
{/if}
