---
title: 'Excluding node_modules From Backblaze Backups on Windows'
description: 'The Backblaze exclusion rules that finally worked for my node_modules, SvelteKit caches, Go build caches, and other development folders on Windows.'
date: '2026-06-04'
date_updated: ''
category: 'Systems'
tags:
  - Backblaze
  - backup
  - Windows
  - node_modules
published: true
slug: 'excluding-node-modules-from-backblaze-backups-windows'
---

I had to re-push my Backblaze backup recently because of a frozen state with a PEK, so I relooked at my setup. I realized that I was doing my exclusions all wrong.

My first rule used forward slashes like `/node_modules/`, which is the instinct, but Windows paths use backslashes so it never matched. Then I copied the node_modules rule from a helpful post by Kicken ([aoeex.com/phile/backblaze-custom-exclusions](https://aoeex.com/phile/backblaze-custom-exclusions/)) as-is, but it anchors to the user folder with `skipFirstCharThenStartsWith=":\Users\"` and my projects sit on a separate drive, so it matched nothing either.

## Environment

I work mainly on my Windows desktop, mostly not WSL, which is why every path uses backslashes. My stack is mostly SvelteKit with Node and pnpm, plus Go.

## The rules that worked

I ended up with two versions of this, a conservative one I started with and a broader one I'm on now. Both share the same base. These four match the folder name on any drive with `skipFirstCharThenStartsWith="*"`, which is what I want since my projects are scattered across drives.

```xml
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith="*" contains_1="\.git\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith="*" contains_1="\.svelte-kit\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith="*" contains_1="\node_modules\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith="*" contains_1="\.pnpm-store\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
```

### Conservative: name each cache

This was my first working set. On top of the base I named each build cache I knew about, one rule per folder. The Go module cache sits under my user profile, so it keeps the `:\Users\` anchor.

```xml
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith="*" contains_1="\go-build\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith="*" contains_1="\gopls\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith=":\Users\" contains_1="\go\pkg\mod\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
```

### Broader: exclude AppData\Local

The version I'm on now. Instead of naming every cache under AppData\Local, I exclude the whole folder and list the few things I want to keep in `doesNotContain`, pipe separated. That catches go-build and gopls without me having to know their names. The Go module cache still needs its own rule since it lives under the profile but outside AppData.

```xml
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith=":\Users\" contains_1="\AppData\Local\" contains_2="*" doesNotContain="Bookmarks|WindowsTerminal|MicrosoftStickyNotes|KeePass" endsWith="*" hasFileExtension="*" />
<excludefname_rule plat="win" osVers="*" ruleIsOptional="t" skipFirstCharThenStartsWith=":\Users\" contains_1="\go\pkg\mod\" contains_2="*" doesNotContain="*" endsWith="*" hasFileExtension="*" />
```

For me the carve-outs are browser bookmarks, Windows Terminal, sticky notes, and KeePass. Everything else under AppData\Local is cache I can rebuild. The trade-off is that this rule is broad, so the `doesNotContain` list is the only thing standing between me and dropping something I wanted. I went this way because I was tired of finding new cache folders one at a time.

Whichever set you pick, the rules go into:

```text
C:\ProgramData\Backblaze\bzdata\bzexcluderules_editable.xml
```

## Checking it actually worked

Backblaze's "Producing file lists" step is where it applies your exclusions to build the to-do list, so `bz_todo_*` under `C:\ProgramData\Backblaze\bzdata\bzbackup\bzdatacenter` is the result of your rules, and `bz_done_*` is what's already been sent. Search the latest `bz_todo` for a folder you excluded, and if it's gone, the rule took. Don't be like me and assume it did.

Brian from Backblaze explains the file-list step in this [r/backblaze thread](https://www.reddit.com/r/backblaze/comments/1f0itk7/stuck_on_producing_file_lists_what_should_i_do/).

Writing this down because I'll set Backblaze up again on another machine at some point and I don't want to relearn the backslash and `:\Users\` lessons a third time. If your projects don't sit under `C:\Users`, drop the anchor and match the folder name on its own.
