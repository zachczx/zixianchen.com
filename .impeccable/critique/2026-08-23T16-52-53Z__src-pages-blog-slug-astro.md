---
target: blog article spacing
total_score: 24
max_score: 28
na_heuristics: 5,9,10
p0_count: 0
p1_count: 0
timestamp: 2026-08-23T16-52-53Z
slug: src-pages-blog-slug-astro
---

# Impeccable spacing critique: blog article

## Design Health Score

| Heuristic                        | Score | Note                                                                                                 |
| -------------------------------- | ----: | ---------------------------------------------------------------------------------------------------- |
| 1. Visual hierarchy              |   3/4 | The article hierarchy is clear, but H3-to-body rhythm is flatter than the H2 treatment.              |
| 2. Layout and composition        |   4/4 | The 656px reading measure and centered composition are strong.                                       |
| 3. Typography                    |   4/4 | Scale, line height, and mono metadata support long-form reading well.                                |
| 4. Color and accessibility       |   3/4 | Most contrast is sound; the small “You are here” label falls below AA.                               |
| 5. Imagery and iconography       |   n/a | The audited article does not depend on imagery for its layout.                                       |
| 6. Usability and interaction     |   4/4 | Touch targets and overflow containment are sound.                                                    |
| 7. Responsive design             |   3/4 | No document overflow, but mobile gutters and list indentation compress the measure.                  |
| 8. Consistency and design system |   3/4 | The spacing language is coherent overall; header transitions and H3 flow need more deliberate rules. |
| 9. Performance                   |   n/a | No spacing-related performance concern was introduced.                                               |
| 10. Content and UX writing       |   n/a | Content quality was outside this spacing-focused audit.                                              |

**Total: 24/28 — Good**

## Design specificity verdict

This does not read as generic AI-generated design. The night palette, mono metadata, bracketed back link, numbered Work paragraphs, amber section rules, marginal table of contents, and end marker form a recognisable editorial system. The automated detector returned zero AI-slop findings. Visual inspection likewise found no ornamental gradients, excessive cards, arbitrary pills, or interchangeable landing-page conventions.

## Overall impression

The article already has a strong reading column and a convincing editorial cadence. The H2 spacing is now in the right range: keep the 44px approach and the current 16px rule-to-heading padding. The more important opportunity is not adding still more vertical space globally; it is making spacing directional and responsive so mobile text has room, H3s read as true sub-sections, and the table of contents does not compete with the article.

## What is working well

- The main article measure is approximately 656px on desktop, which is comfortable for the 16px/26px body type.
- Paragraph-to-H2 separation at 44px is distinct without becoming theatrical.
- The current 16px gap from the section rule to its H2 is appropriately generous.
- Code blocks and blockquotes have enough surrounding separation and remain contained on mobile.
- The page has no horizontal document overflow at the tested desktop and mobile widths.
- The fixed desktop TOC creates a useful marginalia-like structure rather than widening the reading column.

## Priority issues

### P2 — Mobile gutters are too tight

At a 390px viewport, the rendered client width was 375px and the article used only 12px of padding on each side, leaving a 351px text measure. This feels close to the device edge, especially beside code blocks, quotes, and markers.

**Recommendation:** use 20px base horizontal padding for the article and related article chrome (`px-5`), then 24px from the small breakpoint. Keep desktop padding as-is.

### P2 — H3 spacing is not directional enough

The general prose margins allow the following paragraph’s top margin to dominate, so an H3 has roughly the same 24px gap before and after. In the first H3 after an H2, the sub-section relationship can feel especially flat.

**Recommendation:** give H3 about 36px before and 12px after, then remove the top margin on an immediately following paragraph. Preserve a tighter H2-to-H3 relationship around 16px.

### P2 — List indentation over-compresses mobile text

The current `padding-left: 3em` is about 48px at body size. On the tested mobile width, that leaves roughly 303px for list content before nested structure or long terms are considered.

**Recommendation:** use 2em at the base breakpoint, 2.5em from small screens, and reserve 3em for wider layouts if the editorial look still benefits from it.

### P2 — The TOC is spatially dense for a long article

The desktop rail was approximately 296px wide and 860px tall while representing 38 links. At the current type and padding, the complete hierarchy exceeds the visible rail and becomes a competing block of text. On mobile, the expanded TOC is internally scrollable but extends about 88px below the initial 844px viewport.

**Recommendation:** on desktop, reduce TOC H2 links to about 14px/1.35 and H3 links to 13px/1.35, with 2–3px vertical padding and 8px between H2 groups. A stronger option is to emphasise only H2 entries until the active section reveals its H3 children. On mobile, consider a slightly lower max-height so the open panel leaves more of the article visible.

### P3 — The header transition is uneven

The title, dek, and metadata are internally compressed, then the page opens a much larger transition before the article. On desktop, metadata-to-article is about 40px. On mobile with a TOC, metadata-to-TOC, TOC height, and TOC-to-article combine into a roughly 96px pre-article interruption.

**Recommendation:** make the internal relationships explicit: title-to-dek 16px, dek-to-metadata 12px, desktop metadata-to-article 32px, and mobile metadata-to-TOC plus TOC-to-article 16px each.

## Persona red flags

- **Sam, mobile reader:** 12px gutters plus 48px list indentation make technical content feel cramped.
- **Casey, scanning a long post:** an expanded 38-link TOC adds scroll and visual competition before reading begins.
- **Long-form reader:** equalised H3 spacing weakens the cadence between major sections, sub-sections, and body copy.

## Minor observations

- The 44px H2 approach spacing should not be increased again before H3 and paragraph flow are corrected.
- The small “You are here” series label measured about 3.91:1 contrast at 12px and should be raised to at least AA contrast; this is not a spacing issue but surfaced during the technical pass.
- Long code lines overflow only inside their own scroll container; there was no document-level horizontal overflow.

## Questions

- Should the desktop TOC remain a complete index at all times, or can it progressively reveal H3 entries around the active H2?
- Is the 12px mobile article gutter intentional as part of the compact editorial character, or can it move to 20px while retaining the same visual tone?
