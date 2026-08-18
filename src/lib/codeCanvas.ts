import { codeSnippets } from '$lib/codeSnippets';

interface CodeCanvasOptions {
	animated: boolean;
}

type CodeCanvasAttachment = (canvas: HTMLCanvasElement) => void | (() => void);

const snippets = codeSnippets.filter(Boolean);
const staticText = snippets.join(' ');

function shuffledText() {
	const shuffled = [...snippets];
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
	}
	return shuffled.join(' ');
}

export function codeCanvas({ animated }: CodeCanvasOptions): CodeCanvasAttachment {
	return (canvas) => {
		const context = canvas.getContext('2d');
		if (!context) return;
		const drawingContext: CanvasRenderingContext2D = context;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let currentText = animated ? shuffledText() : staticText;
		let nextText = animated ? shuffledText() : staticText;
		let cursorPosition = 0;
		let animationTimer: ReturnType<typeof setInterval> | undefined;
		let animationFrame: number | undefined;
		let disposed = false;

		function draw() {
			animationFrame = undefined;
			if (disposed) return;

			const { width, height } = canvas.getBoundingClientRect();
			if (width === 0 || height === 0) return;

			const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
			const renderWidth = Math.max(1, Math.round(width));
			const renderHeight = Math.max(1, Math.round(height));
			const bitmapWidth = Math.max(1, Math.round(renderWidth * pixelRatio));
			const bitmapHeight = Math.max(1, Math.round(renderHeight * pixelRatio));

			if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
				canvas.width = bitmapWidth;
				canvas.height = bitmapHeight;
			}

			drawingContext.setTransform(bitmapWidth / renderWidth, 0, 0, bitmapHeight / renderHeight, 0, 0);
			drawingContext.clearRect(0, 0, renderWidth, renderHeight);

			const fontSize = Math.min(11.2, Math.max(9, renderWidth * 0.06));
			const lineHeight = fontSize * 1.3;
			drawingContext.font = `${fontSize}px "JetBrains Mono Variable", monospace`;
			drawingContext.textBaseline = 'top';
			drawingContext.fillStyle = getComputedStyle(canvas).color;

			const characterWidth = drawingContext.measureText('M').width || fontSize * 0.6;
			const charactersPerLine = Math.max(1, Math.floor(renderWidth / characterWidth));
			const visibleLines = Math.ceil(renderHeight / lineHeight) + 1;
			const displayText =
				animated && !reducedMotion
					? nextText.slice(0, cursorPosition) + currentText.slice(cursorPosition)
					: currentText;

			for (let line = 0; line < visibleLines; line += 1) {
				const start = line * charactersPerLine;
				drawingContext.fillText(displayText.slice(start, start + charactersPerLine), 0, line * lineHeight);
			}

			if (animated && !reducedMotion) {
				const visibleCharacters = charactersPerLine * visibleLines;
				const visibleCursor = cursorPosition % visibleCharacters;
				const cursorLine = Math.floor(visibleCursor / charactersPerLine);
				const cursorColumn = visibleCursor % charactersPerLine;
				drawingContext.fillStyle = '#ffff00';
				drawingContext.fillRect(cursorColumn * characterWidth, cursorLine * lineHeight, 3, lineHeight);
			}

			canvas.dataset.ready = 'true';
		}

		function requestDraw() {
			if (disposed) return;
			if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(draw);
		}

		const resizeObserver = new ResizeObserver(requestDraw);
		resizeObserver.observe(canvas);

		const themeObserver = new MutationObserver(requestDraw);
		const themeContainer = canvas.closest('[data-theme]');
		themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
		if (themeContainer) {
			themeObserver.observe(themeContainer, { attributes: true, attributeFilter: ['class', 'data-theme'] });
		}

		void document.fonts.ready.then(requestDraw);
		requestDraw();

		if (animated && !reducedMotion) {
			animationTimer = setInterval(() => {
				cursorPosition += 1;
				if (cursorPosition >= currentText.length) {
					currentText = nextText;
					nextText = shuffledText();
					cursorPosition = 0;
				}
				requestDraw();
			}, 70);
		}

		return () => {
			disposed = true;
			resizeObserver.disconnect();
			themeObserver.disconnect();
			if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
			if (animationTimer) clearInterval(animationTimer);
		};
	};
}
