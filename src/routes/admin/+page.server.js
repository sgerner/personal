import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { IMAGES_BASE_URL } from '$lib/config/site';
import sharp from 'sharp';

async function resizeImage(buffer) {
	try {
		return await sharp(buffer)
			.resize({
				width: 1024,
				height: 1024,
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({ quality: 80 })
			.toBuffer();
	} catch (err) {
		console.error('Resize failed, using original:', err);
		return buffer;
	}
}

export const actions = {
	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id');
		const title = data.get('title');
		const description = data.get('description');
		const tags = data
			.get('tags')
			?.toString()
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		const latStr = data.get('lat');
		const lonStr = data.get('lon');

		const latNum = latStr !== null && latStr !== '' ? Number(latStr) : undefined;
		const lonNum = lonStr !== null && lonStr !== '' ? Number(lonStr) : undefined;

		const payload = {};
		if (title) payload.title = title;
		if (description) payload.description = description;
		if (tags && tags.length) payload.tags = tags;
		if (Number.isFinite(latNum) && Number.isFinite(lonNum)) {
			payload.gps = { lat: latNum, lon: lonNum };
		}

		const rawToken = env.IMAGE_SERVER_AUTH_TOKEN;
		const token = rawToken ? String(rawToken).trim() : '';
		if (!token) {
			return fail(500, { error: 'Image server auth token not configured' });
		}
		if (process.env.NODE_ENV !== 'production') {
			console.debug('[admin:update] Using image server token length:', token.length);
		}

		const response = await fetch(`${IMAGES_BASE_URL}/images/${encodeURIComponent(id)}`, {
			method: 'PUT',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const error = await response.text();
			return fail(response.status, { error });
		}

		return { success: true };
	},
		suggest: async ({ request, fetch }) => {
		try {
			const data = await request.formData();
			const id = data.get('id')?.toString();
			const title = data.get('title')?.toString() || '';
			const description = data.get('description')?.toString() || '';
			const tagsStr = data.get('tags')?.toString() || '';
			const lat = data.get('lat')?.toString() || '';
			const lon = data.get('lon')?.toString() || '';
			const image_url = data.get('image_url')?.toString();
			const image_file = data.get('image');

			if (!image_url && (!image_file || typeof image_file === 'string')) {
				return fail(400, { error: 'Missing image for suggestion' });
			}

			const apiKey = (env.GOOGLE_GENAI_API_KEY || '').trim();
			if (!apiKey) {
				return fail(500, { error: 'Google Generative AI API key not configured' });
			}

			let mime = 'image/webp';
			let b64 = '';
			if (image_file && typeof image_file !== 'string') {
				mime = image_file.type || mime;
				const arr = new Uint8Array(await image_file.arrayBuffer());
				const resized = await resizeImage(Buffer.from(arr));
				b64 = resized.toString('base64');
				mime = 'image/webp';
			} else if (image_url) {
				const imgRes = await fetch(image_url);
				if (!imgRes.ok) {
					return fail(502, { error: `Unable to fetch image (${imgRes.status})` });
				}
				const buf = new Uint8Array(await imgRes.arrayBuffer());
				const resized = await resizeImage(Buffer.from(buf));
				b64 = resized.toString('base64');
				mime = 'image/webp';
			}

			const context = {
				id,
				existing: {
					title,
					description,
					tags: tagsStr
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean),
					gps:
						lat && lon && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lon))
							? { lat: Number(lat), lon: Number(lon) }
							: null
				}
			};

			const ALLOWED_TAGS = ['People','Animals','Architecture','Nature','City','Events','Landscape','Culture'];

			const prompt = `You are a photo catalog assistant. Analyze the image and existing metadata to suggest improved metadata.

Return ONLY valid JSON, no code fences or extra text, with this shape:
{"title":"string (<=60 chars)","description":"very brief, keyword-focused (<=140 chars)","tags":["Choose 1-3 from exactly this list: People, Animals, Architecture, Nature, City, Events, Landscape, Culture"],"gps":{"lat":number,"lon":number} or null}

Guidelines:
- Title: concise, descriptive, and captures the spirit or a unique perspective of the image, aiming for a touch of personality.
- Description: short, focus on key search terms, and infuse a bit of character or a memorable observation about the scene.
- Tags: select ONLY from: People, Animals, Architecture, Nature, City, Events, Landscape, Culture
- GPS: include only if you can infer a plausible location from content; otherwise null

Existing metadata (may be partial): ${JSON.stringify(context.existing)}`;

			const body = {
				contents: [
					{
						role: 'user',
						parts: [{ text: prompt }, { inlineData: { mimeType: mime, data: b64 } }]
					}
				]
			};

			const resp = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(
					apiKey
				)}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				}
			);

			if (!resp.ok) {
				const txt = await resp.text();
				return fail(resp.status, { error: `Gemini error: ${txt}` });
			}

			const out = await resp.json();
			const text = out?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') || '';
			if (!text) return fail(502, { error: 'No suggestions returned' });

			let jsonStr = text;
			const first = jsonStr.indexOf('{');
			const last = jsonStr.lastIndexOf('}');
			if (first !== -1 && last !== -1) jsonStr = jsonStr.slice(first, last + 1);

			let suggestions;
			try {
				suggestions = JSON.parse(jsonStr);
			} catch (e) {
				return fail(502, { error: 'Failed to parse suggestions JSON' });
			}

			// Restrict tags strictly to ALLOWED_TAGS, preserve canonical case, max 3
			if (suggestions?.tags && Array.isArray(suggestions.tags)) {
				const out = [];
				for (const raw of suggestions.tags) {
					const lower = String(raw).trim().toLowerCase();
					const match = ALLOWED_TAGS.find((t) => t.toLowerCase() === lower);
					if (match) out.push(match);
				}
				suggestions.tags = Array.from(new Set(out)).slice(0, 3);
			}
			if (suggestions?.gps && (suggestions.gps.lat == null || suggestions.gps.lon == null)) {
				suggestions.gps = null;
			}

			return { success: true, suggestions };
		} catch (err) {
			return fail(500, { error: err.message || 'Suggestion failed' });
		}
	},
	upload: async ({ request, fetch }) => {
		try {
			const data = await request.formData();
			const image = data.get('image');
			if (!image || typeof image === 'string') {
				return fail(400, { error: 'No image provided' });
			}

			const rawToken = env.IMAGE_SERVER_AUTH_TOKEN;
			const token = rawToken ? String(rawToken).trim() : '';
			if (!token) {
				return fail(500, { error: 'Image server auth token not configured' });
			}

			const fd = new FormData();
			// Remote expects field name 'file'
			fd.append('file', image);
			// Pass through optional metadata
			const passthrough = ['id', 'title', 'description', 'tags', 'lat', 'lon'];
			for (const key of passthrough) {
				const v = data.get(key);
				if (v != null && v !== '') fd.append(key, v.toString());
			}

			const resp = await fetch(`${IMAGES_BASE_URL}/upload`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: fd
			});

			if (!resp.ok) {
				const txt = await resp.text();
				return fail(resp.status, { error: txt });
			}

			const out = await resp.json();
			return { success: true, uploaded: out };
		} catch (err) {
			return fail(500, { error: err.message || 'Upload failed' });
		}
	},
	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id');

		const rawTokenDel = env.IMAGE_SERVER_AUTH_TOKEN;
		const token = rawTokenDel ? String(rawTokenDel).trim() : '';
		if (!token) {
			return fail(500, { error: 'Image server auth token not configured' });
		}
		if (process.env.NODE_ENV !== 'production') {
			console.debug('[admin:delete] Using image server token length:', token.length);
		}

		const response = await fetch(`${IMAGES_BASE_URL}/images/${encodeURIComponent(id)}`, {
			method: 'DELETE',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			const error = await response.text();
			return fail(response.status, { error });
		}

		return { success: true };
	}
};
