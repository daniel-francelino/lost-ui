import { LayoutGridIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { defaultRenderLink, type RenderNavLink } from "../app-nav";

export type Space = {
  id: string;
  title: string;
  icon: ReactNode;
  to: string;
  /** Classes of the coloured tile, e.g. `bg-secondary text-secondary-foreground`. */
  tileClassName?: string;
};

export type SpaceSwitcherProps = {
  spaces: Space[];
  /** The `id` of the space now. */
  current?: string;
  renderLink?: RenderNavLink;
  label?: string;
  className?: string;
};

/** A button that opens a grid of the areas of the app (marketing, site, shop…). Hidden when there is one or none. */
export function SpaceSwitcher({
  spaces,
  current,
  renderLink = defaultRenderLink,
  label,
  className,
}: SpaceSwitcherProps) {
  const { t } = useLostTranslation();
  const [open, setOpen] = useState(false);
  if (spaces.length < 2) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label ?? t("appShell.switchSpace")}
          className={className}
        >
          <LayoutGridIcon aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 max-w-[calc(100vw-2rem)] p-3">
        <p className="px-1 pb-2 text-sm font-medium">{t("appShell.spaces")}</p>
        <ul className="grid grid-cols-2 gap-2">
          {spaces.map((space) => {
            const active = space.id === current;
            return (
              <li key={space.id}>
                {renderLink({
                  item: { title: space.title, to: space.to },
                  href: space.to,
                  "aria-current": active ? "page" : undefined,
                  onClick: () => setOpen(false),
                  className: cn(
                    "flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active && "bg-accent",
                  ),
                  children: (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground [&_svg]:size-6",
                          space.tileClassName,
                        )}
                      >
                        {space.icon}
                      </span>
                      <span className="text-center text-xs font-medium leading-tight">
                        {space.title}
                      </span>
                    </>
                  ),
                })}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
