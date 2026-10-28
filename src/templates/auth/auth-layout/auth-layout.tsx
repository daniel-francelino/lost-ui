import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { duration, easeOut } from "../../../lib/motion";
import { Card, CardContent } from "../../../components/ui/card";

export type AuthLayoutProps = {
  title: ReactNode;
  description?: ReactNode;
  /** The logo of the app, above the title. */
  logo?: ReactNode;
  children?: ReactNode;
  /**
   * A line of links, e.g. "Don't have an account? Sign up". Inside the card in the `split-card`
   * variant, under it in the others.
   */
  footer?: ReactNode;
  /** Small print under the card, e.g. "By clicking continue, you agree to our Terms of Service". */
  legal?: ReactNode;
  /**
   * `split-card` (default) is a card with the form on one side and the `aside` (an image) on the
   * other from `md` up, or a narrow card without an `aside`; `card` is one centred card on a plain
   * page; `split` puts the `aside` in a half of the screen.
   */
  variant?: "split-card" | "card" | "split";
  /** The panel at the side, e.g. an image (`absolute inset-0 size-full object-cover`) or a quote. */
  aside?: ReactNode;
  className?: string;
};

const enter = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.slow, ease: easeOut },
} as const;

/**
 * The frame of the pages that come before the app (sign in, sign up, recover the password…):
 * a card with a centred title and description, the content, a line of links and the small print.
 */
export function AuthLayout({
  title,
  description,
  logo,
  children,
  footer,
  legal,
  variant = "split-card",
  aside,
  className,
}: AuthLayoutProps) {
  const small = legal && (
    <div className="text-balance px-6 text-center text-xs text-muted-foreground">{legal}</div>
  );

  if (variant === "split-card") {
    return (
      <main
        data-slot="auth-layout"
        data-variant="split-card"
        className={cn(
          "flex min-h-screen items-center justify-center bg-muted p-4 md:p-10",
          className,
        )}
      >
        <MotionConfig reducedMotion="user">
          <motion.div
            className={cn("flex w-full flex-col gap-6", aside ? "max-w-4xl" : "max-w-sm")}
            {...enter}
          >
            <Card className="overflow-hidden p-0">
              <CardContent className={cn("grid p-0", aside && "md:grid-cols-2")}>
                <div className="flex flex-col gap-6 p-6 md:p-8">
                  <div className="flex flex-col items-center gap-2 text-center">
                    {logo && <div className="mb-2">{logo}</div>}
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {description && (
                      <p className="text-balance text-sm text-muted-foreground">{description}</p>
                    )}
                  </div>
                  {children}
                  {footer && (
                    <div className="text-center text-sm text-muted-foreground">{footer}</div>
                  )}
                </div>
                {aside && <aside className="relative hidden bg-muted md:block">{aside}</aside>}
              </CardContent>
            </Card>
            {small}
          </motion.div>
        </MotionConfig>
      </main>
    );
  }

  const card = (
    <MotionConfig reducedMotion="user">
      <motion.div className="flex w-full flex-col items-center" {...enter}>
        {logo && <div className="mb-6">{logo}</div>}
        <Card className="w-full max-w-md">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            {children && <div className="mt-6">{children}</div>}
          </CardContent>
        </Card>
        {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        {legal && <div className="mt-3">{small}</div>}
      </motion.div>
    </MotionConfig>
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
