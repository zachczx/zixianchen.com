<script lang="ts">
	import { type Snippet } from 'svelte';
	import { descriptions } from './ProjectDescriptions';
	import AlignCenterText from './AlignCenterText.svelte';
	import ExternalLinkIcon from '~icons/lucide/external-link';
	interface ProjectEntryProps {
		id: string;
		title: Snippet;
		screenshots: Snippet;
		screenshotsHeading?: string;
		stack?: Snippet;
		stats?: Snippet;
		story?: Snippet;
		problem?: Snippet;
		built?: Snippet;
		architecture?: Snippet;
		more?: Snippet;
	}
	let {
		id = '',
		title,
		screenshots,
		screenshotsHeading = 'Look',
		stack,
		stats,
		story,
		problem,
		built,
		architecture,
		more,
	}: ProjectEntryProps = $props();

	let subtitle = $derived(descriptions[id]?.subtitle ?? '');
	let tldr = $derived(descriptions[id]?.tldr ?? '');
	let url = $derived(descriptions[id]?.url ?? '');
</script>

<div {id} class="project grid content-center justify-items-center px-2 pt-4 lg:min-h-[90vh] lg:px-8 lg:pt-8 lg:pb-32">
	<div class="grid content-center justify-items-center text-center">
		{@render title()}
		<p class="text-base-content/70 italic">{subtitle}</p>
		{#if url}
			<a
				href={url}
				target="_blank"
				rel="noopener"
				class="border-primary/45 text-primary mt-4 inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold">
				Visit site <ExternalLinkIcon class="size-[1.1em]" aria-hidden="true" />
			</a>
		{/if}
	</div>
	<div class="bg-base-200 grid max-w-[1000px] pt-24">
		<div class="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-x-16 lg:gap-y-24">
			{#if tldr}
				<h3 class="text-4xl font-bold">TL;DR</h3>
				<div>
					{#if tldr.length < 90}
						<AlignCenterText><p class="text-base-content/70 italic">{tldr}</p></AlignCenterText>
					{:else}
						<p class="text-base-content/70 italic">{tldr}</p>
					{/if}
				</div>
			{/if}
			{#if story}
				<div class="lg:col-span-2">{@render story()}</div>
			{/if}
			{#if stats}
				<h3 class="text-4xl font-bold">By the numbers</h3>
				<div>{@render stats()}</div>
			{/if}
			{#if problem}
				<h3 class="text-4xl font-bold">Problem</h3>
				<div>
					{@render problem()}
				</div>
			{/if}
			{#if built}
				<h3 class="text-4xl font-bold">What I built</h3>
				<div>{@render built()}</div>
			{/if}
			{#if architecture}
				<h3 class="text-4xl font-bold">Architecture</h3>
				<div>{@render architecture()}</div>
			{/if}
			{#if stack}
				<h3 class="text-4xl font-bold">Stack</h3>
				<div class="flex flex-wrap gap-4">
					{@render stack()}
				</div>
			{/if}
			{#if screenshots}
				<h3 class="text-4xl font-bold">{screenshotsHeading}</h3>
				<div>{@render screenshots()}</div>
			{/if}
			{#if more}
				<h3 class="text-4xl font-bold">See</h3>
				<div>{@render more()}</div>
			{/if}
		</div>
	</div>
</div>
