import { useId, type ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type FormFieldsetProps = {
  legend: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  hideLegend?: boolean;
  variant?: "plain" | "section" | "boxed";
  gap?: "sm" | "md";
  /** Disables every control inside, like the native `fieldset`. */
  disabled?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

const variants = {
  plain: { fieldset: "", legend: "text-sm font-medium" },
  section: { fieldset: "", legend: "text-base font-semibold" },
  boxed: {
    fieldset: "rounded-xl border border-border px-4 pb-4 pt-1",
    legend: "px-1 text-sm font-semibold",
  },
} as const;

const gaps = { sm: "grid gap-2", md: "grid gap-4" } as const;

export function FormFieldset({
  legend,
  description,
  icon,
  hideLegend = false,
  variant = "plain",
  gap = "md",
  disabled,
  className,
  bodyClassName,
  children,
}: FormFieldsetProps) {
  const descriptionId = useId();

  return (
    <fieldset
      data-slot="form-fieldset"
      data-variant={variant}
      disabled={disabled}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "min-w-0 border-0 p-0 disabled:opacity-60",
        variants[variant].fieldset,
        className,
      )}
    >
      <legend
        className={cn(
          hideLegend ? "sr-only" : "mb-3 flex items-center gap-2 p-0 text-foreground",
          !hideLegend && variants[variant].legend,
        )}
      >
        {icon && !hideLegend && (
          <span aria-hidden="true" className="flex text-muted-foreground">
            {icon}
          </span>
        )}
        {legend}
      </legend>
      {description && (
        <p
          id={descriptionId}
          className={cn("-mt-1 mb-3 text-sm text-muted-foreground", hideLegend && "sr-only")}
        >
          {description}
        </p>
      )}
      <div className={cn(gaps[gap], bodyClassName)}>{children}</div>
    </fieldset>
  );
}
