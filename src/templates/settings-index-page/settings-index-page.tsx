import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { cn } from "../../lib/cn";
import {
  defaultRenderLink,
  navItemKey,
  type NavItem,
  type RenderNavLink,
} from "../../components/app/app-nav";
import { PageHeader } from "../../components/app/page-header";

export type SettingsEntry = NavItem & {
  /** What the page is for, under the title. */
  description?: ReactNode;
};

export type SettingsIndexPageProps = {
  /** The pages of the settings. `hidden` ones are left out: use it for what the user may not open. */
  entries: SettingsEntry[];
  title?: ReactNode;
  description?: ReactNode;
  renderLink?: RenderNavLink;
  className?: string;
};

/** The landing page of the settings: a grid of cards, one per area, each linking to its page. */
export function SettingsIndexPage({
  entries,
  title,
  description,
  renderLink = defaultRenderLink,
  className,
}: SettingsIndexPageProps) {
  const { t } = useLostTranslation();
  return (
    <div data-slot="settings-index-page" className={cn("space-y-6", className)}>
      <PageHeader title={title ?? t("settingsPage.title")} description={description} />
      <ul className="grid gap-4 md:grid-cols-2">
        {entries
          .filter((entry) => !entry.hidden && entry.to !== undefined)
          .map((entry) => (
            <li key={navItemKey(entry)}>
              {renderLink({
                item: entry,
                href: entry.to!,
                className:
                  "group flex h-full items-start gap-3 rounded-2xl border bg-card p-5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                children: (
                  <>
                    {entry.icon && (
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted [&_svg]:size-5"
                      >
                        {entry.icon}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{entry.title}</span>
                      {entry.description && (
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {entry.description}
                        </span>
                      )}
                    </span>
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                ),
              })}
            </li>
          ))}
      </ul>
    </div>
  );
}
