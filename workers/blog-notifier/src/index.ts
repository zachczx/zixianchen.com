import {
	describePreferences,
	parsePreferenceCallback,
	shouldNotify,
	togglePreference,
} from './preferences';
import { parseRss } from './rss';
import type { Env, ExecutionContextLike, NotificationMessage, QueueBatch } from './runtime';
import {
	answerTelegramCallback,
	buildPreferenceKeyboard,
	editTelegramReplyMarkup,
	formatNotification,
	parseCommand,
	sendTelegramMessage,
	type InlineKeyboardMarkup,
	type TelegramApiResponse,
	type TelegramCallbackQuery,
	type TelegramUpdate,
} from './telegram';

const INITIALIZED_KEY = 'rss_initialized';
const STOP_MESSAGE = "Notifications stopped. Send /start anytime if you'd like to subscribe again.";
const HELP_MESSAGE = 'Use /start to subscribe, /settings to choose post categories, or /stop to turn notifications off.';
const QUEUE_BATCH_SIZE = 100;
const D1_MAX_BOUND_PARAMETERS = 100;

interface SubscriberRow {
	categories: string;
	chat_id: string;
}

let schemaReady: Promise<void> | undefined;

function ensureSchema(env: Env): Promise<void> {
	if (!schemaReady) {
		schemaReady = env.DB.batch([
			env.DB.prepare(`
				CREATE TABLE IF NOT EXISTS subscribers (
					chat_id TEXT PRIMARY KEY,
					subscribed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
					categories TEXT NOT NULL DEFAULT 'all'
				)
			`),
			env.DB.prepare(`
				CREATE TABLE IF NOT EXISTS seen_posts (
					guid TEXT PRIMARY KEY,
					first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
				)
			`),
			env.DB.prepare(`
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

function logTelegramError(context: string, response: TelegramApiResponse): void {
	console.error(context, response.error_code ?? 'unknown', response.description ?? 'Unknown Telegram error');
}

function reply(
	env: Env,
	ctx: ExecutionContextLike,
	chatId: string,
	text: string,
	replyMarkup?: InlineKeyboardMarkup,
): void {
	ctx.waitUntil(
		sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, text, replyMarkup)
			.then((response) => {
				if (!response.ok) logTelegramError('Telegram reply failed:', response);
			})
			.catch((error) => console.error('Telegram reply failed:', error)),
	);
}

function settingsMessage(preferences: string, justSubscribed = false): string {
	const heading = justSubscribed
		? "You're subscribed. I'll message you when I publish something new."
		: 'Notification settings';

	return `${heading}\n\nCurrently: ${describePreferences(preferences)}\n\nChoose what you'd like updates for:`;
}

async function getSubscriber(env: Env, chatId: string): Promise<SubscriberRow | null> {
	return env.DB.prepare('SELECT chat_id, categories FROM subscribers WHERE chat_id = ?')
		.bind(chatId)
		.first<SubscriberRow>();
}

async function handlePreferenceCallback(
	callbackQuery: TelegramCallbackQuery,
	env: Env,
	ctx: ExecutionContextLike,
): Promise<Response> {
	const message = callbackQuery.message;
	const preferenceKey = callbackQuery.data ? parsePreferenceCallback(callbackQuery.data) : undefined;

	if (!message || message.chat.type !== 'private' || String(callbackQuery.from.id) !== String(message.chat.id)) {
		await answerTelegramCallback(env.TELEGRAM_BOT_TOKEN, callbackQuery.id);
		return new Response('ok');
	}

	if (!preferenceKey) {
		await answerTelegramCallback(env.TELEGRAM_BOT_TOKEN, callbackQuery.id, 'That setting is no longer available.');
		return new Response('ok');
	}

	await ensureSchema(env);

	const chatId = String(message.chat.id);
	const subscriber = await getSubscriber(env, chatId);
	if (!subscriber) {
		await answerTelegramCallback(env.TELEGRAM_BOT_TOKEN, callbackQuery.id, 'Send /start to subscribe first.');
		return new Response('ok');
	}

	const update = togglePreference(subscriber.categories, preferenceKey);
	if (update.changed) {
		await env.DB.prepare('UPDATE subscribers SET categories = ? WHERE chat_id = ?')
			.bind(update.value, chatId)
			.run();
	}

	await answerTelegramCallback(env.TELEGRAM_BOT_TOKEN, callbackQuery.id, update.message);

	if (update.changed) {
		ctx.waitUntil(
			editTelegramReplyMarkup(
				env.TELEGRAM_BOT_TOKEN,
				chatId,
				message.message_id,
				buildPreferenceKeyboard(update.value),
			)
				.then((response) => {
					if (!response.ok) logTelegramError('Telegram settings update failed:', response);
				})
				.catch((error) => console.error('Telegram settings update failed:', error)),
		);
	}

	return new Response('ok');
}

async function handleWebhook(request: Request, env: Env, ctx: ExecutionContextLike): Promise<Response> {
	const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
	if (!env.TELEGRAM_WEBHOOK_SECRET || secret !== env.TELEGRAM_WEBHOOK_SECRET) {
		return new Response('Unauthorized', { status: 401 });
	}

	let update: TelegramUpdate;
	try {
		update = (await request.json()) as TelegramUpdate;
	} catch {
		return new Response('Invalid JSON', { status: 400 });
	}

	if (update.callback_query) return handlePreferenceCallback(update.callback_query, env, ctx);

	const message = update.message;
	if (!message?.text || message.chat.type !== 'private') return new Response('ok');

	await ensureSchema(env);

	const chatId = String(message.chat.id);
	const command = parseCommand(message.text);

	if (command === 'start') {
		await env.DB.prepare(
			`INSERT INTO subscribers (chat_id, subscribed_at, categories)
			 VALUES (?, CURRENT_TIMESTAMP, 'all')
			 ON CONFLICT(chat_id) DO UPDATE SET subscribed_at = CURRENT_TIMESTAMP`,
		)
			.bind(chatId)
			.run();

		const subscriber = await getSubscriber(env, chatId);
		const preferences = subscriber?.categories ?? 'all';
		reply(env, ctx, chatId, settingsMessage(preferences, true), buildPreferenceKeyboard(preferences));
		return new Response('ok');
	}

	if (command === 'settings') {
		const subscriber = await getSubscriber(env, chatId);
		if (!subscriber) {
			reply(env, ctx, chatId, 'You are not subscribed yet. Send /start to get new-post notifications.');
			return new Response('ok');
		}

		reply(env, ctx, chatId, settingsMessage(subscriber.categories), buildPreferenceKeyboard(subscriber.categories));
		return new Response('ok');
	}

	if (command === 'stop') {
		await env.DB.prepare('DELETE FROM subscribers WHERE chat_id = ?').bind(chatId).run();
		reply(env, ctx, chatId, STOP_MESSAGE);
		return new Response('ok');
	}

	reply(env, ctx, chatId, HELP_MESSAGE);
	return new Response('ok');
}

function chunk<T>(items: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
	return chunks;
}

async function seedExistingPosts(env: Env, posts: { guid: string }[]): Promise<void> {
	const statements = chunk(
		posts.map((post) => post.guid),
		D1_MAX_BOUND_PARAMETERS,
	).map((guids) => {
		const placeholders = guids.map(() => '(?)').join(', ');
		return env.DB.prepare(`INSERT OR IGNORE INTO seen_posts (guid) VALUES ${placeholders}`).bind(...guids);
	});
	statements.push(env.DB.prepare('INSERT OR REPLACE INTO state (key, value) VALUES (?, ?)').bind(INITIALIZED_KEY, '1'));
	await env.DB.batch(statements);
}

async function runFeedCheck(env: Env): Promise<void> {
	await ensureSchema(env);

	const response = await fetch(env.RSS_URL);
	if (!response.ok) throw new Error(`RSS fetch failed with HTTP ${response.status}.`);

	const posts = parseRss(await response.text());
	if (posts.length === 0) throw new Error('RSS feed contained no readable posts.');

	const initialized = await env.DB.prepare('SELECT value FROM state WHERE key = ?')
		.bind(INITIALIZED_KEY)
		.first<{ value: string }>();

	if (!initialized) {
		await seedExistingPosts(env, posts);
		return;
	}

	const seenResult = await env.DB.prepare('SELECT guid FROM seen_posts').all<{ guid: string }>();
	const seen = new Set(seenResult.results.map((row) => row.guid));
	const newPosts = posts.filter((post) => !seen.has(post.guid)).reverse();
	if (newPosts.length === 0) return;

	const subscriberResult = await env.DB.prepare('SELECT chat_id, categories FROM subscribers').all<SubscriberRow>();

	for (const post of newPosts) {
		const notifications: NotificationMessage[] = subscriberResult.results
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

		await env.DB.prepare('INSERT OR IGNORE INTO seen_posts (guid) VALUES (?)').bind(post.guid).run();
	}
}

function isNotificationMessage(value: unknown): value is NotificationMessage {
	if (!value || typeof value !== 'object') return false;

	const candidate = value as Partial<NotificationMessage>;
	return (
		(candidate.category === undefined || typeof candidate.category === 'string') &&
		typeof candidate.chatId === 'string' &&
		typeof candidate.description === 'string' &&
		typeof candidate.guid === 'string' &&
		typeof candidate.title === 'string' &&
		typeof candidate.url === 'string' &&
		Boolean(candidate.chatId && candidate.guid && candidate.title && candidate.url)
	);
}

async function handleQueuedNotification(message: NotificationMessage, env: Env): Promise<TelegramApiResponse | null> {
	const subscriber = await getSubscriber(env, message.chatId);
	if (!subscriber || !shouldNotify(subscriber.categories, message.category)) return null;

	return sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, message.chatId, formatNotification(message));
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContextLike): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'GET' && url.pathname === '/health') {
			return Response.json({ ok: true });
		}

		if (request.method === 'POST' && url.pathname === '/telegram/webhook') {
			return handleWebhook(request, env, ctx);
		}

		return new Response('Not found', { status: 404 });
	},

	async scheduled(_controller: unknown, env: Env, ctx: ExecutionContextLike): Promise<void> {
		ctx.waitUntil(runFeedCheck(env));
	},

	async queue(batch: QueueBatch<unknown>, env: Env): Promise<void> {
		await ensureSchema(env);

		for (const queuedMessage of batch.messages) {
			const notification = queuedMessage.body;
			if (!isNotificationMessage(notification)) {
				console.error('Discarding malformed notification message.');
				queuedMessage.ack();
				continue;
			}

			let response: TelegramApiResponse | null;
			try {
				response = await handleQueuedNotification(notification, env);
			} catch (error) {
				console.error('Telegram request failed:', error);
				queuedMessage.retry();
				continue;
			}

			if (!response || response.ok) {
				queuedMessage.ack();
				continue;
			}

			if (response.error_code === 403) {
				await env.DB.prepare('DELETE FROM subscribers WHERE chat_id = ?').bind(notification.chatId).run();
				queuedMessage.ack();
				continue;
			}

			if (response.error_code === 429) {
				const retryAfter = Math.min(Math.max(response.parameters?.retry_after ?? 10, 1), 86_400);
				queuedMessage.retry({ delaySeconds: retryAfter });
				continue;
			}

			if (!response.error_code || response.error_code >= 500) {
				queuedMessage.retry();
				continue;
			}

			logTelegramError('Discarding permanent Telegram error:', response);
			queuedMessage.ack();
		}
	},
};
