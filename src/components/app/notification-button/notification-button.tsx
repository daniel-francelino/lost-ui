import { BellIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { Button } from "../../ui/button";
import { badgeText, defaultRenderLink, type RenderNavLink } from "../app-nav";

export type NotificationButtonProps = {
  /** Unread notifications. Nothing is shown for 0. */
  count?: number;
  /** Above this the badge reads "9+". */
  max?: number;
  /** Makes the button a link, e.g. to the page of notifications. */
  to?: string;
  onClick?: () => void;
  renderLink?: RenderNavLink;
  /** Replaces the bell. */
  icon?: ReactNode;
  label?: string;
  className?: string;
};

/** The bell of the top bar, with the count of unread notifications. */
export function NotificationButton({
  count = 0,
  max = 9,
  to,
  onClick,
  renderLink = defaultRenderLink,
  icon,
  label,
  className,
}: NotificationButtonProps) {
  const { t } = useLostTranslation();
  const text = badgeText(count, max);
  const name = label ?? t("appShell.notifications");
  const content = (
    <>
      {icon ?? <BellIcon aria-hidden="true" />}
      {text && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground"
        >
          {text}
        </span>
      )}
      {text && <span className="sr-only">{t("appShell.unread", { count })}</span>}
    </>
  );

  return (
    <Button
      asChild={to !== undefined}
      variant="ghost"
      size="icon"
      aria-label={name}
      className={cn("relative", className)}
      data-slot="notification-button"
      onClick={to === undefined ? onClick : undefined}
    >
      {to !== undefined ? (
        renderLink({ item: { title: name, to }, href: to, onClick, children: content })
      ) : (
        <button type="button">{content}</button>
      )}
    </Button>
  );
}
