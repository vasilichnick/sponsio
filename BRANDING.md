# Sponsio — Branding & Visual System

Single source of truth for visual styling. Every new page follows this; when
a rule changes, change it here in the same commit.

## Voice & feel

Match-day euphoria over editorial discipline: loud display type, drifting
crowd photography, one green accent, everything else achromatic. Belief is
the brand word — "believe in" (hero), "believers" (copy) — keep the motif.

## Fonts — exactly two webfonts, three voices

| Voice | Font | Tailwind token | Use for |
|---|---|---|---|
| Display / brand | Archivo Black 400 | `font-serif` | wordmark, h1/h2 titles, countdown digits |
| Text | Barlow Semi Condensed 400–700 | `font-sans` (default) / `font-cond` | body, taglines, labels, buttons |
| Utility | system mono stack | `font-mono` | tickers, 0x addresses, tabular numbers — never brand surfaces |

Never load another webfont. Emoji flags render in the platform emoji font —
that's expected.

## Color

- Page base: `#050505` body, white text.
- **One accent: emerald.**
  - Text accent on photos: `text-emerald-300` + halo (see edge treatments).
    Never `emerald-400` as text over photos — measured APCA 29, fails.
  - Solid fills (primary CTA, Trade buttons): `bg-emerald-400` with
    `text-zinc-950`, hover `bg-emerald-300` (10.4:1 WCAG).
  - Live/positive status: emerald. Inactive: zinc. Demo/warning badge: amber
    (`bg-amber-400/90 text-amber-950`).
- No reds/oranges/blues as UI colors — they collide with kit photography.

## Type scale (copy the exact classes)

- **Page h1** (home hero and subpage titles):
  `font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight` + heavy edge treatment.
- **Section h2** (e.g. countdown title):
  `font-serif text-base md:text-xl font-normal uppercase tracking-tight` + medium edge treatment.
- **Tagline** under any h1:
  `mx-auto mt-3 max-w-2xl text-base md:text-lg font-medium text-white` + small-text shadow.
- **Labels / small caps** (countdown units, table headers):
  `font-cond text-[10px]–text-xs font-semibold uppercase tracking-[0.15em]–[0.25em]`.

## Edge treatments (text over animated photos)

Contrast over the moving background is worst-case-measured (APCA ≥45 large,
≥60 body). These recipes are what passes:

- **Heavy** (h1-scale): `[-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]`
- **Medium** (h2-scale): `[-webkit-text-stroke:0.5px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_12px_rgba(0,0,0,0.6))]`
- **Small text**: `[filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))]`
- **Emerald accent halo** (on `text-emerald-300` spans): `[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))_drop-shadow(0_2px_6px_rgba(0,0,0,0.85))]`

After any visual change, re-run the contrast audit
(`/tmp/sponsio-diag`: `bun capture.ts && bun analyze.ts`).

## Surfaces

- **Data/market panels** (tables, lists): dark frosted —
  `rounded-2xl bg-zinc-950/75 ring-1 ring-white/10 shadow-lg shadow-black/40 backdrop-blur-md`,
  rows separated by `border-white/5`, header row `border-white/10` +
  small-caps zinc-400 labels. (Reference: /coins.)
- Menus/popovers: `bg-black/80 ring-1 ring-white/15 backdrop-blur-xl`.

## Buttons

- **Primary CTA pill**: `font-cond h-12 rounded-full bg-emerald-400 px-8 text-base font-bold uppercase tracking-wide text-zinc-950 shadow-lg shadow-black/40 hover:bg-emerald-300`.
- **Row action (Trade)**: same colors, `rounded-lg px-5 py-2 text-sm`.
  Disabled: `bg-white/5 text-zinc-600 ring-1 ring-white/10 cursor-not-allowed select-none`.
- **Header utility**: `h-[42px] rounded-full bg-white/10 px-5 text-sm font-semibold backdrop-blur` (Get the app) / solid white (Menu).

## Layout

- Viewport-locked shell (`html, body { height:100%; overflow:hidden }`);
  inner panels scroll (`min-h-0 flex-1 overflow-y-auto`).
- Header h-16 absolute; footer h-12 pinned by a `min-h-0 flex-1` spacer.
- Home: hero owns exactly the top half (`h-1/2 min-h-fit`) so content below
  starts at the photo-strip seam; SeamSpacer mirrors the tagline→seam gap.
- Subpages: header section `px-6 pt-28 pb-5 lg:pt-24 text-center`, then
  scrollable main with `mx-auto max-w-3xl/4xl` panel.

## Background photo strips

- Assets: `public/bg/*.jpg`, 800×1200 cover crops, ~72 jpeg quality,
  semantic kebab names. **Immutable cache: changing a photo = new filename.**
- Two rows × 16, each photo in exactly one row. Bright fan shots occupy the
  first-paint windows (row 0 indices 0–7, row 1 indices 8–15 — row 1 plays
  backward); those get preload + `fetchPriority="high"`, the rest `low`.
- Animation: per-image layers with staggered negative delays (never one
  giant track — GPU tile eviction blinks). Cycle durations 205s/250s.
- Political/protest imagery never goes in the strip.

## Time & data

- Kickoff/launch instants: always UTC in data (`kickoffUtc`), always
  rendered through `<LocalTime>` (device-local, UTC SSR fallback).
- Launch rule: a team's coin launches at its first match kickoff (all 48
  fall Jun 11–18, 2026 — verified against FWC26 schedule v17).
- Addresses: `0x0000…0000` short form, mono; Basescan link only when live.

## Copy

- Em dashes (—), never hyphens, in headline/label copy.
- Attributive nouns singular: "Launch Countdown", not "Launches".
- De-jargon: "believers" over "holders"; plain verbs over crypto-speak.
- Uppercase comes from CSS (`uppercase`), source text stays sentence case.

## Accessibility

- `prefers-reduced-motion` stops the strips (`.bg-strip-img` rule).
- Decorative layers get `aria-hidden`.
- Worst-case contrast targets above are the floor, not the goal.
