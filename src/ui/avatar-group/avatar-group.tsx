import { Children, type ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Avatar, AvatarFallback } from "../avatar";

const sizes = {
  xs: "[&>*]:size-6! text-[10px]",
  sm: "[&>*]:size-8! text-xs",
  md: "[&>*]:size-10! text-sm",
  lg: "[&>*]:size-12! text-base",
  xl: "[&>*]:size-14! text-lg",
} as const;

export type AvatarGroupProps = {
  /** The avatars, in order. The first is drawn on top. */
  children: ReactNode;
  /** Shows at most this many avatars and a `+N` for the rest. */
  max?: number;
  size?: keyof typeof sizes;
  /** Names the group for screen readers, e.g. "Team members". */
  label?: string;
  className?: string;
};

export function AvatarGroup({ children, max, size = "md", label, className }: AvatarGroupProps) {
  const avatars = Children.toArray(children);
  const limit = max !== undefined ? Math.max(0, max) : avatars.length;
  const shown = avatars.slice(0, limit);
  const hidden = avatars.length - shown.length;

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="avatar-group"
      // reversed, so that the first avatar is the one on top
      className={cn(
        "flex flex-row-reverse justify-end -space-x-2 space-x-reverse",
        "[&>*]:ring-2 [&>*]:ring-background",
        sizes[size],
        className,
      )}
    >
      {hidden > 0 && (
        <Avatar data-slot="avatar-group-overflow">
          <AvatarFallback>+{hidden}</AvatarFallback>
        </Avatar>
      )}
      {[...shown].reverse()}
    </div>
  );
}
