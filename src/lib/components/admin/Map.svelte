<script>
	import { onMount, onDestroy } from 'svelte';
	import L from 'leaflet';

	export let lat = 0;
	export let lon = 0;

	let mapElement;
	let map;
	let marker;

	onMount(() => {
		map = L.map(mapElement).setView([lat || 0, lon || 0], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		marker = L.marker([lat || 0, lon || 0], {
			draggable: true
		}).addTo(map);

		marker.on('dragend', function (event) {
			var position = marker.getLatLng();
			lat = position.lat;
			lon = position.lng;
		});

		map.on('click', function (event) {
			marker.setLatLng(event.latlng);
			lat = event.latlng.lat;
			lon = event.latlng.lng;
		});
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	$: if (map && marker) {
		map.setView([lat || 0, lon || 0], 13);
		marker.setLatLng([lat || 0, lon || 0]);
	}
</script>

<div bind:this={mapElement} class="h-64 rounded-lg"></div>
