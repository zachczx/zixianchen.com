import '@poppanator/sveltekit-svg/dist/svg';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		declare module '*?enhanced' {
			import type { Picture } from 'vite-imagetools';

			const value: Picture;
			export default value;
		}

		declare module '*&enhanced' {
			import type { Picture } from 'vite-imagetools';

			const value: Picture;
			export default value;
		}

		declare module '*.md' {
			import type { SvelteComponent } from 'svelte';

			export default class Comp extends SvelteComponent {}

			export const metadata: Record<string, unknown>;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
