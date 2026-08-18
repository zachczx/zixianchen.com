import { readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
	args.set(process.argv[index], process.argv[index + 1]);
}

const root = resolve(args.get('--root') ?? 'dist');
const label = args.get('--label') ?? root;
const routes = (args.get('--routes') ?? '/').split(',').filter(Boolean);

function routeFile(route) {
	if (route === '/') return join(root, 'index.html');
	return join(root, `${route.replace(/^\//, '')}.html`);
}

function localPath(specifier, parentFile = join(root, 'index.html')) {
	if (!specifier || /^(?:https?:)?\/\//.test(specifier) || specifier.startsWith('data:')) return undefined;
	const clean = specifier.split(/[?#]/, 1)[0];
	if (!clean.endsWith('.js') && !clean.endsWith('.mjs')) return undefined;
	return clean.startsWith('/') ? join(root, clean.slice(1)) : resolve(dirname(parentFile), clean);
}

function referencedScripts(source) {
	const specifiers = new Set();
	for (const match of source.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) specifiers.add(match[1]);
	for (const match of source.matchAll(/\b(?:component-url|renderer-url)=["']([^"']+)["']/gi)) specifiers.add(match[1]);
	for (const match of source.matchAll(/\bimport\s*(?:\(|[^"']*?\bfrom\s*)["']([^"']+)["']/g)) specifiers.add(match[1]);
	for (const match of source.matchAll(/\bimport\s*["']([^"']+)["']/g)) specifiers.add(match[1]);
	return specifiers;
}

function inlineScripts(html) {
	return [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
}

function collectJs(htmlFile) {
	const visited = new Set();
	const queue = [];
	const html = readFileSync(htmlFile, 'utf8');
	for (const specifier of referencedScripts(html)) {
		const file = localPath(specifier, htmlFile);
		if (file) queue.push(file);
	}

	while (queue.length > 0) {
		const file = normalize(queue.shift());
		if (visited.has(file)) continue;
		visited.add(file);
		let source;
		try {
			source = readFileSync(file, 'utf8');
		} catch {
			continue;
		}
		for (const specifier of referencedScripts(source)) {
			const dependency = localPath(specifier, file);
			if (dependency && !visited.has(dependency)) queue.push(dependency);
		}
	}

	const files = [...visited].filter((file) => {
		try {
			return statSync(file).isFile();
		} catch {
			return false;
		}
	});
	const externalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
	const externalGzipBytes = files.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0);
	const inline = inlineScripts(html);
	const inlineBytes = inline.reduce((sum, script) => sum + Buffer.byteLength(script), 0);
	const inlineGzipBytes = inline.reduce((sum, script) => sum + gzipSync(script).length, 0);
	return { files, externalBytes, externalGzipBytes, inlineBytes, inlineGzipBytes };
}

const rows = routes.map((route) => {
	const { files, externalBytes, externalGzipBytes, inlineBytes, inlineGzipBytes } = collectJs(routeFile(route));
	return {
		label,
		route,
		externalJsBytes: externalBytes,
		inlineJsBytes: inlineBytes,
		totalJsBytes: externalBytes + inlineBytes,
		gzipJsBytes: externalGzipBytes + inlineGzipBytes,
		files: files.map((file) => relative(root, file)),
	};
});

console.log(JSON.stringify(rows, null, 2));
console.log('\nRoute\tRaw JS\tGzip JS\tExternal JS\tInline JS\tFiles');
for (const row of rows) {
	console.log(
		`${row.route}\t${row.totalJsBytes}\t${row.gzipJsBytes}\t${row.externalJsBytes}\t${row.inlineJsBytes}\t${row.files.length}`,
	);
}
