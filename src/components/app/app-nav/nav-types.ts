import type { ReactElement, ReactNode } from "react";

export type NavItem = {
  /** Key of the item. Defaults to `to`, then `title`. */
  id?: string;
  title: string;
  icon?: ReactNode;
  /** Where the item goes. An item with `children` and no `to` only opens its children. */
  to?: string;
  /** Active only on the exact address, not on the pages below it. */
  exact?: boolean;
  /** Addresses below `to` where the item is not active, e.g. a sibling that has its own item. */
  exclude?: string[];
  /** Other addresses where the item is active. */
  alsoActive?: string[];
  /** Forces the active state. */
  active?: boolean;
  /** A count or a short text at the end, e.g. new requests. A count of 0 is not shown. */
  badge?: number | string;
  /** What screen readers read for the badge, e.g. "new". */
  badgeLabel?: string;
  /** Takes the item out, e.g. when the user may not see it. */
  hidden?: boolean;
  children?: NavItem[];
  onSelect?: () => void;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

export type NavLinkRenderProps = {
  item: NavItem;
  href: string;
  className?: string;
  "aria-current"?: "page";
  onClick?: () => void;
  children: ReactNode;
};

/** Draws the link of an item with the router of the app, e.g. `({ href, item, ...rest }) => <Link to={item.to} {...rest} />`. */
export type RenderNavLink = (props: NavLinkRenderProps) => ReactElement;
