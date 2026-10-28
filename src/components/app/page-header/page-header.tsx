import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** The end of the header, e.g. a "New" button. */
  actions?: ReactNode;
  /** Above the title, e.g. a back link. */
  leading?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  className?: string;
};

/** The title of a page of the app, with a description and the actions of the page. */
export function PageHeader({
  title,
  description,
  actions,
  leading,
  headingLevel = 1,
  className,
}: PageHeaderProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-wrap items-start justify-between gap-3", className)}
    >
      <div className="min-w-0 space-y-1">
        {leading}
        <Heading className="text-2xl font-semibold tracking-tight">{title}</Heading>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
