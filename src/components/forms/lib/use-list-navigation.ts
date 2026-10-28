import { useCallback, useState, type KeyboardEvent } from "react";

export type ListNavigationOptions = {
  count: number;
  isDisabled?: (index: number) => boolean;
  onSelect?: (index: number) => void;
  selectOnSpace?: boolean;
};

export function useListNavigation({
  count,
  isDisabled,
  onSelect,
  selectOnSpace = false,
}: ListNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const step = useCallback(
    (from: number, direction: 1 | -1) => {
      if (count === 0) return -1;
      let index = from;
      for (let tries = 0; tries < count; tries++) {
        index = (index + direction + count) % count;
        if (!isDisabled?.(index)) return index;
      }
      return -1;
    },
    [count, isDisabled],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent): boolean => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((current) => step(current, 1));
          return true;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((current) => step(current < 0 ? 0 : current, -1));
          return true;
        case "Home":
          event.preventDefault();
          setActiveIndex(step(-1, 1));
          return true;
        case "End":
          event.preventDefault();
          setActiveIndex(step(0, -1));
          return true;
        case "Enter":
          if (activeIndex >= 0) {
            event.preventDefault();
            onSelect?.(activeIndex);
            return true;
          }
          return false;
        case " ":
          if (selectOnSpace && activeIndex >= 0) {
            event.preventDefault();
            onSelect?.(activeIndex);
            return true;
          }
          return false;
        default:
          return false;
      }
    },
    [activeIndex, onSelect, selectOnSpace, step],
  );

  return { activeIndex, setActiveIndex, onKeyDown };
}
