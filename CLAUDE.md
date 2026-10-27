# lost-ui: instructions for Claude Code

Shared component library for aura-creative and memoria-print. Read `docs/README.md` for the map and `docs/stack.md` for the decisions. Documentation and code are in English; talk to the user in the language they use.

## Rule: every component has tests, always

1. **When you create a component, create its test in the same change.** A component without `<name>.test.tsx` is not finished.
2. **When you change a component, update its tests in the same change.** New behaviour, changed props, renamed classes or removed features each need the matching test change. A passing old test is not proof: check that the tests still assert the current behaviour.
3. **Before reporting done, run `npm test` and `npm run typecheck`** and report what failed, if anything, and what was not run.
4. Do not delete or weaken a test to make it pass. If a test is wrong, say why and fix its expectation.

## Component layout

Each component has its own folder under `src/effects/` (landing-page effects) or `src/ui/` (primitives):

```
src/effects/marquee/
  marquee.tsx           the component
  marquee.stories.tsx   Storybook stories (also used by the test)
  marquee.test.tsx      Vitest + Testing Library, renders the stories with composeStories
  index.ts              export * from "./marquee"
```

Anything that belongs only to that component (constants, types, helpers, CSS variables) lives in its folder, not in `src/lib`.

- Import shared code with relative paths: `../../lib/cn`, `../../ui/button`.
- A component that needs a heavy optional peer (cobe, shiki, react-tweet…) is added to the `standalone` set in `scripts/generate-barrels.mjs`, then run `npm run barrels`. Otherwise run `npm run barrels` after adding a folder so `lost-ui/effects` exports it.
- Animations and keyframes are prefixed `lost-` (`animate-lost-*`) so they cannot override Tailwind's own.
- Colours come from theme tokens (`bg-primary`, `var(--effect-from)`), not hex or the raw Tailwind palette. Exceptions are listed in `docs/magic-ui-integration.md`.

## Commands

| Command             | Use                                                  |
| ------------------- | ---------------------------------------------------- |
| `npm test`          | Vitest, all tests                                    |
| `npm run typecheck` | `tsc --noEmit`                                       |
| `npm run build`     | library build and declarations                       |
| `npm run storybook` | Storybook on port 6006                               |
| `npm run barrels`   | regenerate `src/index.ts` and `src/effects/index.ts` |

## Do not

- Do not commit or push unless asked.
- Do not edit `src/index.ts` or `src/effects/index.ts` by hand; they are generated.
