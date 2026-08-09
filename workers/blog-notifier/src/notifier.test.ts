import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePreferenceCallback, shouldNotify, togglePreference } from './preferences.ts';
import { parseRss } from './rss.ts';
import { buildPreferenceKeyboard, formatNotification, parseCommand, SETTINGS_DONE_CALLBACK } from './telegram.ts';

test('parseRss reads categories and decodes escaped metadata', () => {
	const posts = parseRss(`<?xml version="1.0"?>
<rss><channel>
	<item>
		<title>Newest &amp; useful</title>
		<link>https://zixianchen.com/blog/newest</link>
		<guid isPermaLink="true">https://zixianchen.com/blog/newest</guid>
		<description>One &lt; two &amp; three</description>
		<category>Systems</category>
	</item>
	<item>
		<title>Backdated post</title>
		<link>https://zixianchen.com/blog/backdated</link>
		<guid isPermaLink="true">https://zixianchen.com/blog/backdated</guid>
		<description>Still needs to be detected.</description>
	</item>
</channel></rss>`);

	assert.deepEqual(posts, [
		{
			category: 'Systems',
			description: 'One < two & three',
			guid: 'https://zixianchen.com/blog/newest',
			title: 'Newest & useful',
			url: 'https://zixianchen.com/blog/newest',
		},
		{
			category: undefined,
			description: 'Still needs to be detected.',
			guid: 'https://zixianchen.com/blog/backdated',
			title: 'Backdated post',
			url: 'https://zixianchen.com/blog/backdated',
		},
	]);
});

test('parseCommand accepts Telegram command suffixes and settings', () => {
	assert.equal(parseCommand('/start'), 'start');
	assert.equal(parseCommand('/start follow-blog'), 'start');
	assert.equal(parseCommand('/settings'), 'settings');
	assert.equal(parseCommand('/stop@zixianchen_blog_bot'), 'stop');
	assert.equal(parseCommand('/help'), 'help');
	assert.equal(parseCommand('hello'), undefined);
});

test('category preferences default to all and support multiple selections', () => {
	assert.deepEqual(togglePreference('all', 'work'), { changed: true, value: 'work' });
	assert.deepEqual(togglePreference('work', 'systems'), { changed: true, value: 'work,systems' });
	assert.deepEqual(togglePreference('work,systems', 'work'), { changed: true, value: 'systems' });
	assert.deepEqual(togglePreference('systems', 'systems'), {
		changed: false,
		message: 'Choose at least one category, or use /stop.',
		value: 'systems',
	});
	assert.deepEqual(togglePreference('systems', 'all'), { changed: true, value: 'all' });
});

test('category matching only filters subscribers with specific preferences', () => {
	assert.equal(shouldNotify('all', 'Dev'), true);
	assert.equal(shouldNotify('work,systems', 'Systems'), true);
	assert.equal(shouldNotify('work,systems', 'Life'), false);
	assert.equal(shouldNotify('work,systems', undefined), false);
});

test('preference callback and keyboard state are deterministic', () => {
	assert.equal(parsePreferenceCallback('prefs:life'), 'life');
	assert.equal(parsePreferenceCallback(SETTINGS_DONE_CALLBACK), undefined);
	assert.equal(parsePreferenceCallback('other:life'), undefined);
	assert.deepEqual(
		buildPreferenceKeyboard('work,life').inline_keyboard.map((row) => row.map(({ text }) => text)),
		[['◻️ All posts'], ['✅ Work', '◻️ Systems'], ['◻️ Dev', '✅ Life'], ['Done']],
	);
	assert.equal(buildPreferenceKeyboard('work,life').inline_keyboard.at(-1)?.[0]?.callback_data, SETTINGS_DONE_CALLBACK);
});

test('formatNotification keeps the message simple and includes the post URL', () => {
	assert.equal(
		formatNotification({
			category: 'Dev',
			chatId: '123',
			description: 'A short summary.',
			guid: 'post-1',
			title: 'A new post',
			url: 'https://zixianchen.com/blog/a-new-post',
		}),
		'New post: A new post\n\nA short summary.\n\nhttps://zixianchen.com/blog/a-new-post',
	);
});
