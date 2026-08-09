import { parsePreferenceCallback, togglePreference } from '../preferences';
import {
	ensureSchema,
	getSubscriber,
	subscribe,
	unsubscribe,
	updateSubscriberCategories,
} from '../repositories/notifier';
import type { Env, ExecutionContextLike } from '../runtime';
import {
	answerTelegramCallback,
	buildPreferenceKeyboard,
	editTelegramReplyMarkup,
	parseCommand,
	sendTelegramMessage,
	type InlineKeyboardMarkup,
	type TelegramApiResponse,
	type TelegramCallbackQuery,
	type TelegramUpdate,
} from '../telegram';

const STOP_MESSAGE = "Notifications stopped. Send /start anytime if you'd like to subscribe again.";
const HELP_MESSAGE =
	'Use /start to subscribe, /settings to choose post categories, or /stop to turn notifications off.';

function logTelegramError(context: string, response: TelegramApiResponse): void {
	console.error(context, response.error_code ?? 'unknown', response.description ?? 'Unknown Telegram error');
}

async function acknowledgeCallback(env: Env, callbackQueryId: string, text?: string): Promise<void> {
	try {
		const response = await answerTelegramCallback(env.TELEGRAM_BOT_TOKEN, callbackQueryId, text);
		if (!response.ok) logTelegramError('Telegram callback acknowledgement failed:', response);
	} catch (error) {
		console.error('Telegram callback acknowledgement failed:', error);
	}
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

function settingsMessage(justSubscribed = false): string {
	const heading = justSubscribed
		? "You're subscribed. I'll message you when I publish something new."
		: 'Notification settings';

	return `${heading}\n\nChoose what you'd like updates for:`;
}

async function handlePreferenceCallback(
	callbackQuery: TelegramCallbackQuery,
	env: Env,
	ctx: ExecutionContextLike,
): Promise<Response> {
	const message = callbackQuery.message;
	const preferenceKey = callbackQuery.data ? parsePreferenceCallback(callbackQuery.data) : undefined;

	if (!message || message.chat.type !== 'private' || String(callbackQuery.from.id) !== String(message.chat.id)) {
		await acknowledgeCallback(env, callbackQuery.id);
		return new Response('ok');
	}

	if (!preferenceKey) {
		await acknowledgeCallback(env, callbackQuery.id, 'That setting is no longer available.');
		return new Response('ok');
	}

	await ensureSchema(env.DB);

	const chatId = String(message.chat.id);
	const subscriber = await getSubscriber(env.DB, chatId);
	if (!subscriber) {
		await acknowledgeCallback(env, callbackQuery.id, 'Send /start to subscribe first.');
		return new Response('ok');
	}

	const update = togglePreference(subscriber.categories, preferenceKey);
	if (update.changed) await updateSubscriberCategories(env.DB, chatId, update.value);

	await acknowledgeCallback(env, callbackQuery.id, update.message);

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

export async function handleTelegramWebhook(
	request: Request,
	env: Env,
	ctx: ExecutionContextLike,
): Promise<Response> {
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

	await ensureSchema(env.DB);

	const chatId = String(message.chat.id);
	const command = parseCommand(message.text);

	if (command === 'start') {
		await subscribe(env.DB, chatId);
		const subscriber = await getSubscriber(env.DB, chatId);
		reply(env, ctx, chatId, settingsMessage(true), buildPreferenceKeyboard(subscriber?.categories ?? 'all'));
		return new Response('ok');
	}

	if (command === 'settings') {
		const subscriber = await getSubscriber(env.DB, chatId);
		if (!subscriber) {
			reply(env, ctx, chatId, 'You are not subscribed yet. Send /start to get new-post notifications.');
			return new Response('ok');
		}

		reply(env, ctx, chatId, settingsMessage(), buildPreferenceKeyboard(subscriber.categories));
		return new Response('ok');
	}

	if (command === 'stop') {
		await unsubscribe(env.DB, chatId);
		reply(env, ctx, chatId, STOP_MESSAGE);
		return new Response('ok');
	}

	reply(env, ctx, chatId, HELP_MESSAGE);
	return new Response('ok');
}
