import { randomUUID, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import slugify from 'slugify';

const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN?.trim();
const authTokenBytes = Buffer.from(AUTH_TOKEN || '');
const DATA_DIR = process.env.DATA_DIR || '/data';
const OUTPUT_DIR = path.join(DATA_DIR, 'processed-images');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');
const TMP_DIR = path.join(DATA_DIR, 'tmp');

const sizes = { thumb: 200, sm: 640, md: 768, lg: 1024, xl: 1280 };
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.tif', '.avif']);

await fs.mkdir(OUTPUT_DIR, { recursive: true });
await fs.mkdir(TMP_DIR, { recursive: true });
try {
	await fs.writeFile(MANIFEST_PATH, '[]', { flag: 'wx' });
} catch (error) {
	if (error.code !== 'EEXIST') throw error;
}

let manifestLock = Promise.resolve();
function withLock(fn) {
	const pending = manifestLock.then(fn);
	manifestLock = pending.catch(() => {});
	return pending;
}

async function readManifest() {
	return JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'));
}

async function writeManifest(manifest) {
	const tmpPath = path.join(TMP_DIR, `manifest-${randomUUID()}.json`);
	try {
		await fs.writeFile(tmpPath, JSON.stringify(manifest, null, 2));
		await fs.rename(tmpPath, MANIFEST_PATH);
	} catch (error) {
		await fs.rm(tmpPath, { force: true });
		throw error;
	}
}

async function removeImages(urls) {
	await Promise.all(
		Object.values(urls).map(async (url) => {
			if (typeof url !== 'string') return;
			const filepath = path.join(OUTPUT_DIR, path.basename(url));
			try {
				await fs.rm(filepath, { force: true });
			} catch (error) {
				console.error(`Failed to delete file ${filepath}`, error);
			}
		})
	);
}

function validGps(lat, lon) {
	return (
		Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lon) && Math.abs(lon) <= 180
	);
}

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 25 * 1024 * 1024 }
});

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(compression());

app.use(
	'/processed-images',
	express.static(OUTPUT_DIR, {
		maxAge: '365d',
		immutable: true,
		setHeaders: (res) => {
			res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
		}
	})
);

app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.get('/manifest.json', async (_req, res) => {
	try {
		const data = await fs.readFile(MANIFEST_PATH, 'utf-8');
		res.setHeader('Content-Type', 'application/json');
		res.send(data);
	} catch {
		res.status(500).json({ error: 'cannot read manifest' });
	}
});

function requireAuth(req, res, next) {
	const hdr = req.get('authorization') || '';
	if (!AUTH_TOKEN) return res.status(503).json({ error: 'image mutations unavailable' });

	const token = Buffer.from(hdr.startsWith('Bearer ') ? hdr.slice(7) : '');
	if (token.length === authTokenBytes.length && timingSafeEqual(token, authTokenBytes))
		return next();
	res.status(401).json({ error: 'unauthorized' });
}

app.put('/images/:id', requireAuth, express.json(), async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, tags, lat, lon } = req.body ?? {};
		if (
			(title !== undefined && typeof title !== 'string') ||
			(description !== undefined && typeof description !== 'string') ||
			(tags !== undefined && (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string')))
		) {
			return res.status(400).json({ error: 'invalid metadata' });
		}

		if (
			(lat !== undefined || lon !== undefined) &&
			!(lat === null && lon === null) &&
			!validGps(lat, lon)
		) {
			return res.status(400).json({ error: 'invalid coordinates' });
		}

		const image = await withLock(async () => {
			const manifest = await readManifest();
			const entry = manifest.find((item) => item.id === id);
			if (!entry) return null;

			if (typeof title === 'string') entry.title = title;
			if (typeof description === 'string') entry.description = description;
			if (tags !== undefined) entry.tags = tags;
			if (lat === null && lon === null) delete entry.gps;
			else if (validGps(lat, lon)) entry.gps = { lat, lon };

			await writeManifest(manifest);
			return entry;
		});

		if (!image) return res.status(404).json({ error: 'image not found' });
		res.json({ ok: true, image });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'update_failed' });
	}
});

app.delete('/images/:id', requireAuth, async (req, res) => {
	try {
		const { id } = req.params;
		const urls = await withLock(async () => {
			const manifest = await readManifest();
			const idx = manifest.findIndex((item) => item.id === id);
			if (idx === -1) return null;

			const [entry] = manifest.splice(idx, 1);
			await writeManifest(manifest);
			return entry.urls ?? {};
		});

		if (!urls) return res.status(404).json({ error: 'image not found' });

		await removeImages(urls);
		res.json({ ok: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'delete_failed' });
	}
});

app.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
	const urls = {};
	let published = false;
	try {
		if (!req.file) return res.status(400).json({ error: 'no file' });

		const originalName = req.file.originalname || 'upload';
		const ext = path.extname(originalName).toLowerCase();
		if (!supported.has(ext)) return res.status(400).json({ error: 'unsupported file type' });

		const fields = ['id', 'title', 'description', 'tags', 'lat', 'lon'];
		if (fields.some((key) => req.body[key] !== undefined && typeof req.body[key] !== 'string')) {
			return res.status(400).json({ error: 'invalid metadata' });
		}

		const baseName = path.basename(originalName, ext);
		const customId = (req.body.id || '').trim();
		const id = slugify(customId || baseName, { lower: true, strict: true });
		if (!id || id.length > 150) return res.status(400).json({ error: 'invalid image ID' });

		const title = req.body.title || baseName;
		const description = req.body.description || '';
		const tags = (req.body.tags || '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const lat = req.body.lat ? Number(req.body.lat) : undefined;
		const lon = req.body.lon ? Number(req.body.lon) : undefined;

		if ((lat !== undefined || lon !== undefined) && !validGps(lat, lon)) {
			return res.status(400).json({ error: 'invalid coordinates' });
		}

		// Publish new files under unique URLs so an upload cannot replace cached assets.
		const prefix = `${id}-${randomUUID()}`;
		const source = sharp(req.file.buffer, { failOn: 'warning' }).rotate();
		for (const [size, width] of [['original', null], ...Object.entries(sizes)]) {
			const outName = `${prefix}-${size}.webp`;
			urls[size] = `/processed-images/${outName}`;
			const variant = source.clone();
			if (width !== null) variant.resize({ width, withoutEnlargement: true });
			await variant
				.webp({ quality: width === null ? 90 : 80 })
				.toFile(path.join(OUTPUT_DIR, outName));
		}

		const now = new Date().toISOString();
		const newEntry = {
			id,
			title,
			description,
			tags: tags.length ? tags : ['untagged'],
			createdAt: now,
			urls
		};

		if (validGps(lat, lon)) newEntry.gps = { lat, lon };

		published = await withLock(async () => {
			const manifest = await readManifest();
			if (manifest.some((entry) => entry.id === id)) return false;

			manifest.push(newEntry);
			await writeManifest(manifest);
			return true;
		});
		if (!published) return res.status(409).json({ error: 'an image with this ID already exists' });

		res.json({ ok: true, id, urls });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'processing_failed' });
	} finally {
		if (!published) await removeImages(urls);
	}
});

app.listen(PORT, () => {
	console.log(`images-worker listening on ${PORT}`);
});
