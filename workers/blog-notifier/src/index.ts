import { runFeedCheck } from './handlers/feed';
import { processNotificationQueue } from './handlers/notifications';
import { handleTelegramWebhook } from './handlers/telegram';
import type { Env, ExecutionContextLike, QueueBatch } from './runtime';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContextLike): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'GET' && url.pathname === '/health') {
			return Response.json({ ok: true });
		}

		if (request.method === 'POST' && url.pathname === '/telegram/webhook') {
			return handleTelegramWebhook(request, env, ctx);
		}

		return new Response('Not found', { status: 404 });
	},

	async scheduled(_controller: unknown, env: Env, ctx: ExecutionContextLike): Promise<void> {
		ctx.waitUntil(runFeedCheck(env));
	},

	async queue(batch: QueueBatch<unknown>, env: Env): Promise<void> {
		await processNotificationQueue(batch, env);
	},
};
