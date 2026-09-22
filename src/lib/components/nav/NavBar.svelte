<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import {
		Sun,
		Moon,
		Home,
		Image as Gallery,
		Croissant,
		Heart,
		FolderGit2,
		MoreHorizontal,
		ExternalLink
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { SITE_TITLE } from '$lib/config/site';

	let isDarkMode = $state(false);
	let moreOpen = $state(false);

	onMount(() => {
		isDarkMode = document.documentElement.dataset.mode === 'dark';
	});

	function toggleMode() {
		isDarkMode = !isDarkMode;
		document.documentElement.dataset.mode = isDarkMode ? 'dark' : 'light';
		localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
	}

	async function handleNavigation(event, href) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		event.preventDefault();
		moreOpen = false;

		if (window.location.pathname !== href) await goto(href);

		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
		setTimeout(() => {
			window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}, 0);
	}

	const routes = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/gallery', label: 'Gallery', icon: Gallery },
		{ href: '/advocacy', label: 'Advocacy', icon: Heart },
		{ href: '/projects', label: 'Projects', icon: FolderGit2 }
	];
</script>

<!-- Mobile Bottom Bar -->
<div class="fixed right-0 bottom-0 left-0 z-50 pb-[env(safe-area-inset-bottom)] md:hidden">
	{#if moreOpen}
		<div
			class="absolute right-2 bottom-full mb-2 min-w-52 rounded-lg border border-white/15 bg-[#14121d]/95 p-2 text-white shadow-2xl backdrop-blur-xl"
			role="menu"
			aria-label="More options"
		>
			<a
				href="https://ButteredUpBakery.com"
				target="_blank"
				rel="noopener noreferrer"
				role="menuitem"
				class="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition hover:bg-white/10"
				onclick={() => (moreOpen = false)}
			>
				<Croissant size={20} class="text-secondary-300" />
				<span class="flex-1">Visit the Bakery</span>
				<ExternalLink size={14} class="text-white/50" />
			</a>
			<button
				type="button"
				role="menuitem"
				class="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold transition hover:bg-white/10"
				onclick={toggleMode}
			>
				{#if isDarkMode}
					<Sun size={20} class="text-secondary-300" />
					<span>Use light theme</span>
				{:else}
					<Moon size={20} class="text-secondary-300" />
					<span>Use dark theme</span>
				{/if}
			</button>
		</div>
	{/if}

	<Navigation
		layout="bar"
		class="border-t border-white/10 bg-[#14121d]/90 text-white backdrop-blur-xl"
	>
		<Navigation.Menu class="flex w-full flex-row">
			{#each routes as route}
				<Navigation.TriggerAnchor
					href={route.href}
					aria-label={route.label}
					onclick={(event) => handleNavigation(event, route.href)}
					class="flex flex-1 items-center justify-center py-4 transition-colors {$page.url
						.pathname === route.href
						? 'preset-filled-primary-500'
						: 'hover:bg-surface-800'}"
				>
					{@const Icon = route.icon}
					<Icon size={24} />
				</Navigation.TriggerAnchor>
			{/each}
			<button
				type="button"
				class="flex flex-1 items-center justify-center py-4 transition-colors hover:bg-surface-800"
				onclick={() => (moreOpen = !moreOpen)}
				aria-label="More options"
				aria-expanded={moreOpen}
				aria-haspopup="menu"
			>
				<MoreHorizontal size={24} />
			</button>
		</Navigation.Menu>
	</Navigation>
</div>

<!-- Desktop Sidebar -->
<div class="sticky top-0 z-50 hidden h-screen shrink-0 md:block">
	<Navigation layout="rail" class="h-full bg-surface-900/70 text-white backdrop-blur-xs">
		<Navigation.Header>
			<a
				href="/"
				onclick={(event) => handleNavigation(event, '/')}
				class="flex flex-col items-center gap-2 py-8"
			>
				<img src="/favicon.svg" alt="Logo" class="h-10 w-10" />
				<p class="w-full px-2 text-center text-[10px] font-bold uppercase">{SITE_TITLE}</p>
				<hr class="mt-4 w-8 border-surface-200/50" />
			</a>
		</Navigation.Header>
		<Navigation.Menu>
			{#each routes as route}
				<Navigation.TriggerAnchor
					href={route.href}
					onclick={(event) => handleNavigation(event, route.href)}
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
				aria-label="Visit Buttered Up Bakery (opens in a new tab)"
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
