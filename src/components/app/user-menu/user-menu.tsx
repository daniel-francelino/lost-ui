import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { defaultRenderLink, navItemKey, type NavItem, type RenderNavLink } from "../app-nav";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../sidebar";

export type UserMenuProps = {
  name: string;
  email?: string;
  /** Shown under the name, e.g. the role. */
  description?: string;
  avatarUrl?: string;
  /** Links before the sign out, e.g. "My profile". */
  items?: NavItem[];
  /** Adds the sign out item. */
  onSignOut?: () => void;
  signOutLabel?: ReactNode;
  renderLink?: RenderNavLink;
};

/** The user at the foot of the sidebar: avatar, name and a menu. Use it as the `footer` of `AppSidebar`. */
export function UserMenu({
  name,
  email,
  description,
  avatarUrl,
  items = [],
  onSignOut,
  signOutLabel,
  renderLink = defaultRenderLink,
}: UserMenuProps) {
  const { t } = useLostTranslation();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu data-slot="user-menu">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" tooltip={name}>
              <Avatar className="size-8 rounded-lg">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                {description && (
                  <span className="truncate text-xs text-muted-foreground">{description}</span>
                )}
              </span>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            className="min-w-56"
          >
            <DropdownMenuLabel className="font-normal">
              <p className="truncate text-sm font-medium">{name}</p>
              {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {items.map((item) => {
              const content = (
                <>
                  {item.icon}
                  {item.title}
                </>
              );
              return (
                <DropdownMenuItem
                  key={navItemKey(item)}
                  asChild={item.to !== undefined}
                  onSelect={item.onSelect}
                >
                  {item.to !== undefined
                    ? renderLink({ item, href: item.to, children: content })
                    : content}
                </DropdownMenuItem>
              );
            })}
            {onSignOut && (
              <DropdownMenuItem onSelect={onSignOut}>
                <LogOutIcon />
                {signOutLabel ?? t("appShell.signOut")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
