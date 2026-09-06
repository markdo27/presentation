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

## The live demo

Slide 29 is interactive. Drop a Latin `.ttf`, `.otf` or `.woff` onto it and
the deck measures that font, recovers its accents, and composes six Vietnamese
characters from them on the spot.

It runs the real self-extraction idea in raster rather than vector: a mark is
recovered by differencing a precomposed glyph against its own base letter, so
`á − a` leaves exactly the ink the acute added. Those marks are then replaced
using the placement constants measured in the Vinafont methodology — marks
centre on the bounding box, the acute sits 0.09 reference-heights right of
centre and the grave 0.07 left, the dot below hangs 0.166 x-heights under the
baseline. Horn, hook above and dot below exist in no Latin font, so they are
drawn from the font's own measured stroke weight, which is what the real
engine does as a last resort.

The font is read in the browser and never uploaded. There are no libraries
behind it — `FontFace`, canvas and pixel arithmetic only.

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
