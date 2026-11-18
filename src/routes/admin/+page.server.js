import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { IMAGES_BASE_URL } from '$lib/config/site';

async function mutateImage(fetch, path, options) {
	const token = env.IMAGE_SERVER_AUTH_TOKEN?.trim();
	if (!token) {
		return fail(500, { error: 'Image server auth token not configured' });
	}

	try {
		const response = await fetch(`${IMAGES_BASE_URL}${path}`, {
			...options,
			headers: { ...options.headers, accept: 'application/json', Authorization: `Bearer ${token}` }
		});
		if (!response.ok) {
			return fail(response.status, { error: await response.text() });
		}
		if (path === '/upload') return { success: true, uploaded: await response.json() };
		return { success: true };
	} catch {
		return fail(502, { error: 'Could not reach the image server' });
	}
}

function imagePath(data) {
	const id = data.get('id');
	if (typeof id !== 'string' || !id || id === '.' || id === '..') return null;
	return `/images/${encodeURIComponent(id)}`;
}

export const actions = {
	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const path = imagePath(data);
		if (!path) return fail(400, { error: 'Invalid image ID' });

		const title = data.get('title');
		const description = data.get('description');
		const tags = data.get('tags');
		const lat = data.get('lat');
		const lon = data.get('lon');

		const payload = {};
		if (typeof title === 'string') payload.title = title;
		if (typeof description === 'string') payload.description = description;
		if (typeof tags === 'string') {
			payload.tags = tags
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean);
		}

		if (lat === '' && lon === '') {
			payload.lat = null;
			payload.lon = null;
		} else if (lat !== null || lon !== null) {
			if (
				typeof lat !== 'string' ||
				!lat.trim() ||
				typeof lon !== 'string' ||
				!lon.trim() ||
				!Number.isFinite(Number(lat)) ||
				!Number.isFinite(Number(lon))
			) {
				return fail(400, { error: 'Enter both latitude and longitude' });
			}
			payload.lat = Number(lat);
			payload.lon = Number(lon);
		}

		return mutateImage(fetch, path, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
	},
	upload: async ({ request, fetch }) => {
		const data = await request.formData();
		const image = data.get('image');
		if (!image || typeof image === 'string' || image.size === 0) {
			return fail(400, { error: 'No image provided' });
		}

		const body = new FormData();
		body.append('file', image);
		for (const key of ['id', 'title', 'description', 'tags', 'lat', 'lon']) {
			const value = data.get(key);
			if (typeof value === 'string' && value !== '') body.append(key, value);
		}
		return mutateImage(fetch, '/upload', { method: 'POST', body });
	},
	delete: async ({ request, fetch }) => {
		const path = imagePath(await request.formData());
		if (!path) return fail(400, { error: 'Invalid image ID' });

		return mutateImage(fetch, path, { method: 'DELETE' });
	}
};
