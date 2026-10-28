import { useCallback, useRef, useState } from "react";

export type ControlledOptions<T> = {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
};

/**
 * A value that can be controlled (`value`) or kept inside (`defaultValue`), and that reports
 * every change. `undefined` means uncontrolled; use `null` for "nothing" when it is controlled.
 */
export function useControlled<T>({
  value,
  defaultValue,
  onValueChange,
}: ControlledOptions<T>): [T | undefined, (next: T) => void] {
  const controlled = value !== undefined;
  const [inner, setInner] = useState<T | undefined>(defaultValue);
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;

  const setValue = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange.current?.(next);
    },
    [controlled],
  );

  return [controlled ? value : inner, setValue];
}
