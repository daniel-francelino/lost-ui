/**
 * Timings shared by the animated components, taken from what aura-creative, memoria-print and
 * kortex already use, so everything moves at the same pace.
 */

/** Soft landing: fast at the start, slow at the end. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const duration = { fast: 0.15, base: 0.2, slow: 0.3 } as const;

/** For a marker that slides between items (the active tab, the active step). */
export const indicatorSpring = { type: "spring", stiffness: 420, damping: 34 } as const;

/** For a panel that comes in and goes out (a tray, a menu over the page). */
export const panelSpring = { type: "spring", stiffness: 380, damping: 32 } as const;

/** The delay of the nth item of a list that enters one after the other, capped so long lists stay quick. */
export function stagger(index: number, step = 0.025, max = 0.12): number {
  return Math.min(index * step, max);
}

/** Enter and exit of an item of a list: fades and rises a little. */
export const listItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 24 },
  transition: { duration: duration.base, ease: easeOut },
} as const;

/** Enter and exit of a block that swaps with another one. */
export const swap = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: easeOut },
} as const;
