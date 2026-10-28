import { useEffect, type ElementType, type MouseEvent, type ReactNode } from "react";
import { MenuIcon, XIcon } from "lucide-react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";
import { Button } from "../../ui/button";
import { Container } from "../container";
import { Modal } from "../../elements/modal";

export type HeaderProps = {
  /** Names the site. It is the text of the link at the start, and the name of that link for screen readers. */
  title?: string;
  /** Where the title link goes. */
  href?: string;
  /** Replaces the text of the title, e.g. with a logo. Keep `title` for screen readers. */
  logo?: ReactNode;
  /** Replaces the whole title link. */
  left?: ReactNode;
  /** The middle, e.g. a `NavigationMenu`. Shown from the `lg` screens up. */
  children?: ReactNode;
  /** The end, e.g. a colour mode button. */
  right?: ReactNode;
  /** The menu of small screens, below the header. Shown in a modal or a slideover. */
  body?: ReactNode;
  /** Replaces the whole menu of small screens. */
  content?: ReactNode;
  /** How the menu opens on small screens. */
  mode?: "modal" | "slideover";
  /** Shows the button that opens the menu. Set to false when there is no menu. */
  toggle?: boolean;
  toggleSide?: "left" | "right";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Closes the menu when a link inside it is followed, or the page moves. */
  autoClose?: boolean;
  as?: ElementType;
  className?: string;
};

export function Header({
  title,
  href = "/",
  logo,
  left,
  children,
  right,
  body,
  content,
  mode = "modal",
  toggle = true,
  toggleSide = "right",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  autoClose = true,
  as: Comp = "header",
  className,
}: HeaderProps) {
  const { t } = useLostTranslation();
  const [open, setOpen] = useControlled<boolean>({
    ...(openProp !== undefined ? { value: openProp } : {}),
    defaultValue: defaultOpen,
    ...(onOpenChange ? { onValueChange: onOpenChange } : {}),
  });
  const isOpen = open ?? false;
  const hasMenu = body !== undefined || content !== undefined;

  useEffect(() => {
    if (!autoClose || !isOpen) return;
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, [autoClose, isOpen, setOpen]);

  const toggleButton = toggle && hasMenu && (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="header-toggle"
      aria-expanded={isOpen}
      aria-label={isOpen ? t("header.closeMenu") : t("header.openMenu")}
      className="lg:hidden"
      onClick={() => setOpen(!isOpen)}
    >
      {isOpen ? <XIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
    </Button>
  );

  const followLink = (event: MouseEvent<HTMLElement>) => {
    if (autoClose && (event.target as HTMLElement).closest("a[href]")) setOpen(false);
  };

  return (
    <Comp
      data-slot="header"
      className={cn(
        "sticky top-0 z-40 h-[var(--header-height,4rem)] w-full border-b bg-background/75 backdrop-blur",
        className,
      )}
    >
      <Container className="flex h-full items-center justify-between gap-3">
        <div data-slot="header-left" className="flex items-center gap-1.5 lg:flex-1">
          {toggleSide === "left" && toggleButton}
          {left ?? (
            <a
              href={href}
              aria-label={title}
              className="flex items-center gap-2 text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {logo ?? title}
            </a>
          )}
        </div>
        <div data-slot="header-center" className="hidden lg:flex">
          {children}
        </div>
        <div data-slot="header-right" className="flex items-center justify-end gap-1.5 lg:flex-1">
          {right}
          {toggleSide === "right" && toggleButton}
        </div>
      </Container>
      {hasMenu && (
        <Modal
          open={isOpen}
          onOpenChange={setOpen}
          title={title}
          side={mode === "slideover" ? toggleSide : undefined}
          className="lg:hidden"
          {...(content !== undefined ? { content } : {})}
        >
          {content === undefined && (
            // a click on a link inside the menu is a click on the page: the menu closes
            <div data-slot="header-body" onClick={followLink}>
              {body}
            </div>
          )}
        </Modal>
      )}
    </Comp>
  );
}
