import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { solidColor, type ThemeColor } from "../../lib/theme-colors";

const dotSizes = {
  xs: "size-1.5",
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
  xl: "size-3.5",
  "2xl": "size-4",
  "3xl": "size-5",
} as const;

const textSizes = {
  xs: "min-w-3 h-3 px-0.5 text-[8px]",
  sm: "min-w-3.5 h-3.5 px-1 text-[9px]",
  md: "min-w-4 h-4 px-1 text-[10px]",
  lg: "min-w-5 h-5 px-1 text-[11px]",
  xl: "min-w-6 h-6 px-1.5 text-xs",
  "2xl": "min-w-7 h-7 px-1.5 text-sm",
  "3xl": "min-w-8 h-8 px-2 text-base",
} as const;

const positions = {
  "top-right": "right-0 top-0",
  "bottom-right": "bottom-0 right-0",
  "top-left": "left-0 top-0",
  "bottom-left": "bottom-0 left-0",
} as const;

const outside = {
  "top-right": "translate-x-1/2 -translate-y-1/2",
  "bottom-right": "translate-x-1/2 translate-y-1/2",
  "top-left": "-translate-x-1/2 -translate-y-1/2",
  "bottom-left": "-translate-x-1/2 translate-y-1/2",
} as const;

export type ChipProps = {
  /** The element the chip sits on. Without it the chip stands alone. */
  children?: ReactNode;
  /** A short text or a number inside the chip. */
  text?: string | number;
  color?: ThemeColor;
  size?: keyof typeof dotSizes;
  position?: keyof typeof positions;
  /** Keeps the chip inside the corner of the element, for round elements such as avatars. */
  inset?: boolean;
  /** Draws the chip on its own, in the flow, instead of on a corner. */
  standalone?: boolean;
  /** Hides the chip when false. */
  show?: boolean;
  /** Custom content of the chip, instead of `text`. */
  content?: ReactNode;
  /** Names the chip for screen readers, e.g. "3 unread". */
  label?: string;
  className?: string;
};

export function Chip({
  children,
  text,
  color = "primary",
  size = "md",
  position = "top-right",
  inset = false,
  standalone = false,
  show = true,
  content,
  label,
  className,
}: ChipProps) {
  const hasContent = content !== undefined || text !== undefined;

  const badge = show && (
    <span
      data-slot="chip"
      data-position={standalone ? undefined : position}
      className={cn(
        "flex items-center justify-center rounded-full font-medium leading-none ring-2 ring-background",
        solidColor[color],
        hasContent ? textSizes[size] : dotSizes[size],
        standalone ? "relative" : cn("absolute", positions[position], !inset && outside[position]),
      )}
    >
      {content ?? text}
      {label && <span className="sr-only">{label}</span>}
    </span>
  );

  if (standalone && !children) return <span className={cn("inline-flex", className)}>{badge}</span>;

  return (
    <span data-slot="chip-root" className={cn("relative inline-flex shrink-0", className)}>
      {children}
      {badge}
    </span>
  );
}
