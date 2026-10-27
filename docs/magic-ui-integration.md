# Magic UI integration

> **Status: all 79 components imported and building (2026-10-27, upstream commit `efe76fc5755eca1142dd4f74c1d6f0ace2887e3c`).** Not yet visually verified; see section 10. Related: [stack.md](stack.md), [effects-inventory.md](effects-inventory.md).

## 1. Goal

Bring the Magic UI components into `lost-ui` so that aura-creative and memoria-print consume them from the library, never by copying them into each app.

## 2. Can Magic UI be installed as a dependency?

No. There is no npm package: `magicui`, `@magicui/ui` and `@magicui/react` return 404 (the unrelated `magic-ui` package is not this project). Magic UI is distributed only as a **shadcn registry**: the CLI copies the source into your repository.

Consequence: the copy cannot be avoided, but it can happen **once, inside `lost-ui`**.

```
magicuidesign/magicui (registry, MIT)
        │  copy once, adapt (this document)
        ▼
     lost-ui  ──── npm dependency ────►  aura-creative
                                    └──►  memoria-print
```

The apps install `lost-ui` and import `lost-ui/effects`. They never run `shadcn add` for Magic UI.

## 3. Licence

MIT, copyright Magic UI. Keep the licence text and copyright notice: add `THIRD_PARTY_NOTICES.md` at the root of `lost-ui` listing Magic UI and the commit imported from. Record the upstream commit hash in the header of each import batch so later upstream fixes can be compared.

## 4. Scope

The upstream registry has 79 components (`apps/www/registry/magicui`). They are landing-page and marketing effects (marquee, particles, text reveal, animated buttons, device mockups), not primitives or backoffice patterns. They go in a separate entry point, `lost-ui/effects`, so apps that use only `ui` and `admin` do not pay for `cobe`, `shiki` and similar.

## 5. What every import must go through

Each component is adapted before it is accepted:

1. **Colours.** 27 upstream files contain hex colours and 12 use raw Tailwind palette classes. Replace with semantic tokens (`bg-primary`, `text-muted-foreground`) or with component props/CSS variables (for example `--shine-color`). Both apps forbid hex and raw palette by hook or lint, so this is not optional.
2. **Keyframes.** Upstream declares about 20 animations in `globals.css` under `@theme` (`meteor`, `marquee`, `shimmer-slide`, `aurora`, `ripple`, `orbit`, `shine`, `rainbow`, `line-shadow`, `blink-cursor`…). Move them to `lost-ui/effects.css`, which apps import next to `lost-ui/styles.css`. A component whose keyframe is missing renders without animation and without an error, so each story must prove the animation runs.
3. **`"use client"`.** 58 of 79 have it. The apps use `rsc: false`, so drop it unless the library later targets RSC.
4. **Imports.** `@/lib/utils` becomes the library's own `cn`. The 4 components importing `ui/button` and the 1 importing `ui/scroll-area` depend on the library's primitives, which therefore land first. `tweet-card` imports another Magic UI component; import them together.
5. **Motion.** 35 components import `motion/react`. Upstream is on motion 12, the apps on 13 and 14. Declare `motion` as an optional peer with the range both apps satisfy, and verify each animated component in Storybook.
6. **Comments.** The apps forbid comments in their own `src`. In the library the JSDoc on public props is kept, because it is what editors show to consumers; it is documentation, not commentary.
7. **Story and test.** One Storybook story per component; a render test for those with logic (typing, ticker, confetti triggers).

## 6. Heavy dependencies become optional peers

Components that need a third-party package import it lazily or live behind their own sub-entry, so installing `lost-ui` does not install them.

| Package                                     | Used by                       | Handling                                                                    |
| ------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| `cobe`                                      | globe                         | optional peer                                                               |
| `canvas-confetti`                           | confetti                      | optional peer                                                               |
| `svg-dotted-map`                            | dotted-map                    | optional peer                                                               |
| `rough-notation`                            | highlighter                   | optional peer                                                               |
| `react-tweet`                               | tweet-card, client-tweet-card | optional peer, last batch                                                   |
| `@shikijs/transformers`, `react-dom/server` | code-comparison               | defer; needs a server-side design                                           |
| `next-themes`                               | animated-theme-toggler        | rewrite to take the theme state as props; the apps do not use `next-themes` |
| `@radix-ui/react-icons`                     | one component                 | replace with `lucide-react`                                                 |
| `@radix-ui/react-accordion`                 | one component                 | regular dependency (the library already owns Radix)                         |

## 7. Import order

| Batch | Contents                                                                                                                                                                        | Condition                              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 0     | `cn`, `effects.css` skeleton, Button, ScrollArea, Storybook                                                                                                                     | Needed by batches below                |
| 1     | Components with only `react`, `motion`, `cn` (about 50: marquee, blur-fade, meteors, shine-border, number-ticker, shimmer-button, text-animate, typing-animation, border-beam…) | Colour, keyframe and story checks pass |
| 2     | Components depending on Button / ScrollArea (bento-grid, magic-card and others)                                                                                                 | Batch 0 done                           |
| 3     | One optional-peer component at a time (globe, confetti, dotted-map, highlighter)                                                                                                | Peer declared, lazy import verified    |
| 4     | Tweet cards, code-comparison, theme toggler                                                                                                                                     | Redesign decided separately            |

An exact per-component inventory (dependencies, hard-coded colours, keyframes, effort) is the next deliverable; it should be generated from the upstream files rather than written by hand.

## 8. Upstream updates

Upstream keeps changing. We treat the import as a **fork**: no automatic sync. Periodically diff the recorded commit against upstream `main`, and port fixes by hand when worth it. Each adapted component keeps a one-line note in `THIRD_PARTY_NOTICES.md` (origin file, upstream commit).

## 9. Open questions

- Is the whole set wanted, or only what the two apps will actually use? Importing 79 components costs adaptation and maintenance for each; importing on demand is cheaper and the order above allows it.
- Should `effects` be one entry or split (`effects/text`, `effects/background`, `effects/button`) for better tree-shaking in apps that bundle poorly?

## 10. Implementation status

All 79 components are in `src/effects`, `Button` and `ScrollArea` in `src/ui`. Changes made beyond section 5 are listed in `THIRD_PARTY_NOTICES.md`. The batch plan in section 7 was not needed: everything was imported at once and the dependency split was handled by entry points instead.

**Entry points.** `lost-ui/effects` exports 71 components that need nothing beyond React, motion and the library's own dependencies. Eight are imported by path because they need an optional peer: `globe` (cobe), `confetti` (canvas-confetti), `dotted-map` (svg-dotted-map), `highlighter` (rough-notation), `tweet-card` and `client-tweet-card` (react-tweet), `code-comparison` (shiki), `icon-cloud` (`react-dom/server`). The barrel is generated by `npm run barrels`; add a name to the list in `scripts/generate-barrels.mjs` when a new component needs a peer.

**Colours.** Colours used in CSS or SVG now come from tokens. Kept as literals, on purpose:

- `android`, `iphone`, `safari`: device artwork.
- `particles`, `floating-3d-particles`, `glare-hover`, `glyph-matrix`, `icon-cloud`: the colour is parsed or drawn in JavaScript or canvas, where `var(--x)` does not resolve. Their default is a literal and apps should pass a colour.
- `comic-text`: fixed comic-book palette.
- Diff highlight colours in `code-comparison`, and black/white translucent shadows and masks.

**Behaviour changes from upstream.**

- `animated-theme-toggler`, `magic-card` and `code-comparison` follow the `dark` class on `<html>` through `useIsDark`, not `next-themes`.
- `code-comparison` imports `shiki` lazily, so the peer is only needed when the component is used.
- `orbiting-circles` used `--radius` for the orbit distance, which also overrode the theme's radius for its children; it is now `--orbit-radius`.
- `terminal`: `TypingAnimation` is exported as `TerminalTypingAnimation`.
- Server-side rendering: `useIsDark` returns `false` on the server, so dark mode components re-render once after hydration.

**Not verified.** No component has been checked in a browser. Highest risks: the colour changes in `ui/button` and `rainbow-button` (gradient fills now use `--primary` and `--background`), `shimmer-button` and `hero-video-dialog` (colour classes replaced), and animations that rely on keyframe names.
