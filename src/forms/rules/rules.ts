import { patterns, type ValidationRule } from "../lib/validation";

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === false) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && !(value instanceof Date)) {
    return Object.keys(value).length === 0;
  }
  return false;
}

function sizeOf(value: unknown): number {
  if (typeof value === "string" || Array.isArray(value)) return value.length;
  return 0;
}

export const rules = {
  required:
    (message = "This field is required"): ValidationRule =>
    (value) =>
      !isEmpty(value) || message,

  minLength:
    (length: number, message = `Use at least ${length} characters`): ValidationRule =>
    (value) =>
      isEmpty(value) || sizeOf(value) >= length || message,

  maxLength:
    (length: number, message = `Use at most ${length} characters`): ValidationRule =>
    (value) =>
      isEmpty(value) || sizeOf(value) <= length || message,

  min:
    (limit: number, message = `Must be at least ${limit}`): ValidationRule =>
    (value) =>
      value === null || value === undefined || Number(value) >= limit || message,

  max:
    (limit: number, message = `Must be at most ${limit}`): ValidationRule =>
    (value) =>
      value === null || value === undefined || Number(value) <= limit || message,

  email:
    (message = "Enter a valid email"): ValidationRule =>
    (value) =>
      isEmpty(value) || patterns.email(value) || message,

  url:
    (message = "Enter a valid URL"): ValidationRule =>
    (value) =>
      isEmpty(value) || patterns.url(value) || message,

  pattern:
    (expression: RegExp, message = "Invalid format"): ValidationRule =>
    (value) =>
      isEmpty(value) || (typeof value === "string" && expression.test(value)) || message,

  oneOf:
    (options: readonly unknown[], message = "Choose a valid option"): ValidationRule =>
    (value) =>
      isEmpty(value) || options.includes(value) || message,

  matches:
    (other: () => unknown, message = "Values do not match"): ValidationRule =>
    (value) =>
      Object.is(value, other()) || message,
};
