# Structure of `src/`

```
src/
  components/
    ui/          shadcn primitives only
    elements/    small Nuxt UI style pieces made of primitives
    app/         the frame of an app: shell, navigation, header, footer, errors
    forms/       fields with `rules`, `Form`, `FormBuilder`
    data/        DataTable, Empty, Timeline, TreeView, UserInfo
    charts/      Recharts wrapper and data-driven charts
    effects/     landing-page effects (Magic UI)
    ai-chat/     the pieces of an AI chat: messages, prompt, reasoning, tool calls (see ai-chat.md)
    editor/      the Notion-style block editor on Tiptap (see editor.md)
    calendar/    reserved: Google Calendar-like screen
  templates/     pages and layouts the apps reuse, by category: auth, errors, backoffice, ai-chat (see below)
  i18n/          languages (en, es, pt), provider, hooks
  lib/           shared helpers (cn, use-controlled, theme-colors…)
  stories/       shims used by stories
  test/          Vitest setup
```

The public paths do not carry `components`: `@danielsoaresf/lost-ui/ui`, `@danielsoaresf/lost-ui/elements`, `@danielsoaresf/lost-ui/app`, `@danielsoaresf/lost-ui/forms`, `@danielsoaresf/lost-ui/data`, `@danielsoaresf/lost-ui/charts`, `@danielsoaresf/lost-ui/effects`, `@danielsoaresf/lost-ui/i18n`, plus `@danielsoaresf/lost-ui/<layer>/<component>` for one component. The root `lost-ui` exports `ui`, `elements`, `app`, `effects`, `data` and `i18n` (components that need an optional peer are imported by their path).

## Templates

`src/templates/` is not a component layer. A **component** is a piece you place in a screen; a **template** is the screen (or the frame of one) and is reused between projects: you give it props and handlers and the app keeps its data, routes and permissions.

| Template (category)                                                                                              | What it is                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `auth/`: `AuthLayout`, `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `AuthMessagePage` | sign in, sign up, recover and reset the password, "waiting for approval" / "confirm your email"             |
| `errors/`: `NotFoundPage`, `ForbiddenPage`, `ErrorFallback`                                                      | error pages to put inside the layout of the app (the full screen one is `ErrorPage`, in `app`)              |
| `backoffice/`: `BackofficeLayout`                                                                                | the whole internal layout from props: sidebar, top bar, bottom bar, user menu                               |
| `ai-chat/`: `AiChatPage`                                                                                         | the chat screen: list of conversations (a drawer on a phone), welcome with suggestions, messages and prompt |
| `backoffice/`: `NotificationsPage`                                                                               | list by day, filters, loading / error / empty states, load more                                             |
| `backoffice/`: `SettingsLayout`, `SettingsIndexPage`, `ProfilePage`                                              | tabs between settings pages, the grid of areas, name and password                                           |

The small pieces they use are components, in `components/app`: `NotificationItem`, `NotificationPreferences`, `SettingsSection`, `PageHeader`. Helpers shared by the templates (`useSubmit`, `SubmitButton`, `FormError`…) are in `templates/lib`.

Rules for a template: router-agnostic (`renderLink`), no data fetching (it receives items and calls handlers; a handler returns a text to show it as the error), texts from `i18n`, and it imports components, never the other way round. The public path is `@danielsoaresf/lost-ui/templates` (everything) or `@danielsoaresf/lost-ui/templates/<category>/<page>` (one page).

A template lives in a **category folder** (`src/templates/<category>/<page>/`), so the folder can grow with `marketing`, `ecommerce`, `landing-page`… Each category has a generated `index.ts`; a new category is just a new folder, then `npm run barrels`. `templates/lib` is not a category (shared helpers).

## Where a component goes

| It is…                                                                  | Folder      |
| ----------------------------------------------------------------------- | ----------- |
| copied from shadcn, keeps its upstream shape                            | `ui`        |
| small, made of primitives, no knowledge of an app (Chip, Kbd, Modal…)   | `elements`  |
| part of the frame of an internal screen or of a site (sidebar, header…) | `app`       |
| a field validated by `rules`                                            | `forms`     |
| shows records (table, tree, timeline)                                   | `data`      |
| a chart                                                                 | `charts`    |
| an animation for a landing page                                         | `effects`   |
| belongs to one of the big modules (chat, editor, calendar)              | its own dir |

A new layer needs a folder with component folders (each with an `index.ts`), then a line in `layers` of `scripts/generate-barrels.mjs` and `vite.config.ts` and its two entries in `package.json` `exports`. A folder with only a README is ignored by the tooling.

Layers import each other with relative paths (`../../ui/button`). The rule: `ui` imports nothing from the others; `elements` imports `ui`; `app`, `forms`, `data` and the modules import `ui` and `elements`.

## The internal layout (`app`)

Analysed from the three systems: **aura-creative** and **memoria-print** (TanStack Start, shadcn `Sidebar`) and **kortex** (Nuxt UI `UDashboardGroup`, Capacitor app).

What they share, and what became a component:

| In the systems                                                                                         | Component                                                      |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `SidebarProvider` + skip link + `SidebarInset` + sticky header + `main` with `max-w-6xl` (`_app.tsx`)  | `AppShell`                                                     |
| `AppSidebar` / `PortalSidebar`: groups with a label, leaves, collapsible parents, badges, rail         | `AppSidebar`                                                   |
| `nav-config.ts`: items with `to`, `exact`, `exclude`, `alsoActive`, `action` (permission), `badge`     | `NavItem`, `NavSection`, `filterNavigation`, `isNavItemActive` |
| header: sidebar trigger, separator, breadcrumbs, actions                                               | `AppTopbar`                                                    |
| footer of the sidebar: avatar, name, role, menu with profile and sign out                              | `UserMenu`                                                     |
| `SpaceSwitcher`: popover with a grid of areas (marketing / site / shop…)                               | `SpaceSwitcher`                                                |
| `NotificationBell` with unread count                                                                   | `NotificationButton`                                           |
| kortex `MobileBottomNav`: 4 fixed destinations, a "More" grid, tabs of the open page that replace them | `BottomNav`                                                    |
| error and not-found pages of the layout                                                                | `ErrorPage`                                                    |

How it fits together:

```tsx
<AppShell
  sidebar={
    <AppSidebar
      sections={sections}
      pathname={pathname}
      header={<Logo />}
      footer={<UserMenu name="…" onSignOut={signOut} />}
      renderLink={renderLink}
    />
  }
  topbar={
    <AppTopbar
      breadcrumbs={crumbs}
      actions={
        <>
          <SpaceSwitcher spaces={spaces} current="shop" />
          <NotificationButton count={unread} to="/notifications" />
        </>
      }
    />
  }
  bottomNav={
    <BottomNav items={main} moreItems={rest} pathname={pathname} renderLink={renderLink} />
  }
  overlay={<Toaster />}
>
  <Outlet />
</AppShell>
```

Decisions:

- **Router-agnostic.** Links go through `renderLink` (`({ item, href, children, ...rest }) => <Link to={item.to} {...rest}>{children}</Link>`); the default is an `<a>`. The app passes the router `pathname`.
- **Permissions stay in the app.** The systems filter by `can(auth, item.action)`. The library only has `hidden` and `filterNavigation(sections, allow)`, so the app decides with its own rules.
- **One navigation, two shapes.** The sidebar is the desktop (and a sheet below `lg`); `BottomNav` is hidden from `lg` up. Both read the same `NavItem` type. `BottomNav` sets `--bottom-nav-height`, which `AppShell` uses to leave room under the page.
- **Mobile like kortex.** `BottomNav` takes `contextItems` (tabs of the open page, e.g. inbox / sent) that replace the main destinations while there are some.
- **Not copied:** kortex's animated layout (motion), Capacitor safe-area handling beyond CSS `env()`, onboarding modal, team menu. They are app code.
- `SidebarInset` is a `div`, not a `main`: the shadcn version nested the `main` of the page inside another `main`.

## Reserved modules

`ai-chat` is built (see [ai-chat.md](ai-chat.md)). `editor` and `calendar` have a README each and no code. Kortex already has a Notion-like editor (`NotionEditor`, Tiptap) and a calendar (`appointments/*View`); memoria-print has a calendar (`erp/calendar`). They are the starting point when those modules are built.

## Motion

`motion` is a required peer of the library and the animated components share the timings in `src/lib/motion.ts` (`easeOut`, `indicatorSpring`, `panelSpring`, `stagger`, `listItem`, `swap`), taken from what aura-creative, memoria-print and kortex already do.

| Pattern                                                    | Where                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Marker that slides between items (`layoutId` and a spring) | `BottomNav`, `SettingsLayout` tabs                                                      |
| Content that swaps (`AnimatePresence mode="wait"`)         | `PageTransition`, `Stepper` content, `ForgotPasswordPage`, `AppShell` (`transitionKey`) |
| Items that come in one after the other                     | `AppSidebar` sub-menus                                                                  |
| Rows that enter and leave a list                           | `NotificationItem` in `NotificationsPage`                                               |
| Menu that rises over the page, with a fading backdrop      | `BottomNav` "More"                                                                      |
| Fill of a line as steps are done                           | `Stepper` separators                                                                    |
| Entrance of a card, fade of an error                       | `AuthLayout`, `FormError`                                                               |

Every animated component sits in a `MotionConfig reducedMotion="user"`, so a user who asked the system for less motion gets none. Tests set `MotionGlobalConfig.skipAnimations` in `src/test/setup.ts`, so they do not wait for an animation.
