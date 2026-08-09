import { shouldNotify } from '../preferences';
import { ensureSchema, getSubscriber, unsubscribe } from '../repositories/notifier';
import type { Env, NotificationMessage, QueueBatch } from '../runtime';
import { formatNotification, sendTelegramMessage, type TelegramApiResponse } from '../telegram';

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

function logTelegramError(context: string, response: TelegramApiResponse): void {
	console.error(context, response.error_code ?? 'unknown', response.description ?? 'Unknown Telegram error');
}

async function sendQueuedNotification(message: NotificationMessage, env: Env): Promise<TelegramApiResponse | null> {
	const subscriber = await getSubscriber(env.DB, message.chatId);
	if (!subscriber || !shouldNotify(subscriber.categories, message.category)) return null;

	return sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, message.chatId, formatNotification(message));
}

export async function processNotificationQueue(batch: QueueBatch<unknown>, env: Env): Promise<void> {
	await ensureSchema(env.DB);

	for (const queuedMessage of batch.messages) {
		const notification = queuedMessage.body;
		if (!isNotificationMessage(notification)) {
			console.error('Discarding malformed notification message.');
			queuedMessage.ack();
			continue;
		}

		let response: TelegramApiResponse | null;
		try {
			response = await sendQueuedNotification(notification, env);
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
			await unsubscribe(env.DB, notification.chatId);
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
}
