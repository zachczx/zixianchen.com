<script lang="ts">
	import { page } from '$app/state';
	import NavDock from '$lib/NavDock.svelte';

	let { navCurrent }: { navCurrent: string } = $props();

	type ActiveRule =
		| { type: 'hash'; key: string }
		| { type: 'path'; key: string }
		| { type: 'prefix'; key: string }
		| { type: 'prefixOrHash'; key: string; hash: string };

	const links: { href: string; label: string; active: ActiveRule }[] = [
		{ href: '/', label: 'Home', active: { type: 'hash', key: 'header' } },
		{ href: '/#about', label: 'About', active: { type: 'hash', key: 'about' } },
		{ href: '/#projects', label: 'Projects', active: { type: 'hash', key: 'projects' } },
		{ href: '/blog', label: 'Blog', active: { type: 'prefixOrHash', key: '/blog', hash: 'musings' } },
		{ href: '/contact', label: 'Contact', active: { type: 'path', key: '/contact' } },
	];

	function isActive(rule: ActiveRule): boolean {
		if (rule.type === 'hash') return navCurrent === rule.key;
		if (rule.type === 'path') return page.url.pathname === rule.key;
		if (rule.type === 'prefixOrHash') return page.url.pathname.startsWith(rule.key) || navCurrent === rule.hash;
		return page.url.pathname.startsWith(rule.key);
	}

	function ariaCurrent(rule: ActiveRule, active: boolean): 'location' | 'page' | undefined {
		if (!active) return undefined;
		if (rule.type === 'hash') return 'location';
		if (rule.type === 'prefixOrHash' && !page.url.pathname.startsWith(rule.key)) return 'location';
		return 'page';
	}
</script>

<nav
	aria-label="Primary"
	class="z-50 grid h-fit w-full justify-center px-4 transition-all duration-300 ease-out xl:fixed xl:bottom-2">
	<div
		style="view-transition-name: navdock;"
		class="hidden h-20 w-fit min-w-120 items-center justify-center justify-self-center rounded border border-gray-400 bg-gray-900 px-2 shadow-sm backdrop-blur-md transition-all duration-300 ease-out xl:relative xl:flex">
		<NavDock {navCurrent} pathName={page.url.pathname} />
	</div>
</nav>

<!-- Stoic pole: a plain mono bar on narrow screens, where the playful dock is hidden. -->
<nav
	aria-label="Site"
	class="border-base-content/10 bg-base-100/95 fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] font-mono text-xs tracking-wide uppercase backdrop-blur xl:hidden">
	{#each links as link}
		{@const active = isActive(link.active)}
		<a
			href={link.href}
			aria-current={ariaCurrent(link.active, active)}
			class={[
				'decoration-accent focus-visible:outline-accent inline-flex min-h-11 items-center justify-center px-1 text-center decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-0',
				active ? 'text-base-content underline' : 'text-muted-foreground hover:text-base-content',
			]}>
			{link.label}
		</a>
	{/each}
</nav>
