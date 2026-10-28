import { useAnimate, useReducedMotionConfig } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { duration } from "../../../lib/motion";
import { Label } from "../../ui/label";
import { fieldTextSize, type FieldSize } from "../lib/field-props";
import type { FieldIds } from "../lib/use-field";

export type FormFieldProps = {
  label?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  help?: ReactNode;
  required?: boolean | undefined;
  size?: FieldSize | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean;
  errorMessage?: string | null;
  ids: FieldIds;
  orientation?: "vertical" | "horizontal";
  className?: string | undefined;
  children: ReactNode;
};

/** The control shakes a little when its error appears. */
const shake = { x: [0, -5, 5, -3, 3, 0] };

export function FormField({
  label,
  description,
  hint,
  help,
  required,
  size = "md",
  disabled,
  invalid = false,
  errorMessage,
  ids,
  orientation = "vertical",
  className,
  children,
}: FormFieldProps) {
  const showError = invalid && Boolean(errorMessage);
  const horizontal = orientation === "horizontal";
  const [control, animate] = useAnimate<HTMLDivElement>();
  const reduceMotion = useReducedMotionConfig();
  const wasShowingError = useRef(false);

  useEffect(() => {
    if (showError && !wasShowingError.current && !reduceMotion) {
      void animate(control.current, shake, { duration: duration.slow + 0.05, ease: "easeInOut" });
    }
    wasShowingError.current = showError;
  }, [showError, reduceMotion, animate, control]);

  return (
    <div
      data-slot="form-field"
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "grid gap-1.5",
        "[&_[aria-invalid=true]]:border-destructive [&_[aria-invalid=true]:focus-visible]:ring-destructive",
        fieldTextSize[size],
        horizontal && "grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4",
        disabled && "opacity-60",
        className,
      )}
    >
      {(label || hint || description) && (
        <div className={cn("grid gap-0.5", horizontal && "col-start-1 row-start-1")}>
          {(label || hint) && (
            <div className="flex items-baseline justify-between gap-2">
              {label && (
                <Label
                  id={ids.labelId}
                  htmlFor={ids.id}
                  className={cn(invalid && "text-destructive")}
                >
                  {label}
                  {required && (
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  )}
                </Label>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
          {description && (
            <p id={ids.descriptionId} className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div ref={control} className={cn(horizontal && "col-start-2 row-start-1")}>
        {children}
      </div>
      {showError ? (
        <p id={ids.errorId} role="alert" className="text-destructive">
          {errorMessage}
        </p>
      ) : (
        help && (
          <p id={ids.helpId} className="text-muted-foreground">
            {help}
          </p>
        )
      )}
    </div>
  );
}
