<script lang="ts">
	import TagIcon from '~icons/lucide/tag';
	import ChevronRightIcon from '~icons/lucide/chevron-right';
	import ArrowLeftIcon from '~icons/lucide/arrow-left';
	import ArrowRightIcon from '~icons/lucide/arrow-right';
	import dayjs from 'dayjs';
	import Seo from '$lib/Seo.svelte';

	let { data } = $props();
	let content = $derived(data.content);
	let canonicalUrl = $derived(`https://zixianchen.com/blog/${data.metadata.slug}`);
</script>

<Seo
	title="{data.metadata.title} | Zixian Chen"
	description={data.metadata.description}
	pathname="/blog/{data.metadata.slug}"
	type="article"
	noindex={data.metadata.listed === false}
	publishedTime={data.metadata.date}
	modifiedTime={data.metadata.date_updated || data.metadata.date}
	structuredData={[
		{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: data.metadata.title,
			description: data.metadata.description,
			datePublished: data.metadata.date,
			dateModified: data.metadata.date_updated || data.metadata.date,
			articleSection: data.metadata.category,
			keywords: data.metadata.tags,
			mainEntityOfPage: canonicalUrl,
			author: {
				'@type': 'Person',
				name: 'Zixian Chen',
				url: 'https://zixianchen.com/',
			},
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zixianchen.com/' },
				{ '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://zixianchen.com/blog' },
				{ '@type': 'ListItem', position: 3, name: data.metadata.title, item: canonicalUrl },
			],
		},
	]} />
<svelte:head>
	<meta data-pagefind-meta="description[content]" content={data.metadata.description} />
	<meta data-pagefind-meta="date[content]" content={data.metadata.date} />
	<meta data-pagefind-meta="category[content]" content={data.metadata.category ?? ''} />
	<meta data-pagefind-meta="tags[content]" content={data.metadata.tags.join(' / ')} />
	<meta data-pagefind-filter="category[content]" content={data.metadata.category ?? ''} />
</svelte:head>
<div class="px-3 pb-3 sm:px-6 xl:px-14">
	<a
		href="/blog"
		class="text-base-content/50 hover:text-base-content font-mono text-sm tracking-tight transition-colors"
		>[back to main]</a>
</div>
<h1 class="px-3 py-1 text-2xl font-extrabold sm:px-6 sm:text-3xl lg:text-4xl xl:px-14 xl:text-5xl xl:font-black">
	{data.metadata.title}
</h1>
<div class="text-base-content/50 px-3 font-mono text-sm tracking-tight sm:px-6 xl:px-14">
	<div class="flex flex-wrap items-baseline gap-x-1.5">
		<span class="uppercase">{dayjs(data.metadata.date).format('D MMM YYYY')}</span>
		{#if data.metadata.date_updated}
			<span class="uppercase">[++ {dayjs(data.metadata.date_updated).format('D MMM YYYY')}]</span>
		{/if}
		<span class="text-base-content/30">/</span>
		<span>{data.readingTime} min read</span>
	</div>
	<div class="mt-1 flex flex-wrap items-center gap-x-1.5">
		<TagIcon class="size-[1em]" />
		{#each data.metadata.tags as tag, i}
			{#if i > 0}<span class="text-base-content/30">/</span>{/if}
			<span>{tag}</span>
		{/each}
	</div>
	{#if data.series}
		<div class="mt-2 flex flex-wrap items-baseline gap-x-1.5">
			<span>Series:</span>
			<a
				href="#series-navigation"
				class="text-base-content/80 decoration-accent hover:text-base-content font-semibold underline decoration-2 underline-offset-3 transition-colors">
				{data.series.title}
			</a>
			<span class="text-base-content/30">/</span>
			<span>Part {data.series.position} of {data.series.total}</span>
		</div>
	{/if}
</div>
{#if data.headings.length > 0}
	<details
		open={data.headings.length <= 8}
		class="article-contents text-base-content/55 border-base-content/10 mt-6 border-y px-3 font-mono text-sm tracking-tight sm:px-6 xl:px-14">
		<summary
			class="focus-visible:outline-accent text-base-content/80 flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-xs font-bold tracking-widest uppercase focus-visible:outline-2 focus-visible:outline-offset-2">
			<span>Contents · {data.headings.length} {data.headings.length === 1 ? 'section' : 'sections'}</span>
			<ChevronRightIcon aria-hidden="true" class="contents-chevron size-4 shrink-0 transition-transform" />
		</summary>
		<nav aria-label="Article contents" class="border-base-content/10 border-t py-2">
			<ol>
				{#each data.headings as heading}
					<li class={heading.level === 3 ? 'ml-6' : ''}>
						<a
							href="#{heading.slug}"
							class="group hover:text-base-content focus-visible:outline-accent flex min-h-11 items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
							<ChevronRightIcon
								aria-hidden="true"
								class="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
							<span>{heading.text}</span>
						</a>
					</li>
				{/each}
			</ol>
		</nav>
	</details>
{/if}
<article
	data-pagefind-body={data.metadata.listed === false ? undefined : ''}
	class="blog-prose prose prose-a:font-semibold prose-a:decoration-1 prose-a:underline-offset-3 prose-a:hover:text-accent prose-blockquote:my-8 prose-blockquote:ms-8 prose-h2:text-2xl prose-h2:font-bold prose-p:leading-relaxed prose-li:leading-relaxed prose-p:my-6 prose-code:font-mono prose-pre:px-0 prose-pre:py-3 mt-6 w-full max-w-none px-3 sm:px-6 lg:mt-10 xl:px-14"
	class:numbered-paras={data.metadata.category === 'Work'}>
	{#if content}
		{@const Component = content}
		<Component />
	{/if}
</article>
<div class="text-base-content/30 mt-10 px-3 text-center font-mono text-xs tracking-widest sm:px-6 xl:px-14">
	— END OF POST —
</div>
{#if data.series}
	<nav
		id="series-navigation"
		aria-label="{data.series.title} series"
		class="border-base-content/10 mt-8 border-y px-3 py-6 sm:px-6 xl:px-14">
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
			<h2 class="text-xl font-bold">{data.series.title}</h2>
			<span class="text-base-content/50 font-mono text-sm">
				Part {data.series.position} of {data.series.total}
			</span>
		</div>
		<ol class="mt-4 grid gap-2">
			{#each data.series.posts as seriesPost}
				<li class="grid grid-cols-[2rem_1fr] items-baseline gap-2">
					<span class="text-base-content/40 text-right font-mono text-sm">{seriesPost.position}.</span>
					{#if seriesPost.current}
						<span class="font-semibold" aria-current="page">
							{data.metadata.title}
							<span class="text-base-content/45 ml-1 font-mono text-xs font-normal">You are here</span>
						</span>
					{:else if seriesPost.published}
						<a
							href="/blog/{seriesPost.slug}"
							class="decoration-accent hover:text-accent font-semibold underline decoration-1 underline-offset-3 transition-colors">
							{seriesPost.title}
						</a>
					{:else}
						<span class="text-base-content/45 font-mono text-sm">Coming soon</span>
					{/if}
				</li>
			{/each}
		</ol>
		{#if data.series.previous || data.series.next}
			<div
				class="border-base-content/10 mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 font-mono text-sm">
				{#if data.series.previous}
					<a
						href="/blog/{data.series.previous.slug}"
						class="hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
						<ArrowLeftIcon class="size-[1.1em]" aria-hidden="true" />
						Part {data.series.previous.position}
					</a>
				{:else}
					<span></span>
				{/if}
				{#if data.series.next}
					<a
						href="/blog/{data.series.next.slug}"
						class="hover:text-accent focus-visible:outline-accent inline-flex items-center gap-1.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
						Continue to Part {data.series.next.position}
						<ArrowRightIcon class="size-[1.1em]" aria-hidden="true" />
					</a>
				{/if}
			</div>
		{/if}
	</nav>
{/if}
{#if data.relatedPosts.length > 0}
	<nav aria-label="Related posts" class="border-base-content/10 mt-8 border-y px-3 py-6 sm:px-6 xl:px-14">
		<h2 class="text-xl font-bold">Related notes</h2>
		<ul class="divide-base-content/10 mt-3 divide-y">
			{#each data.relatedPosts as relatedPost}
				<li class="py-3 first:pt-0 last:pb-0">
					<a
						href="/blog/{relatedPost.slug}"
						class="decoration-accent hover:text-accent focus-visible:outline-accent font-semibold underline decoration-1 underline-offset-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
						{relatedPost.title}
					</a>
					<p class="text-base-content/60 mt-1 text-sm leading-relaxed">{relatedPost.description}</p>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.article-contents summary::-webkit-details-marker {
		display: none;
	}

	.article-contents[open] :global(.contents-chevron) {
		transform: rotate(90deg);
	}

	article.numbered-paras {
		counter-reset: para;
	}

	article.numbered-paras > :global(p) {
		counter-increment: para;
	}

	article.numbered-paras > :global(p)::before {
		content: counter(para) '.';
		margin-inline-end: 0.5em;
		font-family: var(--font-mono);
		font-size: 0.85em;
		opacity: 0.75;
	}

	article :global(ul),
	article :global(ol) {
		padding-left: 3em;
	}

	article :global(li)::marker {
		font-family: var(--font-mono);
		font-size: 0.85em;
		opacity: 0.75;
	}
</style>
