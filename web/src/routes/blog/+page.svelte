<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import { getBlogSeriesPosition } from '$lib/blogSeries';
	import Seo from '$lib/Seo.svelte';
	import SearchIcon from '~icons/lucide/search';
	import XIcon from '~icons/lucide/x';

	type SearchState = 'idle' | 'loading' | 'ready' | 'error';

	interface PagefindResultData {
		url: string;
		excerpt: string;
		meta: Record<string, string>;
	}

	interface PagefindApi {
		init: () => Promise<void>;
		debouncedSearch: (
			query: string,
			options?: { filters?: Record<string, string> },
		) => Promise<{ results: { data: () => Promise<PagefindResultData> }[] } | null>;
	}

	let { data } = $props();

	const categories = ['Work', 'Systems', 'Dev', 'Life'] as const;
	type Category = (typeof categories)[number];

	let activeCategory = $state<Category | undefined>();
	let query = $state('');
	let searchResults = $state<PagefindResultData[]>([]);
	let searchState = $state<SearchState>('idle');
	let searchRequest = 0;
	let pagefindPromise: Promise<PagefindApi> | undefined;

	let trimmedQuery = $derived(query.trim());
	let isSearchActive = $derived(trimmedQuery.length > 0);
	let filteredPosts = $derived(
		activeCategory ? data.posts.filter((post) => post.category === activeCategory) : data.posts,
	);
	let filters = $derived([
		{ label: 'All', category: undefined, count: data.posts.length },
		...categories
			.map((category) => ({
				label: category,
				category,
				count: data.posts.filter((post) => post.category === category).length,
			}))
			.filter((filter) => filter.count > 0),
	]);

	function updateUrl() {
		const url = new URL(window.location.href);

		if (trimmedQuery) url.searchParams.set('q', trimmedQuery);
		else url.searchParams.delete('q');

		if (activeCategory) url.searchParams.set('category', activeCategory);
		else url.searchParams.delete('category');

		replaceState(url, {});
	}

	function handleSearchInput(event: Event) {
		query = (event.currentTarget as HTMLInputElement).value;
		updateUrl();
	}

	function setActiveCategory(category: Category | undefined) {
		activeCategory = category;
		updateUrl();
	}

	function clearSearch() {
		query = '';
		updateUrl();
	}

	function loadPagefind() {
		if (!pagefindPromise) {
			const pagefindPath = '/pagefind/pagefind.js';
			pagefindPromise = import(/* @vite-ignore */ pagefindPath).then(async (pagefindModule) => {
				const pagefind = pagefindModule as PagefindApi;
				await pagefind.init();
				return pagefind;
			});
		}

		return pagefindPromise;
	}

	async function searchPosts(searchQuery: string, category: Category | undefined) {
		const request = ++searchRequest;
		searchState = 'loading';
		searchResults = [];

		try {
			const pagefind = await loadPagefind();
			const response = await pagefind.debouncedSearch(searchQuery, category ? { filters: { category } } : undefined);

			if (!response || request !== searchRequest) return;

			searchResults = await Promise.all(response.results.map((result) => result.data()));
			searchState = 'ready';
		} catch (error) {
			if (request !== searchRequest) return;
			console.error('Unable to load the blog search index.', error);
			searchState = 'error';
		}
	}

	$effect(() => {
		const searchQuery = trimmedQuery;
		const category = activeCategory;

		if (!searchQuery) {
			searchRequest += 1;
			searchResults = [];
			searchState = 'idle';
			return;
		}

		void searchPosts(searchQuery, category);
	});

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		activeCategory = categories.find((category) => category === params.get('category'));
		query = params.get('q') ?? '';
	});
</script>

<Seo title="Zixian's Blog" description="Zixian's blog on web dev, javascript, or random stuff." pathname="/blog" />

<header class="border-base-content/10 border-b px-4 pt-2 pb-8 lg:px-6">
	<div class="text-base-content/60 font-mono text-sm" aria-live="polite">
		{#if isSearchActive && searchState === 'loading'}
			Searching the archive…
		{:else if isSearchActive && searchState === 'ready'}
			{searchResults.length}
			{searchResults.length === 1 ? 'match' : 'matches'}{activeCategory ? ` in ${activeCategory}` : ''}
		{:else if isSearchActive && searchState === 'error'}
			Search unavailable
		{:else if activeCategory}
			{filteredPosts.length} of {data.posts.length} listed posts
		{:else}
			{data.posts.length} listed posts
		{/if}
	</div>
	<h1 class="text-base-content mt-3 text-3xl font-black sm:text-4xl">Notes, fixes, and stray thoughts</h1>
	<p class="text-base-content/65 mt-3 max-w-2xl text-base leading-relaxed">
		Web development, infra, AI, writing, and odd problems worth writing down.
	</p>
	<div class="relative mt-6">
		<label for="blog-search" class="sr-only">Search blog posts</label>
		<SearchIcon
			class="text-base-content/45 pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
			aria-hidden="true" />
		<input
			id="blog-search"
			type="search"
			value={query}
			oninput={handleSearchInput}
			placeholder="Search every post…"
			autocomplete="off"
			aria-controls="blog-post-list"
			aria-describedby={searchState === 'error' ? 'blog-search-error' : undefined}
			class="border-base-content/15 bg-base-100/65 text-base-content placeholder:text-base-content/60 focus:border-accent focus:ring-accent/30 focus:bg-base-100 min-h-12 w-full rounded-md border py-3 pr-12 pl-11 text-base transition-[border-color,box-shadow,background-color] outline-none focus:ring-3" />
		{#if query}
			<button
				type="button"
				onclick={clearSearch}
				class="text-base-content/45 hover:bg-base-content/[0.07] hover:text-base-content focus-visible:outline-accent absolute top-1/2 right-2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2"
				aria-label="Clear blog search">
				<XIcon class="size-4" aria-hidden="true" />
			</button>
		{/if}
	</div>
	{#if searchState === 'error'}
		<p id="blog-search-error" class="text-warning mt-2 text-sm">
			Search could not load. Clear the search to browse all posts.
		</p>
	{/if}
	<nav class="mt-6 flex flex-wrap gap-1" aria-label="Filter blog posts by category">
		{#each filters as filter}
			{@const isActive = filter.category === activeCategory}
			<button
				type="button"
				onclick={() => setActiveCategory(filter.category)}
				aria-pressed={isActive}
				class="focus-visible:outline-accent inline-flex min-h-11 cursor-pointer items-center gap-2 rounded px-3 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 {isActive
					? 'bg-accent text-neutral'
					: 'text-base-content/65 hover:bg-base-content/[0.06] hover:text-base-content'}">
				<span>{filter.label}</span>
				<span
					class="min-w-5 rounded-sm px-1.5 py-0.5 text-center text-xs leading-none tabular-nums {isActive
						? 'bg-neutral/15 text-neutral/80'
						: 'bg-accent/20 text-base-content/75'}">{filter.count}</span>
			</button>
		{/each}
	</nav>
</header>

<main id="blog-post-list" class="grid" aria-busy={searchState === 'loading'}>
	{#if isSearchActive}
		{#if searchState === 'loading'}
			{#each [0, 1, 2] as i}
				<div class="border-base-content/10 px-4 py-6 lg:px-6" class:border-t={i > 0} aria-hidden="true">
					<div class="grid gap-3 motion-safe:animate-pulse">
						<div class="flex items-center gap-2">
							<div class="bg-base-content/10 h-5 w-6 shrink-0 rounded-sm"></div>
							<div class="bg-base-content/10 h-6 rounded-sm {i === 0 ? 'w-3/4' : i === 1 ? 'w-2/3' : 'w-4/5'}"></div>
						</div>
						<div class="grid max-w-2xl gap-2">
							<div class="bg-base-content/[0.07] h-4 w-full rounded-sm"></div>
							<div class="bg-base-content/[0.07] h-4 rounded-sm {i === 1 ? 'w-4/5' : 'w-3/5'}"></div>
						</div>
						<div class="flex items-center gap-2">
							<div class="bg-base-content/[0.07] h-3.5 w-14 rounded-sm"></div>
							<div class="bg-base-content/[0.07] h-3.5 w-20 rounded-sm"></div>
						</div>
					</div>
				</div>
			{/each}
		{:else if searchState === 'ready' && searchResults.length === 0}
			<div class="px-4 py-10 text-center lg:px-6">
				<p class="text-lg font-bold">Nothing matched “{trimmedQuery}”.</p>
				<p class="text-base-content/60 mt-2 text-sm">Try fewer words, another category, or browse the full list.</p>
				<button
					type="button"
					onclick={clearSearch}
					class="decoration-accent hover:text-accent focus-visible:outline-accent mt-4 cursor-pointer font-semibold underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">
					Show every post
				</button>
			</div>
		{:else if searchState === 'ready'}
			{#each searchResults as result, i}
				<a
					href={result.url}
					class="group border-base-content/10 hover:bg-base-content/[0.03] focus-visible:outline-accent block px-4 py-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] lg:px-6"
					class:border-t={i > 0}>
					<article class="grid gap-2">
						<h2 class="text-xl font-bold sm:text-2xl">
							<span class="decoration-accent decoration-2 underline-offset-4 group-hover:underline">
								<span class="text-base-content/55 font-mono text-[0.85em]">{i + 1}.</span>
								{result.meta.title}
							</span>
						</h2>
						<p class="search-excerpt text-base-content/70 max-w-2xl text-sm leading-relaxed sm:text-base">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -- Pagefind encodes excerpt content and only adds mark elements. -->
							{@html result.excerpt}
						</p>
						<div class="text-base-content/50 flex flex-wrap items-center gap-x-1.5 font-mono text-sm">
							{#if result.meta.category}
								<span>{result.meta.category}</span>
							{/if}
							{#if result.meta.category && result.meta.date}
								<span class="text-base-content/30">/</span>
							{/if}
							{#if result.meta.date}
								<span class="uppercase">{dayjs(result.meta.date).format('D MMM YYYY')}</span>
							{/if}
						</div>
						{#if result.meta.tags}
							<div class="text-base-content/50 font-mono text-sm">{result.meta.tags}</div>
						{/if}
					</article>
				</a>
			{/each}
		{/if}
	{:else}
		{#each filteredPosts as post, i}
			{@const series = getBlogSeriesPosition(post.slug)}
			<a
				href="/blog/{post.slug}"
				class="group border-base-content/10 hover:bg-base-content/[0.03] focus-visible:outline-accent block px-4 py-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] lg:px-6"
				class:border-t={i > 0}>
				<article class="grid gap-2">
					<h2 class="text-xl font-bold sm:text-2xl">
						<span class="decoration-accent decoration-2 underline-offset-4 group-hover:underline">
							<span class="text-base-content/55 font-mono text-[0.85em]">{i + 1}.</span>
							{post.title}
						</span>
					</h2>
					{#if post.description}
						<p class="text-base-content/70 max-w-2xl text-sm leading-relaxed sm:text-base">{post.description}</p>
					{/if}
					<div class="text-base-content/50 flex flex-wrap items-center gap-x-1.5 font-mono text-sm">
						{#if post.category}
							<span>{post.category}</span>
							<span class="text-base-content/30">/</span>
						{/if}
						{#if series}
							<span>{series.title} · {series.position}/{series.total}</span>
							<span class="text-base-content/30">/</span>
						{/if}
						<span class="uppercase">{dayjs(post.date).format('D MMM YYYY')}</span>
						{#if post.date_updated}
							<span class="text-base-content/30">/</span>
							<span class="uppercase">updated {dayjs(post.date_updated).format('D MMM YYYY')}</span>
						{/if}
					</div>
					<div class="text-base-content/50 flex flex-wrap gap-x-1.5 font-mono text-sm">
						{#each post.tags as tag, j}
							{#if j > 0}<span class="text-base-content/30">/</span>{/if}
							<span>{tag}</span>
						{/each}
					</div>
				</article>
			</a>
		{/each}
	{/if}
</main>
<div class="text-base-content/30 mt-10 px-3 text-center font-mono text-xs tracking-widest sm:px-6 xl:px-14">
	— END OF LIST —
</div>

<style>
	#blog-search::-webkit-search-cancel-button {
		display: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.search-excerpt :global(mark) {
		background: color-mix(in oklab, var(--color-accent) 55%, transparent);
		color: var(--color-neutral);
		font-weight: 700;
	}
</style>
