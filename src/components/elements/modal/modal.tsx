import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";

export type ModalSide = "left" | "right" | "top" | "bottom";

export type ModalProps = {
  /** The element that opens the modal; it is not rendered when the open state is driven from outside. */
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  /** The body. */
  children?: ReactNode;
  /** Buttons next to the close button in the header. */
  actions?: ReactNode;
  /** Replaces the title and the description in the header. */
  header?: ReactNode;
  /** Below the body. A function receives `close`. */
  footer?: ReactNode | ((api: { close: () => void }) => ReactNode);
  /** Replaces the whole panel (header, body and footer); the close button is then yours to draw. */
  content?: ReactNode;
  /** Draws a backdrop. It has no effect on a modal that is not `modal`. */
  overlay?: boolean;
  /** Blocks what is outside. Set to false and the page stays usable, without a backdrop. */
  modal?: boolean;
  /** Lets the user close it with Escape or a click outside. */
  dismissible?: boolean;
  /** Called when the user tried to close a modal that is not dismissible, e.g. to shake it. */
  onClosePrevented?: () => void;
  transition?: boolean;
  /** Fills the screen. */
  fullscreen?: boolean;
  /** Scrolls the whole panel, header and footer included, instead of only the body. */
  scrollable?: boolean;
  /** Hides the close button with false. */
  close?: boolean;
  closeLabel?: string;
  /** Keeps the content mounted while closed. */
  unmountOnHide?: boolean;
  /** Slides in from an edge of the screen instead of opening in the centre. `Slideover` is this. */
  side?: ModalSide;
  /** With `side`: keeps the panel away from the edges, as a floating card. */
  inset?: boolean;
  className?: string;
};

const sideClass: Record<ModalSide, { edge: string; inset: string; motion: string }> = {
  right: {
    edge: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
    inset: "inset-y-2 right-2 h-[calc(100%-1rem)] w-3/4 max-w-sm rounded-lg border",
    motion: "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  },
  left: {
    edge: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
    inset: "inset-y-2 left-2 h-[calc(100%-1rem)] w-3/4 max-w-sm rounded-lg border",
    motion: "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  },
  top: {
    edge: "inset-x-0 top-0 w-full border-b",
    inset: "inset-x-2 top-2 w-[calc(100%-1rem)] rounded-lg border",
    motion: "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  },
  bottom: {
    edge: "inset-x-0 bottom-0 w-full border-t",
    inset: "inset-x-2 bottom-2 w-[calc(100%-1rem)] rounded-lg border",
    motion: "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  },
};

const fade = "data-[state=open]:animate-in data-[state=closed]:animate-out";

export function Modal({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  actions,
  header,
  footer,
  content,
  overlay = true,
  modal = true,
  dismissible = true,
  onClosePrevented,
  transition = true,
  fullscreen = false,
  scrollable = false,
  close = true,
  closeLabel,
  unmountOnHide = true,
  side,
  inset = false,
  className,
}: ModalProps) {
  const { t } = useLostTranslation();
  const [open, setOpen] = useControlled<boolean>({
    ...(openProp !== undefined ? { value: openProp } : {}),
    defaultValue: defaultOpen,
    ...(onOpenChange ? { onValueChange: onOpenChange } : {}),
  });
  const isOpen = open ?? false;
  const keep = !unmountOnHide;
  const mounted = keep ? { forceMount: true as const } : {};

  const prevent = (event: Event) => {
    if (dismissible) return;
    event.preventDefault();
    onClosePrevented?.();
  };

  const panel = side
    ? cn(
        "fixed z-50 flex flex-col bg-background shadow-lg",
        inset ? sideClass[side].inset : sideClass[side].edge,
      )
    : fullscreen
      ? "fixed inset-0 z-50 flex h-dvh w-screen flex-col bg-background"
      : "fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg border bg-background shadow-lg";
  const motion = !transition
    ? ""
    : side
      ? cn(fade, "duration-300", sideClass[side].motion)
      : cn(
          fade,
          "duration-200 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        );

  const showHeader = header !== undefined || title !== undefined || description !== undefined;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen} modal={modal}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal {...mounted}>
        {overlay && modal && (
          <DialogPrimitive.Overlay
            {...mounted}
            data-slot="modal-overlay"
            className={cn(
              "fixed inset-0 z-50 bg-black/50 data-[state=closed]:hidden",
              transition && cn(fade, "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"),
            )}
          />
        )}
        <DialogPrimitive.Content
          {...mounted}
          data-slot="modal"
          data-side={side}
          {...(description ? {} : { "aria-describedby": undefined })}
          onEscapeKeyDown={prevent}
          onInteractOutside={prevent}
          className={cn(
            panel,
            motion,
            "data-[state=closed]:hidden",
            scrollable && "overflow-y-auto",
            className,
          )}
        >
          {content !== undefined ? (
            <>
              <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
              {content}
            </>
          ) : (
            <>
              {showHeader ? (
                <div
                  data-slot="modal-header"
                  className="flex items-start gap-3 p-4 pb-0 sm:p-6 sm:pb-0"
                >
                  <div className="grid flex-1 gap-1.5">
                    {header ?? (
                      <>
                        <DialogPrimitive.Title className="text-lg font-semibold leading-none">
                          {title}
                        </DialogPrimitive.Title>
                        {description && (
                          <DialogPrimitive.Description className="text-sm text-muted-foreground">
                            {description}
                          </DialogPrimitive.Description>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {actions}
                    {close && <CloseButton label={closeLabel ?? t("common.close")} />}
                  </div>
                </div>
              ) : (
                <>
                  <DialogPrimitive.Title className="sr-only">
                    {t("common.dialog")}
                  </DialogPrimitive.Title>
                  {(close || actions) && (
                    <div className="absolute right-3 top-3 flex items-center gap-1">
                      {actions}
                      {close && <CloseButton label={closeLabel ?? t("common.close")} />}
                    </div>
                  )}
                </>
              )}
              {children !== undefined && (
                <div
                  data-slot="modal-body"
                  className={cn("min-h-0 flex-1 p-4 sm:p-6", !scrollable && "overflow-y-auto")}
                >
                  {children}
                </div>
              )}
              {footer !== undefined && (
                <div
                  data-slot="modal-footer"
                  className="flex flex-wrap items-center justify-end gap-2 p-4 pt-0 sm:p-6 sm:pt-0"
                >
                  {typeof footer === "function" ? footer({ close: () => setOpen(false) }) : footer}
                </div>
              )}
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CloseButton({ label }: { label: string }) {
  return (
    <DialogPrimitive.Close
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <XIcon aria-hidden="true" className="size-4" />
    </DialogPrimitive.Close>
  );
}
