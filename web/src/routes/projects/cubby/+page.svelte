<script>
	import dashboard from '$lib/screenshots/cubby/dashboard.webp';
	import shelf from '$lib/screenshots/cubby/shelf.webp';
	import tasks from '$lib/screenshots/cubby/tasks.webp';
	import limits from '$lib/screenshots/cubby/limits.webp';
	import market from '$lib/screenshots/cubby/market.webp';
	import finance from '$lib/screenshots/cubby/finance.webp';
	import expiry from '$lib/screenshots/cubby/expiry.webp';
	import gymExercise from '$lib/screenshots/cubby/gym-exercise.webp';
	import gymWorkout from '$lib/screenshots/cubby/gym-workout.webp';
	import coffee from '$lib/screenshots/cubby/coffee.webp';
	import meals from '$lib/screenshots/cubby/meals.webp';
	import illness from '$lib/screenshots/cubby/illness.webp';
	import travel from '$lib/screenshots/cubby/travel.webp';
	import journalRecap from '$lib/screenshots/cubby/journal-recap.webp';
	import growingUp from '$lib/screenshots/cubby/growing-up.webp';
	import enrichment from '$lib/screenshots/cubby/enrichment.webp';
	import screentimer from '$lib/screenshots/cubby/screentimer.webp';
	import CubbyLogo from '$lib/assets/cubby-logo.webp';
	import BackIcon from '~icons/lucide/arrow-left';
	import ChevronRightIcon from '~icons/lucide/chevron-right';
	import ExternalLinkIcon from '~icons/lucide/external-link';
	import Seo from '$lib/Seo.svelte';

	// Features are grouped the way the app groups them. Each group is a section, each feature a row.
	const groups = [
		{
			label: 'Routines',
			note: 'recurring upkeep, limits, and schedules',
			items: [
				{
					src: tasks,
					alt: 'Cubby tasks',
					headline: 'When did I last do this?',
					problem:
						"My kid's nasal spray started daily, then shifted to every two days, then three, while we were also tracking nose congestion alongside it. It was difficult enough that we didn't really track, beyond one or two messages on Telegram, and by the time we got to a doctor's consultation we couldn't answer any of her questions on how his symptoms had been.",
					solution:
						'A quick log for anything with a when-did-I-last question, one tap to record, one glance to answer. Each entry holds a snapshot of the interval at that moment, so we can look back at any point and know exactly what the routine was, with symptoms tracked alongside it.',
				},
				{
					src: limits,
					alt: 'Cubby limits',
					headline: 'On pace, or already over',
					problem:
						"Screen time seemed to grow every week, then I got concerned about soda and beer too, and across all of them I needed unit conversion because a McDonald's small Coke is a very different drink from a can of Coke.",
					solution:
						"A weekly limit per habit tracked against a daily pace, so mid-week I can see at a glance whether I'm on track or already over, not just a raw count at the end. It's guilt-tripped me into skipping a drink more than once when I see the counter maxing out early in the week.",
				},
				{
					src: screentimer,
					alt: 'Cubby screen timer',
					headline: 'The same timers, by hand, every day',
					problem:
						"YouTube countdown videos weren't customizable for duration, voice, or ticking sounds, and tracking screen time meant juggling separate apps with no sense of where the week actually stood.",
					solution:
						'I built saved profiles so the common ones are one tap, added AI voices and ticking sounds so my kid could close his eyes without needing a video, and folded the tracking into a weekly limit so I always knew where we stood.',
				},
				{
					src: enrichment,
					alt: 'Cubby enrichment schedule',
					headline: 'The schedule nobody could find',
					problem:
						"Our kid's enrichment classes ended at a different time every day, and along the way we started and stopped classes, terms came with new timings, and make-up sessions got pasted into pinned Telegram messages we could never find. Across all the pins and emails we mixed up timings more than once, and usually ended up at the door waiting longer than we should have. One class required a make-up every time a public holiday fell on it, which made the whole thing even harder to follow.",
					solution:
						'The schedule is now the first thing you see when you open the app, so the right pickup time is one glance away, no hunting through chats or emails. Make-up sessions are clearly marked so nothing gets missed.',
				},
			],
		},
		{
			label: 'Health',
			note: 'four bodies, one of them a dog',
			items: [
				{
					src: gymWorkout,
					alt: 'Cubby gym workout',
					headline: 'What should I aim for today',
					problem:
						"I never trained with much structure, just gut feel and whatever I could vaguely recall from last time. For cable machines I couldn't remember which plate I used, so it was agar agar the rough position of the pin. Rest timings, lift volume, whether I hit failure or did a dropset or a warmup, none of it was tracked, and I had no way to know which exercises I was actually progressing on.",
					solution:
						"Every set is logged with weight, reps, rest time, and notes on failure or dropsets, so before each set I can see exactly what I did last time and what to aim for. No more guessing the pin position on cable machines. There's also a lock screen so sweaty hands mid-set don't accidentally hit a destructive button.",
				},
				{
					src: gymExercise,
					alt: 'Cubby gym exercise',
					headline: 'Am I actually getting stronger?',
					problem:
						'Even while lifting regularly I never really tracked progress, just noticed the odd milestone shift on bench or squat, and for machines, free weights, kettlebell rows, everything else, it was just too much to remember.',
					solution:
						"PR tracking with a progress chart per exercise so I can see whether I'm moving or stalling, and exercises come from an open-source dataset pulled once so the whole app stays consistent.",
				},
				{
					src: illness,
					alt: 'Cubby illness log',
					headline: "One log when everyone's sick at once",
					problem:
						'Temperatures, medicine timings, dosages, and MCs all went into Telegram messages nobody could find later, and it got worse the moment more than one of us was sick at once, because by the time we sat in front of a doctor the chronology was a blur.',
					solution:
						"A personal diary of medicines, symptoms, and temperatures per illness episode, so when the doctor asks what happened I can just read it out, whether it's for me, my wife, our kid, or the dog. For the dog especially it's useful, vet visits can be 8-12 months apart so I paste the vet's guidance straight in and pull it up next time without scrambling. Not trying to build an EHR, just enough to walk into a consult prepared.",
				},
				{
					src: coffee,
					alt: 'Cubby coffee recipes',
					headline: 'Which brew actually tasted better',
					problem:
						'Memory only went back a cup or two, anything else was roughly recalled, and definitely not across different bags, batches, or roasters.',
					solution:
						'Log the parameters per brew, bean weight, water amount, timing, and grinder clicks on my Kingrinder K6, with a taste rating so I can see which combinations actually taste better.',
				},
			],
		},
		{
			label: 'Home',
			note: 'what comes in and what runs out',
			items: [
				{
					src: meals,
					alt: 'Cubby meals',
					headline: 'What did we eat yesterday?',
					problem:
						'We could never recall what we ate, even from the afternoon or the day before, and with a lot of fast food and salty food in the mix I had no real picture of what the week actually looked like.',
					solution:
						"Log it at the table before we leave, photo attached, so there's an actual record instead of just a vague sense.",
				},
				{
					src: expiry,
					alt: 'Cubby expiry tracker',
					headline: 'The dates that actually matter',
					problem:
						"A friend mentioned forgetting her cosmetics expiring, and I realised I never tracked when opened milk or soy milk would go bad either, the kind of date that changes once you've opened it.",
					solution:
						"Log when something was opened and how long it keeps, so the actual expiry is calculated and visible at a glance. At minimum it made me much more conscious of how long my milk had left, even if I don't always keep to it.",
				},
				{
					src: market,
					alt: 'Cubby market prices',
					headline: 'Which price is actually worth it',
					problem:
						'I could hold a rough sense of what things cost but never the details, and for wines especially there were enough promotions and my Just Wine Club subscription that I needed an actual record to know when something was really worth buying.',
					solution:
						'Log prices per item so I can compare across shops and promotions, and actually know a good deal when I see one. Supermarkets here rarely show price per gram or unit, so this fills that gap too.',
				},
			],
		},
		{
			label: 'Finance',
			note: 'the dates that cost money',
			items: [
				{
					src: finance,
					alt: 'Cubby finance',
					headline: "The fee we couldn't waive",
					problem:
						"I've missed credit card bills before, luckily waived both times, but my wife's annual fee wasn't, and it was expensive. With many cards each on their own fee schedule, plus bills and subscriptions on top, it's genuinely too much to keep in your head.",
					solution:
						'All the card fees, bills, and subscriptions in one place with dates, so nothing sneaks up and we catch the waivable ones in time.',
				},
			],
		},
		{
			label: 'Life',
			note: 'the things worth keeping',
			items: [
				{
					src: travel,
					alt: 'Cubby travel planner',
					headline: 'Every trip, scattered everywhere',
					problem:
						'Trip details were scattered across emails, Telegram chats, browser tabs, and PDFs, sometimes password protected like insurance documents, and every trip meant hunting through all of it again.',
					solution:
						"I'd already built Roamichi as a standalone travel planner, so I folded it in whole, all of it in one place now. It still can't pull from emails automatically and isn't a full itinerary planner, but a step at a time.",
				},
				{
					src: growingUp,
					alt: 'Cubby growing up',
					headline: 'The moments worth keeping',
					problem:
						"I wanted to log the things my wife did that I loved but never said, and the things that frustrated me too, but a complaint ledger about your spouse is just toxic, and I'd built something similar on The Standup Podcast and landed in the same place.",
					solution:
						"Reframed it as a record for our kid instead, PTCs, teacher feedback, naughty moments, and the sweet ones, the kind of stuff that's worth keeping but slips out of memory fast.",
				},
			],
		},
	];

	const contents = [
		...groups.map((g) => ({ id: g.label.toLowerCase(), label: g.label, note: g.note })),
		{ id: 'notes', label: 'Design notes', note: 'how it stays one app' },
		{ id: 'recap', label: 'Recap', note: 'everything rolled up' },
	];

	const decisions = [
		{
			kicker: 'Prioritization',
			title: 'What I pin, and what surfaces when it needs me',
			points: [
				"Pinned daily: tasks, limits, the kid's schedule, always shown",
				"Surfaced on attention: bills due, who's in care, things running out",
				'Everything else stays one tap away',
			],
		},
		{
			kicker: 'Data model',
			title: 'I logged the judgment, not the data',
			points: [
				'A market entry is "a good price to buy at", not a price',
				'A limit is "am I on pace", not a raw count',
				'A coffee is "which one tasted better", not a log',
			],
		},
		{
			kicker: 'Consolidation',
			title: 'Folded together, then wired to each other',
			points: [
				'Each tracker began as its own small POC, then moved into one app once it proved out',
				'Now they feed each other, a finished screen-timer logs to its limit, a new gym PR posts to the journal',
				'The whole lot rolls up into one dashboard and recap',
			],
		},
	];

	const stack = [
		{ role: 'Runtime', tools: 'Go' },
		{ role: 'Frontend', tools: 'SvelteKit, Tailwind' },
		{ role: 'Distribution', tools: 'Progressive Web App' },
		{ role: 'Data', tools: 'PostgreSQL' },
		{ role: 'Auth', tools: 'Stytch' },
		{ role: 'Observability', tools: 'Grafana Cloud, Umami, Uptime Kuma' },
	];
</script>

<Seo
	title="Cubby — Project Case Study | Zixian Chen"
	description="A personal ERP that turns dozens of small household frictions into one app for routines, health, money, travel, and family life."
	pathname="/projects/cubby" />

{#snippet specimen(src, alt, max)}
	<figure class="mx-auto w-full {max}">
		<img {src} {alt} loading="lazy" decoding="async" class="border-neutral/20 block w-full border-2 shadow-sm" />
	</figure>
{/snippet}

<div class="text-base-content bg-base-200">
	<!-- top bar -->
	<div class="border-neutral/15 bg-base-100 sticky top-0 z-10 border-b">
		<div class="text-base-content/50 mx-auto flex max-w-5xl items-center justify-between px-5 py-2.5 text-xs">
			<a href="/#projects" class="hover:text-base-content flex items-center gap-1.5">
				<BackIcon class="size-[1.2em]" aria-hidden="true" /> Projects
			</a>
			<span>Cubby</span>
		</div>
	</div>

	<!-- hero -->
	<header class="mx-auto max-w-5xl px-5 pt-16 pb-12 lg:pt-24 lg:pb-14">
		<img src={CubbyLogo} alt="Cubby" class="h-12" />
		<p class="mt-8 text-xs tracking-wide text-[#C42A1C]">A personal ERP for the household</p>
		<h1 class="mt-4 max-w-4xl text-4xl leading-[1.05] font-black tracking-tight text-balance sm:text-6xl lg:text-7xl">
			It started with my towels and ended up managing our home.
		</h1>
		<p class="text-base-content/80 mt-6 max-w-2xl text-lg leading-relaxed">
			Dozens of small daily frictions, each turned into its own tracker, then folded into one app that a household of
			four and a dog now runs on.
		</p>
		<a
			href="https://cubby.dev"
			target="_blank"
			rel="noopener"
			class="hover:bg-base-100 mt-7 inline-flex items-center gap-2 border border-[#C42A1C]/45 px-4 py-2 text-sm font-semibold text-[#C42A1C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C42A1C]">
			Visit site <ExternalLinkIcon class="size-[1.1em]" aria-hidden="true" />
		</a>
	</header>

	<!-- home screen overview -->
	<div class="mx-auto max-w-5xl px-5 pb-10">
		<div class="mx-auto flex max-w-2xl flex-col items-start justify-center gap-10 sm:flex-row">
			<figure class="mx-auto w-full max-w-[300px]">
				<img
					src={dashboard}
					alt="Cubby home screen"
					loading="lazy"
					decoding="async"
					class="border-neutral/20 block w-full border-2 shadow-sm" />
				<figcaption class="text-base-content/55 mt-3 text-center text-sm leading-relaxed">
					The home screen up top: a pinned daily set, plus whatever needs attention now.
				</figcaption>
			</figure>
			<figure class="mx-auto w-full max-w-[300px]">
				<img
					src={shelf}
					alt="Cubby home screen scrolled down"
					loading="lazy"
					decoding="async"
					class="border-neutral/20 block w-full border-2 shadow-sm" />
				<figcaption class="text-base-content/55 mt-3 text-center text-sm leading-relaxed">
					One scroll down, the rest of the house, every tracker as a tile.
				</figcaption>
			</figure>
		</div>
	</div>

	<!-- contents -->
	<details class="case-study-contents mx-auto max-w-5xl px-5 pb-14 sm:hidden">
		<summary
			class="focus-visible:outline-accent text-base-content/80 flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 border-y border-[#C42A1C]/25 py-3 text-xs font-semibold tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2">
			<span>Explore {contents.length} sections</span>
			<ChevronRightIcon aria-hidden="true" class="contents-chevron size-4 shrink-0 transition-transform" />
		</summary>
		<nav aria-label="Sections">
			<ul class="mt-2 grid">
				{#each contents as c (c.id)}
					<li>
						<a
							href="#{c.id}"
							class="group border-neutral/10 focus-visible:outline-accent flex min-h-11 items-center justify-between gap-4 border-b py-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
							<span class="font-semibold group-hover:text-[#C42A1C]">{c.label}</span>
							<span class="text-base-content/55 text-sm">{c.note}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</details>
	<nav class="mx-auto hidden max-w-5xl px-5 pb-14 sm:block" aria-label="Sections">
		<p class="text-xs tracking-wide text-[#C42A1C]">Contents</p>
		<ul class="mt-4 grid gap-x-10 sm:grid-cols-2">
			{#each contents as c (c.id)}
				<li>
					<a href="#{c.id}" class="group border-neutral/10 flex items-baseline justify-between gap-4 border-b py-3">
						<span class="font-semibold group-hover:text-[#C42A1C]">{c.label}</span>
						<span class="text-base-content/50 text-sm">{c.note}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- feature groups -->
	<main class="mx-auto max-w-5xl px-5">
		{#each groups as group (group.label)}
			<section id={group.label.toLowerCase()} class="scroll-mt-20 pt-14">
				<div class="border-neutral/20 flex items-baseline gap-3 border-b pb-3">
					<h2 class="text-base-content/85 text-sm font-semibold tracking-[0.18em] uppercase">
						{group.label}
					</h2>
					<span class="text-base-content/50 text-xs">{group.note}</span>
				</div>

				<div>
					{#each group.items as item (item.headline)}
						<article
							class="border-neutral/10 grid gap-8 border-b py-10 last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-12">
							<div>
								<h3 class="text-2xl leading-snug font-bold lg:text-3xl">{item.headline}</h3>
								<div class="mt-5 grid gap-6">
									<div>
										<p class="text-base-content/50 text-[0.65rem] font-semibold tracking-wider uppercase">Problem</p>
										<p class="text-base-content/85 mt-1.5 leading-relaxed">{item.problem}</p>
									</div>
									<div>
										<p class="text-base-content/50 text-[0.65rem] font-semibold tracking-wider uppercase">Solution</p>
										<p class="text-base-content/85 mt-1.5 leading-relaxed">{item.solution}</p>
									</div>
								</div>
							</div>
							<div class="sm:w-[230px]">
								{@render specimen(item.src, item.alt, 'max-w-[230px]')}
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/each}
	</main>

	<!-- design notes -->
	<section id="notes" class="border-neutral/15 bg-base-100 mt-20 scroll-mt-20 border-t">
		<div class="mx-auto max-w-5xl px-5 py-16">
			<p class="text-base-content/55 text-xs tracking-wide">Design notes</p>
			<p class="border-primary/50 text-base-content/85 mt-5 max-w-3xl border-l-4 pl-5 text-xl leading-relaxed italic">
				I built everything I wanted, and I never once worried about whether it was needed, because every piece started
				from something already going wrong in my own life, so I was always the person it was for.
			</p>
			<p class="text-base-content/85 mt-8 max-w-3xl leading-relaxed">
				Each piece started as its own small annoyance, and a pile of single-purpose trackers turns into a junk drawer
				fast. A few decisions kept it one coherent app instead.
			</p>

			<div class="mt-8 grid gap-4 md:grid-cols-3">
				{#each decisions as d (d.title)}
					<div class="border-neutral/20 border p-5">
						<div class="text-[0.7rem] font-semibold tracking-wider text-[#C42A1C] uppercase">{d.kicker}</div>
						<p class="mt-2 font-semibold">{d.title}</p>
						<ul class="mt-3 grid gap-1.5">
							{#each d.points as point (point)}
								<li class="text-base-content/70 grid grid-cols-[1ch_1fr] gap-2 text-sm leading-relaxed">
									<span class="bg-primary/70 mt-2 size-1.5 rounded-full" aria-hidden="true"></span>
									<span>{point}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- recap -->
	<section id="recap" class="mx-auto max-w-5xl scroll-mt-20 px-5 py-16">
		<div class="grid items-start gap-10 sm:grid-cols-[auto_1fr] sm:gap-12">
			{@render specimen(journalRecap, 'Cubby journal recap', 'max-w-[230px]')}
			<div class="sm:pt-2">
				<h2 class="text-2xl font-bold lg:text-3xl">Everything tracked, rolled up</h2>
				<p class="text-base-content/85 mt-4 max-w-md leading-relaxed">
					A weekly and monthly recap that pulls from everything tracked, so the whole house has one place to look back
					on.
				</p>
			</div>
		</div>
	</section>

	<!-- closing + colophon -->
	<section class="border-neutral/15 bg-base-100 border-t">
		<div class="mx-auto max-w-5xl px-5 py-12">
			<p class="text-base-content/85 max-w-2xl text-lg leading-relaxed italic">
				None of it was planned as a product, it just kept answering the next real problem, and the family ended up
				living in it too.
			</p>
			<div class="mt-10">
				<p class="text-base-content/55 text-xs tracking-wide">Built with</p>
				<dl class="mt-4 max-w-md">
					{#each stack as row (row.role)}
						<div class="border-neutral/10 grid grid-cols-[8rem_1fr] gap-4 border-b py-2 last:border-b-0">
							<dt class="text-base-content/55 text-[0.7rem] font-semibold tracking-wider uppercase">
								{row.role}
							</dt>
							<dd class="text-base-content/85 text-sm">{row.tools}</dd>
						</div>
					{/each}
				</dl>
				<p class="text-base-content/55 mt-4 max-w-md text-sm leading-relaxed">
					Sentry used to be in here too, but it slowed builds more than it was worth, so it came out. A self-hosted
					GitHub Actions runner checks the web app, main API and retained Roamichi service before changes ship.
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.case-study-contents summary::-webkit-details-marker {
		display: none;
	}

	.case-study-contents[open] :global(.contents-chevron) {
		transform: rotate(90deg);
	}
</style>
