// scripts/process-images.js
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const sourceDir = 'src/images';
const outputDir = 'static/processed-images';
const manifestPath = 'static/manifest.json';

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff'];

const sizes = {
	thumb: 200,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280
};

async function processImages() {
	try {
		await fs.mkdir(outputDir, { recursive: true });
		const files = await fs.readdir(sourceDir);
		const manifest = [];

		for (const file of files) {
			const ext = path.extname(file).toLowerCase();
			if (!supportedExtensions.includes(ext)) {
				console.log(`Skipping non-image file: ${file}`);
				continue;
			}

			const sourcePath = path.join(sourceDir, file);
			const stats = await fs.stat(sourcePath);
			if (stats.isDirectory()) continue;

			const baseName = path.basename(file, ext);
			const id = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-');

			const imageInfo = {
				id,
				title: baseName.replace(/-/g, ' '),
				description: 'A placeholder description.',
				tags: ['untagged'],
				gps: { lat: 0, lon: 0 },
				urls: {
					original: `/processed-images/${baseName}-original.webp`
				}
			};

			// Process original
			await sharp(sourcePath)
				.webp({ quality: 90 })
				.toFile(path.join(outputDir, `${baseName}-original.webp`));

			// Process resized versions
			for (const [size, width] of Object.entries(sizes)) {
				const outputFileName = `${baseName}-${size}.webp`;
				const outputPath = path.join(outputDir, outputFileName);
				await sharp(sourcePath).resize(width).webp({ quality: 80 }).toFile(outputPath);
				imageInfo.urls[size] = `/processed-images/${outputFileName}`;
			}

			manifest.push(imageInfo);
			console.log(`Processed: ${file}`);
		}

		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
		console.log(`Manifest generated at ${manifestPath}`);
	} catch (error) {
		console.error('Error processing images:', error);
	}
}

processImages();
