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
    ai-chat/     reserved: AI chat screen
    editor/      reserved: Notion-like editor
    calendar/    reserved: Google Calendar-like screen
  i18n/          languages (en, es, pt), provider, hooks
  lib/           shared helpers (cn, use-controlled, theme-colors…)
  stories/       shims used by stories
  test/          Vitest setup
```

The public paths do not carry `components`: `lost-ui/ui`, `lost-ui/elements`, `lost-ui/app`, `lost-ui/forms`, `lost-ui/data`, `lost-ui/charts`, `lost-ui/effects`, `lost-ui/i18n`, plus `lost-ui/<layer>/<component>` for one component. The root `lost-ui` exports `ui`, `elements`, `app`, `effects`, `data` and `i18n` (components that need an optional peer are imported by their path).

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

`ai-chat`, `editor` and `calendar` have a README each and no code. Kortex already has a Notion-like editor (`NotionEditor`, Tiptap) and a calendar (`appointments/*View`); memoria-print has a calendar (`erp/calendar`). They are the starting point when those modules are built.
