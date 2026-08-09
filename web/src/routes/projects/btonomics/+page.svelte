<script>
	import ProjectShell from '$lib/ProjectShell.svelte';
	import btonomicsMain from '$lib/screenshots/btonomics/main.webp?enhanced&w=1100&quality=90';
	import btonomicsTopics from '$lib/screenshots/btonomics/topics.webp?enhanced&w=1000&quality=90';

	const stack = [
		{ role: 'Frontend', tools: 'Astro' },
		{ role: 'Search', tools: 'Pagefind' },
	];
</script>

<ProjectShell
	name="BTOnomics"
	slug="btonomics"
	accent="#6b7e56"
	accentInk="#15803D"
	eyebrow="Honest lessons from an HDB renovation"
	headline="Six months, forty-seven arguments, one home."
	sub="A renovation blog about doing up an HDB flat on a budget, the vision against the reality, the defect counts, and the lessons nobody warns you about. Rebuilt from WordPress into a fast static site."
	url="https://btonomics.com"
	{stack}>
	{#snippet wordmark()}
		<h2 class="text-4xl font-bold text-[#6b7e56] lg:text-5xl">BTOnomics</h2>
	{/snippet}

	{#snippet hero()}
		<enhanced:img
			src={btonomicsMain}
			alt="BTOnomics landing, the vision against the reality of an HDB renovation"
			class="border-neutral/20 block w-full border-2 shadow-sm" />
	{/snippet}

	<section class="border-neutral/10 border-t py-12">
		<p class="text-xs tracking-wide" style="color: var(--accent-ink)">Problem</p>
		<p class="mt-3 max-w-3xl text-2xl leading-snug font-bold">
			WordPress felt bloated for what is really a blog, it outgrew shared hosting, and the PHP, MySQL, and plugin stack
			was more overhead than the writing needed.
		</p>
	</section>

	<section class="border-neutral/10 border-t py-12">
		<p class="text-xs tracking-wide" style="color: var(--accent-ink)">How it works</p>
		<div class="text-base-content/85 mt-4 grid max-w-2xl gap-4 leading-relaxed">
			<p>
				I rebuilt it as a static AstroJS site for speed, with full-text search and tag filtering, and recently moved it
				to Astro 5's Content Layer API. ChatGPT helped convert the old WordPress shortcodes to Markdown.
			</p>
			<p>
				I skipped comments and user accounts on purpose. The blog is for people who want the content, not an engagement
				platform.
			</p>
		</div>
	</section>

	<section class="border-neutral/10 border-t py-12">
		<p class="text-xs tracking-wide" style="color: var(--accent-ink)">A look inside</p>
		<enhanced:img
			src={btonomicsTopics}
			alt="BTOnomics topics, browse by category"
			class="border-neutral/20 mt-5 block w-full border-2 shadow-sm" />
	</section>
</ProjectShell>
