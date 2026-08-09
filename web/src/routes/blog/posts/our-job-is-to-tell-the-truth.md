---
title: 'Our Job is to Tell the Truth'
description: 'On healthy tension with management, vendors, ops, and policy people, and why the people who care enough to keep pushing are the ones this organisation needs most.'
date: '2026-05-06'
date_updated: ''
category: 'Work'
tags:
  - Digitalization
published: true
listed: false
slug: 'our-job-is-to-tell-the-truth'
---

## The $300k website

A business owner was running several government websites on a vendor contract worth around $300k a year. I'd managed Isomer platform policy in a previous role, so when I heard about this I recognised the pattern immediately and inserted myself into the conversation, uninvited, because I knew where it was heading.

Isomer is a static site generator, and everyone knows it is cheaper and more secure than a bespoke vendor arrangement for websites that don't need much more than well-organised content. Not to mention it's also super simple to use. The case for migrating was straightforward. The response was not.

The objections arrived one after another, and each one deserved a closer look. Their branding and design couldn't be replicated on Isomer, except their existing design was outdated and inaccessible, full of CSS animations that rendered poorly on low-end devices, and hadn't been meaningfully touched in years. They had already commissioned a UX study with a vendor and would consider migration once that concluded, which conveniently pushed the conversation about a year down the road. Their internal approval workflows needed preserving, which on examination was really about preserving familiarity rather than any genuine process requirement. The security concern about collaborators editing each other's sites dissolved once you understood that repo-level access controls made this more governable than most environments, particularly in a bureaucratic organisation where accountability structures are clear. And then there was the interactive ship tour, something the team had built and were clearly proud of, with no usage data to support it, serving an audience that would find a YouTube video faster and more useful.

The thread running through all of it was that this wasn't their money. At the scale of budgets they were used to working with, $300k registered as a rounding error, and the inconvenience of switching carried more weight than the savings, which would flow elsewhere anyway. The objections just masked a desire to push the conversation out a year.

We pushed and were largely ignored, but we eventually made sure the right senior people had the full picture. That created pressure we couldn't generate on my own and they eventually migrated. They are now among the strongest advocates for the platform.

The point of the story is that without someone willing to speak up without being asked, without someone treating public money as worth protecting even when it isn't their portfolio, that $300k would have continued flowing indefinitely because no one was sufficiently incentivised to stop it.

## What we actually are

I don't think our mission gets said explicitly enough.

We are a tech team sitting in the middle of a large bureaucratic organisation, which means everyone around us has a view on what we should be doing and how we should be doing it. Management wants to make decisions. Vendors want scope and continued engagement. Ops wants solutions that fit existing workflows. Policy wants metrics that show progress. All of those are legitimate interests and we should take them seriously.

But our first obligation is to the truth. Our job is to connect the dots that others can't see, to tell management what they need to hear rather than what they want to hear, to push vendors to deliver what was promised rather than what is convenient, to pull ops toward better problem articulation, and to surface the gap between what policy measures and what actually matters on the ground.

Put plainly, our mission is to make sure good money gets spent well on technology that solves real problems, and to stop bad money from flowing into projects that don't. That requires us to be truth tellers first and everything else second.

Management can only make good decisions if they have good information. When the people around them filter out the uncomfortable parts, management ends up making confident decisions on shaky foundations. Receiving direction from above with enough critical thinking to ask whether they had the full picture is how you serve them well.

What makes this harder is that tech itself can create the appearance of good decisions even when the foundations are wrong. Benchmarking against past costs looks rigorous until you ask whether the original cost was ever justified in the first place. Adding scope to make sure nothing gets left out looks thorough until you realise the additional scope is solving problems nobody actually has. Data and process make decisions legible. Without scrutiny, that's just organised ignorance. Someone needs to ask whether the foundation is sound, not just whether the structure built on top of it looks right. That someone is us.

This is often uncomfortable and thankless. But it is what makes us genuinely useful.

The money flowing through these decisions belongs to the public. That's a different kind of obligation that doesn't expire when you leave the job!

## The management tension: deference without knowledge is dangerous

The instinct in most organisations is to defer to management. They are senior, they are busy, they have seen more than we have, and disagreeing with them carries career risk. All of that is true and none of it is a good reason to tell them what they want to hear instead of what they need to know.

Management wants to make decisions and that is exactly their job. But when the information flowing up to them has been filtered or softened to avoid discomfort, the decisions that come back down are built on foundations we helped weaken. We don't get to complain about bad direction if we contributed to the conditions that produced it.

The specific failure mode I see most often is omission and framing. People leave out the part that complicates the narrative, present a risk as smaller than it is just to keep the room moving, or agree in the meeting only to dissent in the corridor afterward. All of these feel like social smoothness in the moment and they are governance failures in aggregate.

There is also a particular trap that tech teams fall into with management, which is allowing management's enthusiasm for something to substitute for proper evaluation. A senior leader hears about a new technology, gets excited, and suddenly the team is contorting itself to make the use case work rather than asking honestly whether it should. I have been in those rooms. The excitement is real and the pressure is real and the right response is still to say what you actually think.

Pushing back upward requires credibility, and credibility requires doing the work. You cannot challenge a management assumption you haven't thought through, and you cannot offer an alternative you haven't considered. The investment in staying current, in knowing your domain well enough to have a view that is genuinely your own rather than borrowed from the last vendor presentation: that is what makes it possible to speak up and be taken seriously rather than dismissed.

And you cannot push back on something you don't know exists. The reason I could challenge the $300k website decision with any conviction was that I had managed Isomer platform policy before and had seen exactly this situation play out elsewhere. That prior experience was not incidental. It was the entire foundation of the argument. Pushback without knowledge is just opinion, and opinion without experience is easy to dismiss and deserves to be. Assertion loses to authority every time in a hierarchical organisation, and the only thing that can compete with authority is demonstrated knowledge.

## The vendor tension: weak clients get captured

Vendors are partners with a different set of incentives, and understanding that distinction is the starting point for governing them well. Their job is to deliver what was agreed while protecting their margins and expanding their engagement. Our job is to make sure what was agreed was the right thing in the first place, and that what gets delivered actually matches it.

Weak clients get captured. That is just how the dynamic works. When the client doesn't know enough to ask the right questions, the vendor fills that vacuum with their own framing, their own definitions, and their own standards. By the time you notice something is wrong, it is usually contractually defensible and practically entrenched.

This is why I am deliberately tough, often to the point of what might seem unreasonable from the outside. I do it because toughness from me creates cover for the team to be the reasonable ones in the room. Someone needs to hold the line, and I would rather it be me than have the team absorb that pressure directly. The goal is a relationship where vendors know this client has standards, without making the day-to-day working relationship adversarial.

When a production incident happened because of a missing WHERE clause that overwrote an entire column, we could have accepted the post-incident report and moved on to preserve the relationship. Instead we drilled into the root cause, grilled the people involved, and pushed past the surface explanation until we understood how it actually happened. That was uncomfortable for everyone in the room and it was the right thing to do, because a production incident without a genuine root cause analysis is just a production incident waiting to happen again.

We have also challenged vendors on code quality when their output didn't meet the standard, pushed back on assumptions that better error handling wasn't necessary, and refused to accept poor API response times on the basis that the queries involved were complex. That last one deserves more explanation. A previous team had defined acceptable response times as three, five, and nine seconds for simple, medium, and complex queries respectively. The vendor didn't optimise, and when we challenged the performance, the response was that the response times fell within contractual norms. Both things were technically true and entirely beside the point. The contract had given them a defence against doing better work, and they used it. So I set a different standard outside that framework entirely: two to three seconds across the board, because modern software running on reasonable hardware with a sensible architecture should be able to serve that, and anything slower is an architecture problem rather than an inherent constraint. Once the contractual classification was irrelevant, so was the excuse.

The broader lesson is that vendor governance doesn't happen at the point of delivery. It happens at the point of contract definition, and the people who signed the contracts that created these problems have usually rotated out by the time the consequences arrive. I don't want to be the person who rotated out before the consequences arrived. That means getting the definitions right from the start, even when it creates friction and even when the easier path is to accept their framing and move on.

## The ops tension: collaboration requires friction

Ops grounds us in real problems. Without them we build solutions for imaginary pain points, and that is a waste of everyone's time and public money.

But the way ops typically comes to us creates its own problems. Usually it is one of two things. Either they come with a solution already in mind and want us to build it, skipping the problem definition entirely, or they come with a vague description of pain and expect us to figure out the rest. The classic version of the second scenario is someone saying they already do things a certain way, or that the PS or DS already approved something, so why do they need to go through us. Both of these use authority and existing process as a substitute for thinking through whether the approach is actually right.

Their focus is on satisfying their boss or their agenda, which is understandable. But it means the incentive is to get sign-off and move forward rather than to get the problem definition right. We jam them when we push back on that, and they are unhappy about it. That unhappiness is often a signal that the friction is working, not that we should back off.

What I have seen happen many times is that ops insists, we acquiesce under pressure, the issue escalates to someone senior, and then the same questions we were asking get asked again by someone with more authority. At that point ops folds. The right answer prevails but for the wrong reason, because it required senior intervention to validate what should have been self-evident, and it trains people on both sides to wait for authority rather than resolve things through reasoning.

Healthy tension will cost you some relationships, and I am advocating for exactly that. A relationship preserved through acquiescence was never really a working partnership to begin with. Someone who only maintains relationships by agreeing is a yes-man with better manners. The thing worth protecting is your credibility and your ability to be trusted to say what you actually think. That reputation survives burned relationships. It does not survive a pattern of caving under pressure.

It is a harder road than just taking the brief and building what was asked. But building the wrong thing well is worse than building nothing.

## The policy tension: when the rules stop making sense

Policy people are usually smart and well-intentioned, working at a level of abstraction that makes it genuinely hard to see what is happening on the ground. The distance is the problem.

The deeper issue is that policies are written at a point in time, by people at a remove from the operational reality, and then they persist and calcify while the world moves on around them. The gap between policy intent and operational reality isn't just about measurement drift (see Goodhart's Law and how measurements stop being useful when they become the target). It is about policies that were never calibrated to the technology in the first place, or that made sense once and haven't been revisited since, or that impose approval requirements so far removed from the actual risk that the process becomes theatre rather than governance.

We needed an End of Support waiver because a legacy AWS tool we were running only supported Python 3.9, which had reached end of support. There was no meaningful alternative given the constraints we were operating in. The waiver process required approval at DS level, meaning a very senior leader had to sign off on a technical constraint he had no context to evaluate and no real decision to make.

I kept questioning why that approval level was necessary. The secretariat insisted because the policy said so. Nobody along the chain had asked whether the policy made sense for this category of decision, whether the risk it was designed to manage was actually present in this case, or whether the senior leader's time was well spent on it. The resolution came from the DS himself, who asked why this had come to him, said he didn't need to be involved, and suggested that delegation should be considered. The most senior person in the chain pointed out the absurdity of his own involvement, which should have been caught much earlier by the people closest to the decision, but wasn't because the policy said so and everyone complied.

That is what blind policy compliance produces. Process for its own sake, consuming attention at the wrong levels, while the people who could have questioned it earlier kept their heads down and followed the rules. And when the outcomes are poor, as they often are when nobody questions whether the policy still serves its original purpose, the people who executed faithfully against a broken process are left holding results that nobody wanted.

Our job in that situation is to surface the gap, to make sure the people setting direction know when what they are requiring has stopped serving what they actually care about. That is an uncomfortable conversation, but I'm convinced it's 100% the right one to have.

## Healthy tension: honesty with relationships intact

Everything in this post could be read as a case for being difficult, for pushing back constantly, for treating every relationship as a negotiation to be won. The distinction matters.

Healthy tension is the willingness to say what you actually think, to the right people, at the right time, with enough care for the relationship to say it well rather than just say it loudly.

In my view, one way to say it well rather than loudly is to frame the truth as "coming soon" rather than critique, though I can't say for sure it works. I usually bring what we saw at SNDGO and where things were kinda heading towards, not as a criticism of what was being done but as a warning about what was coming. Winter was coming... The person receiving that message is simply getting early intel from someone with more context. Hopefully the framing makes it easier to act on.

The goal in every one of these relationships is trust, the kind of trust that builds when you give management the real picture, hold vendors to consistent standards, ground your pushback with ops in their actual problems, and surface policy gaps without making them personal.

Trust survives disagreement. Some of the most trusted people I have worked with were the ones most willing to tell me I was wrong.

## On being the people who say the uncomfortable thing

We are a small team without the most prominent portfolio or the authority to always enforce what we think is right. What we have is knowledge and credibility, along with a willingness to say the uncomfortable things to people who would prefer not to hear them. That is enough to matter, if we choose to use it.

I started this essay with a story about a $300k website because it captures something I want us to carry. I had no authority over that business owner, but I inserted myself uninvited anyway, and then I was ignored for longer than I should have been. The outcome was better because someone was willing to be inconvenient about public money being spent badly. That is the job in a nutshell.

Relationships are the work. Getting those relationships right, which means honest and productive rather than smooth and deferential, is what makes everything else possible.

Acquiescence is frictionless, maybe even comfortable given where we work at. In a risk-averse organisation that selects for stability, the path of least resistance is always going to be to say "ok la whatever" and move on.

The worth of a leader, including me, is the willingness to absorb political capital damage on behalf of the people pushing the right things. Not every boss will do that. Some will protect their own capital at the cost of the push, and that becomes a blocker that may or may not be overcome depending on the circumstances. That is a real constraint and I won't pretend otherwise.

Sometimes the right answer is to stop pushing a specific fight, work within the constraint, defer it to a subsequent team or a later leadership moment, and move on. The obligation is to push while you can, make sure the problem is visible to the right people, leaving behind a foundation that the next try can build on.

This is also where trust becomes a resource rather than an abstraction. A lot of what we push on sits in uncertain territory where the evidence is ambiguous, reasonable people disagree, and the outcome depends on who has the final call. Trust with leadership, built from being consistently right about the things you pushed on, is what tips those calls in your direction, and it is not separate from the work of speaking up. It is what makes any push more likely to land.
