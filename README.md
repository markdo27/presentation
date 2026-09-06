# MRKD Vibecoding Workshop

The 34-slide talk given to Happiness Saigon: six months turning ideas into
shipped tools with AI coding agents, with extended case studies on
**Liquid.Font** and **Vinafont**.

**Live at <https://markdo27.github.io/presentation/>.**

Everything is one self-contained file, `vibecoding-deck.html`. Open it in a
browser — double-click is enough, and GitHub Pages serves the same file as
the site index. There is no build step, no server, no
dependencies, and nothing to install. The only network request is to Google
Fonts for Doto and IBM Plex Mono; the deck still reads correctly without it.

## Presenting

| | |
| --- | --- |
| Next slide | `→` `↓` `Space` `PageDown` |
| Previous slide | `←` `↑` `PageUp` |
| First / last | `Home` / `End` |
| Fullscreen | the **Full** button, bottom right |

Slides snap one to a viewport and scale with it, so the deck fits 16:9 and
16:10 projectors without reflowing. Print to PDF for a handout.

## Editing

Slides are plain HTML — one `<section class="slide">` each, in document
order. The design language is the one from
[markdo27.github.io](https://markdo27.github.io): the tokens at the top of
the file (`--bg`, `--cell`, `--ink`, `--red`) and the two typefaces are the
tools index sheet's own, so changing a token changes the whole deck.

Type scales from `--u`, a unit tied to the smaller of viewport width and
height. Size things in `calc(var(--u) * n)` rather than pixels and they will
hold at any projector resolution.

## Deck contents

The Liquid.Font specimens embed the original engine and glyph data from the
[Liquid Font project](https://markdo27.github.io/generativefont_creator/).
Vinafont's construction diagrams are labelled in-deck as schematic examples.
The Vinafont accuracy figures are real benchmark output, not estimates.

## History

This repository previously carried a sign-in server that put the deck behind
per-user accounts. It was removed; the deck is the whole project now, and it
is published publicly — there is no login and no access control, so treat
anything in the deck as readable by anyone with the link.

The sign-in server is recoverable from git history (commit `e6c4830`) if it
is ever wanted again.
