<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import ChevronLeftIcon from '~icons/lucide/chevron-left';
	import ChevronRightIcon from '~icons/lucide/chevron-right';
	import ExpandIcon from '~icons/lucide/expand';
	import XIcon from '~icons/lucide/x';

	export interface GalleryImage {
		thumbnail: Picture;
		full: Picture;
		alt: string;
		caption: string;
	}

	interface Props {
		id: string;
		title?: string;
		images: GalleryImage[];
	}

	let { id, title = 'Supporting screenshots', images }: Props = $props();
	let selectedIndex = $state(0);
	let isOpen = $state(false);
	let selectedImage = $derived(images[selectedIndex]);

	function openImage(index: number) {
		selectedIndex = index;
		isOpen = true;
	}

	function selectRelative(offset: number) {
		selectedIndex = (selectedIndex + offset + images.length) % images.length;
	}

	function handleDialogKeydown(event: KeyboardEvent) {
		if (images.length < 2) return;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			selectRelative(-1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			selectRelative(1);
		}
	}
</script>

<section class="mt-6" aria-labelledby="{id}-title">
	<div class="flex items-baseline justify-between gap-4">
		<h3 id="{id}-title" class="text-base-content/80 text-sm font-semibold">{title}</h3>
		<p class="text-base-content/50 text-xs">Select to enlarge</p>
	</div>

	<div class="mt-3 grid gap-3 sm:grid-cols-2">
		{#each images as image, index (image.caption)}
			<button
				type="button"
				class="group focus-visible:outline-base-content/70 border-neutral/20 bg-base-100 hover:border-neutral/45 cursor-pointer overflow-hidden border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
				aria-label="Open full-size screenshot: {image.caption}"
				onclick={() => openImage(index)}>
				<div class="relative aspect-video overflow-hidden">
					<enhanced:img
						src={image.thumbnail}
						alt={image.alt}
						loading="lazy"
						class="block h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]" />
					<span
						class="absolute right-2 bottom-2 grid size-8 place-items-center bg-neutral-950/85 text-white opacity-85 transition-opacity group-hover:opacity-100"
						aria-hidden="true">
						<ExpandIcon class="size-4" />
					</span>
				</div>
				<span class="text-base-content/70 border-neutral/15 block border-t px-3 py-2 text-xs leading-relaxed">
					{image.caption}
				</span>
			</button>
		{/each}
	</div>
</section>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content
		showCloseButton={false}
		overlayClass="bg-neutral-950/85 supports-backdrop-filter:backdrop-blur-sm"
		class="max-h-[96vh] w-[min(96vw,96rem)] max-w-none gap-0 rounded-none bg-neutral-950 p-0 text-white ring-1 ring-white/20 sm:max-w-none"
		onkeydown={handleDialogKeydown}>
		{#if selectedImage}
			<div class="flex items-center gap-3 border-b border-white/15 px-3 py-2 sm:px-4">
				<Dialog.Title id="{id}-dialog-title" class="min-w-0 flex-1 truncate text-sm leading-normal font-semibold">
					{selectedImage.caption}
				</Dialog.Title>
				{#if images.length > 1}
					<span class="text-xs text-white/60">{selectedIndex + 1} of {images.length}</span>
				{/if}
				<Dialog.Close
					class="grid size-10 cursor-pointer place-items-center border border-white/20 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					aria-label="Close full-size screenshot">
					<XIcon class="size-5" />
				</Dialog.Close>
			</div>

			<div class="relative grid max-h-[calc(96vh-3.6rem)] place-items-center overflow-auto bg-neutral-900">
				<enhanced:img
					src={selectedImage.full}
					alt={selectedImage.alt}
					class="block max-h-[calc(96vh-3.6rem)] max-w-full object-contain" />

				{#if images.length > 1}
					<button
						type="button"
						class="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center bg-neutral-950/85 transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4"
						aria-label="Previous screenshot"
						onclick={() => selectRelative(-1)}>
						<ChevronLeftIcon class="size-6" />
					</button>
					<button
						type="button"
						class="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center bg-neutral-950/85 transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4"
						aria-label="Next screenshot"
						onclick={() => selectRelative(1)}>
						<ChevronRightIcon class="size-6" />
					</button>
				{/if}
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
