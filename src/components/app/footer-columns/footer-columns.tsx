import type { MouseEvent, ReactNode } from "react";
import { ExternalLinkIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { Link } from "../../elements/link";

export type FooterLink = {
  label: ReactNode;
  href?: string;
  target?: string;
  /** Shown before the label. */
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  className?: string;
};

export type FooterColumn = {
  label: ReactNode;
  children: FooterLink[];
};

export type FooterColumnsProps = {
  columns: FooterColumn[];
  /** Content before the columns, e.g. a logo. */
  left?: ReactNode;
  /** Content after the columns, e.g. a newsletter form. */
  right?: ReactNode;
  /** Level of the heading of each column, 1 to 6. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  renderColumnLabel?: (column: FooterColumn, index: number) => ReactNode;
  renderLink?: (link: FooterLink, column: FooterColumn) => ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function FooterColumns({
  columns,
  left,
  right,
  headingLevel = 3,
  renderColumnLabel,
  renderLink,
  className,
  "aria-label": ariaLabel,
}: FooterColumnsProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <nav
      data-slot="footer-columns"
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-8 lg:flex-row lg:justify-between", className)}
    >
      {left && <div data-slot="footer-columns-left">{left}</div>}
      <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 lg:justify-items-center">
        {columns.map((column, index) => (
          <div key={index} data-slot="footer-column">
            <Heading className="mb-3 text-sm font-semibold text-foreground">
              {renderColumnLabel ? renderColumnLabel(column, index) : column.label}
            </Heading>
            <ul className="grid gap-2 text-sm">
              {column.children.map((link, position) => (
                <li key={position}>
                  {renderLink ? (
                    renderLink(link, column)
                  ) : (
                    <Link
                      href={link.href}
                      target={link.target}
                      disabled={link.disabled}
                      onClick={link.onClick}
                      className={link.className}
                    >
                      {link.icon && (
                        <span aria-hidden="true" className="flex [&_svg]:size-4">
                          {link.icon}
                        </span>
                      )}
                      {link.label}
                      {link.target === "_blank" && (
                        <ExternalLinkIcon aria-hidden="true" className="size-3 opacity-60" />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {right && <div data-slot="footer-columns-right">{right}</div>}
    </nav>
  );
}
