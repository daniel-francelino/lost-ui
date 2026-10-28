import type { ElementType, ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { Button, type ButtonProps } from "../../ui/button";

export type ErrorPageError = {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
};

export type ErrorPageProps = {
  error: ErrorPageError;
  /** Shown above the status code. */
  icon?: ReactNode;
  /** The button that takes the user away. Set to false to hide it. */
  clear?: false | (Pick<ButtonProps, "variant" | "size"> & { label?: ReactNode; icon?: ReactNode });
  /** Where the button goes. */
  redirect?: string;
  /** Called when the button is clicked, e.g. to clear the error of the app first. */
  onClear?: () => void;
  /** Above everything, e.g. a logo. */
  leading?: ReactNode;
  children?: ReactNode;
  /** Level of the heading with the status message. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: ElementType;
  className?: string;
};

const messages = {
  401: "errorPage.unauthorized",
  403: "errorPage.forbidden",
  404: "errorPage.notFound",
  500: "errorPage.serverError",
  503: "errorPage.unavailable",
} as const;

/** A page for an error: the status code, a message and a way back. It fills the screen under the `Header`. */
export function ErrorPage({
  error,
  icon,
  clear,
  redirect = "/",
  onClear,
  leading,
  children,
  headingLevel = 1,
  as: Comp = "main",
  className,
}: ErrorPageProps) {
  const { t } = useLostTranslation();
  const Heading = `h${headingLevel}` as const;
  const code = error.statusCode;
  const known = code !== undefined ? messages[code as keyof typeof messages] : undefined;
  const statusMessage = error.statusMessage ?? (known ? t(known) : t("errorPage.generic"));
  const action = clear === false ? null : (clear ?? {});

  return (
    <Comp
      data-slot="error-page"
      className={cn(
        "flex min-h-[calc(100vh-var(--header-height,0px))] items-center justify-center p-6",
        className,
      )}
    >
      <div className="grid max-w-xl justify-items-center gap-4 text-center">
        {leading}
        {icon && (
          <span aria-hidden="true" className="flex text-muted-foreground [&_svg]:size-12">
            {icon}
          </span>
        )}
        {code !== undefined && (
          <p data-slot="error-status-code" className="text-sm font-semibold text-primary">
            {code}
          </p>
        )}
        <Heading
          data-slot="error-status-message"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {statusMessage}
        </Heading>
        {error.message && (
          <p data-slot="error-message" className="text-muted-foreground">
            {error.message}
          </p>
        )}
        {children}
        {action && (
          <Button asChild variant={action.variant ?? "default"} size={action.size ?? "default"}>
            <a href={redirect} onClick={onClear}>
              {action.icon}
              {action.label ?? t("errorPage.backHome")}
            </a>
          </Button>
        )}
      </div>
    </Comp>
  );
}
