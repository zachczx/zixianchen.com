<script lang="ts">
	import SvgSvelte from '$lib/logos/svelte-small-logo.svg?dataurl';
	import SvgGreensock from '$lib/logos/Greensock.svg?dataurl';
	import SvgTailwindSmall from '$lib/logos/tailwindcss-small.svg?dataurl';
	import SvgDrizzlePng from '$lib/logos/Drizzle.png?w=40&enhanced';
	import SvgSortable from '$lib/logos/Sortablejs.png?w=40&enhanced';
	import SvgNginx from '$lib/logos/nginx-small-logo.svg?dataurl';
	import SvgCoolify from '$lib/logos/Coolify.svg?dataurl';
	import SvgPostgresql from '$lib/logos/Postgresql.svg?dataurl';
	import SvgHtmx from '$lib/logos/htmx-small-logo.svg?dataurl';
	import SvgDjango from '$lib/logos/django-small-logo.svg?dataurl';
	import SvgBootstrap from '$lib/logos/Bootstrap.svg?dataurl';
	import SvgGunicorn from '$lib/logos/Gunicorn.svg?dataurl';
	import SvgWordpress from '$lib/logos/Wordpress.svg?dataurl';
	import SvgMysql from '$lib/logos/mysql-small-logo.svg?dataurl';
	import SvgBunny from '$lib/logos/Bunny.svg?dataurl';
	import SvgAstro from '$lib/logos/astro-icon-dark.svg?dataurl';
	import SvgPagefind from '$lib/logos/pagefind-small-logo.svg?dataurl';
	import SvgPocketbase from '$lib/logos/pocketbase.svg?dataurl';
	import SvgGolang from '$lib/logos/Golang.svg?dataurl';
	import SvgSqlite from '$lib/logos/sqlite-small-logo.svg?dataurl';
	import SvgBetterAuth from '$lib/logos/betterauth.svg?dataurl';
	import SvgTempl from '$lib/logos/templ-small-logo.svg?dataurl';
	import SvgStytch from '$lib/logos/Stytch.svg?dataurl';
	import SvgKeycloak from '$lib/logos/keycloak-small-logo.svg?dataurl';

	interface StackEntry {
		name: string;
		src: string;
		class: string;
		enhanced?: boolean;
	}

	const stacks = {
		go: { name: 'Go', src: SvgGolang, class: 'h-5' },
		astro: { name: 'AstroJS', src: SvgAstro, class: 'h-5' },
		betterAuth: { name: 'Better Auth', src: SvgBetterAuth, class: 'h-5' },
		htmx: { name: 'Htmx', src: SvgHtmx, class: 'h-4' },
		tailwind: { name: 'Tailwind', src: SvgTailwindSmall, class: 'h-4' },
		sqlite: { name: 'Sqlite', src: SvgSqlite, class: 'h-5' },
		templ: { name: 'Templ', src: SvgTempl, class: 'h-4' },
		sveltekit: { name: 'Sveltekit', src: SvgSvelte, class: 'h-5' },
		sortable: { name: 'SortableJS', enhanced: true, src: SvgSortable, class: 'h-5' },
		coolify: { name: 'Coolify', src: SvgCoolify, class: 'h-5' },
		postgresql: { name: 'PostgreSQL', src: SvgPostgresql, class: 'h-5' },
		drizzle: { name: 'Drizzle', enhanced: true, src: SvgDrizzlePng, class: 'h-5 rounded-xl' },
		greensock: { name: 'GSAP', src: SvgGreensock, class: 'h-5' },
		pagefind: { name: 'Pagefind', src: SvgPagefind, class: 'h-5' },
		pocketbase: { name: 'PocketBase', src: SvgPocketbase, class: 'h-5' },
		django: { name: 'Django', src: SvgDjango, class: 'h-5' },
		gunicorn: { name: 'Gunicorn', src: SvgGunicorn, class: 'h-5' },
		bootstrap: { name: 'Bootstrap', src: SvgBootstrap, class: 'h-5' },
		wordpress: { name: 'Wordpress', src: SvgWordpress, class: 'h-5' },
		nginx: { name: 'Nginx', src: SvgNginx, class: 'h-5' },
		mysql: { name: 'MySQL', src: SvgMysql, class: 'h-5' },
		bunny: { name: 'BunnyCDN', src: SvgBunny, class: 'h-5' },
		stytch: { name: 'Stytch', src: SvgStytch, class: 'h-5' },
		keycloak: { name: 'Keycloak', src: SvgKeycloak, class: 'h-5' },
	} satisfies Record<string, StackEntry>;

	let { names = [] }: { names: (keyof typeof stacks)[] } = $props();
</script>

{#each names as name}
	<div
		class="border-neutral/15 flex items-center justify-center gap-4 rounded-lg border bg-white/70 px-4 py-2 shadow-md">
		{#if 'enhanced' in stacks[name]}
			<enhanced:img
				src={stacks[name].src}
				class={stacks[name].class}
				alt={stacks[name].name}
				title={stacks[name].name} />{stacks[name].name}
		{:else}
			<img
				src={stacks[name].src}
				class={stacks[name].class}
				alt={stacks[name].name}
				title={stacks[name].name} />{stacks[name].name}
		{/if}
	</div>
{/each}
