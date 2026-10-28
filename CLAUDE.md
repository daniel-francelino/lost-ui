# lost-ui: instructions for Claude Code

Shared component library for aura-creative and memoria-print. Read `docs/README.md` for the map and `docs/stack.md` for the decisions. Documentation and code are in English; talk to the user in the language they use.

## Rule: every component has tests, always

1. **When you create a component, create its test in the same change.** A component without `<name>.test.tsx` is not finished.
2. **When you change a component, update its tests in the same change.** New behaviour, changed props, renamed classes or removed features each need the matching test change. A passing old test is not proof: check that the tests still assert the current behaviour.
3. **Before reporting done, run `npm test` and `npm run typecheck`** and report what failed, if anything, and what was not run.
4. Do not delete or weaken a test to make it pass. If a test is wrong, say why and fix its expectation.

## Component layout

Components live in `src/components/`, split by theme (see `docs/structure.md`). Each has its own folder under one of:

- `ui/`: shadcn primitives only (button, dialog, select…).
- `elements/`: small Nuxt UI style pieces built on the primitives (`Kbd`, `Chip`, `AvatarGroup`, `ButtonGroup`, `ProgressGroup`, `Link`, `Stepper`, `Modal`, `Slideover`).
- `app/`: the frame of an app (`AppShell`, `AppSidebar`, `AppTopbar`, `BottomNav`, `UserMenu`, `SpaceSwitcher`, `NotificationButton`, `Header`, `Footer`, `Main`, `Container`, `ErrorPage`, `Banner`, `Theme`, `App`, and the `Sidebar` primitive).
- `forms/` (fields validated like Quasar's QForm and the `FormBuilder`, see `docs/forms.md`), `data/` (`DataTable`, `Empty`, `Timeline`, `TreeView`, `UserInfo`, see `docs/nuxt-components.md`), `charts/` (see `docs/charts.md`) and `effects/` (landing-page effects).
- `src/templates/` (outside `components`): pages and layouts reused between projects, in a folder per category (`auth/`, `errors/`, `backoffice/`, `ai-chat/`; later `marketing/`, `ecommerce/`, `landing-page/`…): `src/templates/<category>/<page>/` (`LoginPage`, `BackofficeLayout`, `NotificationsPage`, `SettingsLayout`…). A template is a screen or the frame of one; anything smaller is a component. See `docs/structure.md`.
- `ai-chat/` (`ChatMessages`, `ChatMessage`, `ChatPrompt`, `ChatPromptSubmit`, `ChatReasoning`, `ChatTool`, `ChatShimmer`, `ChatPalette`, `ChatSuggestions`, `ChatAttachment`, and `chat-parts` with the message types; see `docs/ai-chat.md`): the pieces of an AI chat screen, no SDK needed.
- `editor/` (`RichTextEditor`, `EditorSlashMenu`, `EditorBubbleMenu`, `EditorBlockHandle`, `EditorTableBar`; see `docs/editor.md`): the Notion-style block editor on Tiptap. Its peers are optional.
- `calendar/`: reserved for the Google Calendar-like screen. Empty until it is built.

A folder is a layer only when it has component folders with an `index.ts`; the layers are listed in `scripts/generate-barrels.mjs` and `vite.config.ts`. Texts the components bring come from `src/i18n/` (en, es, pt, see `docs/i18n.md`): never hard-code a visible or screen-reader string, add the key to the three locales and read it with `useLostTranslation`:

```
src/components/effects/marquee/
  marquee.tsx           the component
  marquee.stories.tsx   Storybook stories (also used by the test)
  marquee.test.tsx      Vitest + Testing Library, renders the stories with composeStories
  index.ts              export * from "./marquee"
  examples/             effects only: the official Magic UI examples, one file each
```

The first story of an effect is `Playground` (interactive, drives the controls). Each file in `examples/` is also a story, named from the file (`marquee-demo-vertical` becomes `Vertical`), with its source shown in the docs through `?raw`. Examples keep their original code, so they may use literal colours and remote images; the colour rule below applies to the component, not to stories. `src/stories/` holds shims (`use-theme`, `link`) so examples written for Next.js run unchanged.

**One component per file.** A file exports one component (plus its props type); related components get their own folder, as the shadcn `chart.tsx` was split into six. Compound primitives copied from shadcn in `src/components/ui/` (dialog, select, sidebar…) are the known exception and keep their upstream shape.

**Charts and forms are used through props.** A chart family has a data-driven component (`AreaChart`, `PieChart`…) and its examples must call it with props; if an example needs something the component lacks, add the prop (with a story and a test) instead of dropping to raw Recharts. A form field takes `rules`, `lazyRules` and the shared `FieldProps`, uses `useField`, and registers with `Form` automatically.

Anything that belongs only to that component (constants, types, helpers, CSS variables) lives in its folder, not in `src/lib`.

- Import shared code with relative paths: `../../../lib/cn` (from `src/lib`), `../../ui/button` (another layer, which sits next to yours under `src/components`).
- A component that needs a heavy optional peer (cobe, shiki, react-tweet, cmdk, vaul, react-hook-form…) is added to the `standalone` set of its layer in `scripts/generate-barrels.mjs`, then run `npm run barrels`. Otherwise run `npm run barrels` after adding a folder so `@danielsoaresf/lost-ui/effects`, `@danielsoaresf/lost-ui/ui`, `@danielsoaresf/lost-ui/elements` or `@danielsoaresf/lost-ui/app` exports it.
- Animations and keyframes are prefixed `lost-` (`animate-lost-*`) so they cannot override Tailwind's own.
- Colours come from theme tokens (`bg-primary`, `var(--effect-from)`), not hex or the raw Tailwind palette. Exceptions are listed in `docs/magic-ui-integration.md`.

## Commands

| Command             | Use                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm test`          | Vitest, all tests                                                                                        |
| `npm run typecheck` | `tsc --noEmit`                                                                                           |
| `npm run build`     | library build and declarations                                                                           |
| `npm run storybook` | Storybook on port 6006                                                                                   |
| `npm run skill`     | regenerate the API reference of `skills/lost-ui` (props of every component); run it after changing props |
| `npm run barrels`   | regenerate `src/index.ts` and the `index.ts` of every layer in `src/components`                          |

## Do not

- Do not commit or push unless asked.
- Do not edit `src/index.ts` or the `index.ts` of a layer in `src/components` by hand; they are generated. `charts` and `forms` are not exported from the root entry because they need optional peers; the public paths stay `@danielsoaresf/lost-ui/ui`, `@danielsoaresf/lost-ui/elements`, `@danielsoaresf/lost-ui/app`, `@danielsoaresf/lost-ui/forms`, `@danielsoaresf/lost-ui/data`, `@danielsoaresf/lost-ui/charts` and `@danielsoaresf/lost-ui/effects`.
- Do not write a shell one-liner with backslashes or regexes (`node -e`, `sed`): the shell strips them. Use the Write or Edit tools for files with escapes.
- Do not copy app-specific code into `src/components/ui/` (brand tokens, locale, Portuguese strings). Primitives use semantic tokens and English text; the apps pass their own copy.
