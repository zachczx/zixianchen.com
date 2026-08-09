import type { D1DatabaseBinding, D1Statement } from '../runtime';

const INITIALIZED_KEY = 'rss_initialized';
const D1_MAX_BOUND_PARAMETERS = 100;

export interface Subscriber {
	categories: string;
	chat_id: string;
}

let schemaReady: Promise<void> | undefined;

function chunk<T>(items: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
	return chunks;
}

export function ensureSchema(db: D1DatabaseBinding): Promise<void> {
	if (!schemaReady) {
		schemaReady = db
			.batch([
				db.prepare(`
					CREATE TABLE IF NOT EXISTS subscribers (
						chat_id TEXT PRIMARY KEY,
						subscribed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
						categories TEXT NOT NULL DEFAULT 'all'
					)
				`),
				db.prepare(`
					CREATE TABLE IF NOT EXISTS seen_posts (
						guid TEXT PRIMARY KEY,
						first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
					)
				`),
				db.prepare(`
					CREATE TABLE IF NOT EXISTS state (
						key TEXT PRIMARY KEY,
						value TEXT NOT NULL
					)
				`),
			])
			.then(() => undefined)
			.catch((error) => {
				schemaReady = undefined;
				throw error;
			});
	}

	return schemaReady;
}

export async function getSubscriber(db: D1DatabaseBinding, chatId: string): Promise<Subscriber | null> {
	return db.prepare('SELECT chat_id, categories FROM subscribers WHERE chat_id = ?').bind(chatId).first<Subscriber>();
}

export async function subscribe(db: D1DatabaseBinding, chatId: string): Promise<void> {
	await db
		.prepare(
			`INSERT INTO subscribers (chat_id, subscribed_at, categories)
			 VALUES (?, CURRENT_TIMESTAMP, 'all')
			 ON CONFLICT(chat_id) DO UPDATE SET subscribed_at = CURRENT_TIMESTAMP`,
		)
		.bind(chatId)
		.run();
}

export async function unsubscribe(db: D1DatabaseBinding, chatId: string): Promise<void> {
	await db.prepare('DELETE FROM subscribers WHERE chat_id = ?').bind(chatId).run();
}

export async function updateSubscriberCategories(
	db: D1DatabaseBinding,
	chatId: string,
	categories: string,
): Promise<void> {
	await db.prepare('UPDATE subscribers SET categories = ? WHERE chat_id = ?').bind(categories, chatId).run();
}

export async function listSubscribers(db: D1DatabaseBinding): Promise<Subscriber[]> {
	const result = await db.prepare('SELECT chat_id, categories FROM subscribers').all<Subscriber>();
	return result.results;
}

export async function isFeedInitialized(db: D1DatabaseBinding): Promise<boolean> {
	const row = await db.prepare('SELECT value FROM state WHERE key = ?').bind(INITIALIZED_KEY).first<{ value: string }>();
	return Boolean(row);
}

export async function seedExistingPosts(db: D1DatabaseBinding, posts: readonly { guid: string }[]): Promise<void> {
	const statements: D1Statement[] = chunk(
		posts.map((post) => post.guid),
		D1_MAX_BOUND_PARAMETERS,
	).map((guids) => {
		const placeholders = guids.map(() => '(?)').join(', ');
		return db.prepare(`INSERT OR IGNORE INTO seen_posts (guid) VALUES ${placeholders}`).bind(...guids);
	});

	statements.push(db.prepare('INSERT OR REPLACE INTO state (key, value) VALUES (?, ?)').bind(INITIALIZED_KEY, '1'));
	await db.batch(statements);
}

export async function listSeenPostGuids(db: D1DatabaseBinding): Promise<Set<string>> {
	const result = await db.prepare('SELECT guid FROM seen_posts').all<{ guid: string }>();
	return new Set(result.results.map((row) => row.guid));
}

export async function markPostSeen(db: D1DatabaseBinding, guid: string): Promise<void> {
	await db.prepare('INSERT OR IGNORE INTO seen_posts (guid) VALUES (?)').bind(guid).run();
}
