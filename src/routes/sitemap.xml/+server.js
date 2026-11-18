import { SITE_URL } from '$lib/config/site';

const routes = ['/', '/gallery', '/advocacy', '/projects'];

export async function GET() {
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};

	const urls = routes.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`);
	const sitemap = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls,
		'</urlset>'
	].join('\n');

	return new Response(sitemap, { headers });
}
