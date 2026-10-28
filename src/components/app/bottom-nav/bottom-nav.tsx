import { MenuIcon } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useId, useState } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { duration, easeOut, indicatorSpring } from "../../../lib/motion";
import {
  badgeText,
  defaultRenderLink,
  isNavItemActive,
  navItemKey,
  type NavItem,
  type RenderNavLink,
} from "../app-nav";

export type BottomNavProps = {
  /** The main destinations, always in the bar. Four or five fit. */
  items: NavItem[];
  /** The rest of the destinations. They open from a "More" button, in a grid over the bar. */
  moreItems?: NavItem[];
  /**
   * Replaces `items` while there are some, e.g. the tabs of the page that is open (inbox, sent, drafts).
   * An item with `onSelect` and no `to` works as a tab: give it `active`.
   */
  contextItems?: NavItem[];
  /** The page now, to mark the active item. Defaults to the address of the window. */
  pathname?: string;
  renderLink?: RenderNavLink;
  moreLabel?: string;
  label?: string;
  className?: string;
};

const BAR_HEIGHT = "4.75rem";

/**
 * The navigation of small screens: a bar fixed at the bottom with the main destinations, a "More" menu
 * and, optionally, the tabs of the open page. It sets `--bottom-nav-height` so the page leaves room,
 * and hides itself from the `lg` screens up, where the sidebar takes over.
 */
export function BottomNav({
  items,
  moreItems = [],
  contextItems = [],
  pathname,
  renderLink = defaultRenderLink,
  moreLabel,
  label,
  className,
}: BottomNavProps) {
  const { t } = useLostTranslation();
  const [moreOpen, setMoreOpen] = useState(false);
  const indicatorId = useId();
  const current = pathname ?? (typeof window === "undefined" ? "" : window.location.pathname);
  const shown = contextItems.length > 0 ? contextItems : items;
  const hasMore = moreItems.length > 0 && contextItems.length === 0;
  const moreActive = moreItems.some((item) => isNavItemActive(item, current));

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--bottom-nav-height",
      `calc(${BAR_HEIGHT} + env(safe-area-inset-bottom, 0px))`,
    );
    return () => {
      root.style.removeProperty("--bottom-nav-height");
    };
  }, []);

  // moving to another page closes the menu
  useEffect(() => setMoreOpen(false), [current]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMoreOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const itemClass = (active: boolean) =>
    cn(
      "relative isolate flex min-h-14 min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-center transition-[color,transform] active:scale-95 [&_svg]:size-5 [&_svg]:shrink-0",
      active ? "text-primary" : "text-muted-foreground",
    );

  const content = (item: NavItem, active: boolean) => {
    const text = badgeText(item.badge, 9);
    return (
      <>
        {active && (
          <motion.span
            layoutId={`${indicatorId}-active`}
            aria-hidden="true"
            data-slot="bottom-nav-indicator"
            className="absolute inset-x-1 inset-y-1 -z-10 rounded-xl bg-primary/10"
            transition={indicatorSpring}
          />
        )}
        <span className="relative flex">
          {item.icon}
          {text && (
            <span className="absolute -right-2 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] leading-4 text-primary-foreground">
              {item.badgeLabel && <span className="sr-only">{item.badgeLabel}: </span>}
              {text}
            </span>
          )}
        </span>
        <span className="max-w-full truncate text-[10px] font-medium leading-tight">
          {item.title}
        </span>
      </>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            key="backdrop"
            data-slot="bottom-nav-backdrop"
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base }}
            onClick={() => setMoreOpen(false)}
          />
        )}
      </AnimatePresence>
      <div
        data-slot="bottom-nav"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden",
          className,
        )}
      >
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              key="more"
              id="bottom-nav-more"
              className="absolute inset-x-0 bottom-full grid grid-cols-3 gap-1 border-t border-border bg-popover p-3 shadow-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: duration.base, ease: easeOut }}
            >
              {moreItems.map((item) => {
                const active = isNavItemActive(item, current);
                const body = (
                  <>
                    {item.icon}
                    <span className="text-xs font-medium">{item.title}</span>
                  </>
                );
                const cls = cn(
                  "flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors [&_svg]:size-5",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                );
                return item.to !== undefined ? (
                  <div key={navItemKey(item)} className="contents">
                    {renderLink({
                      item,
                      href: item.to,
                      className: cls,
                      "aria-current": active ? "page" : undefined,
                      onClick: () => {
                        item.onSelect?.();
                        setMoreOpen(false);
                      },
                      children: body,
                    })}
                  </div>
                ) : (
                  <button
                    key={navItemKey(item)}
                    type="button"
                    className={cls}
                    onClick={() => {
                      item.onSelect?.();
                      setMoreOpen(false);
                    }}
                  >
                    {body}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <nav
          aria-label={label ?? t("appShell.bottomNavigation")}
          className="flex items-center overflow-x-auto px-2 py-1.5 [scrollbar-width:none]"
        >
          {shown.map((item) => {
            const active = isNavItemActive(item, current);
            return item.to !== undefined ? (
              <div key={navItemKey(item)} className="contents">
                {renderLink({
                  item,
                  href: item.to,
                  className: itemClass(active),
                  "aria-current": active ? "page" : undefined,
                  onClick: () => {
                    item.onSelect?.();
                    setMoreOpen(false);
                  },
                  children: content(item, active),
                })}
              </div>
            ) : (
              <button
                key={navItemKey(item)}
                type="button"
                aria-pressed={active}
                aria-label={item.title}
                className={itemClass(active)}
                onClick={() => item.onSelect?.()}
              >
                {content(item, active)}
              </button>
            );
          })}
          {hasMore && (
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls="bottom-nav-more"
              className={itemClass(moreActive || moreOpen)}
              onClick={() => setMoreOpen((open) => !open)}
            >
              <MenuIcon aria-hidden="true" />
              <span className="text-[10px] font-medium leading-tight">
                {moreLabel ?? t("appShell.more")}
              </span>
            </button>
          )}
        </nav>
      </div>
    </MotionConfig>
  );
}
