<script lang="ts">
	import Nav from '$lib/Nav.svelte';
	import { onMount } from 'svelte';
	import WebsiteFooter from '$lib/WebsiteFooter.svelte';
	import CodeCanvas from '$lib/CodeCanvas.svelte';
	import Seo from '$lib/Seo.svelte';
	import Moon from '$lib/assets/luke-stackpoole-TRXSkmJb40c-unsplash.webp';
	import Computer from '$lib/assets/jl-cabrera-tcH6W-49jTU-unsplash.webp?enhanced';
	import CrayonPortrait from '$lib/assets/crayon-drawing.webp?enhanced';
	import Projects from './Projects.svelte';
	import LinkedInIcon from '~icons/lucide/linkedin';
	import GitHubIcon from '~icons/lucide/github';
	import ChevronDownIcon from '~icons/lucide/chevron-down';
	import ChevronRightIcon from '~icons/lucide/chevron-right';
	import { jobs } from './jobs';
	import dayjs from 'dayjs';

	let { data } = $props();
	let navCurrent: string = $state('header');

	onMount(() => {
		const sections = Array.from(document.querySelectorAll<HTMLElement>('.navItem'));
		let frame: number | undefined;

		const syncCurrentSection = () => {
			const viewportAnchor = window.innerHeight * 0.4;
			let current = sections.find((section) => {
				const rect = section.getBoundingClientRect();
				return rect.top <= viewportAnchor && rect.bottom > viewportAnchor;
			});

			if (!current) {
				current = sections.reduce<{ section: HTMLElement; distance: number } | undefined>((nearest, section) => {
					const rect = section.getBoundingClientRect();
					const distance = Math.min(Math.abs(rect.top - viewportAnchor), Math.abs(rect.bottom - viewportAnchor));
					return !nearest || distance < nearest.distance ? { section, distance } : nearest;
				}, undefined)?.section;
			}

			navCurrent = current?.id ?? 'header';
			frame = undefined;
		};

		const queueSync = () => {
			if (frame !== undefined) return;
			frame = window.requestAnimationFrame(syncCurrentSection);
		};

		syncCurrentSection();
		window.addEventListener('scroll', queueSync, { passive: true });
		window.addEventListener('resize', queueSync);
		window.addEventListener('hashchange', queueSync);

		return () => {
			window.removeEventListener('scroll', queueSync);
			window.removeEventListener('resize', queueSync);
			window.removeEventListener('hashchange', queueSync);
			if (frame !== undefined) window.cancelAnimationFrame(frame);
		};
	});
</script>

<Seo
	title="Zixian Chen | Public-Sector Tech by Day, Questionable Side Projects by Night"
	description="Public-sector tech by day, questionable side projects by night. Zixian Chen builds useful things, writes about what went wrong, and occasionally codes by hand."
	pathname="/" />

<Nav {navCurrent} />
<main class="bg-base-200 grid min-h-dvh justify-items-center 2xl:overflow-x-clip">
	<header id="header" class="navItem grid min-h-dvh w-full place-items-center px-4 py-12 pb-24 xl:pb-28">
		<div class="bg-base-200 grid w-full content-center justify-items-center gap-7">
			<div class="grid justify-items-center" style="view-transition-name: logo">
				<h1 class="text-[clamp(3.3rem,9vw,7.1rem)] leading-none font-black tracking-tight">
					<span class="sr-only">Zixian Chen</span>
					<span aria-hidden="true">ZIXIAN</span>
				</h1>
				<div
					class="code-z relative my-1 size-[clamp(11rem,40vw,24rem)] overflow-hidden bg-slate-900 lg:my-2"
					aria-hidden="true">
					<CodeCanvas />
				</div>
			</div>
			<div class="grid justify-items-center gap-3 text-center">
				<a
					href="#projects"
					class="group/hero-link text-base-content/65 hover:text-base-content focus-visible:outline-accent grid min-h-11 content-center justify-items-center gap-0.5 px-3 font-mono text-xs tracking-[0.08em] no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
					<span>Side projects</span>
					<ChevronDownIcon
						aria-hidden="true"
						class="size-4 transition-transform duration-200 group-hover/hero-link:translate-y-0.5 group-focus-visible/hero-link:translate-y-0.5" />
				</a>
				<div class="flex items-center justify-center gap-8 xl:hidden">
					<a
						href="https://www.linkedin.com/in/zixianchen/"
						aria-label="LinkedIn"
						class="text-base-content/55 hover:text-base-content focus-visible:outline-accent grid size-11 place-items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
						<LinkedInIcon aria-hidden="true" class="size-6" />
					</a>
					<a
						href="https://github.com/zachczx?tab=repositories"
						aria-label="GitHub"
						class="text-base-content/55 hover:text-base-content focus-visible:outline-accent grid size-11 place-items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
						<GitHubIcon aria-hidden="true" class="size-6" />
					</a>
				</div>
			</div>
		</div>
	</header>

	<section
		id="about"
		aria-labelledby="about-heading"
		class="navItem bg-base-200 grid w-full justify-items-center px-4 py-20 lg:py-32">
		<div class="border-base-content/15 bg-base-100 w-full max-w-3xl border">
			<div class="border-base-content/15 flex items-baseline justify-between border-b px-6 py-5 sm:px-8">
				<h2 id="about-heading" class="text-2xl font-bold tracking-tight lg:text-3xl">Interests</h2>
				<span class="text-base-content/40 text-[0.7rem] tracking-[0.25em] uppercase">Profile</span>
			</div>
			<div class="sm:flex">
				<div class="border-base-content/10 border-b px-4 py-4">
					<enhanced:img
						src={CrayonPortrait}
						alt="Crayon portrait of Zixian"
						class="border-base-content/15 w-32 border sm:w-96" />
				</div>
				<dl class="divide-base-content/10 divide-y px-4">
					<div class="grid gap-x-8 gap-y-1.5 py-4">
						<dt class="text-base-content/45 text-xs tracking-[0.18em] uppercase sm:pt-1">Stack</dt>
						<dd class="text-base-content/80 text-sm leading-relaxed lg:text-base">Go, TypeScript, and a bit of Zig.</dd>
					</div>
					<div class="grid gap-x-8 gap-y-1.5 py-4">
						<dt class="text-base-content/45 text-xs tracking-[0.18em] uppercase sm:pt-1">Since</dt>
						<dd class="text-base-content/80 text-sm leading-relaxed lg:text-base">
							2000 on/off. Back in the Frontpage, XHTML, PHP days.
						</dd>
					</div>
					<div class="grid gap-x-8 gap-y-1.5 py-4">
						<dt class="text-base-content/45 text-xs tracking-[0.18em] uppercase sm:pt-1">Now</dt>
						<dd class="text-base-content/80 text-sm leading-relaxed lg:text-base">
							Building a home admin app. Trying to write organic, free-range code by hand. It's tempting to let Claude
							Code and OpenCode do it automatically but it doesn't feel the same.
						</dd>
					</div>
					<div class="grid gap-x-8 gap-y-1.5 py-4">
						<dt class="text-base-content/45 text-xs tracking-[0.18em] uppercase sm:pt-1">Offline</dt>
						<dd class="text-base-content/80 text-sm leading-relaxed lg:text-base">
							Building PCs (love bargains, hate cable management). Learning about product design, business, and
							entrepreneurship.
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</section>

	<div class="bg-base-200 grid min-h-dvh w-full justify-items-center lg:grid-cols-5">
		<div id="com" class="hidden h-full w-full overflow-hidden pe-12 lg:col-span-2 lg:grid">
			<enhanced:img
				src={Computer}
				alt=""
				loading="lazy"
				class="h-full w-full max-w-175 object-contain object-bottom-left" />
		</div>
		<section
			class="bg-base-200 grid w-full max-w-250 grid-rows-[auto_1fr_auto] content-start gap-y-8 lg:col-span-3 lg:gap-y-24">
			<div class="justify-self-start px-4 lg:pt-28">
				<p class="text-base-content/45 font-mono text-xs tracking-[0.2em] uppercase">Work history</p>
				<h2 id="jobs" class="text-5xl font-extrabold sm:text-6xl lg:text-9xl">Day</h2>
				<p class="text-base-content/65 mt-3 max-w-xl text-sm leading-relaxed lg:text-base">
					Public sector tech, policy, comms, and service delivery roles.
				</p>
			</div>
			<div class="grid content-start gap-y-10 px-4 lg:gap-y-16">
				{#each jobs as job}
					<div class="job-row grid gap-y-1 lg:grid-cols-[auto_1fr]">
						<div class="text-base-content/70 items-baseline text-sm lg:pe-12 lg:pt-1.5 lg:text-base">
							{job.year}
						</div>
						<div>
							<h3 class="job-title relative w-fit text-lg font-bold lg:text-2xl">
								<ChevronRightIcon
									aria-hidden="true"
									class="job-arrow absolute top-1/2 -left-5 size-[0.7em] -translate-y-1/2 opacity-0" />
								{job.title}
							</h3>
							<p
								class="job-desc text-base-content/70 text-sm leading-relaxed transition-colors duration-200 lg:text-base">
								{job.desc}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>

	<div class="text-neutral-content grid w-full content-start justify-items-center bg-[#0E0E0E] lg:grid-cols-5">
		<div class="grid w-full justify-items-center pt-8 lg:col-span-3 lg:pt-28">
			<section
				id="projects"
				aria-labelledby="projects-heading"
				class="navItem grid w-full max-w-250 justify-items-start px-4 pb-8 lg:grid-cols-3 lg:justify-self-end lg:pb-28">
				<div class="justify-self-start pb-8 lg:col-span-3 lg:pb-24">
					<p class="text-neutral-content/45 font-mono text-xs tracking-[0.2em] uppercase">Side projects</p>
					<h2 id="projects-heading" class="text-5xl font-extrabold sm:text-6xl lg:text-9xl">Night</h2>
					<p class="text-neutral-content/65 mt-3 max-w-xl text-sm leading-relaxed lg:text-base">
						Personal tools, experiments, and small products built outside the day job.
					</p>
				</div>

				<div
					class="grid w-full content-start justify-items-center gap-y-8 text-center lg:col-span-3 lg:grid-cols-1 lg:justify-items-start lg:text-start">
					<Projects />
				</div>
			</section>
		</div>
		<div
			id="moon"
			class="hidden h-full w-full overflow-hidden bg-black lg:col-span-2 lg:grid"
			style="background-image:url({Moon}); background-size: cover; background-position: center;">
		</div>
		<section
			id="musings"
			aria-labelledby="musings-heading"
			class="navItem grid w-full justify-items-center px-4 py-20 lg:col-span-5 lg:py-32">
			<div class="w-full max-w-3xl border border-white/15 bg-white/5">
				<div class="border-b border-white/15 px-6 py-5 sm:px-8">
					<h2 id="musings-heading" class="text-2xl font-bold tracking-tight lg:text-3xl">Musings</h2>
					<p class="text-neutral-content/55 mt-2 text-sm leading-relaxed lg:text-base">Recent writing from the blog.</p>
				</div>
				<div class="divide-y divide-white/10 px-6 sm:px-8">
					{#each data.posts as post}
						<a href="/blog/{post.slug}" class="group grid gap-x-8 gap-y-1.5 py-5 sm:grid-cols-[7rem_1fr]">
							<span class="text-neutral-content/45 font-mono text-xs tracking-[0.18em] uppercase sm:pt-1.5">
								{dayjs(post.date).format('D MMM YYYY')}
							</span>
							<span class="block">
								<span
									class="decoration-accent block leading-snug font-bold decoration-2 underline-offset-4 transition-colors group-hover:underline lg:text-lg">
									{post.title}
								</span>
								<span class="text-neutral-content/45 mt-1.5 flex flex-wrap gap-x-1.5 font-mono text-xs tracking-tight">
									{#each post.tags as tag, j}
										{#if j > 0}<span class="text-neutral-content/25">/</span>{/if}
										<span>{tag}</span>
									{/each}
								</span>
							</span>
						</a>
					{/each}
					<a
						href="/blog"
						class="text-neutral-content/60 hover:text-neutral-content flex items-center justify-end gap-1 py-5 font-mono text-sm tracking-tight transition-colors">
						All musings
						<ChevronRightIcon aria-hidden="true" class="size-3.5" />
					</a>
				</div>
			</div>
		</section>
		<div class="lg:col-span-5">
			<WebsiteFooter />
		</div>
	</div>
</main>

<style>
	.code-z {
		clip-path: polygon(0% 0%, 100% 0%, 100% 20%, 25% 80%, 100% 80%, 100% 100%, 0% 100%, 0% 80%, 75% 20%, 0% 20%);
	}

	.job-row:hover :global(.job-arrow) {
		opacity: 1;
	}

	.job-row:hover .job-desc {
		color: var(--color-base-content);
	}

	.job-row:hover .job-title {
		background-size: 100% 100%;
	}

	:global(.job-arrow) {
		transition: opacity 0.2s ease;
	}

	.job-title {
		background-image: linear-gradient(var(--color-accent), var(--color-accent));
		background-size: 0% 100%;
		background-repeat: no-repeat;
		background-position: left;
		transition: background-size 0.25s ease;
	}
</style>
