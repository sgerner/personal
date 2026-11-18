<script>
	import { onMount } from 'svelte';
	import L from 'leaflet';

	let { lat = 0, lon = 0, onLocationChange } = $props();
	let mapElement = $state();
	let map = $state.raw();
	let marker = $state.raw();

	onMount(() => {
		map = L.map(mapElement).setView([lat || 0, lon || 0], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		marker = L.marker([lat || 0, lon || 0], {
			draggable: true
		}).addTo(map);

		marker.on('dragend', () => onLocationChange(marker.getLatLng()));
		map.on('click', (event) => onLocationChange(event.latlng));

		return () => map.remove();
	});

	$effect(() => {
		if (!map || !marker) return;

		map.panTo([lat, lon]);
		marker.setLatLng([lat, lon]);
	});
</script>

<div bind:this={mapElement} class="h-64 rounded-lg"></div>
