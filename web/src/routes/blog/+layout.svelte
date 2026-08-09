<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import Nav from '$lib/Nav.svelte';
	import CodeCanvas from '$lib/CodeCanvas.svelte';
	import DarkModeIcon from '~icons/lucide/moon';
	import LightModeIcon from '~icons/lucide/sun';

	let { children }: { children: Snippet } = $props();
	let theme: 'light' | 'dark' = $state('dark');

	onMount(() => {
		const savedTheme = localStorage.getItem('blog-theme');
		if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('blog-theme', theme);
	}
</script>

<div
	data-theme={theme}
	class="blog-shell bg-base-200 text-base-content relative flex w-full flex-col items-center justify-center overflow-hidden transition-colors">
	<div id="container" class="z-10 grid min-h-dvh w-full max-w-3xl grid-cols-[minmax(0,1fr)] py-6">
		<div class="w-full min-w-0">
			<button
				type="button"
				class="border-base-content/20 bg-base-100/80 text-base-content hover:bg-base-300 focus-visible:outline-accent absolute top-4 right-4 z-20 grid size-10 cursor-pointer place-items-center rounded-full border backdrop-blur transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-6 sm:right-6"
				onclick={toggleTheme}
				aria-label={theme === 'dark' ? 'Switch blog to light mode' : 'Switch blog to dark mode'}
				title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
				{#if theme === 'dark'}
					<LightModeIcon class="size-5" aria-hidden="true" />
				{:else}
					<DarkModeIcon class="size-5" aria-hidden="true" />
				{/if}
			</button>
			<a
				href="/"
				class="flex justify-center pt-8 pb-12 transition-opacity hover:opacity-80"
				aria-label="Zixian Chen — Home">
				<div
					class="code-z size-16 overflow-hidden bg-slate-900 lg:size-20"
					style="view-transition-name: logo"
					aria-hidden="true">
					<CodeCanvas animated={false} />
				</div>
			</a>
			<main>{@render children()}</main>
		</div>
		<div class="mt-auto pt-10 pb-20 text-center text-xs md:text-sm xl:pb-28">© Zixian Chen</div>
	</div>
</div>

<!-- Playful pole: the colorful magnifying dock, floating over the quiet page on wide screens. -->
<Nav navCurrent="" />

<style>
	.code-z {
		clip-path: polygon(0% 0%, 100% 0%, 100% 20%, 25% 80%, 100% 80%, 100% 100%, 0% 100%, 0% 80%, 75% 20%, 0% 20%);
	}

	.blog-shell :global(.blog-prose) {
		--tw-prose-body: var(--color-base-content);
		--tw-prose-headings: var(--color-base-content);
		--tw-prose-lead: color-mix(in oklab, var(--color-base-content) 80%, transparent);
		--tw-prose-links: var(--color-base-content);
		--tw-prose-bold: var(--color-base-content);
		--tw-prose-counters: color-mix(in oklab, var(--color-base-content) 60%, transparent);
		--tw-prose-bullets: color-mix(in oklab, var(--color-base-content) 50%, transparent);
		--tw-prose-hr: color-mix(in oklab, var(--color-base-content) 20%, transparent);
		--tw-prose-quotes: color-mix(in oklab, var(--color-base-content) 80%, transparent);
		--tw-prose-quote-borders: color-mix(in oklab, var(--color-base-content) 30%, transparent);
		--tw-prose-captions: color-mix(in oklab, var(--color-base-content) 60%, transparent);
		--tw-prose-code: var(--color-base-content);
	}
</style>
