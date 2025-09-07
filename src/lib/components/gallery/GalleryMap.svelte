<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import GalleryLightbox from './GalleryLightbox.svelte';

	let { images = [] } = $props();
	const dispatch = createEventDispatcher();

	let mapEl;
	let map;
	let markersLayer;
	let selectedIndex = $state(null);
	let L; // Leaflet (loaded on client)

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

	function precisionForZoom(z) {
		if (z >= 13) return 4; // ~11m
		if (z >= 10) return 3; // ~110m
		if (z >= 7) return 2; // ~1.1km
		if (z >= 4) return 1; // ~11km
		return 0; // ~110km
	}

	let didFitBounds = false;

	// Clustered marker builder (uses leaflet.markercluster)
	function buildMarkersCluster({ initial = false, recenter = false } = {}) {
		if (!map || !L) return;
		if (markersLayer) {
			try {
				markersLayer.clearLayers();
				map.removeLayer(markersLayer);
			} catch {}
			markersLayer = null;
		}
		// @ts-ignore plugin augments L
		markersLayer = L.markerClusterGroup({
			showCoverageOnHover: false,
			maxClusterRadius: 50,
			spiderfyOnMaxZoom: true,
			disableClusteringAtZoom: 12,
			iconCreateFunction: (cluster) => {
				const count = cluster.getChildCount();
				const child = cluster.getAllChildMarkers()[0];
				const src = (child && child.options && child.options.thumb) || '';
				const html = `
            <div class=\"cluster-thumb\">
              <img class=\"cluster-img\" src=\"${src}\" alt=\"\" />
              <span class=\"cluster-count\">${count}</span>
            </div>
          `;
				return L.divIcon({
					html,
					className: 'cluster-icon',
					iconSize: [36, 36],
					iconAnchor: [18, 18]
				});
			}
		});
		markersLayer.addTo(map);

		const bounds = [];
		images.forEach((img, idx) => {
			if (!hasGPS(img)) return;
			const { lat, lon } = img.gps;
			const src = encodeURI(
				img.urls?.thumb || img.urls?.sm || img.urls?.md || img.urls?.original || ''
			);
			const alt = (img.title || '').replace(/\"/g, '&quot;');
			const html = `<div class=\"thumb-marker\"><img class=\"thumb-img\" src=\"${src}\" alt=\"${alt}\"></div>`;
			const icon = L.divIcon({
				html,
				className: 'thumb-icon',
				iconSize: [22, 22],
				iconAnchor: [11, 11]
			});
			const marker = L.marker([lat, lon], { icon, thumb: src });
			marker.on('click', () => {
				selectedIndex = idx;
			});
			// @ts-ignore plugin augments L
			markersLayer.addLayer(marker);
			bounds.push([lat, lon]);
		});

		if (bounds.length && ((initial && !didFitBounds) || recenter)) {
			try {
				map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
			} catch {}
			if (initial) didFitBounds = true;
		}
	}

	function buildMarkers({ initial = false } = {}) {
		if (!map || !L) return;
		if (markersLayer) {
			markersLayer.clearLayers();
		} else {
			markersLayer = L.layerGroup().addTo(map);
		}

		const bounds = [];

		// group nearby points dynamically by zoom level
		const groups = new Map();
		const prec = precisionForZoom(map.getZoom ? map.getZoom() : 2);
		const keyFor = ({ gps }) => `${gps.lat.toFixed(prec)},${gps.lon.toFixed(prec)}`;
		images.forEach((img, idx) => {
			if (!hasGPS(img)) return;
			const key = keyFor(img);
			if (!groups.has(key)) groups.set(key, { lat: img.gps.lat, lon: img.gps.lon, items: [] });
			groups.get(key).items.push({ img, idx });
		});

		for (const [, group] of groups) {
			const { lat, lon } = group;
			const items = group.items;
			const thumbs = items
				.slice(0, 3)
				.map(({ img }, i) => {
					const src = encodeURI(
						img.urls?.thumb || img.urls?.sm || img.urls?.md || img.urls?.original || ''
					);
					const alt = (img.title || '').replace(/"/g, '&quot;');
					return `<img class=\"stack-img i${i}\" src=\"${src}\" alt=\"${alt}\">`;
				})
				.join('');
			const extra =
				items.length > 3 ? `<span class=\"stack-count\">+${items.length - 3}</span>` : '';
			const html = `<div class=\"stack-marker\">${thumbs}${extra}</div>`;

			const icon = L.divIcon({
				html,
				className: 'thumb-icon',
				iconSize: [48, 48],
				iconAnchor: [12, 12]
			});
			const marker = L.marker([lat, lon], { icon });
			marker.on('click', () => {
				// open the first image from this group
				selectedIndex = items[0].idx;
			});
			marker.addTo(markersLayer);
			bounds.push([lat, lon]);
		}

		// Only fit to bounds on initial render to avoid feedback loops with zoomend
		if (initial && !didFitBounds && bounds.length) {
			try {
				map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
			} catch {}
			didFitBounds = true;
		}
	}

	onMount(async () => {
		const mod = await import('leaflet');
		L = mod.default || mod;
		await import('leaflet.markercluster');
		map = L.map(mapEl, { scrollWheelZoom: true, zoomControl: true }).setView([20, 0], 2);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		// Rebuild clusters only on zoom changes (not panning) to reduce churn
		map.on('zoomend', () => buildMarkersCluster());
		buildMarkersCluster({ initial: true });
	});

	onDestroy(() => {
		if (map) map.remove();
	});

	$effect(() => {
		// Rebuild and recenter when filtered images change
		void images;
		buildMarkersCluster({ recenter: true });
	});

	function closeLightbox() {
		selectedIndex = null;
	}
</script>

<div bind:this={mapEl} class="h-[65vh] w-full rounded-xl shadow-lg"></div>

{#if selectedIndex !== null}
	<GalleryLightbox {images} startIndex={selectedIndex} on:close={closeLightbox} />
{/if}

<style>
	/* Marker thumbnails */
	:global(.thumb-icon .thumb-marker) {
		position: relative;
		width: 72px;
		height: 72px;
	}
	:global(.thumb-icon .thumb-img) {
		display: block;
		width: 72px !important;
		height: 72px !important;
		object-fit: cover;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.85);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
		pointer-events: none;
	}

	/* Cluster icons */
	:global(.cluster-icon .cluster-thumb) {
		position: relative;
		width: 48px;
		height: 48px;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
	}
	:global(.cluster-icon .cluster-img) {
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
