import { MotionConfig, motion } from "motion/react";
import { useId, type ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { cn } from "../../lib/cn";
import { indicatorSpring } from "../../lib/motion";
import {
  defaultRenderLink,
  isNavItemActive,
  navItemKey,
  type NavItem,
  type RenderNavLink,
} from "../../components/app/app-nav";
import { PageHeader } from "../../components/app/page-header";

export type SettingsLayoutProps = {
  /** The pages of the settings: General, Billing, Notifications, Security… */
  items: NavItem[];
  /** The page now, to mark the active tab. Defaults to the address of the window. */
  pathname?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Draws the links of the tabs with the router of the app. */
  renderLink?: RenderNavLink;
  /** Where the tabs go: `top` is a row under the title, `side` a column at the left from `md` up. */
  navigation?: "top" | "side";
  children?: ReactNode;
  className?: string;
};

/** The frame of the settings pages: a title, the tabs between pages and a column for the page. */
export function SettingsLayout({
  items,
  pathname,
  title,
  description,
  renderLink = defaultRenderLink,
  navigation = "top",
  children,
  className,
}: SettingsLayoutProps) {
  const { t } = useLostTranslation();
  const current = pathname ?? (typeof window === "undefined" ? "" : window.location.pathname);
  const side = navigation === "side";
  const indicatorId = useId();

  return (
    <MotionConfig reducedMotion="user">
      <div data-slot="settings-layout" className={cn("space-y-6", className)}>
        <PageHeader title={title ?? t("settingsPage.title")} description={description} />
        <div className={cn(side ? "grid gap-6 md:grid-cols-[14rem_1fr]" : "space-y-6")}>
          <nav
            aria-label={typeof title === "string" ? title : t("settingsPage.title")}
            className={cn(
              "flex gap-1 overflow-x-auto [scrollbar-width:none]",
              side ? "md:flex-col md:overflow-visible" : "border-b",
            )}
          >
            {items
              .filter((item) => !item.hidden)
              .map((item) => {
                const active = isNavItemActive(item, current);
                return (
                  <div key={navItemKey(item)} className="contents">
                    {renderLink({
                      item,
                      href: item.to ?? "#",
                      "aria-current": active ? "page" : undefined,
                      className: cn(
                        "relative isolate flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors [&_svg]:size-4",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      ),
                      children: (
                        <>
                          {active && (
                            <motion.span
                              layoutId={`${indicatorId}-tab`}
                              aria-hidden="true"
                              data-slot="settings-tab-indicator"
                              className={cn(
                                "absolute -z-10",
                                side
                                  ? "inset-0 rounded-md bg-accent"
                                  : "inset-x-0 -bottom-px h-0.5 bg-primary",
                              )}
                              transition={indicatorSpring}
                            />
                          )}
                          {item.icon}
                          {item.title}
                        </>
                      ),
                    })}
                  </div>
                );
              })}
          </nav>
          <div className={cn("w-full space-y-6", !side && "max-w-2xl")}>{children}</div>
        </div>
      </div>
    </MotionConfig>
  );
}
