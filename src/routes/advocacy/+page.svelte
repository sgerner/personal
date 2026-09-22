<script>
	import Seo from '$lib/components/meta/Seo.svelte';
	import GlassPanel from '$lib/components/ui/GlassPanel.svelte';
	import {
		ArrowRight,
		ArrowUpRight,
		Bike,
		Building2,
		Check,
		GraduationCap,
		HeartHandshake,
		Mail,
		MapPin,
		Megaphone,
		School,
		ShieldCheck,
		Users
	} from '@lucide/svelte';

	const advocacyLinks = [
		{
			href: 'https://3feetplease.org',
			title: '3 Feet Please',
			description: 'Making roads safer for cyclists',
			focus: 'Safer passing',
			linkText: 'Learn more',
			image: '/3fp.png'
		},
		{
			href: 'https://learn.3feetplease.org',
			title: 'Bicycle Advocacy Wiki',
			description: 'A practical resource for changing streets',
			focus: 'Tools + ideas',
			linkText: 'Change your community',
			image: '/wiki.png'
		},
		{
			href: 'https://biketempe.org',
			title: 'T.B.A.G.',
			description: 'Tempe Bicycle Action Group',
			focus: 'Local action',
			linkText: 'Join T.B.A.G.',
			image: '/tbag.jpg'
		}
	];

	const beliefs = [
		'We deserve streets we can smile about, not just survive.',
		'We deserve streets that connect us, not divide us.',
		'We deserve streets that bring people together.'
	];

	const outcomes = [
		{
			icon: ShieldCheck,
			eyebrow: 'Design',
			title: 'Feel safer',
			text: 'Good streets make room for real people, real speeds, and the occasional mistake.'
		},
		{
			icon: GraduationCap,
			eyebrow: 'Education',
			title: 'Ride with confidence',
			text: 'Practical skills turn “maybe someday” into a next ride that feels possible.'
		},
		{
			icon: HeartHandshake,
			eyebrow: 'Community',
			title: 'Move together',
			text: 'Local voices are stronger when neighbors, riders, and decision-makers show up together.'
		}
	];

	const waysToHelp = [
		{
			icon: GraduationCap,
			title: 'Learn to ride',
			text: 'Build comfort, confidence, and practical street skills at your own pace.',
			linkText: 'Ask about a free class',
			href: 'mailto:steven@sgerner.com?subject=Bicycle%20Safety%20Class%20Inquiry'
		},
		{
			icon: Building2,
			title: 'Bring a workshop',
			text: 'Give your school, workplace, or community group a clearer path to safer riding.',
			linkText: 'Plan a workshop',
			href: 'mailto:steven@sgerner.com?subject=Bicycle%20Safety%20Workshop'
		},
		{
			icon: Megaphone,
			title: 'Advocate locally',
			text: 'Find language, context, and momentum for streets that work for more people.',
			linkText: 'Explore the playbook',
			href: 'https://learn.3feetplease.org'
		},
		{
			icon: Users,
			title: 'Find your people',
			text: 'Connect with local riders and the organizations already doing the work.',
			linkText: 'Meet the local community',
			href: 'https://biketempe.org'
		}
	];

	const classOfferings = [
		{ icon: Users, label: 'Youth & Adult', sub: 'Learn to ride classes' },
		{ icon: School, label: 'Schools', sub: 'Safety workshops' },
		{ icon: Building2, label: 'Employers', sub: 'Workplace programs' },
		{ icon: Users, label: 'Small Groups', sub: 'Community sessions' }
	];
</script>

<Seo
	title="Advocacy"
	description="Promoting safe and accessible streets for everyone through local advocacy, practical bicycle education, and community action in the greater Tempe area."
/>

<!-- ─── Hero ─── -->
<header
	class="relative overflow-hidden px-4 py-20 sm:px-8 lg:flex lg:min-h-[min(78vh,720px)] lg:items-center lg:py-24"
>
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
		aria-hidden="true"
	></div>
	<div
		class="relative z-10 mx-auto grid w-full max-w-6xl items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
	>
		<div>
			<div class="advocate-line mb-6 h-[3px] w-16 rounded-sm bg-secondary-500"></div>
			<p class="mb-3 text-xs font-bold tracking-[0.35em] text-secondary-300 uppercase">
				Streets worth loving
			</p>
			<h1
				class="max-w-3xl text-5xl leading-[0.94] font-extrabold tracking-tight text-white drop-shadow-xl sm:text-7xl lg:text-8xl"
			>
				Cycling<br /><span class="text-secondary-300">Advocacy</span>
			</h1>
			<p class="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
				Fighting for streets where biking, walking, and rolling feel natural — and helping more
				people feel at home on a bike.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<a
					href="#ways-to-help"
					class="inline-flex items-center gap-2 rounded-md bg-secondary-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-secondary-500/25 transition hover:-translate-y-0.5 hover:bg-secondary-300"
				>
					Find your next step
					<ArrowRight size={16} />
				</a>
				<a
					href="#partners"
					class="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
				>
					Meet the partners
				</a>
			</div>
			<div
				class="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/20 pt-5 text-white/80"
			>
				<div>
					<MapPin size={17} class="mb-2 text-secondary-300" />
					<p class="text-xs font-bold tracking-[0.16em] uppercase">Tempe, AZ</p>
				</div>
				<div>
					<GraduationCap size={17} class="mb-2 text-secondary-300" />
					<p class="text-xs font-bold tracking-[0.16em] uppercase">LAB certified</p>
				</div>
				<div>
					<HeartHandshake size={17} class="mb-2 text-secondary-300" />
					<p class="text-xs font-bold tracking-[0.16em] uppercase">Open to all</p>
				</div>
			</div>
		</div>

		<div class="p-6 sm:p-8">
			<div class="mb-8 flex items-center justify-between gap-4">
				<span
					class="rounded-md border border-secondary-500/30 bg-secondary-400/15 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-secondary-700 uppercase dark:text-secondary-300"
				>
					A practical approach
				</span>
				<Bike size={22} class="text-secondary-600 dark:text-secondary-300" />
			</div>
			<h2 class="max-w-sm text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
				Small changes make room for more people.
			</h2>
			<p
				class="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base dark:text-white/70"
			>
				The most useful advocacy is specific, welcoming, and close to home: teach a skill, support a
				neighbor, and keep asking for streets that work for everyone.
			</p>
			<div
				class="mt-8 grid grid-cols-3 gap-2 border-t border-slate-900/10 pt-5 text-center dark:border-white/10"
			>
				<div>
					<p class="text-2xl font-black text-secondary-700 dark:text-secondary-300">01</p>
					<p
						class="mt-1 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase dark:text-white/55"
					>
						Learn
					</p>
				</div>
				<div>
					<p class="text-2xl font-black text-secondary-700 dark:text-secondary-300">02</p>
					<p
						class="mt-1 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase dark:text-white/55"
					>
						Connect
					</p>
				</div>
				<div>
					<p class="text-2xl font-black text-secondary-700 dark:text-secondary-300">03</p>
					<p
						class="mt-1 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase dark:text-white/55"
					>
						Act
					</p>
				</div>
			</div>
		</div>
	</div>
</header>

<!-- ─── Mission statement ─── -->
<section class="relative z-10 px-4 py-10 sm:px-8 lg:py-14">
	<GlassPanel class="max-w-6xl p-6 sm:p-8 lg:p-10">
		<div class="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
			<div>
				<div class="mb-5 flex items-center gap-2 text-secondary-700 dark:text-secondary-300">
					<Bike size={18} />
					<span class="text-xs font-bold tracking-[0.3em] uppercase">The mission</span>
				</div>
				<h2 class="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
					Streets are shared space.
				</h2>
				<p class="mt-4 text-base leading-relaxed text-slate-600 dark:text-white/70">
					Everyone should be able to get where they are going with dignity, whether they are
					walking, biking, rolling, or driving.
				</p>
			</div>

			<div>
				<p class="text-lg leading-relaxed sm:text-xl">
					Join me in advocating for streets that make our communities thrive. Through my work with
					<a
						href="https://biketempe.org"
						target="_blank"
						rel="noopener noreferrer"
						class="font-semibold text-secondary-700 underline decoration-secondary-500/60 underline-offset-4 hover:text-secondary-600 dark:text-secondary-300 dark:hover:text-secondary-200"
						>Tempe Bicycle Action Group</a
					>
					and
					<a
						href="https://3feetplease.org"
						target="_blank"
						rel="noopener noreferrer"
						class="font-semibold text-secondary-700 underline decoration-secondary-500/60 underline-offset-4 hover:text-secondary-600 dark:text-secondary-300 dark:hover:text-secondary-200"
						>Three Feet Please</a
					>, I fight for a vision of safer, more vibrant streets where biking, walking, and rolling
					feel natural.
				</p>

				<ul class="mt-7 flex flex-col">
					{#each beliefs as belief}
						<li
							class="group flex items-center gap-3 border-b border-slate-900/10 py-4 text-base font-semibold text-slate-800 last:border-b-0 sm:text-lg dark:border-white/10 dark:text-white"
						>
							<span
								class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-400/25 text-secondary-700 transition group-hover:bg-secondary-400/40 dark:text-secondary-300"
							>
								<Check size={16} strokeWidth={3} />
							</span>
							<span>{belief}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</GlassPanel>
</section>

<!-- ─── Outcomes ─── -->
<section class="relative z-10 px-4 py-10 sm:px-8 lg:py-14">
	<div class="mx-auto max-w-6xl">
		<p
			class="mb-2 text-center text-sm font-bold tracking-[0.3em] text-secondary-700 uppercase dark:text-secondary-300"
		>
			What better streets unlock
		</p>
		<h2
			class="mx-auto max-w-2xl text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
		>
			More freedom in the everyday.
		</h2>
		<div class="mt-8 grid gap-4 md:grid-cols-3">
			{#each outcomes as outcome}
				{@const OutcomeIcon = outcome.icon}
				<article
					class="editorial-surface rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/90 dark:hover:bg-slate-950/80"
				>
					<div class="flex items-center justify-between gap-4">
						<div
							class="flex h-11 w-11 items-center justify-center rounded-md bg-secondary-400/20 text-secondary-700 dark:text-secondary-300"
						>
							<OutcomeIcon size={22} />
						</div>
						<span
							class="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-white/50"
							>{outcome.eyebrow}</span
						>
					</div>
					<h3 class="mt-7 text-2xl font-extrabold">{outcome.title}</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-white/70">
						{outcome.text}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Advocacy org cards ─── -->
<section id="partners" class="relative z-10 scroll-mt-8 px-4 py-10 sm:px-8 lg:py-14">
	<div class="mx-auto max-w-6xl">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p
					class="mb-2 text-sm font-bold tracking-[0.3em] text-secondary-700 uppercase dark:text-secondary-300"
				>
					Organizations I support
				</p>
				<h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
					Advocacy partners
				</h2>
			</div>
			<p class="max-w-md text-sm leading-relaxed text-white/70 sm:text-right">
				Different roles, same goal: streets that help people participate in their own communities.
			</p>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
			{#each advocacyLinks as link}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="editorial-surface group relative flex min-h-full flex-col overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-2xl dark:hover:bg-slate-950/80"
				>
					<div
						class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary-300 via-secondary-500/70 to-transparent"
					></div>
					<div class="flex flex-1 flex-col p-5 sm:p-6">
						<div class="flex items-start gap-4">
							<div
								class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-900/10 bg-white/85 p-1.5 dark:border-white/15 dark:bg-white/10"
							>
								<img src={link.image} alt={link.title} class="h-full w-full object-contain" />
							</div>
							<div class="min-w-0">
								<p
									class="text-[10px] font-bold tracking-[0.18em] text-secondary-700 uppercase dark:text-secondary-300"
								>
									{link.focus}
								</p>
								<h3 class="mt-1 text-xl font-extrabold tracking-tight">{link.title}</h3>
								<p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/70">
									{link.description}
								</p>
							</div>
						</div>
					</div>
					<div
						class="flex items-center justify-between border-t border-slate-900/10 bg-black/5 px-5 py-4 sm:px-6 dark:border-white/10 dark:bg-white/5"
					>
						<span class="text-sm font-bold text-secondary-700 dark:text-secondary-300"
							>{link.linkText}</span
						>
						<ArrowUpRight
							size={18}
							class="text-secondary-700 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-secondary-300"
						/>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Ways to help ─── -->
<section id="ways-to-help" class="relative z-10 scroll-mt-8 px-4 py-10 sm:px-8 lg:py-14">
	<div class="mx-auto max-w-6xl">
		<div class="max-w-2xl">
			<p
				class="mb-2 text-sm font-bold tracking-[0.3em] text-secondary-700 uppercase dark:text-secondary-300"
			>
				Start where you are
			</p>
			<h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
				There’s a useful next step for every kind of rider.
			</h2>
			<p class="mt-4 text-base leading-relaxed text-white/70">
				You do not need to be an expert or a full-time activist. Pick the move that feels useful
				now, and we can build from there.
			</p>
		</div>

		<div class="mt-8 grid gap-4 sm:grid-cols-2">
			{#each waysToHelp as way}
				{@const WayIcon = way.icon}
				<a
					href={way.href}
					target={way.href.startsWith('http') ? '_blank' : undefined}
					rel={way.href.startsWith('http') ? 'noopener noreferrer' : undefined}
					class="editorial-surface group flex gap-4 rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/90 sm:p-6 dark:hover:bg-slate-950/80"
				>
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary-400/20 text-secondary-700 dark:text-secondary-300"
					>
						<WayIcon size={21} />
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex items-start justify-between gap-3">
							<h3 class="text-lg font-extrabold">{way.title}</h3>
							<ArrowUpRight
								size={17}
								class="shrink-0 text-secondary-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-secondary-300"
							/>
						</div>
						<p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/70">{way.text}</p>
						<p class="mt-4 text-sm font-bold text-secondary-700 dark:text-secondary-300">
							{way.linkText}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ─── LAB Certified Instructor ─── -->
<section id="classes" class="relative z-10 scroll-mt-8 px-4 py-10 sm:px-8 lg:py-14">
	<GlassPanel class="max-w-6xl overflow-hidden p-6 sm:p-8 lg:p-10">
		<div
			class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary-500/10 blur-3xl"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl"
			aria-hidden="true"
		></div>

		<div class="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
			<div class="flex shrink-0 flex-col items-center gap-3 lg:items-start">
				<div
					class="flex h-20 w-20 items-center justify-center rounded-md border border-secondary-600/40 bg-secondary-400/10 text-secondary-700 dark:border-secondary-400/60 dark:text-secondary-300"
				>
					<GraduationCap size={40} />
				</div>
				<span
					class="text-center text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase lg:text-left dark:text-white/50"
					>Practical education</span
				>
			</div>

			<div class="flex-1">
				<a
					href="https://bikeleague.org"
					target="_blank"
					rel="noopener noreferrer"
					class="mb-1 inline-block text-xs font-bold tracking-[0.3em] text-secondary-700 uppercase underline decoration-secondary-500/50 underline-offset-4 hover:underline dark:text-secondary-300"
				>
					League of American Bicyclists
				</a>
				<h2 class="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
					Certified cycling instructor
				</h2>
				<p class="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-white/75">
					As a
					<a
						href="https://bikeleague.org"
						target="_blank"
						rel="noopener noreferrer"
						class="font-bold text-slate-900 underline decoration-secondary-500/60 underline-offset-4 dark:text-white"
						>League of American Bicyclists (LAB) Certified Instructor</a
					>, I offer
					<strong class="text-secondary-700 dark:text-secondary-300">free</strong> bicycle education for
					individuals and organizations in the greater Tempe area. Whether you have never ridden or want
					to ride more confidently, I am here to help.
				</p>

				<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each classOfferings as offering}
						{@const OfferingIcon = offering.icon}
						<div
							class="flex flex-col items-center gap-2 rounded-md border border-slate-900/10 bg-black/5 p-4 text-center text-slate-800 dark:border-white/15 dark:bg-white/5 dark:text-white"
						>
							<OfferingIcon size={20} class="text-secondary-700 dark:text-secondary-300" />
							<span class="text-[11px] font-bold tracking-wide uppercase">{offering.label}</span>
							<span class="text-xs text-slate-500 dark:text-white/60">{offering.sub}</span>
						</div>
					{/each}
				</div>

				<a
					href="mailto:steven@sgerner.com?subject=Bicycle%20Safety%20Class%20Inquiry"
					class="mt-8 inline-flex items-center gap-2.5 rounded-md bg-secondary-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-secondary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-300 hover:shadow-xl hover:shadow-secondary-500/40"
				>
					<Mail size={16} />
					Reach out for a free class
				</a>
			</div>
		</div>
	</GlassPanel>
</section>

<!-- ─── Contact close ─── -->
<section class="relative z-10 px-4 pt-10 pb-20 sm:px-8 lg:pt-14">
	<div
		class="mx-auto flex max-w-6xl flex-col gap-6 rounded-lg border border-secondary-500/30 bg-secondary-300/90 p-6 text-slate-950 shadow-2xl shadow-secondary-500/15 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10"
	>
		<div class="max-w-2xl">
			<p class="text-xs font-bold tracking-[0.3em] uppercase opacity-70">Keep the wheels turning</p>
			<h2 class="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
				Have a street, class, or idea in mind?
			</h2>
			<p class="mt-3 max-w-xl text-sm leading-relaxed text-slate-950/75 sm:text-base">
				Start a conversation. The next useful action is usually smaller — and more local — than it
				first appears.
			</p>
		</div>
		<a
			href="mailto:steven@sgerner.com?subject=Let%27s%20talk%20about%20cycling%20advocacy"
			class="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
		>
			<Mail size={16} />
			Start a conversation
		</a>
	</div>
</section>

<style>
	:global(html[data-mode='light']) .text-secondary-700 {
		color: #526900 !important;
	}

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
