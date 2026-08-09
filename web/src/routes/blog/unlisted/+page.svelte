<script lang="ts">
	import dayjs from 'dayjs';
	import ArrowLeftIcon from '~icons/lucide/arrow-left';
	import Seo from '$lib/Seo.svelte';

	let { data } = $props();
</script>

<Seo
	title="Unlisted Posts — Zixian's Blog"
	description="Published posts kept outside the main blog index."
	pathname="/blog/unlisted"
	noindex />

<header class="border-base-content/10 border-b px-4 pt-2 pb-8 lg:px-6">
	<a
		href="/blog"
		class="text-base-content/50 hover:text-base-content mb-5 inline-flex items-center gap-1.5 font-mono text-sm transition-colors">
		<ArrowLeftIcon aria-hidden="true" class="size-3.5" />
		All listed posts
	</a>
	<div class="text-base-content/45 font-mono text-sm">{data.posts.length} unlisted posts</div>
	<h1 class="text-base-content mt-3 text-3xl font-black sm:text-4xl">Unlisted writing</h1>
	<p class="text-base-content/65 mt-3 max-w-2xl text-base leading-relaxed">
		Published pieces kept outside the main blog index.
	</p>
</header>

<main class="grid">
	{#each data.posts as post, i}
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
</main>

<div class="text-base-content/30 mt-10 px-3 text-center font-mono text-xs tracking-widest sm:px-6 xl:px-14">
	— END OF LIST —
</div>
