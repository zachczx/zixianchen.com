<script>
	import ProjectShell from '$lib/ProjectShell.svelte';
	import ScreenshotGallery from '$lib/ScreenshotGallery.svelte';
	import LingoHome from '$lib/screenshots/lingo/home.png?enhanced&w=1600';
	import LingoTermsDirectoryFull from '$lib/screenshots/lingo/terms-directory.png?enhanced&w=2400';
	import LingoTermsSearch from '$lib/screenshots/lingo/terms-search-dc.png?enhanced&w=1600';
	import LingoExploreConstructionThumbnail from '$lib/screenshots/lingo/explore-built-from-within.png?enhanced&w=800';
	import LingoExploreConstructionFull from '$lib/screenshots/lingo/explore-built-from-within.png?enhanced&w=2400';
	import LingoExploreHistoryThumbnail from '$lib/screenshots/lingo/explore-then-and-now.png?enhanced&w=800';
	import LingoExploreHistoryFull from '$lib/screenshots/lingo/explore-then-and-now.png?enhanced&w=2400';
	import LingoExploreLookalikesThumbnail from '$lib/screenshots/lingo/explore-lookalikes.png?enhanced&w=800';
	import LingoExploreLookalikesFull from '$lib/screenshots/lingo/explore-lookalikes.png?enhanced&w=2400';
	import LingoExploreMeaningsThumbnail from '$lib/screenshots/lingo/explore-most-meanings.png?enhanced&w=800';
	import LingoExploreMeaningsFull from '$lib/screenshots/lingo/explore-most-meanings.png?enhanced&w=2400';
	import LingoNewbie from '$lib/screenshots/lingo/newbie-overview.png?enhanced&w=1600';
	import LingoNewbieStartersThumbnail from '$lib/screenshots/lingo/newbie-starter-terms.png?enhanced&w=800';
	import LingoNewbieStartersFull from '$lib/screenshots/lingo/newbie-starter-terms.png?enhanced&w=2400';
	import LingoNewbieMeetingThumbnail from '$lib/screenshots/lingo/newbie-attending-a-meeting.png?enhanced&w=800';
	import LingoNewbieMeetingFull from '$lib/screenshots/lingo/newbie-attending-a-meeting.png?enhanced&w=2400';
	import LingoQuizRoundThumbnail from '$lib/screenshots/lingo/quiz-newbie-round.png?enhanced&w=800';
	import LingoQuizRoundFull from '$lib/screenshots/lingo/quiz-newbie-round.png?enhanced&w=2400';
	import LingoQuizOverviewThumbnail from '$lib/screenshots/lingo/quiz-overview.png?enhanced&w=800';
	import LingoQuizOverviewFull from '$lib/screenshots/lingo/quiz-overview.png?enhanced&w=2400';

	const stack = [
		{ role: 'Application', tools: 'Go, Templ, HTMX, Tailwind CSS' },
		{ role: 'Search', tools: 'Meilisearch, Jaro-Winkler, Metaphone' },
		{ role: 'Data and identity', tools: 'Embedded JSON, PostgreSQL, Stytch' },
		{ role: 'Product analytics', tools: 'PostHog, Umami' },
		{ role: 'Observability', tools: 'Grafana Cloud, OpenTelemetry' },
		{ role: 'Delivery', tools: 'GitHub Actions, Playwright, Coolify' },
	];

	const exploreScreenshots = [
		{
			thumbnail: LingoExploreConstructionThumbnail,
			full: LingoExploreConstructionFull,
			alt: 'Lingo Explore view showing how Singapore Public Service abbreviations are assembled from words',
			caption: 'Some abbreviations hide their letters inside words.',
		},
		{
			thumbnail: LingoExploreHistoryThumbnail,
			full: LingoExploreHistoryFull,
			alt: 'Lingo Explore view connecting former Singapore Public Service names with their successors',
			caption: 'Old names and what replaced them.',
		},
		{
			thumbnail: LingoExploreLookalikesThumbnail,
			full: LingoExploreLookalikesFull,
			alt: 'Lingo Explore view comparing similar-looking abbreviations',
			caption: 'Terms that look similar enough to mix up.',
		},
		{
			thumbnail: LingoExploreMeaningsThumbnail,
			full: LingoExploreMeaningsFull,
			alt: 'Lingo Explore view listing abbreviations with the most meanings',
			caption: 'The terms with the most possible meanings.',
		},
	];

	const newbieScreenshots = [
		{
			thumbnail: LingoNewbieStartersThumbnail,
			full: LingoNewbieStartersFull,
			alt: 'Lingo newbie guide showing ten starter terms with explanations and examples',
			caption: 'Ten terms to start with.',
		},
		{
			thumbnail: LingoNewbieMeetingThumbnail,
			full: LingoNewbieMeetingFull,
			alt: 'Lingo newbie guide showing terms used when attending a meeting',
			caption: 'Terms that come up in meetings, with explanations and examples.',
		},
	];

	const quizScreenshots = [
		{
			thumbnail: LingoQuizRoundThumbnail,
			full: LingoQuizRoundFull,
			alt: 'A Lingo newbie quiz showing the correct abbreviation for Financial Year',
			caption: 'A ten-question Newbie round.',
		},
		{
			thumbnail: LingoQuizOverviewThumbnail,
			full: LingoQuizOverviewFull,
			alt: 'Lingo quiz screen offering Newbie practice and a full glossary challenge',
			caption: 'Choose between Newbie practice and the full glossary.',
		},
	];

	const learningScreenshots = [...exploreScreenshots, ...quizScreenshots];
</script>

<!--
THESIS: Lingo is understood through its interface and the judgment behind it, replacing the repeated case-study stack with a civic field guide.
OWN-WORLD: Cool civic paper, slate rules, square screenshots, compact reference typography, and restrained annotation.
STORY: An onboarding gap leads to tolerant search, proactive learning, deliberate editorial review, and delivery for constrained devices.
FIRST VIEWPORT: The reason for Lingo sits at left while the working product occupies the larger right field; the live-site action stays with the introduction.
FORM: An artifact-led Workbench shaped by the approved field-guide comp at .impeccable/mocks/lingo-field-guide.png.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->
<ProjectShell
	name="Lingo"
	slug="lingo"
	accent="var(--color-base-content)"
	accentInk="var(--color-base-content)"
	heroLayout="split"
	eyebrow="Language of the Singapore Public Service"
	headline="The glossary I wish I had when I started work."
	sub="A searchable glossary, onboarding guide, and lightweight quiz for people learning the abbreviations, service names, and workplace language of the Singapore Public Service."
	url="https://lingo.zixian.dev"
	{stack}>
	{#snippet wordmark()}
		<p class="text-3xl font-extrabold tracking-tighter lg:text-4xl">Lingo</p>
	{/snippet}

	{#snippet hero()}
		<figure>
			<enhanced:img
				src={LingoHome}
				alt="Lingo landing page for searching Singapore public-service terminology"
				class="border-neutral/20 block w-full border shadow-sm" />
			<figcaption class="text-base-content/55 mt-2 text-xs leading-relaxed">
				Search, browse, explore, or start with the newbie guide.
			</figcaption>
		</figure>
	{/snippet}

	<div class="lingo-showcase">
		<nav class="border-neutral/15 grid border-y py-5 lg:grid-cols-[12rem_1fr] lg:gap-8" aria-label="Inside Lingo">
			<p class="text-base-content/55 font-mono text-xs tracking-wide uppercase">Inside Lingo</p>
			<ol class="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-5">
				<li><a class="chapter-link" href="#why">Why it exists</a></li>
				<li><a class="chapter-link" href="#find">Finding a term</a></li>
				<li><a class="chapter-link" href="#learn">Learning earlier</a></li>
				<li><a class="chapter-link" href="#trust">Earning trust</a></li>
				<li><a class="chapter-link" href="#run">Running it</a></li>
			</ol>
		</nav>

		<section id="why" class="py-16 lg:py-24">
			<div class="grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
				<div>
					<p class="chapter-kicker">Why it exists</p>
					<h2 class="chapter-title">The glossary began with an onboarding problem.</h2>
					<div class="body-copy">
						<p class="text-xl leading-snug font-bold lg:text-2xl">
							When I joined, documents and conversations were full of abbreviations I did not know.
						</p>
						<p>
							Colleagues said the same, and internal employee surveys pointed to unfamiliar terminology as a particular
							pain point during onboarding. The available references were scattered across PDFs, Word documents and
							intranet pages, so I started collecting terms in one place.
						</p>
						<p>
							The collection began with abbreviations, then widened to branded names such as ServiceSG and LifeSG, along
							with workplace expressions such as “seek a steer”, “take offline” and “first cut”. Eventually I renamed it
							Lingo, a glossary for the language of the Singapore Public Service.
						</p>
					</div>
				</div>

				<figure class="min-w-0">
					<enhanced:img
						src={LingoTermsDirectoryFull}
						alt="Lingo directory showing Singapore public-service terms beginning with C"
						class="border-neutral/20 block w-full border shadow-sm" />
					<figcaption class="artifact-caption">
						The list grew beyond acronyms into the language people meet at work.
					</figcaption>
				</figure>
			</div>
		</section>

		<section id="find" class="border-neutral/15 border-t py-16 lg:py-24">
			<div class="max-w-3xl">
				<p class="chapter-kicker">Finding a term</p>
				<h2 class="chapter-title">Search should tolerate imperfect memory.</h2>
				<p class="body-lead">
					Someone might remember a few letters, part of a phrase, roughly how a name sounded, or only what the term did.
					Lingo has to make use of whichever fragment survived.
				</p>
			</div>

			<div class="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,0.5fr)] lg:gap-10">
				<figure class="min-w-0">
					<enhanced:img
						src={LingoTermsSearch}
						alt="Lingo search results showing multiple meanings of DC across Singapore Public Service domains"
						class="border-neutral/20 block w-full border shadow-sm" />
					<figcaption class="artifact-caption">
						A query can lead to several meanings, with context to separate them.
					</figcaption>
				</figure>

				<dl class="decision-ledger">
					<div>
						<dt>First version</dt>
						<dd>Jaro-Winkler and Metaphone handled partial and phonetic matches.</dd>
					</div>
					<div>
						<dt>Why it changed</dt>
						<dd>Ranking became expensive to tune as the glossary grew.</dd>
					</div>
					<div>
						<dt>Current approach</dt>
						<dd>Meilisearch handles typo tolerance and ranking, with separate description search.</dd>
					</div>
					<div>
						<dt>Fallback</dt>
						<dd>The original search still takes over when Meilisearch is unavailable.</dd>
					</div>
				</dl>
			</div>

			<div class="border-neutral/15 mt-10 grid gap-6 border-y py-7 md:grid-cols-2 md:gap-10">
				<div>
					<h3 class="text-sm font-bold">Learn from failed searches</h3>
					<p class="text-base-content/75 mt-2 text-sm leading-relaxed">
						Lingo keeps 90 days of submitted searches, including results that found nothing. A short survey can ask what
						someone expected to find.
					</p>
				</div>
				<div>
					<h3 class="text-sm font-bold">Keep identity out of the log</h3>
					<p class="text-base-content/75 mt-2 text-sm leading-relaxed">
						URLs, emails, identity numbers and long phone-like numbers are redacted. IP addresses, user agents and
						session identifiers are not stored with searches.
					</p>
				</div>
			</div>
		</section>

		<section id="learn" class="border-neutral/15 border-t py-16 lg:py-24">
			<div class="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
				<div>
					<p class="chapter-kicker">Learning earlier</p>
					<h2 class="chapter-title">Search starts after a term gets in the way.</h2>
				</div>
				<div class="body-copy mt-0">
					<p>
						The original pain point was onboarding, so I arranged terms around how new officers encounter the Public
						Service: starting work, attending meetings, writing papers, navigating the hierarchy, handling procurement
						and working across agencies.
					</p>
					<p>
						The newbie guide now brings together 222 terms across eight situations. It begins with ten starter terms,
						then opens into 51 essentials and the wider glossary.
					</p>
				</div>
			</div>

			<figure class="mt-10 min-w-0">
				<enhanced:img
					src={LingoNewbie}
					alt="Lingo newbie guide organised around eight common Public Service workplace situations"
					class="border-neutral/20 block w-full border shadow-sm" />
				<figcaption class="artifact-caption">
					The guide follows situations a new officer can recognise before they know what to search for.
				</figcaption>
			</figure>

			<div class="border-neutral/15 mt-10 grid gap-8 border-y py-8 lg:grid-cols-2 lg:gap-12">
				<div>
					<h3 class="text-lg font-bold">Explore the shape of the glossary</h3>
					<p class="text-base-content/75 mt-3 leading-relaxed">
						Nine views surface lookalikes, changing names, workplace language, acronym families and terms with several
						meanings. The data can teach more than a search box alone.
					</p>
				</div>
				<div>
					<h3 class="text-lg font-bold">Practise without ceremony</h3>
					<p class="text-base-content/75 mt-3 leading-relaxed">
						The quiz uses ten-question rounds and returns missed answers for review. Completed-round totals stay in the
						browser, with no account, timer or leaderboard.
					</p>
				</div>
			</div>

			<ScreenshotGallery id="lingo-newbie-supporting" title="Inside the newbie guide" images={newbieScreenshots} />
			<ScreenshotGallery id="lingo-learning-supporting" title="Explore and quiz" images={learningScreenshots} />
		</section>

		<section id="trust" class="border-neutral/15 border-t py-16 lg:py-24">
			<div class="max-w-3xl">
				<p class="chapter-kicker">Earning trust</p>
				<h2 class="chapter-title">Make contributing easy. Make publishing deliberate.</h2>
				<p class="body-lead">
					Workplace language varies across agencies, so Lingo needs help finding gaps. It also needs every public entry
					to pass through research and review.
				</p>
			</div>

			<div class="mt-12" aria-labelledby="trust-flow-title">
				<h3 id="trust-flow-title" class="text-base font-bold">How an entry reaches search</h3>
				<ol class="trust-flow mt-5">
					<li>
						<span>01</span>
						<strong>A lead arrives</strong>
						<p>A suggestion, report, survey response or failed query points to a gap.</p>
					</li>
					<li>
						<span>02</span>
						<strong>Research it</strong>
						<p>I check the meaning, context and available public sources.</p>
					</li>
					<li>
						<span>03</span>
						<strong>Review and edit</strong>
						<p>The private panel keeps evidence, proposed changes and the decision together.</p>
					</li>
					<li>
						<span>04</span>
						<strong>Prepare the draft</strong>
						<p>An accepted suggestion becomes JSON for a final manual change.</p>
					</li>
					<li>
						<span>05</span>
						<strong>Release to search</strong>
						<p>The embedded JSON remains the source of truth and the index updates with the release.</p>
					</li>
				</ol>
			</div>

			<div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)] lg:gap-14">
				<div class="body-copy mt-0">
					<p>
						The first suggestion form asked separately for the term, meaning, agency, source and context. That made
						submissions easier to process, but suggesting something felt like work. The default is now one text box
						where someone can paste whatever they have, even if it is only a rough lead.
					</p>
					<p>
						People can report a problem with an existing entry and point to the fields that need attention. Suggestions,
						reports, survey responses and analytics sit in one private panel, while the public forms warn contributors
						to leave out classified, sensitive or personal information.
					</p>
				</div>

				<aside class="border-neutral/25 border-l-2 pl-5">
					<p class="font-mono text-xs tracking-wide uppercase">Where LLMs help</p>
					<p class="text-base-content/75 mt-3 text-sm leading-relaxed">
						One model can draft an entry and another can critique it. I still review the result against public
						references. The models do not answer live searches or publish entries.
					</p>
				</aside>
			</div>
		</section>

		<section id="run" class="border-neutral/15 border-t py-16 lg:py-24">
			<div class="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
				<div>
					<p class="chapter-kicker">Running it</p>
					<h2 class="chapter-title">Built for the browser people actually have.</h2>
					<p class="body-lead">
						Many users reach Lingo through Menlo Security's remote browser isolation, where extra client-side work can
						become more noticeable than it would on a normal connection.
					</p>
				</div>

				<dl class="technical-ledger">
					<div>
						<dt>Application</dt>
						<dd>
							Go and Templ render the main experience on the server. HTMX handles focused interactions, and JavaScript
							is divided into page-specific bundles.
						</dd>
					</div>
					<div>
						<dt>Analytics</dt>
						<dd>
							PostHog loads only on selected public pages. Recording stops when someone types a search, and query pages
							use event tracking without replay. Authentication, submissions and the admin panel are excluded.
						</dd>
					</div>
					<div>
						<dt>Release</dt>
						<dd>
							A self-hosted GitHub Actions runner generates code, builds the app, runs Go and browser tests, lints, and
							checks formatting. It synchronises the Meilisearch indexes before triggering the Coolify deployment.
						</dd>
					</div>
				</dl>
			</div>
		</section>

		<section class="border-neutral/20 bg-base-100 mt-2 border-y px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
			<h2
				class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
				Most people will use Lingo when a term gets in their way, and that is fine.
			</h2>
			<div class="body-copy max-w-3xl">
				<p>
					They look it up, find the explanation and return to whatever they were doing. The newbie guide gives new
					officers somewhere to start before that happens, with situations they recognise and a way to practise the
					terms.
				</p>
				<p>
					I started with a glossary because that was the simplest answer to the onboarding problem. Over time it has
					become much closer to the onboarding resource I wanted when I joined.
				</p>
			</div>
		</section>
	</div>
</ProjectShell>

<style>
	/* Hallmark · pre-emit critique: P5 H4 E4 S5 R4 V4
	 * macrostructure: Workbench · tone: civic field guide · anchor hue: slate
	 */
	.lingo-showcase {
		--lingo-rule: color-mix(in oklab, var(--color-base-content) 15%, transparent);
		--lingo-muted: color-mix(in oklab, var(--color-base-content) 72%, transparent);
		min-width: 0;
	}

	.lingo-showcase :global(section[id]) {
		scroll-margin-top: 4rem;
	}

	.chapter-link {
		color: var(--lingo-muted);
		font-size: 0.8125rem;
		line-height: 1.2;
		text-decoration-color: transparent;
		text-underline-offset: 0.25rem;
		transition:
			color 160ms ease,
			text-decoration-color 160ms ease;
	}

	.chapter-link:hover,
	.chapter-link:focus-visible {
		color: var(--color-base-content);
		text-decoration-color: currentColor;
	}

	.chapter-link:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 0.25rem;
	}

	.chapter-kicker {
		color: var(--lingo-muted);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 650;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.chapter-title {
		margin-top: 0.75rem;
		min-width: 0;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 750;
		letter-spacing: -0.035em;
		line-height: 1.05;
		overflow-wrap: anywhere;
	}

	.body-copy {
		color: var(--lingo-muted);
		display: grid;
		gap: 1rem;
		margin-top: 1.5rem;
		line-height: 1.7;
	}

	.body-lead {
		color: var(--lingo-muted);
		margin-top: 1.5rem;
		font-size: 1.0625rem;
		line-height: 1.65;
	}

	.artifact-caption {
		color: var(--lingo-muted);
		margin-top: 0.625rem;
		font-size: 0.75rem;
		line-height: 1.5;
	}

	.decision-ledger,
	.technical-ledger {
		border-top: 1px solid var(--lingo-rule);
	}

	.decision-ledger > div,
	.technical-ledger > div {
		border-bottom: 1px solid var(--lingo-rule);
		padding-block: 1rem;
	}

	.decision-ledger dt,
	.technical-ledger dt {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.decision-ledger dd,
	.technical-ledger dd {
		color: var(--lingo-muted);
		margin-top: 0.4rem;
		font-size: 0.875rem;
		line-height: 1.55;
	}

	.trust-flow {
		display: grid;
		gap: 0;
		list-style: none;
	}

	.trust-flow li {
		border-top: 1px solid var(--lingo-rule);
		padding-block: 1rem;
	}

	.trust-flow span {
		color: var(--lingo-muted);
		display: block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
	}

	.trust-flow strong {
		display: block;
		margin-top: 0.65rem;
		font-size: 0.9375rem;
	}

	.trust-flow p {
		color: var(--lingo-muted);
		margin-top: 0.4rem;
		font-size: 0.8125rem;
		line-height: 1.5;
	}

	@media (min-width: 48rem) {
		.trust-flow {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}

		.trust-flow li {
			border-right: 1px solid var(--lingo-rule);
			border-bottom: 1px solid var(--lingo-rule);
			padding: 1rem;
		}

		.trust-flow li:first-child {
			border-left: 1px solid var(--lingo-rule);
		}
	}
</style>
