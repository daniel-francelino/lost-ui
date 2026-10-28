import { motion, useReducedMotionConfig } from "motion/react";

import { cn } from "../../../lib/cn";

export type ChatShimmerProps = {
  text: string;
  /** Seconds a sweep takes. */
  duration?: number;
  /** The width of the highlight, in pixels per character of the text. */
  spread?: number;
  className?: string;
};

/**
 * Text with a light that sweeps across it, for something still going on: "Thinking…", a tool
 * that runs. With reduced motion it is plain muted text.
 */
export function ChatShimmer({ text, duration = 2, spread = 2, className }: ChatShimmerProps) {
  const reduceMotion = useReducedMotionConfig();

  if (reduceMotion) {
    return (
      <span data-slot="chat-shimmer" className={cn("text-muted-foreground", className)}>
        {text}
      </span>
    );
  }

  const band = text.length * spread;

  return (
    <motion.span
      data-slot="chat-shimmer"
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, transparent calc(50% - ${band}px), var(--foreground), transparent calc(50% + ${band}px)), linear-gradient(var(--muted-foreground), var(--muted-foreground))`,
        backgroundSize: "250% 100%, auto",
        backgroundRepeat: "no-repeat, padding-box",
      }}
      initial={{ backgroundPosition: "100% center, 0 0" }}
      animate={{ backgroundPosition: "0% center, 0 0" }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {text}
    </motion.span>
  );
}
