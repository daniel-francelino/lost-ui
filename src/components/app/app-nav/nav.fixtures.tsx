import {
  CalendarDaysIcon,
  HouseIcon,
  InboxIcon,
  PackageIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";

import type { NavItem, NavSection } from "./nav-types";

/** Navigation shared by the stories and tests of the app layout components. */
export const navSections: NavSection[] = [
  {
    items: [
      { title: "Home", icon: <HouseIcon />, to: "/admin", exact: true },
      { title: "Calendar", icon: <CalendarDaysIcon />, to: "/admin/calendar" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        title: "Products",
        icon: <PackageIcon />,
        to: "/admin/products",
        badge: 3,
        badgeLabel: "new",
      },
      { title: "Customers", icon: <UsersIcon />, to: "/admin/customers" },
      { title: "Inbox", icon: <InboxIcon />, to: "/admin/inbox", hidden: true },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        icon: <SettingsIcon />,
        to: "/admin/settings",
        children: [
          { title: "General", to: "/admin/settings", exact: true },
          { title: "Security", icon: <ShieldIcon />, to: "/admin/settings/security" },
          { title: "Billing", to: "/admin/settings/billing", badge: 1, badgeLabel: "due" },
        ],
      },
    ],
  },
];

export const profileItems: NavItem[] = [{ title: "My profile", to: "/admin/profile" }];

export const bottomItems: NavItem[] = [
  { title: "Home", icon: <HouseIcon />, to: "/admin", exact: true },
  { title: "Calendar", icon: <CalendarDaysIcon />, to: "/admin/calendar" },
  { title: "Products", icon: <PackageIcon />, to: "/admin/products", badge: 12 },
];

export const moreItems: NavItem[] = [
  { title: "Customers", icon: <UsersIcon />, to: "/admin/customers" },
  { title: "Settings", icon: <SettingsIcon />, to: "/admin/settings" },
];
