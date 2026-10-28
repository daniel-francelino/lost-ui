# Recipes

Short, correct starting points. Prop names are the ones in the library; check the `.d.ts` or the story when in doubt.

## App wrapper

```tsx
import { App } from "lost-ui/app/app";

<App language={i18n.language}>{/* router outlet */}</App>;
```

Without `App`: `LostI18nProvider` from `lost-ui/i18n` plus one `<Toaster />` from `lost-ui/ui/sonner`.

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

## Forms

```tsx
import { Form, FormInput, FormInputPassword, FormSelect, rules } from "lost-ui/forms";

<Form onSubmit={() => save(values)}>
  <FormInput
    label="Email"
    type="email"
    required
    value={values.email}
    onValueChange={(email) => setValues((v) => ({ ...v, email }))}
    rules={[rules.required(), rules.email()]}
  />
  <FormInputPassword label="Password" rules={[rules.required(), rules.minLength(10)]} />
  <button type="submit">Save</button>
</Form>;
```

Many fields from data: `FormBuilder` (import by path `lost-ui/forms/form-builder`) with `fields={[{ control: "input", name, label, rules, visible, colSpan }]}`, `columns`, `onSubmit(values)`. Masks: `<FormInput mask="(##) #####-####" unmask />`.

## DataTable

```tsx
import { DataTable, type DataTableColumn } from "lost-ui/data";

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "created", header: "Created", accessor: "created", cell: (row) => formatDate(row.created) },
];

<DataTable
  data={users}
  columns={columns}
  getRowId={(user) => user.id}
  total={total}
  page={page}
  pageSize={20}
  onPageChange={setPage} // server mode
  sort={sort}
  onSortChange={setSort}
  loading={isLoading}
/>;
```

Full feature table (search, selection across pages, expand, column visibility, row actions with a reason when blocked) is in the library's `docs/nuxt-components.md`.

## Toast and modal

```tsx
import { toast } from "lost-ui/ui/sonner";
import { Modal } from "lost-ui/elements/modal";

toast.success("Saved.");

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Delete order?"
  description="This cannot be undone."
  footer={({ close }) => (
    <>
      <Button variant="outline" onClick={close}>
        Cancel
      </Button>
      <Button onClick={remove}>Delete</Button>
    </>
  )}
/>;
```

## Text in another language

```tsx
import { LostI18nProvider, registerMessages, useLostTranslation } from "lost-ui/i18n";

registerMessages("app", { en: { hello: "Hello" }, pt: { hello: "Olá" } });
const { t } = useLostTranslation("app"); // t("hello")
```
