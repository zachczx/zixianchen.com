<script lang="ts">
	import { page } from '$app/state';
	import DizzyCrayonPortrait from '$lib/assets/crayon-drawing-dizzy.webp?enhanced';

	let isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{page.status} | Zixian Chen</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="bg-base-200 grid min-h-dvh place-items-center px-4 py-16">
	<div
		class="grid w-full max-w-3xl justify-items-center gap-8 text-center {isNotFound
			? 'sm:grid-cols-[13.5rem_minmax(0,1fr)] sm:items-center sm:gap-12 sm:text-left'
			: ''}">
		{#if isNotFound}
			<div class="border-base-content/15 bg-base-100 -rotate-2 border p-2 shadow-[0_14px_35px_rgba(0,0,0,0.12)]">
				<enhanced:img
					src={DizzyCrayonPortrait}
					alt="Crayon portrait of Zixian looking dizzy and saying ‘Wrong page!’"
					class="aspect-[0.89] w-44 object-cover sm:w-52" />
			</div>
		{/if}

		<div class="grid justify-items-center gap-4 {isNotFound ? 'sm:justify-items-start' : ''}">
			<h1 class="text-[clamp(6rem,18vw,10rem)] leading-none font-extrabold tracking-tight">{page.status}</h1>
			<p class="max-w-lg text-xl font-semibold text-balance sm:text-2xl">
				{isNotFound
					? 'This page isn’t here. The useful things still are.'
					: 'Something broke before this page could load.'}
			</p>
			<nav
				aria-label="Error recovery"
				class="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm {isNotFound
					? 'sm:justify-start'
					: ''}">
				<a
					href="/"
					class="decoration-accent hover:text-base-content focus-visible:outline-accent text-base-content/70 inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
					Go home
				</a>
				{#if isNotFound}
					<a
						href="/#projects"
						class="decoration-accent hover:text-base-content focus-visible:outline-accent text-base-content/70 inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
						See projects
					</a>
					<a
						href="/blog"
						class="decoration-accent hover:text-base-content focus-visible:outline-accent text-base-content/70 inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
						Read the blog
					</a>
				{/if}
			</nav>
		</div>
	</div>
</main>
