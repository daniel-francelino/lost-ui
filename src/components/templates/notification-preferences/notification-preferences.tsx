import { BellOffIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { Empty } from "../../data/empty";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";

export type NotificationChannels = { inApp: boolean; email: boolean };

export type NotificationPreference = {
  /** The type of notification. */
  kind: string;
  title: string;
  description?: ReactNode;
  channels: NotificationChannels;
  /** Extra controls under the row, e.g. "Warn days in advance". */
  extra?: ReactNode;
};

export type NotificationPreferencesProps = {
  preferences: NotificationPreference[];
  /** Called with the type and its new channels each time a switch changes. */
  onChange: (kind: string, channels: NotificationChannels) => void;
  disabled?: boolean;
  /** Hides the email switch, when the app sends no email. */
  email?: boolean;
  className?: string;
};

/** A switch per channel (in the app, by email) for each type of notification. */
export function NotificationPreferences({
  preferences,
  onChange,
  disabled = false,
  email = true,
  className,
}: NotificationPreferencesProps) {
  const { t } = useLostTranslation();

  if (preferences.length === 0) {
    return <Empty size="sm" icon={<BellOffIcon />} title={t("settingsPage.noPreferences")} />;
  }

  return (
    <ul data-slot="notification-preferences" className={cn("divide-y", className)}>
      {preferences.map((preference) => {
        const id = `pref-${preference.kind}`;
        const { channels } = preference;
        return (
          <li
            key={preference.kind}
            className="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium">{preference.title}</p>
              {preference.description && (
                <p className="text-sm text-muted-foreground">{preference.description}</p>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <Switch
                  id={`${id}-app`}
                  checked={channels.inApp}
                  disabled={disabled}
                  aria-label={`${preference.title}: ${t("settingsPage.inApp")}`}
                  onCheckedChange={(inApp) => onChange(preference.kind, { ...channels, inApp })}
                />
                <Label htmlFor={`${id}-app`}>{t("settingsPage.inApp")}</Label>
              </span>
              {email && (
                <span className="flex items-center gap-2">
                  <Switch
                    id={`${id}-email`}
                    checked={channels.email}
                    disabled={disabled || !channels.inApp}
                    aria-label={`${preference.title}: ${t("settingsPage.byEmail")}`}
                    onCheckedChange={(next) =>
                      onChange(preference.kind, { ...channels, email: next })
                    }
                  />
                  <Label htmlFor={`${id}-email`}>{t("settingsPage.byEmail")}</Label>
                </span>
              )}
            </div>
            {preference.extra && <div className="w-full">{preference.extra}</div>}
          </li>
        );
      })}
    </ul>
  );
}
