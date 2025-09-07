<script>
	import { SOCIAL_LINKS } from '$lib/config/site';
	import { Mail, Instagram, Facebook, Github } from '@lucide/svelte';

	const socialIcons = {
		email: Mail,
		instagram: Instagram,
		facebook: Facebook,
		github: Github
	};
</script>

<footer
	class="m-4 mx-auto max-w-fit rounded-xl bg-surface-100/30 p-2 text-center backdrop-blur-xs dark:bg-surface-800/30"
>
	<div class="inline-flex items-center justify-center space-x-4">
		{#each Object.entries(SOCIAL_LINKS) as [key, href]}
			{@const Icon = socialIcons[key]}
			{#if Icon}
				<a
					{href}
					target="_blank"
					rel="noopener noreferrer"
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
