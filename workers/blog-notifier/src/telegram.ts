import { parsePreferences } from './preferences.ts';
import type { NotificationMessage } from './runtime';

export type BotCommand = 'help' | 'settings' | 'start' | 'stop';

export interface InlineKeyboardButton {
	callback_data: string;
	text: string;
}

export interface InlineKeyboardMarkup {
	inline_keyboard: InlineKeyboardButton[][];
}

export interface TelegramMessage {
	chat: {
		id: number;
		type: string;
	};
	message_id: number;
	text?: string;
}

export interface TelegramCallbackQuery {
	data?: string;
	from: {
		id: number;
	};
	id: string;
	message?: TelegramMessage;
}

export interface TelegramUpdate {
	callback_query?: TelegramCallbackQuery;
	message?: TelegramMessage;
}

export interface TelegramApiResponse {
	description?: string;
	error_code?: number;
	ok: boolean;
	parameters?: {
		retry_after?: number;
	};
}

export function parseCommand(text: string): BotCommand | undefined {
	const token = text.trim().split(/\s+/, 1)[0]?.toLowerCase();
	const command = token?.split('@', 1)[0];

	if (command === '/start') return 'start';
	if (command === '/settings') return 'settings';
	if (command === '/stop') return 'stop';
	if (command === '/help') return 'help';
	return undefined;
}

export function buildPreferenceKeyboard(preferences: string): InlineKeyboardMarkup {
	const selected = parsePreferences(preferences);
	const isAll = selected === 'all';
	const button = (key: string, label: string, active: boolean): InlineKeyboardButton => ({
		callback_data: `prefs:${key}`,
		text: `${active ? '✅' : '◻️'} ${label}`,
	});

	return {
		inline_keyboard: [
			[button('all', 'All posts', isAll)],
			[
				button('work', 'Work', !isAll && selected.has('work')),
				button('systems', 'Systems', !isAll && selected.has('systems')),
			],
			[button('dev', 'Dev', !isAll && selected.has('dev')), button('life', 'Life', !isAll && selected.has('life'))],
		],
	};
}

export function formatNotification(message: NotificationMessage): string {
	const description = message.description.trim();
	const shortenedDescription = description.length > 800 ? `${description.slice(0, 797).trimEnd()}...` : description;
	const parts = [`New post: ${message.title}`];

	if (shortenedDescription) parts.push(shortenedDescription);
	parts.push(message.url);

	return parts.join('\n\n');
}

async function telegramRequest(
	botToken: string,
	method: string,
	body: Record<string, unknown>,
): Promise<TelegramApiResponse> {
	if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not configured.');

	const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	try {
		return (await response.json()) as TelegramApiResponse;
	} catch {
		return {
			ok: false,
			error_code: response.status,
			description: `Telegram returned HTTP ${response.status}.`,
		};
	}
}

export function sendTelegramMessage(
	botToken: string,
	chatId: string,
	text: string,
	replyMarkup?: InlineKeyboardMarkup,
): Promise<TelegramApiResponse> {
	return telegramRequest(botToken, 'sendMessage', {
		chat_id: chatId,
		text,
		...(replyMarkup ? { reply_markup: replyMarkup } : {}),
	});
}

export function answerTelegramCallback(
	botToken: string,
	callbackQueryId: string,
	text?: string,
): Promise<TelegramApiResponse> {
	return telegramRequest(botToken, 'answerCallbackQuery', {
		callback_query_id: callbackQueryId,
		...(text ? { text } : {}),
	});
}

export function editTelegramReplyMarkup(
	botToken: string,
	chatId: string,
	messageId: number,
	replyMarkup: InlineKeyboardMarkup,
): Promise<TelegramApiResponse> {
	return telegramRequest(botToken, 'editMessageReplyMarkup', {
		chat_id: chatId,
		message_id: messageId,
		reply_markup: replyMarkup,
	});
}
