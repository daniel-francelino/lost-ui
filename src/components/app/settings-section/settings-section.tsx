import type { ElementType, ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Card, CardContent } from "../../ui/card";

export type SettingsSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  /** In the top right corner, e.g. a link or a switch. */
  actions?: ReactNode;
  /** The row of buttons at the bottom, e.g. the save button. */
  footer?: ReactNode;
  children?: ReactNode;
  /** `form` makes the section a form, so Enter submits it. */
  as?: ElementType;
  className?: string;
} & Record<string, unknown>;

/** A card for one group of settings: a title, a description, the fields and the save button. */
export function SettingsSection({
  title,
  description,
  actions,
  footer,
  children,
  as: Comp = "section",
  className,
  ...rest
}: SettingsSectionProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-5">
        <Comp data-slot="settings-section" className="space-y-4" {...rest}>
          {(title || actions) && (
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                {title && <h2 className="font-medium">{title}</h2>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              {actions}
            </div>
          )}
          {children}
          {footer && <div className="flex flex-wrap items-center gap-2">{footer}</div>}
        </Comp>
      </CardContent>
    </Card>
  );
}
