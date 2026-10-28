import { AnimatePresence, MotionConfig, motion } from "motion/react";

import { duration } from "../../lib/motion";

/** The error of a whole form (not of a field), read by screen readers when it appears. */
export function FormError({ message }: { message: string | null | undefined }) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false}>
        {message && (
          <motion.p
            key={message}
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
