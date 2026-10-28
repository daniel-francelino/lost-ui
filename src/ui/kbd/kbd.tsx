import type { ComponentProps } from "react";

import { cn } from "../../lib/cn";
import {
  outlineColor,
  softColor,
  solidColor,
  subtleColor,
  type ThemeColor,
} from "../../lib/theme-colors";
import { useKbd } from "./use-kbd";

const variants = {
  outline: outlineColor,
  soft: softColor,
  subtle: subtleColor,
  solid: solidColor,
} as const;

const sizes = {
  sm: "h-4 min-w-4 px-1 text-[10px]",
  md: "h-5 min-w-5 px-1.5 text-[11px]",
  lg: "h-6 min-w-6 px-2 text-xs",
} as const;

export type KbdProps = Omit<ComponentProps<"kbd">, "color"> & {
  /** The key. `meta` shows ⌘ on a Mac and Ctrl elsewhere; the text of other keys is used as is. */
  value?: string;
  color?: ThemeColor;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Kbd({
  value,
  color = "neutral",
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: KbdProps) {
  const { getKbdKey } = useKbd();

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex items-center justify-center rounded-sm font-sans font-medium",
        variants[variant][color],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children ?? (value !== undefined ? getKbdKey(value) : null)}
    </kbd>
  );
}
