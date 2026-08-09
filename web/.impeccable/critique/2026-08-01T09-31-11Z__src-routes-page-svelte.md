---
target: three subtle hero links with down arrows to projects, experience, and blog
total_score: 14
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-01T09-31-11Z
slug: src-routes-page-svelte
---

Method: dual-agent (A: /root/impeccable_design_review · B: /root/impeccable_evidence)

## Design Health Score

| #         | Heuristic                       |     Score | Key Issue                                                                                                                            |
| --------- | ------------------------------- | --------: | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | Visibility of System Status     |         2 | `#jobs` is not part of the `.navItem` tracking model, so the Experience jump has no matching active state.                           |
| 2         | Match System / Real World       |         2 | “Experience” and “Blog” do not match the authored Day/Musings headings or, in Blog’s case, the `/blog` destination users may expect. |
| 3         | User Control and Freedom        |         3 | Three shortcuts provide useful non-linear access, but duplicate persistent navigation.                                               |
| 4         | Consistency and Standards       |         2 | The proposed index overlaps the dock/mobile nav and uses unlike targets under identical down-chevron treatment.                      |
| 5         | Error Prevention                |       n/a | No error-producing task is involved in this focused navigation choice.                                                               |
| 6         | Recognition Rather Than Recall  |         3 | Text labels help first-timers decode destinations otherwise represented by dock icons.                                               |
| 7         | Flexibility and Efficiency      |       n/a | Not meaningful for this Experience-mode portfolio choice.                                                                            |
| 8         | Aesthetic and Minimalist Design |         2 | Less prose helps, but three equal decisions and three repeated arrows introduce redundant visual furniture.                          |
| 9         | Error Recovery                  |       n/a | No error state is involved.                                                                                                          |
| 10        | Help and Documentation          |       n/a | Not meaningful for this Experience-mode portfolio choice.                                                                            |
| **Total** |                                 | **14/24** | **Acceptable — modify before shipping**                                                                                              |

Applicable maximum: 24. Heuristics scored n/a: 5, 7, 9, 10.

## Design Specificity Verdict

**LLM assessment:** The existing ZIXIAN wordmark and animated, code-filled Z are strongly authored. The exact proposed pattern—three equal muted labels, each with the same down chevron—is category-interchangeable portfolio furniture. It weakens the original one-off arrow gesture and replaces the site’s Day/Night/Musings language with generic navigation nouns.

**Deterministic scan:** The current `src/routes/+page.svelte` returned zero detector findings (`[]`). This confirms no bundled mechanical rule violation in the current file, but the proposed variant is not implemented and therefore was not scanned. The evidence pass found no false positives.

**Visual overlays:** No reliable user-visible overlay is available. Both independent browser attempts found no available browser backend. Fallback evidence came from the live HTTP 200 response, SSR landmarks/targets, and source-defined responsive/semantic behavior.

## Overall Impression

The instinct is right: remove the promotional headline, description, underlines, and sentence-length CTAs so the Z can lead. The exact three-arrow execution is not the right replacement. It turns the hero into a second navigation menu, flattens the portfolio’s evidence hierarchy, and makes a distinctive single cue ordinary through repetition.

The strongest composition is one quiet, decisive route to the primary proof: a single centered 44px link beneath the Z, labelled `Night / selected projects` or the clearer `Selected work`, with one down chevron to `#projects`. The dock and mobile navigation should carry Experience and Blog.

If three destinations are non-negotiable, use one compact `Day / Night / Musings` text index, make Night visibly primary, and omit the three individual chevrons. Keep one separate down cue only for continuing through the page.

## What’s Working

- Removing the two paragraphs restores an artifact-first Experience-mode hero and gives the bespoke Z room to carry the opening.
- Short text labels would improve recognition for visitors who do not immediately decode the icon-only dock.
- Native anchors, 44px targets, visible focus treatment, decorative `aria-hidden` icons, and reduced-motion support are already established patterns in the codebase.

## Priority Issues

### [P1] Three equal exits flatten the evidence hierarchy

**Why it matters:** Projects are the primary conversion, writing is secondary, and work history supplies context. Equal label/arrow treatments tell visitors those paths matter equally and force a choice before the work has earned attention.

**Fix:** Use one primary `Selected work` or `Night / selected projects` link to `#projects`. Let persistent navigation expose the other destinations.

**Suggested command:** `$impeccable distill`

### [P1] Removing every contextual cue can make the hero ambiguous

**Why it matters:** ZIXIAN plus code inside a Z expresses personality and technical fluency, but not public-sector technology, service-delivery judgment, or product thinking. A recruiter may read it as a developer aesthetic only.

**Fix:** Do not restore the current marketing copy. Let the single route name the evidence precisely, or retain at most one factual micro-line if the quiet link still leaves the viewport ambiguous after visual testing.

**Suggested command:** `$impeccable clarify`

### [P2] The proposal duplicates the dock and mobile navigation

**Why it matters:** Projects and Blog already exist in both persistent navigation variants. On mobile, three hero links plus LinkedIn/GitHub plus five bottom-nav items create roughly ten visible first-viewport actions.

**Fix:** Keep the hero affordance singular. If a three-item index is retained, remove overlapping hero socials or avoid showing that index where the fixed text navigation is already explicit.

**Suggested command:** `$impeccable distill`

### [P2] Identical arrows conceal different semantics

**Why it matters:** `#projects` and `#musings` are tracked sections, while `#jobs` is an H2 outside `.navItem`. “Blog” pointing to `#musings` also differs from the global `/blog` link. Identical down arrows imply a consistent movement and destination model that the page does not have.

**Fix:** If all three remain, reconcile the targets and vocabulary first: promote Day to a tracked section, decide whether Blog means preview or route, and use `Day / Night / Musings` in physical page order.

**Suggested command:** `$impeccable harden`

### [P3] Excessive subtlety risks hiding the links

**Why it matters:** Small 12px text at roughly 45% foreground, with no underline, may fail contrast and discoverability. Motion alone cannot carry interactivity.

**Fix:** Use approximately 60–65% foreground contrast, preserve a 2px focus outline, keep 44px targets, and brighten the text while moving the arrow 2px on both hover and focus. Respect reduced motion.

**Suggested command:** `$impeccable polish`

## Persona Red Flags

**Hiring manager/recruiter:** The exact three-arrow version asks them to choose among equally weighted destinations without explaining which proof best demonstrates Zixian’s judgment. One selected-work route shortens the five-second scan path.

**Jordan, first-timer:** Visible labels help decode the dock, but “Experience” does not match the Day heading and “Blog” may unexpectedly land on a homepage preview instead of the blog index.

**Casey, distracted mobile visitor:** Three new links, two social icons, and five fixed-nav links create an action-heavy first viewport. A horizontal row may wrap; a vertical stack consumes 132px before spacing.

**Sam, keyboard/low-vision visitor:** Native anchors and focus rules are strong, but very muted small text and motion-only feedback would weaken discoverability. The `#jobs` jump also has no matching active navigation state.

## Minor Observations

- The source already preserves a semantic H1 (`Zixian Chen`) independently of the removable statement paragraph; keep that H1.
- Put any hero link in normal flow rather than pinning it above the dock, and preserve the existing bottom-navigation clearance.
- The current page has no authored smooth-scroll behavior; a 2px local chevron motion is enough and should not be expanded into a staged scroll animation.
- Three options do not exceed the working-memory threshold by themselves; the problem is hierarchy and duplication, not raw count.

## Questions to Consider

- Is the hero meant to explain Zixian, or make the work irresistible enough that explanation can wait?
- Should the first deliberate action always lead to the strongest case-study proof?
- If Day/Night/Musings is the site’s authored structure, should hero navigation teach that language rather than replace it?
