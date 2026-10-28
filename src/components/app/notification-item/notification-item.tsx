import { BellRingIcon, CheckIcon, ClockIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { Button } from "../../ui/button";

export type NotificationSeverity = "info" | "warning" | "urgent";

export type NotificationData = {
  id: string;
  title: string;
  body?: string | null;
  createdAt: Date | string | number;
  /** When it was read. Empty means unread. */
  readAt?: Date | string | number | null;
  severity?: NotificationSeverity;
  /** The type of notification, to filter by. */
  kind?: string;
  icon?: ReactNode;
};

export type NotificationItemProps = {
  notification: NotificationData;
  /** Called when the notification is chosen, e.g. to go to what it is about. */
  onOpen?: (notification: NotificationData) => void;
  /** Adds "Mark as read" to the unread ones. */
  onRead?: (notification: NotificationData) => void;
  /** Adds "Snooze until tomorrow". */
  onSnooze?: (notification: NotificationData) => void;
  className?: string;
};

const severityStyle: Record<NotificationSeverity, string> = {
  info: "text-muted-foreground",
  warning: "text-warning",
  urgent: "text-destructive",
};

/** One row of a list of notifications: the dot of the unread ones, the text, the date and the actions. */
export function NotificationItem({
  notification,
  onOpen,
  onRead,
  onSnooze,
  className,
}: NotificationItemProps) {
  const { t, language } = useLostTranslation();
  const unread = notification.readAt === null || notification.readAt === undefined;
  const severity = notification.severity ?? "info";
  const date = new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(notification.createdAt));

  const text = (
    <>
      <span className="flex items-center gap-2 text-sm font-medium">
        <span aria-hidden="true" className={cn("flex [&_svg]:size-4", severityStyle[severity])}>
          {notification.icon ?? <BellRingIcon />}
        </span>
        {notification.title}
        <span className="text-xs font-normal text-muted-foreground">
          {t(`notificationsPage.${severity}`)}
        </span>
        {unread && <span className="sr-only">{t("notificationsPage.unreadSr")}</span>}
      </span>
      {notification.body && (
        <span className="mt-0.5 block text-sm text-muted-foreground">{notification.body}</span>
      )}
    </>
  );

  return (
    <li
      data-slot="notification-item"
      data-unread={unread || undefined}
      className={cn("flex gap-3 rounded-lg border bg-card p-3", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-1.5 size-2.5 shrink-0 rounded-full",
          unread ? "bg-primary" : "bg-transparent",
        )}
      />
      <div className="min-w-0 flex-1 space-y-1">
        {onOpen ? (
          <button
            type="button"
            className="block w-full text-left"
            onClick={() => onOpen(notification)}
          >
            {text}
          </button>
        ) : (
          <div>{text}</div>
        )}
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <time dateTime={new Date(notification.createdAt).toISOString()}>{date}</time>
          {unread && onRead && (
            <Button variant="ghost" size="sm" onClick={() => onRead(notification)}>
              <CheckIcon aria-hidden="true" />
              {t("notificationsPage.markRead")}
            </Button>
          )}
          {onSnooze && (
            <Button variant="ghost" size="sm" onClick={() => onSnooze(notification)}>
              <ClockIcon aria-hidden="true" />
              {t("notificationsPage.snooze")}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
