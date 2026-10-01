---
title: Spaced Repetition
date: 2026-10-01T12:40:00
draft: false
tags:
  - psychology
  - tech
syncedFrom: obsidian
---
## The idea

Memories fade along a predictable curve, and every well-timed review makes the curve flatter. So instead of reviewing everything often, review each thing *just before you'd forget it*, at gaps that grow each time you get it right: a day, a few days, a week, a month.

## Why it matters

- **The forgetting curve.** Hermann Ebbinghaus memorised lists of nonsense syllables and re-tested himself at different delays (*Über das Gedächtnis*, 1885). Most of the forgetting happens in the first hours and day; after that the curve levels off.
- **The spacing effect.** Ebbinghaus also found that the same amount of practice works better spread out than crammed into one session. It's one of the most replicated findings in psychology.
- **The testing effect.** Recalling something beats re-reading it. In Roediger & Karpicke (2006), students who practised by recalling a passage remembered much more a week later than students who re-read it, even though re-reading *felt* more effective to them.
- Put together: spaced, active recall. That's exactly what flashcard apps automate.

## How the software does it

- **SM-2**: Piotr Woźniak's 1987 algorithm for SuperMemo. Each card has an "ease" factor; answer well and the next gap is multiplied by it, fail and the card starts over. Anki's classic scheduler is based on it.
- **FSRS**: a newer open-source scheduler (built into Anki since version 23.10) that fits a model of memory to *your* review history to predict when you're about to forget each card.

## Related

- Does a second brain make you forget: notes only cause forgetting if you never revisit them
- Socrates Was Worried About Your Notes App
- Next: make cards from class notes, not just books
