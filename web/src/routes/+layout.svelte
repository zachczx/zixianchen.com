<script>
	import { onNavigate } from '$app/navigation';
	import '../app.css';

	let { children } = $props();

	onNavigate((navigation) => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!document.startViewTransition || prefersReducedMotion) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Zixian Chen - Blog" href="/rss.xml" />
</svelte:head>

{@render children()}
