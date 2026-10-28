import type { ComponentProps, ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { SidebarInset, SidebarProvider } from "../sidebar";

export type AppShellProps = {
  /** The `AppSidebar`. */
  sidebar?: ReactNode;
  /** The `AppTopbar`. */
  topbar?: ReactNode;
  /** The `BottomNav`. The page leaves room for it on small screens. */
  bottomNav?: ReactNode;
  children?: ReactNode;
  /** Draws only the page, with no sidebar or bar, e.g. a point of sale or a preview. */
  fullScreen?: boolean;
  /** Lets the page use the whole width instead of a centred column. */
  fullWidth?: boolean;
  defaultSidebarOpen?: boolean;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Shown over everything, e.g. a `Toaster` or an install banner. */
  overlay?: ReactNode;
  /** Id of the page, the target of the skip link. */
  mainId?: string;
  mainProps?: Omit<ComponentProps<"main">, "id" | "children">;
  className?: string;
};

/**
 * The frame of the internal screens of an app: sidebar, top bar, the page and, on small screens,
 * a bottom bar. It brings a link that skips to the page and a focusable page for keyboards.
 */
export function AppShell({
  sidebar,
  topbar,
  bottomNav,
  children,
  fullScreen = false,
  fullWidth = false,
  defaultSidebarOpen,
  sidebarOpen,
  onSidebarOpenChange,
  overlay,
  mainId = "main-content",
  mainProps,
  className,
}: AppShellProps) {
  const { t } = useLostTranslation();
  const { className: mainClassName, ...restMain } = mainProps ?? {};

  if (fullScreen) {
    return (
      <div data-slot="app-shell" data-full-screen="">
        <main
          id={mainId}
          tabIndex={-1}
          className={cn("outline-none", className, mainClassName)}
          {...restMain}
        >
          {children}
        </main>
        {overlay}
      </div>
    );
  }

  return (
    <SidebarProvider
      data-slot="app-shell"
      defaultOpen={defaultSidebarOpen}
      open={sidebarOpen}
      onOpenChange={onSidebarOpenChange}
    >
      <a
        href={`#${mainId}`}
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        {t("appShell.skipToContent")}
      </a>
      {sidebar}
      <SidebarInset className={className}>
        {topbar}
        <main
          id={mainId}
          tabIndex={-1}
          data-slot="app-main"
          className={cn(
            "w-full flex-1 px-4 py-6 pb-[max(1.5rem,var(--bottom-nav-height,0px))] outline-none sm:px-6 sm:py-8",
            !fullWidth && "mx-auto max-w-6xl",
            mainClassName,
          )}
          {...restMain}
        >
          {children}
        </main>
        {bottomNav}
      </SidebarInset>
      {overlay}
    </SidebarProvider>
  );
}
