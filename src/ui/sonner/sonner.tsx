import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useIsDark } from "../../lib/use-is-dark";

const toasterStyle = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as CSSProperties;

const Toaster = ({ ...props }: ToasterProps) => {
  const isDark = useIsDark();

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      style={toasterStyle}
      {...props}
    />
  );
};

export { Toaster };
