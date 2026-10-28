import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

import { duration, easeOut, swap } from "../../../lib/motion";

export type PageTransitionProps = {
  /** Changing it swaps the content: the old one goes out, then the new one comes in. */
  transitionKey: string | number;
  children?: ReactNode;
  /**
   * `fade-up` rises a little (a page); `fade` only fades (a panel); `slide` moves sideways,
   * following `direction` (the steps of a wizard).
   */
  variant?: "fade-up" | "fade" | "slide";
  /** For `slide`: 1 comes in from the right (next), -1 from the left (back). */
  direction?: 1 | -1;
  /** Animates the first render too. By default only the changes are animated. */
  initial?: boolean;
  className?: string;
};

const SLIDE = 24;

/**
 * Animates the swap of its content when `transitionKey` changes. It respects the "reduce motion"
 * setting of the system: with it on, the content changes with no movement.
 */
export function PageTransition({
  transitionKey,
  children,
  variant = "fade-up",
  direction = 1,
  initial = false,
  className,
}: PageTransitionProps) {
  const motionProps =
    variant === "fade-up"
      ? swap
      : variant === "fade"
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: duration.fast },
          }
        : {
            initial: { opacity: 0, x: SLIDE * direction },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -SLIDE * direction },
            transition: { duration: 0.18, ease: easeOut },
          };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={initial}>
        <motion.div
          key={transitionKey}
          data-slot="page-transition"
          className={className}
          {...motionProps}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
