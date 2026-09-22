<script>
	import { SOCIAL_LINKS } from '$lib/config/site';
	import { Mail, Instagram, Facebook, Github } from '@lucide/svelte';

	const socialIcons = {
		email: Mail,
		instagram: Instagram,
		facebook: Facebook,
		github: Github
	};

	const socialLabels = {
		email: 'Email Steven',
		instagram: 'Steven on Instagram',
		facebook: 'Steven on Facebook',
		github: 'Steven on GitHub'
	};
</script>

<footer
	class="m-4 mx-auto max-w-fit rounded-md border border-white/10 bg-black/15 p-2 text-center backdrop-blur-xs dark:bg-black/25"
>
	<div class="inline-flex items-center justify-center space-x-4">
		{#each Object.entries(SOCIAL_LINKS) as [key, href]}
			{@const Icon = socialIcons[key]}
			{#if Icon}
				<a
					{href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={socialLabels[key]}
					class="preset-tonal-primary/50 btn-icon btn hover:preset-filled-secondary-500"
				>
					<Icon />
				</a>
			{/if}
		{/each}
	</div>
	<p class="p-2 text-xs text-primary-500">
		&copy; {new Date().getFullYear()} Steven Gerner. All rights reserved.
	</p>
</footer>
