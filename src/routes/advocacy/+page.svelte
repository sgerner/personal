<script>
	import Seo from '$lib/components/meta/Seo.svelte';
	import GlassPanel from '$lib/components/ui/GlassPanel.svelte';
	import { ArrowRight, Bike, GraduationCap, Mail, Users, School, Building2 } from '@lucide/svelte';

	const advocacyLinks = [
		{
			href: 'https://3feetplease.org',
			title: '3 Feet Please',
			description: 'Making Roads Safer for Cyclists',
			linkText: 'Learn More',
			image: '/3fp.png',
			accent: 'from-yellow-500/20 to-orange-500/10'
		},
		{
			href: 'https://learn.3feetplease.org',
			title: 'Bicycle Advocacy Wiki',
			description: 'Resource to transform your streets',
			linkText: 'Change Your Community',
			image: '/wiki.png',
			accent: 'from-blue-500/20 to-cyan-500/10'
		},
		{
			href: 'https://biketempe.org',
			title: 'T.B.A.G.',
			description: 'Tempe Bicycle Action Group',
			linkText: 'Join T.B.A.G.',
			image: '/tbag.jpg',
			accent: 'from-red-500/20 to-rose-500/10'
		}
	];

	const classOfferings = [
		{ icon: Users, label: 'Youth & Adult', sub: 'Learn to Ride Classes' },
		{ icon: School, label: 'Schools', sub: 'Safety Workshops' },
		{ icon: Building2, label: 'Employers', sub: 'Workplace Programs' },
		{ icon: Users, label: 'Small Groups', sub: 'Community Sessions' }
	];
</script>

<Seo
	title="Advocacy"
	description="Promoting safe and accessible streets for everyone. League of American Bicyclists Certified Instructor offering free Learn to Ride classes and bicycle safety workshops."
/>

<!-- ─── Hero ─── -->
<header
	class="relative flex flex-col items-start justify-end overflow-hidden px-6 pt-24 pb-12 sm:px-10"
>
	<div class="pointer-events-none absolute inset-0"></div>

	<div class="advocate-line mb-5 h-[3px] w-16 rounded-full bg-secondary-500"></div>

	<p
		class="relative z-10 mb-2 text-xs font-bold tracking-[0.35em] text-secondary-400 uppercase opacity-90"
	>
		Streets Worth Loving
	</p>
	<h1
		class="relative z-10 text-5xl leading-none font-extrabold tracking-tight text-white drop-shadow-xl sm:text-6xl lg:text-7xl"
	>
		Cycling<br /><span class="text-secondary-500 dark:text-secondary-400">Advocacy</span>
	</h1>
	<p class="relative z-10 mt-4 max-w-prose text-base text-white">
		Fighting for streets where biking, walking, and rolling feel natural.
	</p>
</header>

<!-- ─── Mission statement ─── -->
<section class="relative z-10 px-4 py-10 sm:px-8">
	<GlassPanel class="max-w-6xl">
		<!-- Section label -->
		<div
			class="mb-5 flex items-center justify-center gap-2 text-secondary-500 dark:text-secondary-400"
		>
			<Bike size={18} />
			<span class="text-xs font-bold tracking-[0.3em] uppercase">The Mission</span>
			<Bike size={18} />
		</div>

		<!-- Pull-quote -->
		<p class="mb-6 text-center text-lg leading-relaxed">
			Join me in advocating for streets that make our communities thrive. Through my work with
			<a
				href="https://biketempe.org"
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-secondary-500 underline underline-offset-4 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-300"
				>Tempe Bicycle Action Group</a
			>
			and
			<a
				href="https://3feetplease.org"
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-secondary-500 underline underline-offset-4 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-300"
				>Three Feet Please</a
			>, I fight for a vision of safer, more vibrant streets where biking, walking, and rolling feel
			natural.
		</p>

		<!-- Left-bordered belief rows -->
		<ul class="flex flex-col">
			{#each ['We deserve streets we can smile about, not just survive.', 'We deserve streets that connect us, not divide us.', 'We deserve streets that bring people together.'] as statement}
				<li
					class="my-1 flex items-center gap-4 border-b-1 border-l-4 border-secondary-500 py-3 pl-4 text-base font-semibold dark:border-secondary-400"
				>
					✅ {statement}
				</li>
			{/each}
		</ul>
	</GlassPanel>
</section>

<!-- ─── Advocacy org cards ─── -->
<section class="relative z-10 px-4 py-10 sm:px-8">
	<div class="mx-auto max-w-6xl">
		<p class="mb-2 text-center text-sm font-bold tracking-[0.3em] text-secondary-500 uppercase">
			Organizations I Support
		</p>
		<h2 class="mb-8 text-center text-3xl font-extrabold text-white">Advocacy Partners</h2>

		<div class="grid grid-cols-1 gap-5 md:grid-cols-3">
			{#each advocacyLinks as link}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="advocacy-card group relative flex flex-col overflow-hidden rounded-lg border border-surface-200/50 bg-surface-100/50 shadow-lg backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-surface-700/50 dark:bg-surface-800/30"
				>
					<!-- Gradient accent top bar -->
					<div
						class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r {link.accent} via-secondary-500/60"
					></div>

					<!-- Card body -->
					<div class="flex flex-1 flex-col p-5">
						<div class="mb-4 flex items-center gap-4">
							<div
								class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-surface-200/50 bg-surface-200/60 p-1 dark:border-surface-700/50 dark:bg-surface-700/60"
							>
								<img src={link.image} alt={link.title} class="h-full w-full object-contain" />
							</div>
							<div>
								<h3 class="text-lg font-bold">{link.title}</h3>
								<p class="text-sm">{link.description}</p>
							</div>
						</div>
					</div>

					<!-- CTA footer -->
					<div class="border-t border-surface-200/50 px-5 py-3 dark:border-surface-700/50">
						<span
							class="flex items-center gap-2 text-sm font-semibold text-secondary-500 duration-200 group-hover:gap-3 dark:text-secondary-400"
						>
							{link.linkText}
							<ArrowRight
								size={15}
								class="transition-transform duration-200 group-hover:translate-x-1"
							/>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ─── LAB Certified Instructor ─── -->
<section class="relative z-10 px-4 pb-12 sm:px-8">
	<GlassPanel class="max-w-6xl overflow-hidden">
		<!-- Decorative glow blobs -->
		<div
			class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary-500/10 blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl"
		></div>

		<div class="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
			<!-- Icon + badge -->
			<div class="flex shrink-0 flex-col items-center gap-3 lg:items-start">
				<div
					class="flex h-20 w-20 items-center justify-center rounded-2xl preset-outlined-surface-900-100 dark:preset-outlined-secondary-500"
				>
					<GraduationCap size={40} class="text-surface-900 dark:text-secondary-500" />
				</div>
			</div>

			<!-- Content -->
			<div class="flex-1">
				<a
					href="https://bikeleague.org"
					target="_blank"
					rel="noopener noreferrer"
					class="mb-1 inline-block text-xs font-bold tracking-[0.3em] text-secondary-300-700 uppercase underline-offset-4 hover:underline"
				>
					League of American Bicyclists
				</a>
				<h2 class="mb-3 text-2xl font-extrabold sm:text-3xl">Certified Cycling Instructor</h2>
				<p class="mb-6 text-base leading-relaxed">
					As a <a
						href="https://bikeleague.org"
						target="_blank"
						rel="noopener noreferrer"
						class="font-bold">League of American Bicyclists (LAB) Certified Instructor</a
					>, I offer
					<strong class="text-secondary-500 opacity-100 dark:text-secondary-400">FREE</strong> bicycle
					education for individuals and organizations in the greater Tempe area. Whether you've never
					ridden or want to ride more confidently, I'm here to help.
				</p>

				<!-- Offering chips -->
				<div class="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each classOfferings as offering}
						<div
							class="flex flex-col items-center gap-1.5 rounded-xl preset-outlined-surface-900-100 p-2 text-center dark:preset-outlined-secondary-500"
						>
							<svelte:component
								this={offering.icon}
								size={20}
								class="text-secondary-500 dark:text-secondary-400"
							/>
							<span class="text-xs font-bold uppercase">{offering.label}</span>
							<span class="text-xs">{offering.sub}</span>
						</div>
					{/each}
				</div>

				<!-- CTA -->
				<a
					href="mailto:steven@sgerner.com?subject=Bicycle%20Safety%20Class%20Inquiry"
					class="inline-flex items-center gap-2.5 rounded-xl bg-secondary-500 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-secondary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-400 hover:shadow-xl hover:shadow-secondary-500/40"
				>
					<Mail size={16} />
					Reach Out for a Free Class
				</a>
			</div>
		</div>
	</GlassPanel>
</section>

<style>
	.advocate-line {
		animation: line-grow 0.8s ease-out both;
	}
	@keyframes line-grow {
		from {
			width: 0;
			opacity: 0;
		}
		to {
			width: 4rem;
			opacity: 1;
		}
	}
</style>
