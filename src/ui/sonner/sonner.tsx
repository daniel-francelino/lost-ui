import type { CSSProperties } from "react";
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

import { useIsDark } from "../../lib/use-is-dark";

// Each kind has a fill and a text colour from the theme, so an app changes them with
// `--success`, `--warning`, `--info` and `--destructive` (and their `-foreground`).
const toasterStyle = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--success-bg": "var(--success)",
  "--success-border": "var(--success)",
  "--success-text": "var(--success-foreground)",
  "--error-bg": "var(--destructive)",
  "--error-border": "var(--destructive)",
  "--error-text": "var(--destructive-foreground)",
  "--info-bg": "var(--info)",
  "--info-border": "var(--info)",
  "--info-text": "var(--info-foreground)",
  "--warning-bg": "var(--warning)",
  "--warning-border": "var(--warning)",
  "--warning-text": "var(--warning-foreground)",
} as CSSProperties;

const icons = {
  success: <CircleCheck className="size-4" aria-hidden="true" />,
  error: <CircleAlert className="size-4" aria-hidden="true" />,
  info: <Info className="size-4" aria-hidden="true" />,
  warning: <TriangleAlert className="size-4" aria-hidden="true" />,
  loading: <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />,
};

const Toaster = ({ ...props }: ToasterProps) => {
  const isDark = useIsDark();

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      richColors
      style={toasterStyle}
      icons={icons}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-inherit",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
