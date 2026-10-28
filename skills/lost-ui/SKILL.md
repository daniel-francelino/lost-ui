---
name: lost-ui
description: Use the lost-ui component library (shadcn primitives, Nuxt UI style elements, forms with rules, DataTable, charts, app layout, ready-made pages and templates, i18n en/es/pt) in aura-creative, memoria-print or any React 19 + Tailwind v4 app. Use it whenever the task is to build or change a screen, form, table, list, chart, layout, login/sign-up/settings/notifications/error page, toast, modal or sidebar in an app that depends on lost-ui, before writing the component by hand or copying one from another project.
---

# Using lost-ui

`lost-ui` is the shared component library of aura-creative and memoria-print. **Look for the piece in lost-ui before writing or copying one.** If it exists, use it through props; if it almost fits, add the missing prop to the library (see "Changing the library") instead of forking it in the app.

Docs and code of the library are in English. Reply to the user in the language they write in.

## 1. Where things live

Import by layer. The paths do not carry `components`.

| Import from         | What is there                                                                                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lost-ui/ui`        | shadcn primitives only: `Button`, `Dialog`, `Select`, `Tabs`, `Sidebar` pieces, `Toaster`/`toast`…                                                                                                   |
| `lost-ui/elements`  | small Nuxt UI style pieces: `Kbd`, `Chip`, `AvatarGroup`, `ButtonGroup`, `Link`, `Stepper`, `Modal`, `Slideover`, `PageTransition`                                                                   |
| `lost-ui/app`       | the frame of an app: `AppShell`, `AppSidebar`, `AppTopbar`, `BottomNav`, `UserMenu`, `SpaceSwitcher`, `NotificationButton`, `PageHeader`, `Header`, `Footer`, `ErrorPage`, `Banner`, `Theme`, `App`… |
| `lost-ui/forms`     | `Form`, every field (`FormInput`, `FormSelect`, `FormInputPassword`…), `FormBuilder`, `rules`                                                                                                        |
| `lost-ui/data`      | `DataTable` (+ pagination, row actions, column toggle), `Empty`, `Timeline`, `TreeView`, `UserInfo`                                                                                                  |
| `lost-ui/charts`    | data-driven `AreaChart`, `BarChart`, `LineChart`, `PieChart`, `RadarChart`, `RadialChart`                                                                                                            |
| `lost-ui/templates` | whole pages and layouts: `BackofficeLayout`, `LoginPage`, `RegisterPage`, `NotificationsPage`, `SettingsLayout`…                                                                                     |
| `lost-ui/effects`   | landing-page animations (Magic UI)                                                                                                                                                                   |
| `lost-ui/i18n`      | `LostI18nProvider`, `useLostTranslation`, `registerMessages`                                                                                                                                         |

One component: `lost-ui/<layer>/<folder>` (e.g. `lost-ui/forms/form-input-date`). The full list with the folder of each is in [references/catalog.md](references/catalog.md).

**Component vs template.** A component is a piece you place in a screen. A template is a page or the frame of one and is reused between projects; it takes props and handlers and keeps no data, routes or permissions.

## 2. Setup of an app

```css
@import "tailwindcss";
@import "lost-ui/styles.css"; /* token mapping, no brand values */
@import "lost-ui/effects.css"; /* only with lost-ui/effects */
@import "lost-ui/theme-neutral.css"; /* optional default values; leave out when the app defines the tokens */
```

- The app defines the **values** of the tokens (`--primary`, `--background`, `--radius`, `--success`/`--warning`/`--info`, `--effect-from`/`--effect-to`…). Components use semantic classes (`bg-primary`, `text-muted-foreground`), never hex or the raw Tailwind palette.
- Wrap the app once: `<App language={lang}>` (from `lost-ui/app/app`, needs `sonner`) or `<LostI18nProvider language={lang}>` plus the `Toaster`.
- Peers: `react`, `react-dom`, `tailwindcss`, `tw-animate-css`, `motion`. Everything else is an **optional peer**, installed only when the component that needs it is imported: `react-day-picker` (`FormInputDate`, `Calendar`), `input-otp`, `libphonenumber-js` + `country-flag-icons` (phone, country), `emoji-picker-react`, `sonner`, `cmdk`, `vaul`, `recharts`, `react-hook-form`, `react-resizable-panels`, `embla-carousel-react`. If an import fails for a missing package, install that peer; do not replace the component.
- Components that need a peer are imported **by path**, not from the layer barrel: `lost-ui/forms/form-input-date`, `form-pin-input`, `form-input-phone`, `form-country-select`, `form-emoji-picker`, `form-builder`; `lost-ui/ui/{calendar,carousel,command,drawer,form,input-otp,resizable,sonner}`; `lost-ui/app/app`.

## 3. Rules when building with it

1. **Texts.** The components bring their own texts in en/es/pt. Pass `language` to the provider; a prop always wins over the translation. The app's own texts can go in the same instance with `registerMessages("app", {...})`. Never hard-code a user-visible string inside a library component.
2. **Forms.** Every field takes `rules`, `lazyRules` and the shared field props (`label`, `hint`, `description`, `value`/`defaultValue`/`onValueChange`, `required`, `disabled`, `size`, `errorMessage`) and registers itself in the closest `Form`. `Form` validates on submit and calls `onSubmit` only when every rule passed. Rules are `rules.required()`, `minLength`, `maxLength`, `email`, `pattern`, `matches(() => other)`, `oneOf`, `min`/`max`/`between`, `minDate`/`maxDate`, `fileSize`/`fileType`, `when`, `debounce`… each takes an optional message. Do not write a custom validator for something `rules` has. For many fields from data, use `FormBuilder`.
3. **Links and routers.** Navigation components do not know your router. Pass `renderLink` (`({ item, href, children, ...rest }) => <Link to={item.to} {...rest}>{children}</Link>`, TanStack Router or any other). Pass the router `pathname` so the active item is marked.
4. **Permissions stay in the app.** Mark items `hidden` or pass `allow={(item) => …}`; the library never reads your auth.
5. **Data stays in the app.** `DataTable`, `NotificationsPage` and the other pages receive rows/items and call handlers (`onSortChange`, `onLoadMore`, `onRead`…). A submit handler of a template returns a text to show it as the error, or nothing when it worked.
6. **Motion.** Animated components already respect "reduce motion". Reuse `PageTransition` (and `AppShell`'s `transitionKey`) rather than writing new `motion` code for a page or panel swap.
7. **Do not duplicate.** Do not recreate `AuthShell`, `PageHeader`, `EmptyState`, `SectionCard`, `PasswordField`, `StatusBadge`-style pieces or app sidebars by hand: lost-ui has `AuthLayout`, `PageHeader`, `Empty`, `SettingsSection`, `FormInputPassword`, `Badge`/`Chip`, `AppSidebar`.

## 4. Pick the piece for the task

| Task                                            | Use                                                                           |
| ----------------------------------------------- | ----------------------------------------------------------------------------- |
| internal layout of a backoffice                 | `BackofficeLayout` (or `AppShell` + `AppSidebar` + `AppTopbar` + `BottomNav`) |
| sign in / sign up / recover / reset password    | `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`        |
| "waiting for approval", "confirm your email"    | `AuthMessagePage`                                                             |
| 404, no permission, broken page                 | `NotFoundPage`, `ForbiddenPage`, `ErrorFallback`; full screen: `ErrorPage`    |
| notifications page and preferences              | `NotificationsPage`, `NotificationPreferences`                                |
| settings area, profile                          | `SettingsLayout`, `SettingsIndexPage`, `SettingsSection`, `ProfilePage`       |
| list/table with sort, search, paging, selection | `DataTable` and its helpers                                                   |
| form                                            | `Form` + fields, or `FormBuilder`                                             |
| empty list, timeline, tree, user card           | `Empty`, `Timeline`, `TreeView`, `UserInfo`                                   |
| dialog / side panel                             | `Modal` / `Slideover` (props) or the `Dialog`/`Sheet` primitives              |
| toast                                           | `toast.success(...)` from `lost-ui/ui/sonner`, with `<Toaster />` once        |

Examples of each are in [references/recipes.md](references/recipes.md).

## 5. Workflow

1. Name the screen, then find the template or component in the catalog.
2. Read the props in the library (`dist/**/*.d.ts` in the app's `node_modules/lost-ui`, or `src/components/<layer>/<name>/<name>.tsx` in the library repo) and the story (`<name>.stories.tsx`) for examples. Do not guess prop names.
3. Compose from props. Keep app-specific data fetching, routes and permissions in the app.
4. If the app's design needs something the piece lacks, see below.
5. After the change run the app's own `typecheck`, lint and tests, and report what was not run.

## 6. Changing the library

Only when the user asks, or when a missing prop would otherwise force a fork. Work in the lost-ui repo and follow its `CLAUDE.md`: every component has a story and a test in the same change, texts come from `src/i18n` in the three locales, colours from tokens, one component per file, and `npm test` plus `npm run typecheck` before saying it is done. Do not edit the generated `index.ts` barrels; run `npm run barrels`.

## 7. Known limits

- The library is tested in jsdom: structure and behaviour are proven, layout and pixels are not. Check new screens in the browser or Storybook.
- `lost-ui/charts` and `lost-ui/forms` are not re-exported from the root entry because they need optional peers.
- Not yet verified inside memoria-print (it uses `@import "tailwindcss" source(none)`): test the Tailwind `@source` there first.
