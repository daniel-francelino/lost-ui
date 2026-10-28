import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type ThemeProps = {
  /**
   * Values for the tokens of the theme inside this block, by name: `{ primary: "oklch(0.6 0.2 260)" }`
   * sets `--primary`. A name that already starts with `--` is used as it is.
   */
  tokens?: Record<string, string>;
  /** Sets `--radius`. */
  radius?: string;
  /** Uses the dark values of the theme inside this block, whatever the page uses. */
  dark?: boolean;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

const variable = (name: string) => (name.startsWith("--") ? name : `--${name}`);

/**
 * Re-themes a part of the page. The colours and the radius are CSS variables, so every component
 * inside follows them with no prop. Nest blocks to refine: the inner one wins and the rest is inherited.
 * It does not set the props of the components, which Nuxt UI's `Theme` can.
 */
export function Theme({
  tokens,
  radius,
  dark = false,
  as: Comp = "div",
  className,
  children,
}: ThemeProps) {
  const style = {
    ...Object.fromEntries(
      Object.entries(tokens ?? {}).map(([name, value]) => [variable(name), value]),
    ),
    ...(radius !== undefined ? { "--radius": radius } : {}),
  } as CSSProperties;

  return (
    <Comp data-slot="theme" style={style} className={cn("contents", dark && "dark", className)}>
      {children}
    </Comp>
  );
}
