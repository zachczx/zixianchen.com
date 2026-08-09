<script lang="ts">
	import { codeCanvas } from '$lib/codeCanvas';

	let { animated = true }: { animated?: boolean } = $props();
</script>

<canvas {@attach codeCanvas({ animated })} aria-hidden="true" class="block h-full w-full"></canvas>

<style>
	canvas {
		color: var(--color-primary-content);
	}
</style>
