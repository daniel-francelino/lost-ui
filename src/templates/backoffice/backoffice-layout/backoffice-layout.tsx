import type { ReactNode } from "react";

import { AppShell, type AppShellProps } from "../../../components/app/app-shell";
import {
  filterNavigation,
  type NavItem,
  type NavSection,
  type RenderNavLink,
} from "../../../components/app/app-nav";
import { AppSidebar } from "../../../components/app/app-sidebar";
import { AppTopbar, type TopbarCrumb } from "../../../components/app/app-topbar";
import { BottomNav } from "../../../components/app/bottom-nav";
import { NotificationButton } from "../../../components/app/notification-button";
import { SpaceSwitcher, type Space } from "../../../components/app/space-switcher";
import { UserMenu } from "../../../components/app/user-menu";

export type BackofficeUser = {
  name: string;
  email?: string;
  /** Under the name, e.g. the role. */
  description?: string;
  avatarUrl?: string;
};

export type BackofficeLayoutProps = Pick<
  AppShellProps,
  "fullScreen" | "fullWidth" | "overlay" | "defaultSidebarOpen" | "transitionKey" | "className"
> & {
  /** The navigation. `hidden` items and empty groups are left out; use `allow` for permissions. */
  sections: NavSection[];
  /** Decides per item whether the user may see it, e.g. `(item) => can(user, item.permission)`. */
  allow?: (item: NavItem) => boolean;
  /** The page now. Defaults to the address of the window. */
  pathname?: string;
  renderLink?: RenderNavLink;
  /** The top of the sidebar: the logo, a team menu… */
  logo?: ReactNode;
  user?: BackofficeUser;
  /** Links in the menu of the user, e.g. "My profile". */
  userItems?: NavItem[];
  onSignOut?: () => void;
  /** The path to the page, in the top bar. */
  breadcrumbs?: TopbarCrumb[];
  /** The areas of the app, as a switcher in the top bar. */
  spaces?: Space[];
  currentSpace?: string;
  /** Unread notifications. Setting it (even to 0) shows the bell. */
  unreadCount?: number;
  /** Where the bell goes. */
  notificationsHref?: string;
  onNotificationsClick?: () => void;
  /** More in the end of the top bar. */
  topbarActions?: ReactNode;
  /** The bottom bar of small screens. Leave out to have none. */
  bottomItems?: NavItem[];
  moreItems?: NavItem[];
  contextItems?: NavItem[];
  children?: ReactNode;
};

/**
 * The whole internal layout of a backoffice from props: sidebar with the navigation and the user,
 * top bar with breadcrumbs, space switcher and notifications, the page, and the bottom bar on phones.
 * Everything it draws is also exported on its own, for an app that needs more control.
 */
export function BackofficeLayout({
  sections,
  allow,
  pathname,
  renderLink,
  logo,
  user,
  userItems,
  onSignOut,
  breadcrumbs,
  spaces,
  currentSpace,
  unreadCount,
  notificationsHref,
  onNotificationsClick,
  topbarActions,
  bottomItems,
  moreItems,
  contextItems,
  children,
  ...shell
}: BackofficeLayoutProps) {
  const visible = filterNavigation(sections, allow);
  const showBell = unreadCount !== undefined;

  return (
    <AppShell
      {...shell}
      sidebar={
        <AppSidebar
          sections={visible}
          pathname={pathname}
          renderLink={renderLink}
          header={logo}
          footer={
            user && (
              <UserMenu {...user} items={userItems} onSignOut={onSignOut} renderLink={renderLink} />
            )
          }
        />
      }
      topbar={
        <AppTopbar
          breadcrumbs={breadcrumbs}
          renderLink={renderLink}
          actions={
            <>
              {spaces && (
                <SpaceSwitcher spaces={spaces} current={currentSpace} renderLink={renderLink} />
              )}
              {showBell && (
                <NotificationButton
                  count={unreadCount}
                  to={notificationsHref}
                  onClick={onNotificationsClick}
                  renderLink={renderLink}
                />
              )}
              {topbarActions}
            </>
          }
        />
      }
      bottomNav={
        bottomItems && (
          <BottomNav
            items={bottomItems}
            moreItems={moreItems}
            contextItems={contextItems}
            pathname={pathname}
            renderLink={renderLink}
          />
        )
      }
    >
      {children}
    </AppShell>
  );
}
