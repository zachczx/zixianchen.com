import { codeSnippets } from '$lib/codeSnippets';

interface CodeCanvasOptions {
	animated: boolean;
	glyphMask?: 'jost-z';
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

export function codeCanvas({ animated, glyphMask }: CodeCanvasOptions): CodeCanvasAttachment {
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
		let isVisible = true;
		let pageVisible = document.visibilityState === 'visible';
		const shouldAnimate = animated && !reducedMotion;
		const canvasStyles = getComputedStyle(canvas);
		const canvasBackground = canvasStyles.getPropertyValue('--code-canvas-background').trim();
		const canvasCursor = canvasStyles.getPropertyValue('--code-canvas-cursor').trim();
		const canvasMask = canvasStyles.getPropertyValue('--code-canvas-mask').trim();

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
			drawingContext.globalCompositeOperation = 'source-over';
			drawingContext.clearRect(0, 0, renderWidth, renderHeight);
			if (glyphMask === 'jost-z') {
				drawingContext.fillStyle = canvasBackground || '#0f172a';
				drawingContext.fillRect(0, 0, renderWidth, renderHeight);
			}

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

			if (shouldAnimate) {
				const visibleCharacters = charactersPerLine * visibleLines;
				const visibleCursor = cursorPosition % visibleCharacters;
				const cursorLine = Math.floor(visibleCursor / charactersPerLine);
				const cursorColumn = visibleCursor % charactersPerLine;
				drawingContext.fillStyle = canvasCursor || '#ffff00';
				drawingContext.fillRect(cursorColumn * characterWidth, cursorLine * lineHeight, 3, lineHeight);
			}

			if (glyphMask === 'jost-z') {
				const referenceFontSize = 100;
				// Jost's natural uppercase Z reads narrow when isolated inside a square.
				// Keep its contours while giving this display mark a small optical expansion.
				const horizontalScale = 1.14;
				drawingContext.font = `800 ${referenceFontSize}px "Jost Variable", sans-serif`;
				const referenceMetrics = drawingContext.measureText('Z');
				const referenceWidth = referenceMetrics.actualBoundingBoxLeft + referenceMetrics.actualBoundingBoxRight;
				const referenceHeight = referenceMetrics.actualBoundingBoxAscent + referenceMetrics.actualBoundingBoxDescent;
				const glyphFontSize =
					referenceFontSize *
					Math.min((renderWidth * 0.96) / (referenceWidth * horizontalScale), (renderHeight * 0.96) / referenceHeight);

				drawingContext.save();
				drawingContext.globalCompositeOperation = 'destination-in';
				drawingContext.font = `800 ${glyphFontSize}px "Jost Variable", sans-serif`;
				drawingContext.textAlign = 'left';
				drawingContext.textBaseline = 'alphabetic';
				drawingContext.fillStyle = canvasMask || '#000';

				const metrics = drawingContext.measureText('Z');
				const glyphWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
				const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
				const baselineY = (renderHeight - glyphHeight) / 2 + metrics.actualBoundingBoxAscent;
				drawingContext.translate(renderWidth / 2, 0);
				drawingContext.scale(horizontalScale, 1);
				drawingContext.fillText('Z', -glyphWidth / 2 + metrics.actualBoundingBoxLeft, baselineY);
				drawingContext.restore();
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

		const visibilityObserver = new IntersectionObserver(([entry]) => {
			isVisible = entry?.isIntersecting ?? true;
			if (isVisible) requestDraw();
		});
		visibilityObserver.observe(canvas);

		const handleVisibilityChange = () => {
			pageVisible = document.visibilityState === 'visible';
			if (pageVisible) requestDraw();
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);

		if (shouldAnimate) {
			animationTimer = setInterval(() => {
				if (!isVisible || !pageVisible) return;
				cursorPosition += 1;
				if (cursorPosition >= currentText.length) {
					currentText = nextText;
					nextText = shuffledText();
					cursorPosition = 0;
				}
				requestDraw();
			}, 100);
		}

		return () => {
			disposed = true;
			resizeObserver.disconnect();
			themeObserver.disconnect();
			visibilityObserver.disconnect();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
			if (animationTimer) clearInterval(animationTimer);
		};
	};
}
