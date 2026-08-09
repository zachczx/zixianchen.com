import { shouldNotify } from '../preferences';
import {
	ensureSchema,
	isFeedInitialized,
	listSeenPostGuids,
	listSubscribers,
	markPostSeen,
	seedExistingPosts,
} from '../repositories/notifier';
import { parseRss } from '../rss';
import type { Env, NotificationMessage } from '../runtime';

const QUEUE_BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
	return chunks;
}

export async function runFeedCheck(env: Env): Promise<void> {
	await ensureSchema(env.DB);

	const response = await fetch(env.RSS_URL);
	if (!response.ok) throw new Error(`RSS fetch failed with HTTP ${response.status}.`);

	const posts = parseRss(await response.text());
	if (posts.length === 0) throw new Error('RSS feed contained no readable posts.');

	if (!(await isFeedInitialized(env.DB))) {
		await seedExistingPosts(env.DB, posts);
		return;
	}

	const seen = await listSeenPostGuids(env.DB);
	const newPosts = posts.filter((post) => !seen.has(post.guid)).reverse();
	if (newPosts.length === 0) return;

	const subscribers = await listSubscribers(env.DB);

	for (const post of newPosts) {
		const notifications: NotificationMessage[] = subscribers
			.filter(({ categories }) => shouldNotify(categories, post.category))
			.map(({ chat_id }) => ({
				category: post.category,
				chatId: chat_id,
				description: post.description,
				guid: post.guid,
				title: post.title,
				url: post.url,
			}));

		for (const notificationBatch of chunk(notifications, QUEUE_BATCH_SIZE)) {
			await env.NOTIFICATIONS.sendBatch(notificationBatch.map((body) => ({ body })));
		}

		await markPostSeen(env.DB, post.guid);
	}
}
