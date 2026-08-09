interface ProjectDescriptions {
	[index: string]: {
		name: string;
		subtitle: string;
		tldr?: string;
		url: string;
		archived?: boolean;
		lineage?: string;
		stack?: string;
	};
}

export const descriptions: ProjectDescriptions = {
	lingo: {
		name: 'Lingo',
		subtitle: 'The language of Singapore’s Public Service, explained',
		url: 'https://lingo.zixian.dev',
	},
	appraize: {
		name: 'Appraize',
		subtitle: 'Drag & Drop Ranking',
		tldr: 'Drag-and-drop ranking tool with session management, CSV bulk import, and auto-save. Replaced an Excel-based HR ranking workflow.',
		url: 'https://appraize.zixian.dev/',
		archived: true,
		stack: 'SvelteKit, SortableJS, Drizzle, Postgres, Clerk',
	},
	apptitude: {
		name: 'Apptitude',
		subtitle: 'Structured technology learning and decision support',
		url: 'https://titude.app/',
	},
	btonomics: {
		name: 'BTOnomics',
		subtitle: 'Home renovation blog for budget folks',
		url: 'https://btonomics.com',
	},
	cancelninja: {
		name: 'Cancel Ninja',
		subtitle: 'SaaS & Dark Pattern tracker',
		tldr: 'Subscription tracker with calendar view and alerts, built to expose dark pattern cancellation flows. Subscription tracking absorbed into Cubby.',
		url: 'https://cancelninja.com',
		archived: true,
		stack: 'SvelteKit, Drizzle, Postgres',
		lineage: 'Folded into Cubby',
	},
	grumplr: {
		name: 'Grumplr',
		subtitle: 'Reddit-lite style bulletin board',
		tldr: 'Bulletin board with threaded discussions, live chat via SSE, Keycloak auth, and full-text search. Built to learn Go web fundamentals with hand-written SQL.',
		url: 'https://grumplr.com',
		archived: true,
		stack: 'Go, htmx, Templ, Postgres, Keycloak',
	},
	meetrics: {
		name: 'Meetrics',
		subtitle: 'Meeting cost calculator',
		tldr: 'Live meeting cost calculator based on attendee count and seniority levels.',
		url: 'https://meetrics.zixian.dev/',
		archived: true,
		stack: 'SvelteKit',
	},
	rinku: {
		name: 'Rinku',
		subtitle: 'URL shortener',
		tldr: 'URL shortener with admin panel using a custom domain to avoid the spam-link look of bit.ly and tinyurl.',
		url: 'https://zczx.org',
		archived: true,
		stack: 'Go',
	},
	cubby: {
		name: 'Cubby',
		subtitle: 'A personal ERP for the household',
		tldr: 'It started as a way to remember when I last changed the towels, then it grew into the app the whole family runs the house on, with several old side projects folded in.',
		url: 'https://cubby.dev',
	},
	wronged: {
		name: 'Wronged',
		subtitle: 'Products, Problems, UX Chatbot',
		tldr: 'Domain-specific chatbots for product management, UX strategy, and problem statements using OpenRouter APIs with custom system prompts.',
		url: 'https://getwronged.com',
		archived: true,
		stack: 'Go, htmx, Postgres, OpenRouter',
	},
	roamichi: {
		name: 'Roamichi',
		subtitle: 'Trip management & travel planner',
		tldr: 'Trip management app with LLM-powered itinerary parsing, flight and hotel tracking, and a country info service. Absorbed into Cubby.',
		url: 'https://roamichi.com',
		archived: true,
		stack: 'SvelteKit, Go, Postgres, Stytch',
		lineage: 'Folded into Cubby',
	},
	'btonomics-wordpress': {
		name: 'BTOnomics (Wordpress)',
		subtitle: 'Home renovation blog for budget folks',
		tldr: 'I started a Wordpress blog for budget home renovation.',
		url: 'https://web.archive.org/web/20180513112335/http://pewpewpew.cc/',
		archived: true,
		stack: 'WordPress',
		lineage: 'Became BTOnomics',
	},
	eatyourmeds: {
		name: 'Eat Your Medicine!',
		subtitle: 'Medicine dose tracker',
		tldr: 'I built a webapp to track and plan medicine doses between parents.',
		url: 'https://eatyourmeds.zixian.dev/',
		archived: true,
		stack: 'Django, htmx, SQLite',
		lineage: 'Folded into Cubby',
	},
	rankamate: {
		name: 'Rank-a-Mate',
		subtitle: 'Drag & drop ranking v0.1',
		tldr: 'Rank-a-Mate is a drag-and-drop web app I built to replace slow Excel-based ranking processes, streamlining sessions with features like supplementary info and quota sliders.',
		url: 'https://rankamate.zixian.dev/',
		archived: true,
		stack: 'Django, htmx, SQLite',
		lineage: 'Became Appraize',
	},
};
