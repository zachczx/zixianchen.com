export function replaceState(url: URL | string, state: unknown) {
	history.replaceState(state, '', url);
}
