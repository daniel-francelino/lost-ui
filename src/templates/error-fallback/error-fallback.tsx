import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { cn } from "../../lib/cn";
import type { RenderNavLink } from "../../components/app/app-nav";
import { Button } from "../../components/ui/button";
import { HomeButton } from "../lib/home-button";

export type ErrorFallbackProps = {
  title?: ReactNode;
  description?: ReactNode;
  /** The line over the title. */
  eyebrow?: ReactNode;
  icon?: ReactNode;
  /** The `reset` of the router or of the error boundary. Adds the "Try again" button. */
  onRetry?: () => void;
  /** Where "Back to home" goes. Without it there is no button. */
  homeHref?: string;
  renderLink?: RenderNavLink;
  /** Extra detail under the text, e.g. an error id to give to the support. */
  children?: ReactNode;
  className?: string;
};

/** What the app shows when a page breaks: a card that says so, with "Try again" and "Back to home". */
export function ErrorFallback({
  title,
  description,
  eyebrow,
  icon,
  onRetry,
  homeHref,
  renderLink,
  children,
  className,
}: ErrorFallbackProps) {
  const { t } = useLostTranslation();
  return (
    <section
      role="alert"
      data-slot="error-fallback"
      className={cn(
        "flex min-h-[calc(100dvh-12rem)] items-center justify-center px-4 py-8",
        className,
      )}
    >
      <div className="flex w-full max-w-xl flex-col items-center rounded-3xl border bg-card px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="mb-5 flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground [&_svg]:size-7"
        >
          {icon ?? <TriangleAlertIcon />}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow ?? t("errorPage.pageFailed")}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title ?? t("errorPage.generic")}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description ?? t("errorPage.genericDescription")}
        </p>
        {children}
        {(onRetry || homeHref) && (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {onRetry && (
              <Button onClick={onRetry}>
                <RotateCwIcon aria-hidden="true" />
                {t("errorPage.tryAgain")}
              </Button>
            )}
            {homeHref && <HomeButton href={homeHref} renderLink={renderLink} variant="outline" />}
          </div>
        )}
      </div>
    </section>
  );
}
