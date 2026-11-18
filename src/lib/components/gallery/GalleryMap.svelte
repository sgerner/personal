<script>
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import GalleryLightbox from './GalleryLightbox.svelte';

	let { images = [] } = $props();

	let mapEl;
	let map;
	let markersLayer;
	let selectedIndex = $state(null);
	let L; // Leaflet (loaded on client)
	const markerSize = 72;
	const clusterSize = 48;

	function thumbnail(src, className) {
		const image = document.createElement('img');
		image.className = className;
		if (src) image.src = src;
		image.alt = '';
		return image;
	}

	function hasGPS(img) {
		const lat = img?.gps?.lat;
		const lon = img?.gps?.lon;
		return (
			typeof lat === 'number' &&
			typeof lon === 'number' &&
			!Number.isNaN(lat) &&
			!Number.isNaN(lon) &&
			!(lat === 0 && lon === 0)
		);
	}

	// Clustered marker builder (uses leaflet.markercluster)
	function buildMarkersCluster() {
		if (!map || !L) return;
		markersLayer?.remove();
		// @ts-ignore plugin augments L
		markersLayer = L.markerClusterGroup({
			showCoverageOnHover: false,
			maxClusterRadius: markerSize,
			spiderfyOnMaxZoom: true,
			spiderfyDistanceMultiplier: 3,
			iconCreateFunction: (cluster) => {
				const count = cluster.getChildCount();
				const src = cluster.getAllChildMarkers()[0]?.options.thumb;
				const html = document.createElement('div');
				html.className = 'cluster-thumb';
				const badge = document.createElement('span');
				badge.className = 'cluster-count';
				badge.textContent = count;
				html.append(thumbnail(src, 'cluster-img'), badge);
				return L.divIcon({
					html,
					className: 'cluster-icon',
					iconSize: [clusterSize, clusterSize],
					iconAnchor: [clusterSize / 2, clusterSize / 2]
				});
			}
		});
		const bounds = [];
		const markers = [];
		images.forEach((img, idx) => {
			if (!hasGPS(img)) return;
			const { lat, lon } = img.gps;
			const src = encodeURI(
				img.urls?.thumb || img.urls?.sm || img.urls?.md || img.urls?.original || ''
			);
			const icon = L.divIcon({
				html: thumbnail(src, 'thumb-img'),
				className: 'thumb-icon',
				iconSize: [markerSize, markerSize],
				iconAnchor: [markerSize / 2, markerSize / 2]
			});
			const marker = L.marker([lat, lon], {
				icon,
				thumb: src,
				title: img.title || 'Open photograph'
			});
			marker.on('click', () => {
				selectedIndex = idx;
			});
			markers.push(marker);
			bounds.push([lat, lon]);
		});

		markersLayer.addLayers(markers).addTo(map);
		if (bounds.length) {
			map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
		}
	}

	onMount(() => {
		let active = true;

		async function initializeMap() {
			const mod = await import('leaflet');
			await import('leaflet.markercluster');
			if (!active) return;

			L = mod.default || mod;
			map = L.map(mapEl, { scrollWheelZoom: true, zoomControl: true }).setView([20, 0], 2);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
			buildMarkersCluster();
		}

		initializeMap();
		return () => {
			active = false;
			map?.remove();
			map = null;
		};
	});

	$effect(() => {
		// Rebuild and recenter when filtered images change
		void images;
		buildMarkersCluster();
	});

	function closeLightbox() {
		selectedIndex = null;
	}
</script>

<div bind:this={mapEl} class="h-[65vh] w-full rounded-md shadow-lg"></div>

{#if selectedIndex !== null}
	<GalleryLightbox {images} startIndex={selectedIndex} onclose={closeLightbox} />
{/if}

<style>
	/* Marker thumbnails */
	:global(.leaflet-container .thumb-icon img.thumb-img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.85);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
		pointer-events: none;
	}

	/* Cluster icons */
	:global(.cluster-icon .cluster-thumb) {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
	}
	:global(.leaflet-container .cluster-icon img.cluster-img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	:global(.cluster-icon .cluster-count) {
		position: absolute;
		right: 2px;
		bottom: 2px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 11px;
		line-height: 1;
		padding: 2px 5px;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.7);
	}
</style>
