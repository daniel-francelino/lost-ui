import type { ElementType, ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Container } from "../container";

export type FooterProps = {
  /** At the start of the main row, e.g. a copyright line. */
  left?: ReactNode;
  /** In the middle of the main row, e.g. links. */
  children?: ReactNode;
  /** At the end of the main row, e.g. social buttons. */
  right?: ReactNode;
  /** Above the main row, e.g. `FooterColumns`. */
  top?: ReactNode;
  /** Below the main row. */
  bottom?: ReactNode;
  as?: ElementType;
  /** Keeps the rows inside a `Container`. */
  contained?: boolean;
  className?: string;
};

export function Footer({
  left,
  children,
  right,
  top,
  bottom,
  as: Comp = "footer",
  contained = true,
  className,
}: FooterProps) {
  const Row = contained ? Container : "div";

  return (
    <Comp data-slot="footer" className={cn("border-t bg-background", className)}>
      {top && (
        <Row data-slot="footer-top" className="py-8 lg:py-12">
          {top}
        </Row>
      )}
      {(left || children || right) && (
        <Row
          data-slot="footer-main"
          className="flex flex-wrap items-center justify-between gap-3 py-6 lg:py-4"
        >
          <div data-slot="footer-left" className="flex items-center gap-1.5 lg:flex-1">
            {left}
          </div>
          <div data-slot="footer-center" className="flex items-center gap-1.5">
            {children}
          </div>
          <div data-slot="footer-right" className="flex items-center justify-end gap-1.5 lg:flex-1">
            {right}
          </div>
        </Row>
      )}
      {bottom && (
        <Row data-slot="footer-bottom" className="pb-6">
          {bottom}
        </Row>
      )}
    </Comp>
  );
}
