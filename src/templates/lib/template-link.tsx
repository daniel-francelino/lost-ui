import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { defaultRenderLink, type RenderNavLink } from "../../components/app/app-nav";

/** A link drawn with the router of the app (`renderLink`), styled as text. */
export function TemplateLink({
  href,
  renderLink = defaultRenderLink,
  className,
  children,
}: {
  href: string;
  renderLink?: RenderNavLink | undefined;
  className?: string;
  children: ReactNode;
}) {
  return renderLink({
    item: { title: typeof children === "string" ? children : href, to: href },
    href,
    className: cn("underline-offset-4 hover:underline", className),
    children,
  });
}
