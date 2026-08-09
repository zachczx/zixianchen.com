<script lang="ts">
	import type { Component } from 'svelte';
	import HouseIcon from '~icons/lucide/house';
	import AccountIcon from '~icons/lucide/circle-user-round';
	import GridIcon from '~icons/lucide/panels-top-left';
	import ArticleIcon from '~icons/lucide/notebook-text';
	import MailIcon from '~icons/lucide/send';
	import LinkedInIcon from '~icons/lucide/linkedin';
	import GitHubIcon from '~icons/lucide/github';

	interface NavDockProps {
		navCurrent: string;
		pathName: string;
	}
	let { navCurrent, pathName }: NavDockProps = $props();

	type NavItem =
		| { kind: 'divider' }
		| {
				kind: 'anchor';
				href: string;
				label: string;
				icon: Component;
				active:
					| { type: 'hash'; key: string }
					| { type: 'path'; key: string }
					| { type: 'prefix'; key: string }
					| { type: 'prefixOrHash'; key: string; hash: string }
					| { type: 'none' };
		  };

	const items: NavItem[] = [
		{ kind: 'anchor', href: '/#header', label: 'Home', icon: HouseIcon, active: { type: 'hash', key: 'header' } },
		{ kind: 'anchor', href: '/#about', label: 'About', icon: AccountIcon, active: { type: 'hash', key: 'about' } },
		{
			kind: 'anchor',
			href: '/#projects',
			label: 'Projects',
			icon: GridIcon,
			active: { type: 'hash', key: 'projects' },
		},
		{
			kind: 'anchor',
			href: '/blog',
			label: 'Blog',
			icon: ArticleIcon,
			active: { type: 'prefixOrHash', key: '/blog', hash: 'musings' },
		},
		{ kind: 'divider' },
		{ kind: 'anchor', href: '/contact', label: 'Contact', icon: MailIcon, active: { type: 'path', key: '/contact' } },
		{
			kind: 'anchor',
			href: 'https://www.linkedin.com/in/zixianchen/',
			label: 'LinkedIn',
			icon: LinkedInIcon,
			active: { type: 'none' },
		},
		{
			kind: 'anchor',
			href: 'https://github.com/zachczx?tab=repositories',
			label: 'GitHub',
			icon: GitHubIcon,
			active: { type: 'none' },
		},
	];

	function isActive(item: Extract<NavItem, { kind: 'anchor' }>): boolean {
		if (item.active.type === 'hash') return navCurrent === item.active.key;
		if (item.active.type === 'path') return pathName === item.active.key;
		if (item.active.type === 'prefix') return pathName.startsWith(item.active.key);
		if (item.active.type === 'prefixOrHash')
			return pathName.startsWith(item.active.key) || navCurrent === item.active.hash;
		return false;
	}

	function ariaCurrent(item: Extract<NavItem, { kind: 'anchor' }>, active: boolean): 'location' | 'page' | undefined {
		if (!active) return undefined;
		if (item.active.type === 'hash') return 'location';
		if (item.active.type === 'prefixOrHash' && !pathName.startsWith(item.active.key)) return 'location';
		return 'page';
	}
</script>

{#each items as item}
	{#if item.kind === 'divider'}
		<div class="mx-4 h-10/12 w-0.5 bg-white/30"></div>
	{:else}
		{@const Icon = item.icon}
		{@const active = isActive(item)}
		<a
			href={item.href}
			aria-label={item.label}
			aria-current={ariaCurrent(item, active)}
			class="dock group/dock focus-visible:outline-accent relative bg-transparent no-underline transition-all duration-100 ease-linear hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4">
			<div
				class={[
					'relative flex items-center justify-center rounded-sm border transition-all duration-100 ease-linear',
					active
						? 'border-accent bg-accent text-neutral'
						: 'border-white/15 bg-white/10 text-white/80 group-hover/dock:border-white/30 group-hover/dock:bg-white/15 group-hover/dock:text-white',
				]}>
				<Icon aria-hidden="true" />
				<span
					class="bg-neutral pointer-events-none invisible absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-xs px-2 py-1 font-mono text-xs font-bold whitespace-nowrap text-white/90 opacity-0 transition-opacity duration-100 group-hover/dock:visible group-hover/dock:opacity-100 group-focus-visible/dock:visible group-focus-visible/dock:opacity-100">
					{item.label}
				</span>
			</div>
		</a>
	{/if}
{/each}

<style>
	a {
		--font-scaler: 0.3;
		--dimensions-scaler: 0.35;
		--margin-scaler: 0.2;
	}

	.dock {
		font-size: calc(var(--font-scaler) * 6rem);
		div {
			/* filter: saturate(0.5); */
			height: calc(var(--dimensions-scaler) * 9rem);
			width: calc(var(--dimensions-scaler) * 9rem);
			flex-basis: auto;

			&:hover {
				opacity: 100%;
			}
		}
	}

	:global(.dock svg) {
		stroke-width: 1.9;
	}

	@media (prefers-reduced-motion: no-preference) {
		.dock:hover {
			font-size: calc(var(--font-scaler) * 9rem);
			div {
				filter: saturate(1);
				height: calc(var(--dimensions-scaler) * 13rem);
				width: calc(var(--dimensions-scaler) * 13rem);
			}
			margin-top: calc(var(--margin-scaler) * -6rem);
		}

		/* Adjacent to hover */
		.dock:hover + .dock,
		.dock:has(+ .dock:hover) {
			font-size: calc(var(--font-scaler) * 8rem);
			/* background-color: fuchsia; */
			div {
				height: calc(var(--dimensions-scaler) * 11rem);
				width: calc(var(--dimensions-scaler) * 11rem);
			}
			margin-top: calc(var(--margin-scaler) * -3.5rem);
		}

		/* Next next - beside adjacent */
		.dock:hover + .dock + .dock,
		.dock:has(+ .dock + .dock:hover) {
			font-size: calc(var(--font-scaler) * 7rem);
			div {
				height: calc(var(--dimensions-scaler) * 10rem);
				width: calc(var(--dimensions-scaler) * 10rem);
			}
			margin-top: calc(var(--margin-scaler) * -2rem);
		}

		/* Next next next */
		.dock:hover + .dock + .dock + .dock,
		.dock:has(+ .dock + .dock + .dock:hover) {
			font-size: calc(var(--font-scaler) * 6rem);
			div {
				height: calc(var(--dimensions-scaler) * 9rem);
				width: calc(var(--dimensions-scaler) * 9rem);
			}
			margin-top: calc(var(--margin-scaler) * -1rem);
		}
	}
</style>
