<script>
	import { page } from '$app/state';
	import { SITE_TITLE, SITE_TAGLINE, SITE_URL } from '$lib/config/site';

	let {
		title = SITE_TITLE,
		description = SITE_TAGLINE,
		image = '/steven.jpg',
		canonical
	} = $props();

	const fullTitle = $derived(title === SITE_TITLE ? SITE_TITLE : `${title} | ${SITE_TITLE}`);
	const canonicalUrl = $derived(canonical ?? new URL(page.url.pathname, SITE_URL).href);
	const imageUrl = $derived(new URL(image, SITE_URL).href);

	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: SITE_URL,
		name: SITE_TITLE,
		description: SITE_TAGLINE,
		author: {
			'@type': 'Person',
			name: 'Steven Gerner',
			url: SITE_URL
		}
	}).replaceAll('<', '\\u003c');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html '<script type="application/ld+json">' + structuredData + '</' + 'script>'}
</svelte:head>
