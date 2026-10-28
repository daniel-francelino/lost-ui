import { ChevronRightIcon } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { duration, easeOut, stagger } from "../../../lib/motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import {
  badgeText,
  defaultRenderLink,
  isNavItemActive,
  navItemKey,
  type NavItem,
  type NavSection,
  type RenderNavLink,
} from "../app-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "../sidebar";

export type AppSidebarProps = Omit<ComponentProps<typeof Sidebar>, "children"> & {
  sections: NavSection[];
  /** The page now, to mark the active item. Defaults to the address of the window. */
  pathname?: string;
  /** Top of the sidebar, e.g. the logo or a team menu. */
  header?: ReactNode;
  /** Bottom of the sidebar, e.g. the `UserMenu`. */
  footer?: ReactNode;
  /** Draws the link of an item with the router of the app. */
  renderLink?: RenderNavLink;
  /** Called when an item is chosen. The sidebar of small screens closes by itself. */
  onNavigate?: (item: NavItem) => void;
  /** Shows the strip that opens and closes the sidebar. */
  rail?: boolean;
};

function Badge({ item }: { item: NavItem }) {
  const text = badgeText(item.badge);
  if (!text) return null;
  return (
    <SidebarMenuBadge className="bg-primary text-primary-foreground">
      {item.badgeLabel && <span className="sr-only">{item.badgeLabel}: </span>}
      {text}
    </SidebarMenuBadge>
  );
}

type RowProps = {
  item: NavItem;
  pathname: string;
  renderLink: RenderNavLink;
  onNavigate: (item: NavItem) => void;
};

function Leaf({ item, pathname, renderLink, onNavigate }: RowProps) {
  const active = isNavItemActive(item, pathname);
  const content = (
    <>
      {item.icon}
      <span>{item.title}</span>
    </>
  );
  return (
    <SidebarMenuItem>
      {item.to !== undefined ? (
        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
          {renderLink({
            item,
            href: item.to,
            "aria-current": active ? "page" : undefined,
            onClick: () => onNavigate(item),
            children: content,
          })}
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton isActive={active} tooltip={item.title} onClick={() => onNavigate(item)}>
          {content}
        </SidebarMenuButton>
      )}
      <Badge item={item} />
    </SidebarMenuItem>
  );
}

function Parent({ item, pathname, renderLink, onNavigate }: RowProps) {
  const { state, setOpen } = useSidebar();
  const active = isNavItemActive(item, pathname);
  return (
    <Collapsible asChild defaultOpen={active} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={active}
            onClick={() => state === "collapsed" && setOpen(true)}
          >
            {item.icon}
            <span>{item.title}</span>
            <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child, index) => {
              const childActive = isNavItemActive(child, pathname);
              const content = (
                <>
                  {child.icon}
                  <span>{child.title}</span>
                  {badgeText(child.badge) && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {child.badgeLabel && <span className="sr-only">{child.badgeLabel}: </span>}
                      {badgeText(child.badge)}
                    </span>
                  )}
                </>
              );
              return (
                <SidebarMenuSubItem key={navItemKey(child)}>
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: duration.fast + 0.01,
                      delay: stagger(index),
                      ease: easeOut,
                    }}
                  >
                    <SidebarMenuSubButton asChild isActive={childActive}>
                      {child.to !== undefined ? (
                        renderLink({
                          item: child,
                          href: child.to,
                          "aria-current": childActive ? "page" : undefined,
                          onClick: () => onNavigate(child),
                          children: content,
                        })
                      ) : (
                        <span>{content}</span>
                      )}
                    </SidebarMenuSubButton>
                  </motion.div>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/**
 * The side navigation of an app: groups of links, with sub-menus, badges and the active page marked.
 * It collapses to icons, becomes a sheet on small screens and closes itself when a link is followed.
 * Put it inside an `AppShell` (or a `SidebarProvider`).
 */
export function AppSidebar({
  sections,
  pathname,
  header,
  footer,
  renderLink = defaultRenderLink,
  onNavigate,
  rail = true,
  collapsible = "icon",
  className,
  ...props
}: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const current = pathname ?? (typeof window === "undefined" ? "" : window.location.pathname);
  const navigate = (item: NavItem) => {
    item.onSelect?.();
    onNavigate?.(item);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Sidebar
        data-slot="app-sidebar"
        collapsible={collapsible}
        className={cn(className)}
        {...props}
      >
        {header && <SidebarHeader>{header}</SidebarHeader>}
        <SidebarContent className="gap-0">
          {sections.map((section, index) => (
            <SidebarGroup key={section.label ?? index} className="py-1">
              {section.label && <SidebarGroupLabel>{section.label}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const row = { item, pathname: current, renderLink, onNavigate: navigate };
                    return item.children ? (
                      <Parent key={navItemKey(item)} {...row} />
                    ) : (
                      <Leaf key={navItemKey(item)} {...row} />
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        {footer && <SidebarFooter>{footer}</SidebarFooter>}
        {rail && <SidebarRail />}
      </Sidebar>
    </MotionConfig>
  );
}
