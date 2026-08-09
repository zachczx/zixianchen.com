<script lang="ts">
	import Nav from '$lib/Nav.svelte';
	import WebsiteFooter from '$lib/WebsiteFooter.svelte';

	let { children } = $props();
</script>

<Nav navCurrent="projects" />
<div class="bg-base-200 grid min-h-dvh content-start">
	<section id="projects">{@render children()}</section>
	<WebsiteFooter />
</div>
