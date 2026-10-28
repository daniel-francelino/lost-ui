import { BellOffIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";
import { useMemo, type ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";
import { PageHeader } from "../../app/page-header";
import { Empty } from "../../data/empty";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { dayLabel } from "../lib/day-label";
import { NotificationItem, type NotificationData } from "../notification-item";

export type NotificationFilter = "all" | "unread" | "snoozed";

export type NotificationsPageProps = {
  notifications: NotificationData[];
  /** Shows skeleton rows instead of the list. */
  loading?: boolean;
  /** Shows the error state, with `onRetry`. A text is shown under the title. */
  error?: boolean | string;
  onRetry?: () => void;
  /** Number of unread, for the line under the title and the "Mark all as read" button. */
  unreadCount?: number;
  onReadAll?: () => void;
  onOpen?: (notification: NotificationData) => void;
  onRead?: (notification: NotificationData) => void;
  onSnooze?: (notification: NotificationData) => void;
  filter?: NotificationFilter;
  defaultFilter?: NotificationFilter;
  onFilterChange?: (filter: NotificationFilter) => void;
  /** Hides the "Snoozed" tab. */
  snoozeFilter?: boolean;
  /** The types of notification. Shown as a select when there is more than one. */
  kinds?: { value: string; label: string }[];
  kind?: string;
  defaultKind?: string;
  onKindChange?: (kind: string) => void;
  /** Shows "Load more" under the list. */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  title?: ReactNode;
  /** Replaces the text of the empty state. */
  emptyDescription?: ReactNode;
  className?: string;
};

const ALL_KINDS = "__all__";

/**
 * The page of all the notifications: filters by state and by type, the list grouped by day,
 * and the states of loading, error and empty. Data and actions stay with the app.
 */
export function NotificationsPage({
  notifications,
  loading = false,
  error = false,
  onRetry,
  unreadCount,
  onReadAll,
  onOpen,
  onRead,
  onSnooze,
  filter: filterProp,
  defaultFilter = "all",
  onFilterChange,
  snoozeFilter = true,
  kinds = [],
  kind: kindProp,
  defaultKind = ALL_KINDS,
  onKindChange,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  title,
  emptyDescription,
  className,
}: NotificationsPageProps) {
  const { t, language } = useLostTranslation();
  const [filterValue, setFilter] = useControlled<NotificationFilter>({
    value: filterProp,
    defaultValue: defaultFilter,
    onValueChange: onFilterChange,
  });
  const [kindValue, setKind] = useControlled<string>({
    value: kindProp,
    defaultValue: defaultKind,
    onValueChange: onKindChange,
  });
  const filter = filterValue ?? defaultFilter;
  const kind = kindValue ?? defaultKind;

  const groups = useMemo(() => {
    const now = new Date();
    const out: { key: string; text: string; items: NotificationData[] }[] = [];
    for (const item of notifications) {
      const day = dayLabel(item.createdAt, language, now);
      const text =
        day.kind === "today"
          ? t("notificationsPage.today")
          : day.kind === "yesterday"
            ? t("notificationsPage.yesterday")
            : day.text;
      const group = out.find((entry) => entry.key === day.key);
      if (group) group.items.push(item);
      else out.push({ key: day.key, text, items: [item] });
    }
    return out;
  }, [notifications, language, t]);

  const unread = unreadCount ?? 0;
  const emptyTitle =
    filter === "unread"
      ? t("notificationsPage.emptyUnread")
      : filter === "snoozed"
        ? t("notificationsPage.emptySnoozed")
        : t("notificationsPage.emptyAll");

  return (
    <div data-slot="notifications-page" className={cn("space-y-6", className)}>
      <PageHeader
        title={title ?? t("notificationsPage.title")}
        description={
          unreadCount === undefined
            ? undefined
            : unread === 0
              ? t("notificationsPage.caughtUp")
              : t("notificationsPage.unreadCount", { count: unread })
        }
        actions={
          unread > 0 && onReadAll ? (
            <Button variant="outline" onClick={onReadAll}>
              {t("notificationsPage.markAllRead")}
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as NotificationFilter)}>
          <TabsList>
            <TabsTrigger value="all">{t("notificationsPage.tabAll")}</TabsTrigger>
            <TabsTrigger value="unread">{t("notificationsPage.tabUnread")}</TabsTrigger>
            {snoozeFilter && (
              <TabsTrigger value="snoozed">{t("notificationsPage.tabSnoozed")}</TabsTrigger>
            )}
          </TabsList>
        </Tabs>
        {kinds.length > 1 && (
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger className="w-full sm:w-56" aria-label={t("notificationsPage.kindLabel")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_KINDS}>{t("notificationsPage.allKinds")}</SelectItem>
              {kinds.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <div role="status" aria-busy="true" className="space-y-2">
          <span className="sr-only">{t("common.loading")}</span>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : error ? (
        <Empty
          icon={<TriangleAlertIcon />}
          title={t("notificationsPage.loadError")}
          description={
            typeof error === "string" ? error : t("notificationsPage.loadErrorDescription")
          }
          actions={onRetry ? [{ label: t("errorPage.tryAgain"), onClick: onRetry }] : undefined}
        />
      ) : notifications.length === 0 ? (
        <Empty
          icon={<BellOffIcon />}
          title={emptyTitle}
          description={emptyDescription ?? t("notificationsPage.emptyDescription")}
        />
      ) : (
        <>
          {groups.map((group) => (
            <section key={group.key} aria-label={group.text}>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.text}
              </h2>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    onOpen={onOpen}
                    onRead={onRead}
                    onSnooze={onSnooze}
                  />
                ))}
              </ul>
            </section>
          ))}
          {hasMore && onLoadMore && (
            <div className="text-center">
              <Button variant="outline" disabled={loadingMore} onClick={onLoadMore}>
                {loadingMore && <LoaderCircleIcon aria-hidden="true" className="animate-spin" />}
                {t("notificationsPage.loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
