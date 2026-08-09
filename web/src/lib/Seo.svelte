<script lang="ts">
	interface Props {
		title: string;
		description: string;
		pathname: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		noindex?: boolean;
		publishedTime?: string;
		modifiedTime?: string;
		structuredData?: Record<string, unknown> | Record<string, unknown>[];
	}

	let {
		title,
		description,
		pathname,
		type = 'website',
		image = '/android-chrome-512x512.png',
		imageAlt = 'Zixian Chen',
		noindex = false,
		publishedTime,
		modifiedTime,
		structuredData,
	}: Props = $props();

	const origin = 'https://zixianchen.com';
	const canonicalUrl = $derived(`${origin}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`);
	const imageUrl = $derived(new URL(image, origin).href);
	const jsonLd = $derived(structuredData ? JSON.stringify(structuredData).replace(/</g, '\u003c') : '');
	const jsonLdTag = $derived(jsonLd ? `<script type="application/ld+json">${jsonLd}</${'script'}>` : '');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="Zixian Chen" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary" />

	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}
	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if type === 'article' && modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}
	{#if jsonLdTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdTag}
	{/if}
</svelte:head>
