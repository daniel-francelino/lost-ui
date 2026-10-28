import { Fragment, type ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { Separator } from "../../ui/separator";
import { defaultRenderLink, type RenderNavLink } from "../app-nav";
import { SidebarTrigger } from "../sidebar";

export type TopbarCrumb = { label: string; to?: string };

export type AppTopbarProps = {
  /** The path to the page. The last one is the page now. */
  breadcrumbs?: TopbarCrumb[];
  /** Between the breadcrumbs and the actions, e.g. a title or a search. */
  children?: ReactNode;
  /** The end of the bar, e.g. a `SpaceSwitcher` and a `NotificationButton`. */
  actions?: ReactNode;
  /** Shows the button that opens and closes the sidebar. */
  trigger?: boolean;
  renderLink?: RenderNavLink;
  className?: string;
};

/** The bar over the page: the sidebar button, the breadcrumbs and the actions. It keeps its place on scroll. */
export function AppTopbar({
  breadcrumbs,
  children,
  actions,
  trigger = true,
  renderLink = defaultRenderLink,
  className,
}: AppTopbarProps) {
  const { t } = useLostTranslation();
  return (
    <header
      data-slot="app-topbar"
      className={cn(
        "sticky top-0 z-10 flex h-[calc(3.5rem+env(safe-area-inset-top))] items-center gap-2 border-b border-border bg-background/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur pointer-coarse:h-[calc(4rem+env(safe-area-inset-top))]",
        className,
      )}
    >
      {trigger && (
        <>
          <SidebarTrigger aria-label={t("appShell.toggleSidebar")} />
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            {breadcrumbs.map((crumb, index) => {
              const last = index === breadcrumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${index}`}>
                  <BreadcrumbItem className={cn(!last && "hidden sm:inline-flex")}>
                    {last || crumb.to === undefined ? (
                      <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        {renderLink({
                          item: { title: crumb.label, to: crumb.to },
                          href: crumb.to,
                          children: crumb.label,
                        })}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!last && <BreadcrumbSeparator className="hidden sm:block" />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </header>
  );
}
