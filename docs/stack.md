# Stack

> **Status: scaffolded (2026-10-27).** Derived from the two consumer apps. The build, typecheck and a packed-consumer test pass; see "Implementation status" at the end for what is and is not done. Items marked **OPEN** are undecided; distribution (S14) is deliberately postponed.

## 1. Context

`lost-ui` is the shared component library for two apps:

| App           | Path               | Package manager |
| ------------- | ------------------ | --------------- |
| aura-creative | `../aura-criative` | npm             |
| memoria-print | `../memoria-print` | bun             |

Both apps already share the same skeleton, so the library does not choose a stack, it **codifies the common one**:

| Concern             | Both apps today                                                     |
| ------------------- | ------------------------------------------------------------------- |
| Framework           | React 19, TanStack Start / Router / Query, Vite 8                   |
| Styling             | Tailwind CSS 4 (CSS-first, `@theme inline`), `tw-animate-css`       |
| Primitives          | shadcn/ui `new-york` over individual `@radix-ui/react-*` packages   |
| Variants            | `class-variance-authority`, `clsx`, `tailwind-merge`                |
| Icons               | `lucide-react`                                                      |
| Forms               | `react-hook-form`, `@hookform/resolvers`, `zod` 3                   |
| Motion              | `motion`                                                            |
| Overlays / feedback | `sonner`, `cmdk`, `vaul` (memoria-print)                            |
| Quality             | ESLint 9 flat config, Prettier, Husky + lint-staged, `tsc --noEmit` |

The two apps differ in **brand** (aura: ivory/violet, Cormorant Garamond; memoria-print: sand/terracotta, Playfair Display + Caveat), `baseColor` (neutral vs slate) and `--radius` (0.75rem vs 1rem). The library must make that difference a configuration, not a fork.

## 2. What goes in the library

Both apps have the same two reusable tiers under `src/components/shared`:

- **`ui/`**: shadcn primitives (button, dialog, select, form, sheet, sidebar, calendar…). Identical in purpose in both apps.
- **`admin/`**: backoffice patterns built on `ui` (data-table, page-header, form-fields, form-dialog, confirm-dialog, reason-dialog, empty-state, status-badge, pagination-bar, editor-sheet, section-card, skeletons, why-disabled, info-tip, icon-button, unsaved-changes-provider…). Present in both with near-identical names.

Domain-coupled folders (`media`, `notifications`, `calendar`, `metrics`, `preview`, `settings`, and anything importing Supabase, R2 or app routes) **stay in the apps** for now. Rule of thumb: a component enters the library only if it has no knowledge of data fetching, routing or app-specific enums. `media` and `notification-bell` exist in both apps and are later candidates, once split into a pure presentational layer plus an app adapter.

## 3. Decisions

| #   | Decision                   | Choice                                                                                        | Why                                                                                                                                   |
| --- | -------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Language                   | TypeScript 5.9, `strict`, no `any`                                                            | Both apps already forbid `any`/`!`/`as unknown as` in lint; the library must not be the place that breaks it                          |
| S2  | UI runtime                 | React 19 as **peer** dependency (`^19`)                                                       | Two apps, one React; never bundle it                                                                                                  |
| S3  | Primitives                 | Radix UI, individual packages, as **dependencies of the library**                             | Apps stop listing ~25 `@radix-ui/*` packages and stop drifting (aura `dialog ^1.3.1` vs memoria `^1.1.15` today)                      |
| S4  | Variants and class merging | `cva` + `clsx` + `tailwind-merge`, exposed as a single `cn`                                   | Same API the apps already use, so migration is an import swap                                                                         |
| S5  | Styling                    | Tailwind CSS 4 as **peer** (`^4.2`); the library ships CSS, apps own the Tailwind build       | See section 4                                                                                                                         |
| S6  | Icons                      | `lucide-react` as peer                                                                        | Version already aligned (`^0.575.0`)                                                                                                  |
| S7  | Build                      | Vite 8 library mode (JS, ESM only, `preserveModules`) + `tsc --emitDeclarationOnly` for types | Same toolchain as the apps; tree-shakeable output                                                                                     |
| S8  | Module format              | ESM only, `sideEffects` listing only CSS files, subpath `exports`                             | Both consumers are Vite ESM                                                                                                           |
| S9  | Docs and playground        | Storybook (`react-vite`) with a11y addon; one story file per component                        | Doubles as visual spec and component documentation                                                                                    |
| S10 | Tests                      | Vitest + Testing Library; axe checks on interactive components                                | Both apps already use or can use Vitest; keeps one runner                                                                             |
| S11 | Versioning and release     | Changesets, semver                                                                            | Two consumers need explicit breaking-change signals                                                                                   |
| S12 | Quality gates              | ESLint 9 flat config, Prettier, Husky + lint-staged, `tsc --noEmit`, same rules as the apps   | A component that passes here must pass in both apps                                                                                   |
| S13 | Package manager            | **OPEN**                                                                                      | Apps disagree (npm vs bun). Recommendation: **npm**, the lowest common denominator in CI; the published package does not depend on it |
| S14 | Distribution               | **OPEN**                                                                                      | See section 5. Recommendation: private versioned package                                                                              |
| S15 | Charts and DnD             | Out of the core entry; separate optional entries (`lost-ui/charts`, `lost-ui/dnd`)            | Versions diverge (recharts 3.10 vs 2.15, motion 14 vs 13, dnd-kit `react` vs `core`). Do not force a migration inside the library     |

## 4. Theming contract

This is the part that makes one library serve two brands.

- The library ships `lost-ui/styles.css` containing only the **semantic token mapping** (`@theme inline` entries such as `--color-primary: var(--primary)`, radii derived from `--radius`, font families from `--font-sans` / `--font-display`). It contains **no brand values**.
- Each app defines the **values** (`--background`, `--primary`, `--radius`, fonts, brand palette like `--violet` / `--terracota-escura`) in its own `styles.css`, as it does today.
- Token names follow the shadcn semantic set already used by both apps, so existing components keep working.
- Components use semantic classes only (`bg-primary`, `text-muted-foreground`). No hex colors, no raw Tailwind palette (`bg-violet-500`). Both apps already enforce this by hook or lint.
- An optional `lost-ui/theme-neutral.css` provides default values so Storybook and tests render without an app.
- Brand-specific fonts (`--font-display`, `--font-hand`) are a token; the library never loads fonts.

**Tailwind scanning.** Tailwind v4 only emits classes it can see. `lost-ui/styles.css` declares `@source "../dist"` itself, relative to the stylesheet, so an app needs only the imports:

```css
@import "tailwindcss";
@import "lost-ui/styles.css";
@import "lost-ui/effects.css";
@import "lost-ui/theme-neutral.css";
```

`theme-neutral.css` is optional: an app that defines its own values for the tokens leaves it out. `effects.css` is needed only when using `lost-ui/effects`. This was verified by installing the packed tarball in an empty project and compiling with `@tailwindcss/cli` 4.3.3: the library's classes and `lost-*` keyframes were emitted. It was **not** yet verified inside memoria-print, which uses `@import "tailwindcss" source(none)`; test it there first.

**Namespacing.** Animations are prefixed `lost-` (`animate-lost-marquee`, `@keyframes lost-marquee`). The upstream names `pulse` and `ping` would otherwise override Tailwind's built-in `animate-pulse` and `animate-ping`, which both apps use.

**Library tokens beyond shadcn's set.** `--destructive-foreground`, `--effect-from` and `--effect-to` (the two-colour accent used by gradients and glows) and `--rainbow-1` to `--rainbow-5`. An app that skips `theme-neutral.css` must define them.

## 5. Distribution (OPEN)

The apps are separate repositories (no workspace), so the library cannot be consumed by relative path in production.

| Option                                                                  | Pros                                                                     | Cons                                                                        |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **A. Private package** (GitHub Packages or similar), semver, Changesets | One source of truth; explicit upgrades per app; breaking changes visible | Needs a registry and publish pipeline; local dev needs `link`               |
| B. shadcn-style registry (copy components into each app)                | Apps can customise freely; no version coupling                           | Copies drift, which is exactly the problem to solve; fixes do not propagate |
| C. Monorepo with the two apps                                           | Instant local iteration                                                  | Requires merging three repos; large change for a study project              |

**Recommendation: A**, with a local workflow (`npm link` / `bun link`, or `file:` dependency) for iterating against both apps before publishing. Postponed by the owner: the package is `private` and has not been published. The structure (subpath `exports`, `files`, peers) is already shaped for A, and `npm pack` plus install of the tarball works.

## 6. Peer and version policy

- Peers: `react`, `react-dom`, `tailwindcss`, `lucide-react`. Ranges are the intersection of both apps and widen only when both apps support the new range.
- Dependencies (bundled by the consumer's resolver, not copied): Radix packages, `cva`, `clsx`, `tailwind-merge`, `cmdk`, `sonner`, `vaul`, `react-day-picker`, `date-fns`.
- `zod` and `react-hook-form` are peers (the apps own their schemas and form state; the library only provides field components).
- Before adding any dependency, check it against both apps' `package.json` first.

## 7. Next documents

1. `architecture.md`: layers (tokens, primitives, patterns), folder layout, import rules, entry points.
2. `component-conventions.md`: file anatomy, props, `asChild`, `className`, `data-slot`, variants, a11y baseline, story and test requirements.
3. `theming.md`: full token list and how to add a brand.
4. `consuming.md`: install, Tailwind `@source`, migration steps from `shared/ui` and `shared/admin`.
5. `release.md`: Changesets flow, breaking-change policy, supporting two consumers.

## 8. Implementation status

Verified on 2026-10-28: `tsc --noEmit`, `vite build` and Prettier pass; **980 tests in 170 files, all passing** (ui 116, effects 433, charts 178, forms 253); a packed tarball installs in an empty project and its entries import (`lost-ui`, `/ui`, `/effects`, `/charts`, `/forms` and the by-path entries); 585 Storybook stories open in headless Chromium, 4 with console errors that come from third-party images and a video used by Magic UI examples.

| Layer         | Content                                                                   | Entry                          | Doc                                                |
| ------------- | ------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| `src/ui`      | 45 shadcn primitives (one folder each)                                    | `lost-ui`, `lost-ui/ui/<name>` |                                                    |
| `src/effects` | 79 Magic UI components with 170 examples                                  | `lost-ui/effects`              | [magic-ui-integration.md](magic-ui-integration.md) |
| `src/charts`  | Recharts wrapper split into components, 6 data-driven charts, 70 examples | `lost-ui/charts`               | [charts.md](charts.md)                             |
| `src/forms`   | QForm-style `Form`, 19 field components, `FormBuilder`, `rules`           | `lost-ui/forms`                | [forms.md](forms.md)                               |

Tests run in jsdom: they prove structure, state and behaviour, not layout or pixels. Charts and the first set of effects were also looked at in headless Chromium in a light theme.

Not done: see [pending.md](pending.md) (ESLint, Husky and Changesets, distribution, stricter compiler options, integration in the two apps, dark mode and real-browser review of forms, Nuxt UI parity gaps).
