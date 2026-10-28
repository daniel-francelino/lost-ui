import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Card, CardContent } from "../../ui/card";

export type AuthLayoutProps = {
  title: ReactNode;
  description?: ReactNode;
  /** The logo of the app, above the card. */
  logo?: ReactNode;
  children?: ReactNode;
  /** Under the card, e.g. "No account yet? Create one". */
  footer?: ReactNode;
  /** `split` adds the `aside` as a panel at the side on large screens. */
  variant?: "card" | "split";
  /** The panel of the `split` variant, e.g. an image or a quote. */
  aside?: ReactNode;
  className?: string;
};

/**
 * The frame of the pages that come before the app (sign in, sign up, recover the password…):
 * a logo, a card with a title and a description, and a line of links below.
 */
export function AuthLayout({
  title,
  description,
  logo,
  children,
  footer,
  variant = "card",
  aside,
  className,
}: AuthLayoutProps) {
  const card = (
    <div className="flex w-full flex-col items-center">
      {logo && <div className="mb-6">{logo}</div>}
      <Card className="w-full max-w-md">
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          {children && <div className="mt-6">{children}</div>}
        </CardContent>
      </Card>
      {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );

  if (variant === "split") {
    return (
      <main
        data-slot="auth-layout"
        data-variant="split"
        className={cn("grid min-h-screen bg-background lg:grid-cols-2", className)}
      >
        <div className="flex items-center justify-center px-4 py-10">{card}</div>
        <aside className="hidden bg-muted lg:flex lg:items-center lg:justify-center">{aside}</aside>
      </main>
    );
  }

  return (
    <main
      data-slot="auth-layout"
      data-variant="card"
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10",
        className,
      )}
    >
      {card}
    </main>
  );
}
