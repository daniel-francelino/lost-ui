import { useEffect, useState, type ReactNode } from "react";
import { XIcon } from "lucide-react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { cn } from "../../lib/cn";
import { solidColor, type ThemeColor } from "../../lib/theme-colors";
import { Button, type ButtonProps } from "../button";

export type BannerAction = Pick<ButtonProps, "variant" | "disabled"> & {
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  /** Renders a link instead of a button. */
  href?: string;
  target?: string;
};

export type BannerProps = {
  /** With `close`, a dismissed banner stays dismissed on later visits (kept in `localStorage`). */
  id?: string;
  icon?: ReactNode;
  title?: ReactNode;
  /** Replaces the title with your own content. */
  children?: ReactNode;
  actions?: BannerAction[];
  /** Makes the whole banner a link. */
  href?: string;
  target?: string;
  color?: ThemeColor;
  /** Shows a button that dismisses the banner. */
  close?: boolean;
  closeLabel?: string;
  onClose?: () => void;
  /** Names the banner for screen readers; it is then a labelled region. */
  label?: string;
  className?: string;
};

const storageKey = (id: string) => `lost-ui:banner:${id}`;

function wasDismissed(id: string | undefined): boolean {
  if (!id) return false;
  try {
    return window.localStorage.getItem(storageKey(id)) === "dismissed";
  } catch {
    return false;
  }
}

export function Banner({
  id,
  icon,
  title,
  children,
  actions,
  href,
  target,
  color = "primary",
  close = false,
  closeLabel,
  onClose,
  label,
  className,
}: BannerProps) {
  const { t } = useLostTranslation();
  const [hidden, setHidden] = useState(false);

  // read after the first render, so the server and the browser draw the same markup
  useEffect(() => {
    if (close && wasDismissed(id)) setHidden(true);
  }, [close, id]);

  if (hidden) return null;

  const dismiss = () => {
    setHidden(true);
    if (id) {
      try {
        window.localStorage.setItem(storageKey(id), "dismissed");
      } catch {
        // storage can be blocked; the banner is still closed for this visit
      }
    }
    onClose?.();
  };

  const text = children ?? title;

  return (
    <div
      data-slot="banner"
      role={label ? "region" : undefined}
      aria-label={label}
      className={cn(
        "relative flex w-full items-center gap-3 px-4 py-2 text-sm",
        solidColor[color],
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 text-center">
        {icon && (
          <span aria-hidden="true" className="flex shrink-0 [&_svg]:size-4">
            {icon}
          </span>
        )}
        {text &&
          (href ? (
            <a
              href={href}
              target={target}
              rel={target === "_blank" ? "noopener noreferrer" : undefined}
              className="font-medium after:absolute after:inset-0 hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-current"
            >
              {text}
            </a>
          ) : (
            <span className="font-medium">{text}</span>
          ))}
      </div>
      {actions && actions.length > 0 && (
        <div data-slot="banner-actions" className="relative z-10 flex shrink-0 items-center gap-2">
          {actions.map(
            (
              { label: actionLabel, icon: actionIcon, onClick, href: to, target: where, ...button },
              index,
            ) =>
              to ? (
                <Button
                  key={index}
                  asChild
                  variant="secondary"
                  size="sm"
                  className="h-7"
                  {...button}
                >
                  <a href={to} target={where}>
                    {actionIcon}
                    {actionLabel}
                  </a>
                </Button>
              ) : (
                <Button
                  key={index}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7"
                  onClick={onClick}
                  {...button}
                >
                  {actionIcon}
                  {actionLabel}
                </Button>
              ),
          )}
        </div>
      )}
      {close && (
        <button
          type="button"
          aria-label={closeLabel ?? t("common.close")}
          onClick={dismiss}
          className="relative z-10 shrink-0 rounded-sm p-1 opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <XIcon aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  );
}
