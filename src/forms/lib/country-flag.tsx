import type { ComponentType, SVGProps } from "react";
import * as flags from "country-flag-icons/react/3x2";

import { cn } from "../../lib/cn";

const table = flags as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

/** The flag of an ISO 3166-1 alpha-2 code as an SVG, or nothing for an unknown code. */
export function CountryFlag({ code, className }: { code: string; className?: string }) {
  const Flag = table[code.toUpperCase()];
  if (!Flag) return null;

  return (
    <Flag
      aria-hidden="true"
      focusable="false"
      className={cn("h-3.5 w-5 shrink-0 rounded-[2px] border border-border/60", className)}
    />
  );
}
