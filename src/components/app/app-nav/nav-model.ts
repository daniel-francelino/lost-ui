import { isActivePath } from "../../elements/link";
import type { NavItem, NavSection } from "./nav-types";

export const navItemKey = (item: NavItem): string => item.id ?? item.to ?? item.title;

const under = (path: string, base: string) => path === base || path.startsWith(`${base}/`);

/** Whether the item, or one of its children, is the page `pathname`. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.active !== undefined) return item.active;
  if (item.children?.some((child) => isNavItemActive(child, pathname))) return true;
  if (item.alsoActive?.some((path) => under(pathname, path))) return true;
  if (item.to === undefined) return false;
  if (item.exclude?.some((path) => under(pathname, path))) return false;
  return isActivePath(item.to, pathname, item.exact);
}

function keep(item: NavItem, allow?: (item: NavItem) => boolean): NavItem | null {
  if (item.hidden || (allow && !allow(item))) return null;
  if (!item.children) return item;
  const children = item.children
    .map((child) => keep(child, allow))
    .filter((child) => child !== null);
  // a parent with nothing left to open and nowhere to go would be an empty button
  return children.length === 0 && item.to === undefined ? null : { ...item, children };
}

/** Takes out the hidden items, the ones `allow` refuses, and the groups left empty. */
export function filterNavigation(
  sections: NavSection[],
  allow?: (item: NavItem) => boolean,
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.map((item) => keep(item, allow)).filter((item) => item !== null),
    }))
    .filter((section) => section.items.length > 0);
}

/** Every item with an address, children included, in order. */
export function flattenNavigation(sections: NavSection[]): NavItem[] {
  const out: NavItem[] = [];
  const visit = (items: NavItem[]) => {
    for (const item of items) {
      if (item.to !== undefined) out.push(item);
      if (item.children) visit(item.children);
    }
  };
  for (const section of sections) visit(section.items);
  return out;
}

/** The shown number of a badge: `undefined` for 0, "9+" over `max`. */
export function badgeText(badge: NavItem["badge"], max = 99): string | undefined {
  if (badge === undefined || badge === 0 || badge === "") return undefined;
  return typeof badge === "number" && badge > max ? `${max}+` : String(badge);
}
