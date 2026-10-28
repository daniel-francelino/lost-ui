import type { ComponentProps, ElementType } from "react";

import { cn } from "../../../lib/cn";

export type ContainerProps = ComponentProps<"div"> & {
  /** The element to render. */
  as?: ElementType;
};

/**
 * Centres its content and limits its width. The limit is `--container-width` (80rem by default),
 * so one rule in the app changes every container.
 */
export function Container({ as: Comp = "div", className, ...props }: ContainerProps) {
  return (
    <Comp
      data-slot="container"
      className={cn(
        "mx-auto w-full max-w-[var(--container-width,80rem)] px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
