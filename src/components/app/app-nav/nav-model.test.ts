import { describe, expect, it } from "vitest";

import { badgeText, filterNavigation, flattenNavigation, isNavItemActive } from "./nav-model";
import type { NavItem } from "./nav-types";
import { navSections } from "./nav.fixtures";

describe("isNavItemActive", () => {
  it("matches the page and the pages below it", () => {
    const item: NavItem = { title: "Products", to: "/admin/products" };
    expect(isNavItemActive(item, "/admin/products")).toBe(true);
    expect(isNavItemActive(item, "/admin/products/42")).toBe(true);
    expect(isNavItemActive(item, "/admin/products-old")).toBe(false);
  });

  it("matches only the exact page with exact", () => {
    const item: NavItem = { title: "Home", to: "/admin", exact: true };
    expect(isNavItemActive(item, "/admin")).toBe(true);
    expect(isNavItemActive(item, "/admin/calendar")).toBe(false);
  });

  it("leaves out the addresses in exclude and adds the ones in alsoActive", () => {
    const item: NavItem = {
      title: "Stock",
      to: "/admin/stock",
      exclude: ["/admin/stock/transfers"],
      alsoActive: ["/admin/warehouse"],
    };
    expect(isNavItemActive(item, "/admin/stock/transfers/1")).toBe(false);
    expect(isNavItemActive(item, "/admin/warehouse/2")).toBe(true);
  });

  it("is active when a child is", () => {
    const parent = navSections[2]!.items[0]!;
    expect(isNavItemActive({ ...parent, to: undefined }, "/admin/settings/security")).toBe(true);
  });

  it("lets active override the address", () => {
    expect(isNavItemActive({ title: "Tab", active: true }, "/elsewhere")).toBe(true);
    expect(isNavItemActive({ title: "Tab", to: "/x", active: false }, "/x")).toBe(false);
  });
});

describe("filterNavigation", () => {
  it("takes out hidden items", () => {
    const titles = filterNavigation(navSections).flatMap((s) => s.items.map((i) => i.title));
    expect(titles).not.toContain("Inbox");
    expect(titles).toContain("Customers");
  });

  it("takes out what allow refuses, and the groups that stay empty", () => {
    const sections = filterNavigation(navSections, (item) => item.title !== "Settings");
    expect(sections.map((s) => s.label)).toEqual([undefined, "Catalogue"]);
  });

  it("drops a parent with no children and no address", () => {
    const sections = filterNavigation([
      { items: [{ title: "Parent", children: [{ title: "Child", hidden: true }] }] },
    ]);
    expect(sections).toEqual([]);
  });

  it("keeps a parent that goes somewhere", () => {
    const sections = filterNavigation([
      { items: [{ title: "Parent", to: "/p", children: [{ title: "Child", hidden: true }] }] },
    ]);
    expect(sections[0]!.items[0]!.title).toBe("Parent");
  });
});

describe("flattenNavigation", () => {
  it("lists the items with an address, children included", () => {
    const flat = flattenNavigation(navSections).map((item) => item.to);
    expect(flat).toContain("/admin/settings/security");
    expect(flat).toContain("/admin/calendar");
  });
});

describe("badgeText", () => {
  it("hides empty badges and caps the big ones", () => {
    expect(badgeText(0)).toBeUndefined();
    expect(badgeText(undefined)).toBeUndefined();
    expect(badgeText(5)).toBe("5");
    expect(badgeText(120)).toBe("99+");
    expect(badgeText(12, 9)).toBe("9+");
    expect(badgeText("new")).toBe("new");
  });
});
