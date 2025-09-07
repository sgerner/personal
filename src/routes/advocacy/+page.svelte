<script>
	import Seo from '$lib/components/meta/Seo.svelte';
	import GlassPanel from '$lib/components/ui/GlassPanel.svelte';
	import { ArrowRight } from '@lucide/svelte';

	const advocacyLinks = [
		{
			href: 'https://3feetplease.org',
			title: '3 Feet Please',
			description: 'Making Roads Safer for Cyclists',
			linkText: 'Learn More',
			image: '/3fp.png'
		},
		{
			href: 'https://learn.3feetplease.org',
			title: 'Bicycle Advocacy Wiki',
			description: 'Resource to transform your streets',
			linkText: 'Change your Community',
			image: '/wiki.png'
		},
		{
			href: 'https://biketempe.org',
			title: 'T.B.A.G.',
			description: 'Tempe Bicycle Action Group',
			linkText: 'Join T.B.A.G.',
			image: '/tbag.jpg'
		}
	];
</script>

<Seo title="Advocacy" description="Promoting safe and accessible streets for everyone." />

<div class="container mx-auto p-2">
	<header class="mx-auto flex h-[30dvh] max-w-prose flex-wrap content-center items-center">
		<h1 class="h1 text-white drop-shadow-sm">Cycling Advocacy</h1>
		<h5 class="h5 text-secondary-500 uppercase drop-shadow-sm">Streets Worth Loving</h5>
	</header>

	<div class="my-20">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			{#each advocacyLinks as link}
				<div
					class="flex h-full flex-col rounded-lg border border-surface-500/50 bg-surface-100/50 p-4 shadow-lg backdrop-blur-xs dark:bg-surface-800/50"
				>
					<div class="flex gap-4 md:col-3">
						<div class="md:col-span-1">
							<img src={link.image} alt={link.title} class="h-16 w-16" />
						</div>
						<div class="md:col-span-2">
							<header class="mb-4">
								<h3 class="h3">{link.title}</h3>
								<p class="font-semibold">
									{link.description}
								</p>
							</header>
						</div>
					</div>
					<a href={link.href} class="btn preset-filled-secondary-500">
						<span>{link.linkText}</span>
						<ArrowRight />
					</a>
				</div>
			{/each}
		</div>
	</div>

	<GlassPanel>
		<ul class="mb-6 text-left text-lg font-semibold">
			<li>✅ We deserve streets we can smile about, not just survive.</li>
			<li>✅ We deserve streets that connect us, not divide us.</li>
			<li>✅ We deserve streets that bring people together, not push them apart.</li>
		</ul>

		<p class="text-lg">
			Join me in advocating for streets that make our communities thrive. Through my work with
			<a
				href="https://biketempe.org"
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-secondary-500"
			>
				Tempe Bicycle Action Group
			</a>
			and
			<a
				href="https://3feetplease.org"
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-secondary-500"
			>
				Three Feet Please
			</a>, I fight for a vision of safer, more vibrant streets where biking, walking, and rolling
			feel natural.
		</p>
	</GlassPanel>
</div>
