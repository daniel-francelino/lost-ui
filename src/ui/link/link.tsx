import {
  useSyncExternalStore,
  type ComponentProps,
  type ElementType,
  type MouseEvent,
} from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../lib/cn";

export type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  /** Renders an `a`. Without it the link is a button, or the element in `as`. */
  href?: string;
  /** Forces the active state. By default it is read from the address of the page. */
  active?: boolean;
  /** Active only on the exact address, not on the pages below it. */
  exact?: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
  /** Drops the styles of the library and keeps only `className`, `activeClassName` and `inactiveClassName`. */
  raw?: boolean;
  disabled?: boolean;
  /** The element used when there is no `href`. */
  as?: ElementType;
  /** Gives the look and the state to the child, e.g. the `Link` of a router. */
  asChild?: boolean;
  /** The address to compare with, for a router that does not use `window.location`. */
  currentPath?: string;
};

const base =
  "inline-flex items-center gap-1 rounded-sm underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

const clean = (path: string) => {
  const bare = path.split(/[?#]/)[0] ?? "";
  return bare.length > 1 ? bare.replace(/\/+$/, "") : bare || "/";
};

const isExternal = (href: string) => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href);

/** Whether `href` is the page, or (unless `exact`) a page above it. */
export function isActivePath(href: string, current: string, exact = false): boolean {
  if (isExternal(href) || href.startsWith("#")) return false;
  const target = clean(href);
  const here = clean(current);
  if (target === here) return true;
  return !exact && target !== "/" && here.startsWith(`${target}/`);
}

export function Link({
  href,
  active,
  exact = false,
  activeClassName,
  inactiveClassName,
  raw = false,
  disabled = false,
  as,
  asChild = false,
  currentPath,
  className,
  onClick,
  target,
  rel,
  children,
  ...props
}: LinkProps) {
  const location = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "",
  );
  const isActive =
    active ?? (href !== undefined && isActivePath(href, currentPath ?? location, exact));
  const Comp: ElementType = asChild ? Slot : href !== undefined ? "a" : (as ?? "button");
  const anchor = Comp === "a";

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event as MouseEvent<HTMLAnchorElement>);
  };

  return (
    <Comp
      data-slot="link"
      data-active={isActive ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        !raw && base,
        !raw &&
          (isActive ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground"),
        disabled && "pointer-events-none opacity-50",
        isActive ? activeClassName : inactiveClassName,
        className,
      )}
      onClick={handleClick}
      {...(anchor
        ? {
            href: disabled ? undefined : href,
            target,
            rel: rel ?? (target === "_blank" ? "noopener noreferrer" : undefined),
            tabIndex: disabled ? -1 : undefined,
          }
        : Comp === "button"
          ? { type: "button", disabled }
          : {})}
      {...props}
    >
      {children}
    </Comp>
  );
}
