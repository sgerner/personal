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

	let navValue = $state('Home');
</script>

<!-- Mobile Bottom Bar -->
<div class="fixed right-0 bottom-0 left-0 z-50 md:hidden">
	<Navigation.Bar background="bg-surface-900/70" classes="backdrop-blur-xs text-white">
		<a href="/" class="m-0 btn-icon btn h-20 w-full p-0">
			<img src="/favicon.svg" alt="Logo" class="h-12 w-12" />
		</a>
		{#each routes as route}
			<Navigation.Tile
				href={route.href}
				selected={$page.url.pathname === route.href}
				label={route.label}
			>
				{@const Icon = route.icon}
				<Icon />
			</Navigation.Tile>
		{/each}
		<button
			class="btn-icon btn h-full hover:preset-filled-secondary-500"
			onclick={toggleMode}
			aria-label="Toggle theme"
		>
			{#if isDarkMode}
				<Sun />
			{:else}
				<Moon />
			{/if}
		</button>
	</Navigation.Bar>
</div>

<!-- Desktop Sidebar -->
<div class="hidden md:block">
	<Navigation.Rail
		value={navValue}
		onValueChange={(newValue) => (navValue = newValue)}
		background="bg-surface-900/70"
		classes="backdrop-blur-xs text-white"
	>
		{#snippet tiles()}
			<a href="/" class="btn-icon btn flex w-14 flex-col gap-0 pb-16">
				<img src="/favicon.svg" alt="Logo" />
				<p class="w-full text-center text-xs font-bold text-wrap uppercase">{SITE_TITLE}</p>
				<hr class="my-4 hr border-surface-200/50" />
			</a>
			{#each routes as route}
				<Navigation.Tile
					href={route.href}
					selected={$page.url.pathname === route.href}
					label={route.label}
					id={route.label}
				>
					{@const Icon = route.icon}
					<Icon />
				</Navigation.Tile>
			{/each}
			<Navigation.Tile
				href="https://ButteredUpBakery.com"
				label="Bakery"
				id="Bakery"
				target="_blank"
			>
				<Croissant />
			</Navigation.Tile>
			<button
				class="btn-icon btn h-14 w-14 hover:preset-filled-secondary-500"
				onclick={toggleMode}
				aria-label="Toggle theme"
			>
				{#if isDarkMode}
					<Sun />
				{:else}
					<Moon />
				{/if}
			</button>
		{/snippet}
	</Navigation.Rail>
</div>
