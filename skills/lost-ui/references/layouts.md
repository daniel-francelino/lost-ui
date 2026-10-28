# Layouts and pages

Templates from `lost-ui/templates` (the props of each are in [api/templates](api/templates.md)) and the pieces of `lost-ui/app` they are made of. Every one is router-agnostic (`renderLink`), takes its data as props and reports with handlers. `renderLink` below is `({ item, href: _href, children, ...rest }) => <Link to={item.to} {...rest}>{children}</Link>` with the router of the app.

## Backoffice layout

```tsx
import { BackofficeLayout } from "lost-ui/templates";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";

const renderLink = ({ item, href: _href, children, ...rest }) => (
  <Link to={item.to} {...rest}>
    {children}
  </Link>
);

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <BackofficeLayout
      sections={navigation} // { label?, items: NavItem[] }[]  (title, icon, to, exact, badge, children, hidden)
      allow={(item) => canSee(item)} // permissions stay in the app
      pathname={pathname}
      renderLink={renderLink}
      logo={<Logo />}
      user={{ name, email, description: role }}
      userItems={[{ title: "My profile", to: "/admin/profile" }]}
      onSignOut={signOut}
      breadcrumbs={crumbs} // { label, to? }[]
      unreadCount={unread}
      notificationsHref="/admin/notifications"
      spaces={spaces} // { id, title, icon, to }[]  (hidden when fewer than 2)
      currentSpace="marketing"
      bottomItems={main}
      moreItems={rest} // the bar of phones; leave out for none
      transitionKey={pathname} // animates the page swap
    >
      <Outlet />
    </BackofficeLayout>
  );
}
```

Need more control? Use `AppShell`, `AppSidebar`, `AppTopbar`, `UserMenu`, `SpaceSwitcher`, `NotificationButton`, `BottomNav` from `lost-ui/app`. `NavItem` helpers: `filterNavigation`, `isNavItemActive`, `flattenNavigation`.

## Auth pages

```tsx
import { LoginPage } from "lost-ui/templates";

<LoginPage
  logo={<Logo />}
  description="Back office"
  forgotPasswordHref="/admin/recover-password"
  registerHref="/admin/register"
  renderLink={renderLink}
  onSubmit={async ({ identifier, password }) => {
    const result = await signIn({ identifier, password });
    if (!result.ok) return errors[result.reason]; // a text is shown as the form error
    router.history.push(redirectTo); // returning nothing means it worked
  }}
/>;
```

`RegisterPage` (`fields`, `minPasswordLength`, `loginHref`, `onSubmit(values)`), `ForgotPasswordPage` (`onSubmit({ email })`, then shows "check your email"), `ResetPasswordPage` (`onSubmit({ password })`), `AuthMessagePage` (`title`, `description`, `icon`, `actions`).

## Error pages

```tsx
// router errorComponent / notFoundComponent, inside the layout
<ErrorFallback onRetry={reset} homeHref="/admin" renderLink={renderLink} />
<NotFoundPage homeHref="/admin" renderLink={renderLink} />
<ForbiddenPage homeHref="/admin" renderLink={renderLink} />
```

For a screen of its own (public site): `ErrorPage` from `lost-ui/app/error-page` with `error={{ statusCode, message }}`.

## Notifications page

```tsx
<NotificationsPage
  notifications={items} // { id, title, body?, createdAt, readAt?, severity?, kind? }[]
  loading={isLoading}
  error={isError}
  onRetry={refetch}
  unreadCount={unread}
  onReadAll={readAll}
  onOpen={open}
  onRead={read}
  onSnooze={snooze}
  filter={filter}
  onFilterChange={setFilter} // "all" | "unread" | "snoozed"
  kinds={kinds}
  kind={kind}
  onKindChange={setKind}
  hasMore={items.length < total}
  loadingMore={isFetching}
  onLoadMore={more}
/>
```

Preferences: `<SettingsSection title="Notifications"><NotificationPreferences preferences={rows} onChange={(kind, channels) => save(kind, channels)} /></SettingsSection>`.

## Settings and profile

```tsx
<SettingsLayout items={settingsTabs} pathname={pathname} renderLink={renderLink}>
  <Outlet />
</SettingsLayout>

<SettingsIndexPage entries={entries.filter(can)} renderLink={renderLink} />   // entries: NavItem + description

<ProfilePage
  name={profile.name}
  description={`@${profile.username} · ${email}`}
  onSaveName={async (name) => (await save(name)).ok ? undefined : "Could not save."}
  onChangePassword={async ({ password }) => update(password)}
>
  {/* extra sections, e.g. notification preferences */}
</ProfilePage>
```
