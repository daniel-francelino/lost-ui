import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { cn } from "../../lib/cn";
import { Button, type ButtonProps } from "../../ui/button";

const emptyVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    variant: {
      outline: "rounded-lg border border-dashed border-border",
      solid: "rounded-lg bg-primary text-primary-foreground",
      soft: "rounded-lg bg-muted/50",
      subtle: "rounded-lg border border-border bg-muted",
      naked: "",
    },
    size: {
      xs: "gap-1.5 p-3 text-xs",
      sm: "gap-2 p-4 text-sm",
      md: "gap-3 p-6 text-sm",
      lg: "gap-3 p-8 text-base",
      xl: "gap-4 p-12 text-base",
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
});

const iconSize = {
  xs: "size-5",
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
} as const;

export type EmptyAction = Pick<ButtonProps, "variant" | "size" | "disabled"> & {
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  /** Renders a link instead of a button. */
  href?: string;
};

export type EmptyProps = VariantProps<typeof emptyVariants> & {
  /** Shown above the title. */
  icon?: ReactNode;
  /** Shown instead of the icon, e.g. an `Avatar`. */
  avatar?: ReactNode;
  /** Swaps the icon for a spinner. */
  loading?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  /** Buttons under the text. */
  actions?: EmptyAction[];
  /** Extra content between the text and the actions. */
  children?: ReactNode;
  footer?: ReactNode;
  /** Level of the title heading, 1 to 6. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

export function Empty({
  icon,
  avatar,
  loading = false,
  title,
  description,
  actions,
  children,
  footer,
  headingLevel = 2,
  variant,
  size,
  className,
}: EmptyProps) {
  const { t } = useLostTranslation();
  const Heading = `h${headingLevel}` as const;
  const muted = variant === "solid" ? "text-primary-foreground/80" : "text-muted-foreground";
  const mark = loading ? (
    <LoaderCircle
      aria-hidden="true"
      className={cn("animate-spin", iconSize[size ?? "md"], muted)}
    />
  ) : (
    (avatar ?? icon)
  );

  return (
    <div
      data-slot="empty"
      data-variant={variant ?? "outline"}
      aria-busy={loading || undefined}
      className={cn(emptyVariants({ variant, size }), className)}
    >
      {loading && <span className="sr-only">{t("common.loading")}</span>}
      {mark && (
        <div
          data-slot="empty-leading"
          aria-hidden="true"
          className={cn(
            "flex items-center justify-center [&_svg]:size-full",
            !avatar && muted,
            !avatar && iconSize[size ?? "md"],
          )}
        >
          {mark}
        </div>
      )}
      {(title || description) && (
        <div className="grid max-w-md gap-1">
          {title && <Heading className="font-medium">{title}</Heading>}
          {description && <p className={muted}>{description}</p>}
        </div>
      )}
      {children}
      {actions && actions.length > 0 && (
        <div data-slot="empty-actions" className="flex flex-wrap items-center justify-center gap-2">
          {actions.map(({ label, icon: actionIcon, onClick, href, ...button }, index) =>
            href ? (
              <Button key={index} asChild {...button}>
                <a href={href}>
                  {actionIcon}
                  {label}
                </a>
              </Button>
            ) : (
              <Button key={index} type="button" onClick={onClick} {...button}>
                {actionIcon}
                {label}
              </Button>
            ),
          )}
        </div>
      )}
      {footer}
    </div>
  );
}
