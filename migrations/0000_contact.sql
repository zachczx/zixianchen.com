CREATE TABLE IF NOT EXISTS contact_submissions (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	message TEXT NOT NULL,
	created_at TEXT NOT NULL,
	notified_at TEXT,
	telegram_message_id INTEGER
);

CREATE TABLE IF NOT EXISTS contact_spam_daily (
	day TEXT NOT NULL,
	reason TEXT NOT NULL,
	count INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (day, reason)
);
