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
	class="m-4 mx-auto max-w-fit rounded-md border border-slate-900/10 bg-white p-2 text-center text-slate-800 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
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
					class="btn-icon btn bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
				>
					<Icon />
				</a>
			{/if}
		{/each}
	</div>
	<p class="p-2 text-xs text-slate-700 dark:text-slate-200">
		&copy; {new Date().getFullYear()} Steven Gerner. All rights reserved.
	</p>
</footer>
