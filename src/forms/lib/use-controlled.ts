import { useCallback, useRef, useState } from "react";

export type ControlledOptions<T> = {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
};

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
