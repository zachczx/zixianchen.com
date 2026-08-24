const CONTACT_PATH = '/api/contact';
const MAX_BODY_BYTES = 16_384;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 3_000;
const ALLOWED_FIELDS = new Set(['name', 'email', 'message', 'website']);

interface ContactSubmission {
	id: string;
	name: string;
	email: string;
	message: string;
	createdAt: string;
}

interface StoredContactSubmission extends ContactSubmission {
	notifiedAt: string | null;
}

class HttpError extends Error {
	constructor(public readonly status: number) {
		super(`Contact request failed with status ${status}`);
	}
}

function jsonResponse(success: boolean, status: number, headers: HeadersInit = {}) {
	return new Response(JSON.stringify({ success }), {
		status,
		headers: {
			'Cache-Control': 'no-store',
			'Content-Type': 'application/json; charset=utf-8',
			...headers,
		},
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readBoundedJson(request: Request): Promise<unknown> {
	const contentLength = request.headers.get('Content-Length');
	if (contentLength && Number(contentLength) > MAX_BODY_BYTES) throw new HttpError(413);
	if (!request.body) throw new HttpError(400);

	const reader = request.body.getReader();
	const decoder = new TextDecoder();
	let bytesRead = 0;
	let body = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		bytesRead += value.byteLength;
		if (bytesRead > MAX_BODY_BYTES) {
			await reader.cancel();
			throw new HttpError(413);
		}
		body += decoder.decode(value, { stream: true });
	}
	body += decoder.decode();

	try {
		return JSON.parse(body) as unknown;
	} catch {
		throw new HttpError(400);
	}
}

function validateVisibleFields(payload: Record<string, unknown>): Omit<ContactSubmission, 'id' | 'createdAt'> {
	if (Object.keys(payload).some((key) => !ALLOWED_FIELDS.has(key))) throw new HttpError(400);

	const { name, email, message } = payload;
	if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') throw new HttpError(400);

	const normalizedName = name.trim();
	const normalizedEmail = email.trim();
	const normalizedMessage = message.trim();

	if (!normalizedName || normalizedName.length > MAX_NAME_LENGTH) throw new HttpError(400);
	if (!normalizedEmail || normalizedEmail.length > MAX_EMAIL_LENGTH) throw new HttpError(400);
	if (!normalizedMessage || normalizedMessage.length > MAX_MESSAGE_LENGTH) throw new HttpError(400);
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new HttpError(400);

	return {
		name: normalizedName,
		email: normalizedEmail,
		message: normalizedMessage,
	};
}

function isQueueSubmission(value: unknown): value is ContactSubmission {
	if (!isRecord(value)) return false;
	if (Object.keys(value).some((key) => !['id', 'name', 'email', 'message', 'createdAt'].includes(key))) return false;
	if (
		typeof value.id !== 'string' ||
		typeof value.name !== 'string' ||
		typeof value.email !== 'string' ||
		typeof value.message !== 'string' ||
		typeof value.createdAt !== 'string'
	) {
		return false;
	}
	if (!value.id || value.id.length > 64 || Number.isNaN(Date.parse(value.createdAt))) return false;
	try {
		validateVisibleFields({ name: value.name, email: value.email, message: value.message });
		return true;
	} catch {
		return false;
	}
}

async function recordSpam(database: D1Database, reason: 'honeypot') {
	const day = new Date().toISOString().slice(0, 10);
	await database
		.prepare(
			`INSERT INTO contact_spam_daily (day, reason, count)
			 VALUES (?, ?, 1)
			 ON CONFLICT(day, reason) DO UPDATE SET count = count + 1`,
		)
		.bind(day, reason)
		.run();
}

function formatTelegramMessage(submission: ContactSubmission) {
	return `New message: zixianchen.com\n\nFrom: ${submission.name}\nEmail: ${submission.email}\n\n${submission.message}`;
}

async function sendTelegram(submission: ContactSubmission, env: Env): Promise<number> {
	let response: Response;
	try {
		response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: env.TELEGRAM_CHAT_ID,
				text: formatTelegramMessage(submission),
			}),
		});
	} catch {
		throw new Error('Telegram request failed');
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch {
		throw new Error(`Telegram returned an unreadable response (${response.status})`);
	}

	if (!response.ok || !isRecord(body) || body.ok !== true || !isRecord(body.result)) {
		throw new Error(`Telegram rejected the notification (${response.status})`);
	}
	if (typeof body.result.message_id !== 'number') throw new Error('Telegram response did not include a message ID');
	return body.result.message_id;
}

async function persistAndNotify(submission: ContactSubmission, env: Env) {
	await env.CONTACT_DB.prepare(
		`INSERT OR IGNORE INTO contact_submissions (id, name, email, message, created_at)
		 VALUES (?, ?, ?, ?, ?)`,
	)
		.bind(submission.id, submission.name, submission.email, submission.message, submission.createdAt)
		.run();

	const stored = await env.CONTACT_DB.prepare(
		`SELECT id, name, email, message, created_at AS "createdAt", notified_at AS "notifiedAt"
		 FROM contact_submissions
		 WHERE id = ?`,
	)
		.bind(submission.id)
		.first<StoredContactSubmission>();
	if (!stored) throw new Error('Queued submission was not persisted');
	if (stored.notifiedAt) return;

	const telegramMessageId = await sendTelegram(stored, env);
	await env.CONTACT_DB.prepare(
		`UPDATE contact_submissions
		 SET notified_at = ?, telegram_message_id = ?
		 WHERE id = ? AND notified_at IS NULL`,
	)
		.bind(new Date().toISOString(), telegramMessageId, stored.id)
		.run();
}

async function handleContact(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	if (request.method !== 'POST') return jsonResponse(false, 405, { Allow: 'POST' });

	const requestOrigin = request.headers.get('Origin');
	if (requestOrigin !== new URL(request.url).origin) return jsonResponse(false, 403);

	const contentType = request.headers.get('Content-Type')?.split(';', 1)[0]?.trim().toLowerCase();
	if (contentType !== 'application/json') return jsonResponse(false, 415);

	let payload: unknown;
	try {
		payload = await readBoundedJson(request);
	} catch (error) {
		if (error instanceof HttpError) return jsonResponse(false, error.status);
		throw error;
	}
	if (!isRecord(payload)) return jsonResponse(false, 400);

	if (typeof payload.website !== 'undefined' && typeof payload.website !== 'string') return jsonResponse(false, 400);
	if (typeof payload.website === 'string' && payload.website.trim()) {
		ctx.waitUntil(
			recordSpam(env.CONTACT_DB, 'honeypot').catch((error: unknown) => {
				console.error('Failed to record contact spam telemetry', error);
			}),
		);
		return jsonResponse(true, 202);
	}

	let visibleFields: Omit<ContactSubmission, 'id' | 'createdAt'>;
	try {
		visibleFields = validateVisibleFields(payload);
	} catch (error) {
		if (error instanceof HttpError) return jsonResponse(false, error.status);
		throw error;
	}

	const submission: ContactSubmission = {
		id: crypto.randomUUID(),
		...visibleFields,
		createdAt: new Date().toISOString(),
	};

	try {
		await env.CONTACT_QUEUE.send(submission);
	} catch (error) {
		console.error('Failed to enqueue contact submission', { id: submission.id, error });
		return jsonResponse(false, 503);
	}

	return jsonResponse(true, 202);
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		if (url.pathname === CONTACT_PATH) return handleContact(request, env, ctx);
		return env.ASSETS.fetch(request);
	},

	async queue(batch, env) {
		for (const message of batch.messages) {
			if (!isQueueSubmission(message.body)) {
				console.error('Discarding malformed contact queue message', { messageId: message.id });
				message.ack();
				continue;
			}

			try {
				await persistAndNotify(message.body, env);
				message.ack();
			} catch (error) {
				console.error('Contact queue processing failed', { id: message.body.id, error });
				message.retry();
			}
		}
	},
} satisfies ExportedHandler<Env>;
