<script>
	import ProjectShell from '$lib/ProjectShell.svelte';
	import ScreenshotGallery from '$lib/ScreenshotGallery.svelte';
	import LingoHome from '$lib/screenshots/lingo/home.png?enhanced&w=1600';
	import LingoTermsDirectoryThumbnail from '$lib/screenshots/lingo/terms-directory.png?enhanced&w=800';
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

	const glossaryScreenshots = [
		{
			thumbnail: LingoTermsDirectoryThumbnail,
			full: LingoTermsDirectoryFull,
			alt: 'Lingo directory showing Singapore public-service terms beginning with C',
			caption: 'The full A to Z list, now covering more than abbreviations.',
		},
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
</script>

<ProjectShell
	name="Lingo"
	slug="lingo"
	accent="#475569"
	accentInk="#1e293b"
	eyebrow="Language of the Singapore Public Service"
	headline="The glossary I wish I had when I started work."
	sub="A searchable glossary, onboarding guide, and lightweight quiz for people learning the abbreviations, service names, and workplace language of the Singapore Public Service."
	url="https://lingo.zixian.dev"
	{stack}>
	{#snippet wordmark()}
		<h2 class="text-4xl font-extrabold tracking-tighter text-[#475569] lg:text-5xl">Lingo</h2>
	{/snippet}

	{#snippet hero()}
		<enhanced:img
			src={LingoHome}
			alt="Lingo landing page for searching Singapore public-service terminology"
			class="border-neutral/20 block w-full border-2 shadow-sm" />
	{/snippet}

	<section class="border-neutral/10 border-t py-14 lg:py-16">
		<h2 class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
			The glossary began with an onboarding problem
		</h2>
		<div class="text-base-content/85 mt-6 grid max-w-3xl gap-4 leading-relaxed">
			<p class="text-xl leading-snug font-bold lg:text-2xl">
				When I joined, documents and conversations were full of abbreviations I did not know.
			</p>
			<p>
				I heard the same from colleagues, and internal employee surveys also pointed to unfamiliar terminology as a
				particular pain point during onboarding.
			</p>
			<p>
				The available references were scattered across PDFs, Word documents and intranet pages, so I started collecting
				the terms in one place. It remained a personal project, but eventually became useful enough to be linked from an
				internal onboarding guide.
			</p>
		</div>
	</section>

	<section class="border-neutral/10 border-t py-16 lg:py-20">
		<h2 class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
			A glossary first
		</h2>
		<div class="text-base-content/85 mt-6 grid max-w-3xl gap-4 leading-relaxed">
			<p>
				I began with a couple of small compilations that other people had put together, then kept adding terms as I
				encountered them. Those starting lists now make up a relatively small part of the catalogue, which later grew
				through manual additions and LLM-assisted research.
			</p>
			<p>
				Gahmen loves acronyms, and they do not always follow the tidy pattern of taking the first letter of every word.
				GeBIZ compresses “Government Electronic Business”, while HRPS combines “HR” with “Payroll System”.
			</p>
			<p>
				Then the collection moved beyond acronyms. Branded names such as ServiceSG, LifeSG and FormSG, along with
				workplace expressions such as “seek a steer”, “take offline” and “first cut”, were also part of what a new
				officer had to learn. So I widened the list and eventually renamed it Lingo, a glossary for the language of the
				Singapore Public Service.
			</p>
		</div>
		<ScreenshotGallery id="lingo-glossary-supporting" title="Inside the glossary" images={glossaryScreenshots} />
	</section>

	<section class="border-neutral/10 border-t py-16 lg:py-24">
		<h2 class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
			Search that tolerates imperfect memory
		</h2>
		<div class="text-base-content/85 mt-6 grid max-w-3xl gap-4 leading-relaxed">
			<p>
				Someone might remember only a few letters, part of a phrase or roughly how a name sounded, so I originally built
				my own search using Jaro-Winkler and Metaphone to handle partial and phonetic matches.
			</p>
			<p>
				It did a decent job, but as the list grew I spent more and more time fiddling with ranking. Eventually I moved
				the main search to Meilisearch, which handles typos and ranking better than my home-grown version. The old
				Jaro-Winkler and Metaphone search still kicks in if Meilisearch is unavailable.
			</p>
			<p>
				As Lingo grew, search also had to work when someone knew what a term did but not what it was called. I added a
				separate description search for that kind of query, then filled in all descriptions to explain it.
			</p>
			<p>
				The home page still shows popular exact matches, but I now keep 90 days of searches submitted through the search
				form, including the ones that return nothing. URLs, email addresses, identity numbers and long phone-like
				numbers are redacted before storage, while IP addresses, user agents and session identifiers stay out of the
				search log.
			</p>
			<p>
				A short survey can appear after a search returns nothing or after someone has tried a few searches. It asks
				whether they found what they needed, and a Partly or No answer can include what went wrong and what they
				expected to find. That tells me more than a list of successful searches ever could.
			</p>
		</div>
		<enhanced:img
			src={LingoTermsSearch}
			alt="Lingo search results showing multiple meanings of DC across Singapore Public Service domains"
			class="border-neutral/20 mt-5 block w-full border-2 shadow-sm" />
	</section>

	<section class="border-neutral/10 border-t py-16 lg:py-24">
		<h2 class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
			Search only helps after someone has already run into a term they do not know.
		</h2>
		<div class="text-base-content/85 mt-6 grid max-w-3xl gap-4 leading-relaxed">
			<p>
				The pain point had always been onboarding, so I started arranging the terms around how new officers actually
				encounter the Public Service: starting work, attending meetings, writing papers, navigating the hierarchy,
				handling procurement and working across agencies.
			</p>
			<p>
				The newbie guide now pulls together 222 terms across eight situations. It starts with ten terms, then opens into
				51 essentials and the wider collection. Entries can include a plain-language explanation, examples, other ways
				the term is heard, context and a public source.
			</p>
			<p>
				I also added Explore because the data could do more than sit behind a search box. It now has nine ways to
				browse, including terms with several meanings, names built from within words, workplace language, acronym
				families and terminology associated with different agencies. The quiz came after that, with ten-question rounds
				and missed answers returning for review at the end.
			</p>
			<p>
				I kept the quiz deliberately lightweight: no account, timer or leaderboard. Completed-round totals stay only in
				the browser.
			</p>
		</div>
		<enhanced:img
			src={LingoNewbie}
			alt="Lingo newbie guide organised around eight common Public Service workplace situations"
			class="border-neutral/20 mt-5 block w-full border-2 shadow-sm" />
		<ScreenshotGallery id="lingo-newbie-supporting" title="Inside the newbie guide" images={newbieScreenshots} />
		<ScreenshotGallery id="lingo-explore-supporting" title="More ways into the glossary" images={exploreScreenshots} />
		<ScreenshotGallery id="lingo-quiz-supporting" title="Quiz practice" images={quizScreenshots} />
	</section>

	<section class="border-neutral/10 border-t py-14 lg:py-20">
		<h2 class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
			Accepting help without publishing blindly
		</h2>
		<div class="text-base-content/85 mt-6 grid max-w-3xl gap-4 leading-relaxed">
			<p class="text-xl leading-snug font-bold lg:text-2xl">
				As the glossary grew, I needed a way to accept help without letting anything go straight into search.
			</p>
			<p>
				A glossary this broad will always have gaps, especially when workplace language varies across agencies. I first
				designed the suggestion form around separate fields for the term, meaning, agency, source and context. That made
				the submissions easier to process, but also made suggesting something feel like filling in a form.
			</p>
			<p>
				The default is now a single text box where someone can paste whatever they have, even if it is only an
				unfamiliar term or a rough note. Structured details are still welcome for anyone who has them. I would rather
				receive an incomplete lead that I can research than lose it because contributing felt like work.
			</p>
			<p>
				People can also report a problem with an existing entry, mark whether it is wrong, incomplete or out of date,
				and point to the exact fields that need attention. Suggestions, reports, survey responses and analytics now sit
				in one private admin panel, while the public forms warn contributors to leave out classified, sensitive or
				personal information.
			</p>
			<p>
				The analytics view helps answer my "business" questions about the product. What are people searching for? How
				often do searches match an entry exactly? Do visitors go on to search after reaching the home page? Are accounts
				being used to save terms? Umami provides the broad traffic figures, while I am testing PostHog to understand
				anonymous journeys and where people may be getting stuck.
			</p>
			<p>
				I check the meaning, context and any public source before accepting a suggestion or closing a report. The panel
				lets me review the evidence, amend the proposed entry and record the decision. An accepted suggestion becomes a
				JSON draft I can copy into the glossary, while reports remain linked to the entry they concern. I still have to
				make the change by hand, so the admin panel cannot publish directly into live search results.
			</p>
			<p>
				Filling in definitions, examples and sources by hand got slow, so I use LLMs to help research new terms and find
				missing context. I often ask one model to draft the entry and another to poke holes in it.
			</p>
			<p>
				Everything still goes through review and a final scan from me. I track which entries have been checked against a
				public reference, and the embedded JSON files remain the source of truth. The LLMs never answer live searches or
				publish entries.
			</p>
		</div>
	</section>

	<section class="border-neutral/10 border-t py-16 lg:py-20">
		<h2 class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
			Built for constrained government devices
		</h2>
		<div class="text-base-content/85 mt-6 grid max-w-3xl gap-4 leading-relaxed">
			<p class="text-xl leading-snug font-bold lg:text-2xl">
				A site intended for public officers also has to work reasonably well on government devices.
			</p>
			<p>
				Many users reach Lingo through Menlo Security's remote browser isolation. The website is opened and processed in
				a remote browser before being sent to the device, so extra browser-side work can become more noticeable than it
				would be on a normal connection.
			</p>
			<p>
				I kept the main experience server-rendered with Go and Templ, using HTMX for focused interactions instead of
				turning the site into a large client-side application. JavaScript is divided into page-specific bundles, so
				someone looking up a term does not have to download the code used by the quiz, admin panel or other parts of the
				site.
			</p>
			<p>
				Adding PostHog needed the same restraint. Its heavier behaviour and session-replay code is loaded separately and
				only on selected public pages. Recording stops when someone starts typing a search, and pages containing a query
				use event tracking without replay. Authentication, submissions and the private admin panel are left out.
			</p>
			<p>
				The release process has also grown with the application. A self-hosted GitHub Actions runner performs the same
				checks I use locally: generating code, building the application, running the Go and browser tests, linting and
				checking formatting. Playwright covers a small set of important user journeys rather than trying to test every
				implementation detail.
			</p>
			<p>
				After the checks pass on the main branch, the runner synchronises the Meilisearch indexes before triggering the
				Coolify deployment. That keeps changes to the application and its search data together.
			</p>
		</div>
	</section>

	<section class="border-neutral/15 bg-base-100 mt-8 border-y px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
		<h2 class="max-w-3xl min-w-0 text-3xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] lg:text-4xl">
			Most people will use Lingo only when a term gets in their way, and that is fine.
		</h2>
		<div class="text-base-content/85 mt-6 grid max-w-3xl gap-4 leading-relaxed">
			<p>
				They look it up, find the explanation and get back to whatever they were doing. The newbie guide gives new
				officers somewhere to start before that happens, with situations they recognise and a way to practise the terms.
			</p>
			<p>
				I started with a glossary because that was the simplest answer to the onboarding problem. Over time it has
				become much closer to the onboarding resource I wanted when I joined.
			</p>
		</div>
	</section>
</ProjectShell>
