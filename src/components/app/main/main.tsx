import type { ComponentProps, ElementType } from "react";

import { cn } from "../../../lib/cn";

export type MainProps = ComponentProps<"main"> & {
  as?: ElementType;
};

/** The page content. It fills the screen under the `Header` (`--header-height`), so a short page still pushes the footer down. */
export function Main({ as: Comp = "main", className, ...props }: MainProps) {
  return (
    <Comp
      data-slot="main"
      className={cn("min-h-[calc(100vh-var(--header-height,0px))]", className)}
      {...props}
    />
  );
}
