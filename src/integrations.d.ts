import '@poppanator/sveltekit-svg/dist/svg';

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

export {};
