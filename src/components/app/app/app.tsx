import type { ReactNode } from "react";

import { LostI18nProvider } from "../../../i18n/lost-i18n-provider";
import { cn } from "../../../lib/cn";
import { Toaster } from "../../ui/sonner";
import { TooltipProvider } from "../../ui/tooltip";

export type AppProps = {
  /** Language of the texts the components bring: `"en"`, `"es"` or `"pt"`. */
  language?: string;
  /** Options of the tooltips of the whole app. */
  tooltip?: {
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
  };
  /** Options of the `Toaster`, or `null` to leave it out. */
  toaster?: Parameters<typeof Toaster>[0] | null;
  /** Reading direction of the whole app. */
  dir?: "ltr" | "rtl";
  /** Uses the dark values of the theme. */
  dark?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * Put it once at the root. It sets the language of the components, the tooltips and the toasts for
 * the whole app, so `toast.success(…)` works anywhere below it.
 */
export function App({
  language,
  tooltip,
  toaster,
  dir,
  dark = false,
  className,
  children,
}: AppProps) {
  return (
    <LostI18nProvider {...(language !== undefined ? { language } : {})}>
      <TooltipProvider {...tooltip}>
        <div data-slot="app" dir={dir} className={cn("contents", dark && "dark", className)}>
          {children}
        </div>
        {toaster !== null && <Toaster {...toaster} />}
      </TooltipProvider>
    </LostI18nProvider>
  );
}
