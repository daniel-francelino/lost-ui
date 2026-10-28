# lost-ui

Shared React component library for **aura-creative** and **memoria-print**. React 19, Tailwind CSS v4, shadcn/ui primitives and Radix, with animations from [Motion](https://motion.dev).

It has the primitives, Nuxt UI style pieces, the frame of an internal app (sidebar, top bar, bottom bar), validated forms, a data table, charts, landing-page effects and ready-made screens (login, register, settings, notifications…). Texts come in English, Spanish and Portuguese.

## What is inside

| Layer       | Import                                               | What it is                                                                                    |
| ----------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `ui`        | `@danielsoaresf/lost-ui/ui`                          | shadcn primitives (button, dialog, select…)                                                   |
| `elements`  | `@danielsoaresf/lost-ui/elements`                    | small pieces: `Kbd`, `Chip`, `AvatarGroup`, `Stepper`, `Modal`, `Slideover`, `PageTransition` |
| `app`       | `@danielsoaresf/lost-ui/app`                         | frame of an app: `AppShell`, `AppSidebar`, `AppTopbar`, `BottomNav`, `UserMenu`, `ErrorPage`  |
| `forms`     | `@danielsoaresf/lost-ui/forms`                       | fields validated by `rules` (like Quasar's QForm) and `FormBuilder`                           |
| `data`      | `@danielsoaresf/lost-ui/data`                        | `DataTable`, `Empty`, `Timeline`, `TreeView`, `UserInfo`                                      |
| `charts`    | `@danielsoaresf/lost-ui/charts`                      | data-driven charts on Recharts                                                                |
| `effects`   | `@danielsoaresf/lost-ui/effects`                     | landing-page effects (Magic UI)                                                               |
| `templates` | `@danielsoaresf/lost-ui/templates/<category>/<page>` | whole pages and layouts, by category: `auth`, `errors`, `backoffice`                          |
| `i18n`      | `@danielsoaresf/lost-ui/i18n`                        | provider and hooks for en, es and pt                                                          |

A **component** is a piece you place in a screen. A **template** is the screen, or the frame of one, and the app only gives it props and handlers. See [docs/structure.md](docs/structure.md).

## Install in a project

The package is public on npm: [`@danielsoaresf/lost-ui`](https://www.npmjs.com/package/@danielsoaresf/lost-ui). It needs React 19 and Tailwind CSS v4 in the app.

### 1. Install the package and the required peers

```bash
npm i @danielsoaresf/lost-ui
npm i react react-dom tailwindcss tw-animate-css motion   # skip what the app already has
```

Required peers: `react` and `react-dom` (19), `tailwindcss` (4), `tw-animate-css` and `motion` (13 or 14).

#### Shorter imports (optional)

To import from `lost-ui/...` instead of `@danielsoaresf/lost-ui/...`, install the package under an alias. npm puts it in `node_modules/lost-ui`, so TypeScript and the bundler resolve it with no extra config:

```bash
npm i "lost-ui@npm:@danielsoaresf/lost-ui"
```

```tsx
import { LoginPage } from "lost-ui/templates/auth/login-page";
```

`package.json` keeps `"lost-ui": "npm:@danielsoaresf/lost-ui@^0.1.0"`. Never run a plain `npm i lost-ui`: the unscoped name on npm is another package. Everything below uses the scoped name; drop the `@danielsoaresf/` prefix if you use the alias.

### 2. Install the optional peers of what you use

A component that needs an extra package imports it by its own path, so the app only installs what it uses:

| You use                                   | Install                                          |
| ----------------------------------------- | ------------------------------------------------ |
| `App` (`.../app/app`), `Toaster`, `toast` | `sonner`                                         |
| any chart (`.../charts`)                  | `recharts`                                       |
| the shadcn `Form` primitive               | `react-hook-form`                                |
| `Calendar`, `FormInputDate`               | `react-day-picker`                               |
| `InputOTP`, `FormPinInput`                | `input-otp`                                      |
| `FormInputPhone`, `FormCountrySelect`     | `libphonenumber-js`, `country-flag-icons`        |
| `FormEmojiPicker`                         | `emoji-picker-react`                             |
| `Command`, `Drawer`                       | `cmdk`, `vaul`                                   |
| `Resizable`, `Carousel`                   | `react-resizable-panels`, `embla-carousel-react` |

The full list, with the effects that need `cobe`, `shiki`, `react-tweet`…, is in [skills/lost-ui/references/setup.md](skills/lost-ui/references/setup.md).

### 3. Import the styles

In the main CSS file of the app (the one that has `@import "tailwindcss"`):

```css
@import "tailwindcss";
@import "@danielsoaresf/lost-ui/styles.css"; /* token mapping, no brand values */
@import "@danielsoaresf/lost-ui/theme-neutral.css"; /* default values; leave out when the app defines its own */
@import "@danielsoaresf/lost-ui/effects.css"; /* only if you use @danielsoaresf/lost-ui/effects */
```

`styles.css` already tells Tailwind to scan the library, so no `@source` line is needed. If the app uses `@import "tailwindcss" source(none)`, check that the classes of the library still appear. Without `theme-neutral.css`, the app must define the tokens (`--background`, `--primary`, `--radius`…). Dark mode is the `.dark` class on an ancestor.

### 4. Wrap the app once

```tsx
import { App } from "@danielsoaresf/lost-ui/app/app"; // needs sonner

<App language="en">{/* router outlet */}</App>;
```

`App` joins the language provider (`en`, `es`, `pt`), the tooltip provider and the toaster. Then import from the layers, for example `@danielsoaresf/lost-ui/ui`, `/elements`, `/forms`, `/data`, `/templates`.

### 5. Check it works

Render a button and a template:

```tsx
import { Button } from "@danielsoaresf/lost-ui/ui";
import { NotFoundPage } from "@danielsoaresf/lost-ui/templates";
```

If a component shows without style, the CSS imports of step 3 are missing or the CSS file is not loaded. For TypeScript, use `"moduleResolution": "bundler"` (or `node16`/`nodenext`) in `tsconfig.json`, so the `exports` of the package are resolved. With Vite, if React appears twice (hook errors), add `resolve.dedupe: ["react", "react-dom"]`.

### Use it with Claude Code

The package ships a skill that teaches Claude Code the components and their props. Copy it into the app:

```bash
mkdir -p .claude/skills && cp -r node_modules/@danielsoaresf/lost-ui/skills/lost-ui .claude/skills/
```

On Windows PowerShell: `Copy-Item -Recurse node_modules\@danielsoaresf\lost-ui\skills\lost-ui .claude\skills\`. Do it again after updating the library, so the skill has the current props.

### Update

```bash
npm i @danielsoaresf/lost-ui@latest
```

### Try a local build before publishing

```bash
# in lost-ui
npm install
npm run build
npm pack                               # danielsoaresf-lost-ui-0.1.0.tgz

# in the app
npm i ../lost-ui/danielsoaresf-lost-ui-0.1.0.tgz
```

## Use

Use the components:

```tsx
import { App } from "@danielsoaresf/lost-ui/app/app"; // needs sonner
import { LoginPage } from "@danielsoaresf/lost-ui/templates";

export function Login() {
  return (
    <App language="en">
      <LoginPage
        onSubmit={async ({ identifier, password }) => {
          const error = await signIn(identifier, password);
          return error; // a returned text is shown as the error of the form
        }}
        forgotPasswordHref="/recover-password"
        registerHref="/register"
      />
    </App>
  );
}
```

Navigation is router-agnostic: pass `renderLink` with the link of your router. Templates never fetch data or decide permissions; the app passes items and handlers.

## Develop

| Command             | Use                                                         |
| ------------------- | ----------------------------------------------------------- |
| `npm run storybook` | Storybook on port 6006                                      |
| `npm test`          | Vitest, all tests                                           |
| `npm run typecheck` | `tsc --noEmit`                                              |
| `npm run build`     | library build and declarations                              |
| `npm run barrels`   | regenerate the `index.ts` files of the layers (do not edit) |
| `npm run skill`     | regenerate the API reference of the Claude Code skill       |
| `npm run format`    | Prettier                                                    |

Every component has a folder with the component, its stories and its tests (`<name>.test.tsx`). The rules are in [CLAUDE.md](CLAUDE.md).

## Documentation

- [docs/README.md](docs/README.md): map of the documents
- [docs/structure.md](docs/structure.md): folders, templates, the internal layout
- [docs/stack.md](docs/stack.md): stack and decisions
- [docs/forms.md](docs/forms.md), [docs/charts.md](docs/charts.md), [docs/i18n.md](docs/i18n.md), [docs/notifications.md](docs/notifications.md)
- [skills/lost-ui](skills/lost-ui/SKILL.md): Claude Code skill to build screens with the library in an app

## License

[MIT](LICENSE). The code imported from other projects keeps its own licence, see [docs/THIRD_PARTY_NOTICES.md](docs/THIRD_PARTY_NOTICES.md).

## Credits

Built on [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com), [Magic UI](https://magicui.design), [Recharts](https://recharts.org) and [Motion](https://motion.dev); the element and data components follow [Nuxt UI](https://ui.nuxt.com). Details in [docs/THIRD_PARTY_NOTICES.md](docs/THIRD_PARTY_NOTICES.md).
