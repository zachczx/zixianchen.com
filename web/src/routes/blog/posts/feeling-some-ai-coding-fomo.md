---
title: 'Feeling Some AI Coding FOMO'
description: "Just writing down how I've been feeling about AI coding tools lately."
date: '2026-04-11'
date_updated: ''
category: 'Life'
tags:
  - AI
  - FOMO
published: true
slug: 'feeling-some-ai-coding-fomo'
---

This isn't really a technical post, it's just me writing down how I've been feeling about AI coding tools lately, mostly so I can look back on it later and see whether any of it still made sense. I'm a nobody, I'm not an influencer, I don't write code for a living, and I'm not pretending to have any broader point to make. I just like to learn, code, and watch videos from smart people.

I just really wanted to add my own small experience to the pile.

For the past few years, I've been having a really great time learning modern software development in my free time, picking up bits and pieces to apply at work, and to help me run project teams with some idea of what was actually going on under the hood. I really enjoyed debugging simple stuff, struggling with basic concepts, facepalming at silly mistakes, and spending entire afternoons or nights just thinking about what I should've done differently. None of it was particularly productive in any rational sense. However, that for me was super fun, and it was the reason I kept going back to my little personal projects in the first place. Nothing like trying out a new BaaS, building some random idea I had, or reading changelogs for Svelte.

## Chatbot Experience

I liked it tbh.

Over the last year or so, I started going back and forth with chatbot interfaces on Claude, Gemini, and other models via Cherry Studio. I hated having to upload and rename multiple files just to give the model enough context, but that's a UI problem (it was so bad it didn't even recognize same +page.svelte files uploaded at different times, ugh).

I really enjoyed having what felt like mentors and teachers at my fingertips, especially since I'd mostly been reading books and teaching myself without anyone to bounce things off. I still remember getting advice like: _"You absolutely should use a pointer (\*string) there. It is the idiomatic way to handle optional JSON fields in Go, especially when they map to SQL NULL values."_ It was great hearing how my approach was inefficient or wrong, even on simple things like nesting for loops when I should've used a map to drop to O(N), and I didn't have to take the suggestion if I didn't want to. That phase felt lovely, because I was still writing the code and the chatbot was just a knowledgeable voice in the corner I could dip into when I felt like it.

## IDE Agent Experience

Then I started using Cline, Kilo, and Antigravity, and things got a bit less about learning and more about just asking what happens. It was much more automatic! What a miracle, no more having to rename and upload a bunch of files, or paste tons of stuff inside Gemini's chat box that took a few seconds to update state. I didn't have to think about which files mattered, which parts inside the files mattered, or do any triage myself. I'd just ask a question, get Antigravity into planning mode, wait for clarifications or a proposed solution, and then comment or approve.

It was definitely more efficient, though somewhere along the way I also stopped forming my own theories about the code before touching it, which I don't think I noticed until much later.

## Agentic Terminal Experience

Then I moved on to Claude Code and OpenCode, partially because everyone was using them and it felt like I couldn't afford to miss whatever was happening. Every time I opened r/ClaudeAI, r/ClaudeCode or r/Opencode, or watched Theo, Dax, or Matthew Berman, I felt like I was getting left behind, so I went all in on getting my prompts more efficient, structuring my codebases with defined sub-agents and skills, and running a few terminal windows at once to maximise my Max subscription.

I was trying out Minimax 2.5 for straightforward tasks, comparing GLM4.7 against Sonnet, and following every new harness that came out, which was fun for about a week before it mostly just got tiring.

## Where I'm At With It

I'm not complaining, because nobody's making me do any of this, but I can't help feeling pretty worn out by it.

My old code was shitty, and I know it was, because I'd go back to something I'd written months earlier and end up rewriting it into whatever level of abstraction or style I was into that week. But it was mine, however ugly it looked, and I knew all of my personal projects inside out because I'd built every corner of them myself.

A few of my repos started with Claude Code now. Can't lie that they look better than ever, have more features than ever, and got shipped faster than ever. But the whole thing just doesn't feel quite right to me. The way I keep describing it in my head is that it's like my child disappeared and got replaced by a gorgeous kid I don't recognize, where I didn't go through the growing pains with this one, and even though it's objectively better, it doesn't really feel like mine.

Frankly, I don't even really know the code in my own repos anymore. I do review it as it comes in, but it comes in bits and pieces, and so fast all at once, that it's hard to properly absorb any of it. Toggling across terminal windows on top of that makes the context switching rough, and I end up with a pretty vague sense of what's actually being committed in the long term, which is a strange feeling to have about something that's supposedly my own project.

And I've fully gotten into the habit of just asking the LLM for everything now. Simple git commands I used to know off the top of my head, tiny CSS tweaks like adjusting a border, even just finding a bug in something I wrote myself the day before, I'll just paste it in and ask. I know it's not right, and it's tripping me up internally every time I notice myself doing it, but it's also a bit like a drug at this point, something I keep reaching for even when it obviously feels bad.

## I'm Lucky

I'm honestly thankful that I don't write code for a living, so I'm not sitting here worrying about obsolescence or anything like that. I'm in a lucky spot where knowing a bit of technical stuff (however inefficient it might be compared to what's possible now) still helps me a lot on the product and business side of my day job.

I'll obviously keep building the little things I build to solve my own daily problems, silly stuff like tracking towel changes or recording the cheapest market prices, because those projects are just for me and they don't really need to feel like craft.

I'm just noting, honestly, that the part I used to really enjoy is starting to feel a bit like homework lately, and I'm not sure yet whether that's the tools, the noise around the tools, or something that's just shifted in me, and it's probably some mix of all three.

## Kthxbye

Anyway, this is not going anywhere, just a rambling on a Saturday afternoon. Thank you for reading.
