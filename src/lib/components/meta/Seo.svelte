<script>
	import { SITE_TITLE, SITE_TAGLINE, SITE_URL } from '$lib/config/site';

	let {
		title = SITE_TITLE,
		description = SITE_TAGLINE,
		image = '', // Add a default social image later
		canonical = SITE_URL
	} = $props();

	const fullTitle = title === SITE_TITLE ? SITE_TITLE : `${title} | ${SITE_TITLE}`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonical} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<script type="application/ld+json">
		{JSON.stringify({
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
		})}
	</script>
</svelte:head>
