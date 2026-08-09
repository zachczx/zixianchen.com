export type D1Value = string | number | null;

export interface D1Result<T = Record<string, unknown>> {
	results: T[];
}

export interface D1Statement {
	bind(...values: D1Value[]): D1Statement;
	first<T = Record<string, unknown>>(): Promise<T | null>;
	all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
	run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

export interface D1DatabaseBinding {
	prepare(query: string): D1Statement;
	batch(statements: D1Statement[]): Promise<D1Result[]>;
}

export interface QueueBinding<T> {
	sendBatch(messages: { body: T }[]): Promise<unknown>;
}

export interface QueueMessage<T> {
	readonly body: T;
	ack(): void;
	retry(options?: { delaySeconds?: number }): void;
}

export interface QueueBatch<T> {
	readonly messages: readonly QueueMessage<T>[];
}

export interface ExecutionContextLike {
	waitUntil(promise: Promise<unknown>): void;
}

export interface Env {
	DB: D1DatabaseBinding;
	NOTIFICATIONS: QueueBinding<NotificationMessage>;
	RSS_URL: string;
	TELEGRAM_BOT_TOKEN: string;
	TELEGRAM_WEBHOOK_SECRET: string;
}

export interface NotificationMessage {
	category?: string;
	chatId: string;
	description: string;
	guid: string;
	title: string;
	url: string;
}
