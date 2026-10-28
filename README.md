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

## Install

```bash
npm i @danielsoaresf/lost-ui
```

To try a local build before publishing, install the tarball instead:

```bash
# in lost-ui
npm install
npm run build
npm pack                               # danielsoaresf-lost-ui-0.1.0.tgz

# in the app
npm i ../lost-ui/danielsoaresf-lost-ui-0.1.0.tgz
```

Required peers: `react`, `react-dom`, `tailwindcss`, `tw-animate-css` and `motion`. The others (`recharts`, `sonner`, `cmdk`, `react-hook-form`…) are optional and only needed by the components that use them; the list is in [skills/lost-ui/references/setup.md](skills/lost-ui/references/setup.md).

## Use

Styles, in the CSS of the app:

```css
@import "tailwindcss";
@import "@danielsoaresf/lost-ui/styles.css"; /* token mapping, no brand values */
@import "@danielsoaresf/lost-ui/theme-neutral.css"; /* optional default values */
```

The app defines the values of the theme tokens (`--background`, `--primary`, `--radius`…). Dark mode is the `.dark` class on an ancestor.

Wrap the app once and use the components:

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
