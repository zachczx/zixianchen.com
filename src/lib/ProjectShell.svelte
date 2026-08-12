<script lang="ts">
	import type { Snippet } from 'svelte';
	import Seo from '$lib/Seo.svelte';
	import BackIcon from '~icons/lucide/arrow-left';
	import ExternalLinkIcon from '~icons/lucide/external-link';

	interface StackRow {
		role: string;
		tools: string;
	}
	interface Props {
		name: string;
		slug: string;
		accent?: string;
		accentInk?: string;
		heroLayout?: 'stacked' | 'split';
		eyebrow?: string;
		headline: string;
		sub?: string;
		url?: string;
		stack?: StackRow[];
		removed?: string;
		wordmark?: Snippet;
		hero?: Snippet;
		outro?: Snippet;
		children: Snippet;
	}
	let {
		name,
		slug,
		accent = '#f93827',
		accentInk = accent,
		heroLayout = 'stacked',
		eyebrow = '',
		headline,
		sub = '',
		url = '',
		stack = [],
		removed = '',
		wordmark,
		hero,
		outro,
		children,
	}: Props = $props();
</script>

{#snippet intro()}
	<div class="max-w-3xl">
		{#if wordmark}{@render wordmark()}{/if}
		{#if eyebrow}
			<p class="mt-8 text-xs tracking-wide" style="color: var(--accent-ink)">{eyebrow}</p>
		{/if}
		<h1
			class="mt-4 min-w-0 text-4xl leading-[1.05] font-black tracking-tight text-balance [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
			{headline}
		</h1>
		{#if sub}
			<p class="text-base-content/80 mt-6 text-lg leading-relaxed">{sub}</p>
		{/if}
		{#if url}
			<a
				href={url}
				target="_blank"
				rel="noopener"
				class="hover:bg-base-100 mt-7 inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
				style="color: var(--accent-ink); border-color: color-mix(in srgb, var(--accent-ink) 45%, transparent); outline-color: var(--accent-ink)">
				Visit site <ExternalLinkIcon class="size-[1.1em]" aria-hidden="true" />
				<span class="sr-only">(opens in a new tab)</span>
			</a>
		{/if}
	</div>
{/snippet}

<Seo title="{name} — Project Case Study | Zixian Chen" description={sub || headline} pathname="/projects/{slug}" />

<div class="text-base-content bg-base-200" style="--accent: {accent}; --accent-ink: {accentInk}">
	<!-- top bar -->
	<div class="border-neutral/15 bg-base-100 sticky top-0 z-10 border-b">
		<div class="text-base-content/50 mx-auto flex max-w-5xl items-center justify-between px-5 py-2.5 text-xs">
			<a href="/#projects" class="hover:text-base-content flex items-center gap-1.5">
				<BackIcon class="size-[1.2em]" aria-hidden="true" /> Projects
			</a>
			<span>{name}</span>
		</div>
	</div>

	<!-- hero -->
	{#if heroLayout === 'split' && hero}
		<header
			class="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14 lg:py-20">
			{@render intro()}
			<div class="min-w-0">{@render hero()}</div>
		</header>
	{:else}
		<header class="mx-auto max-w-5xl px-5 pt-14 pb-12 lg:pt-20">
			{@render intro()}
		</header>

		{#if hero}
			<div class="mx-auto max-w-5xl px-5 pb-4">{@render hero()}</div>
		{/if}
	{/if}

	<!-- body -->
	<main class="mx-auto max-w-5xl px-5">{@render children()}</main>

	<!-- colophon -->
	<section class="border-neutral/15 bg-base-100 mt-20 border-t">
		<div class="mx-auto max-w-5xl px-5 py-12">
			{#if stack.length}
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
			{/if}
			{#if removed}
				<p class="text-base-content/55 mt-4 max-w-md text-sm leading-relaxed">{removed}</p>
			{/if}
		</div>
	</section>

	{#if outro}
		<section class="border-neutral/15 border-t">
			<div class="mx-auto max-w-5xl px-5">
				{@render outro()}
			</div>
		</section>
	{/if}
</div>
