<script>
	import { page } from '$app/stores';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { Sun, Moon, Home, Image as Gallery, Croissant, Heart, FolderGit2 } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { SITE_TITLE } from '$lib/config/site';

	let isDarkMode = $state(false);

	onMount(() => {
		isDarkMode = document.documentElement.dataset.mode === 'dark';
	});

	function toggleMode() {
		isDarkMode = !isDarkMode;
		document.documentElement.dataset.mode = isDarkMode ? 'dark' : 'light';
		localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
	}

	const routes = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/gallery', label: 'Gallery', icon: Gallery },
		{ href: '/advocacy', label: 'Advocacy', icon: Heart },
		{ href: '/projects', label: 'Projects', icon: FolderGit2 }
	];
</script>

<!-- Mobile Bottom Bar -->
<div class="fixed right-0 bottom-0 left-0 z-50 md:hidden">
	<Navigation layout="bar" class="bg-surface-900/80 text-white backdrop-blur-md border-t border-white/5">
		<Navigation.Menu class="flex w-full flex-row">
			{#each routes as route}
				<Navigation.TriggerAnchor
					href={route.href}
					aria-label={route.label}
					class="flex flex-1 items-center justify-center py-4 transition-colors {$page.url.pathname ===
					route.href
						? 'preset-filled-primary-500'
						: 'hover:bg-surface-800'}"
				>
					{@const Icon = route.icon}
					<Icon size={24} />
				</Navigation.TriggerAnchor>
			{/each}
			<button
				class="flex flex-1 items-center justify-center py-4 transition-colors hover:bg-surface-800"
				onclick={toggleMode}
				aria-label="Toggle theme"
			>
				{#if isDarkMode}
					<Sun size={24} />
				{:else}
					<Moon size={24} />
				{/if}
			</button>
		</Navigation.Menu>
	</Navigation>
</div>

<!-- Desktop Sidebar -->
<div class="hidden md:block">
	<Navigation layout="rail" class="h-full bg-surface-900/70 text-white backdrop-blur-xs">
		<Navigation.Header>
			<a href="/" class="flex flex-col items-center gap-2 py-8">
				<img src="/favicon.svg" alt="Logo" class="h-10 w-10" />
				<p class="w-full px-2 text-center text-[10px] font-bold uppercase">{SITE_TITLE}</p>
				<hr class="mt-4 w-8 border-surface-200/50" />
			</a>
		</Navigation.Header>
		<Navigation.Menu>
			{#each routes as route}
				<Navigation.TriggerAnchor
					href={route.href}
					class="flex w-full flex-col items-center justify-center p-4 transition-colors {$page.url
						.pathname === route.href
						? 'preset-filled-primary-500'
						: 'hover:bg-surface-800'}"
				>
					{@const Icon = route.icon}
					<Icon size={24} />
					<span class="mt-2 text-xs">{route.label}</span>
				</Navigation.TriggerAnchor>
			{/each}
			<Navigation.TriggerAnchor
				href="https://ButteredUpBakery.com"
				target="_blank"
				class="flex w-full flex-col items-center justify-center p-4 hover:bg-surface-800"
			>
				<Croissant size={24} />
				<span class="mt-2 text-xs">Bakery</span>
			</Navigation.TriggerAnchor>
		</Navigation.Menu>
		<Navigation.Footer>
			<div class="flex justify-center p-4">
				<button
					class="rounded-full p-3 transition-colors hover:preset-filled-secondary-500"
					onclick={toggleMode}
					aria-label="Toggle theme"
				>
					{#if isDarkMode}
						<Sun size={24} />
					{:else}
						<Moon size={24} />
					{/if}
				</button>
			</div>
		</Navigation.Footer>
	</Navigation>
</div>
