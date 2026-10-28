import type { ReactNode } from "react";

import type { LazyRules, ValidationRule } from "./validation";

export type FieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export type FieldProps<T> = {
  id?: string;
  name?: string;
  label?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  help?: ReactNode;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  rules?: ValidationRule<T>[];
  lazyRules?: LazyRules;
  reactiveRules?: boolean;
  error?: boolean | null;
  errorMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  size?: FieldSize;
  className?: string;
};

export const fieldControlSize: Record<FieldSize, string> = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-2.5 text-sm",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-base",
  xl: "h-12 px-4 text-base",
};

export const fieldTextSize: Record<FieldSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-base",
};
