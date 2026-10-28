import { lostI18n, translate, type LostKey } from "../../../i18n/i18n";
import { formatSize, matchesAccept } from "../lib/files";
import { patterns, type RuleResult, type ValidationRule } from "../lib/validation";

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === false) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && !(value instanceof Date)) {
    // a range such as `{ from: undefined }` is as empty as `{}`
    return Object.values(value).every((part) => part === undefined || part === null);
  }
  return false;
}

function sizeOf(value: unknown): number {
  if (typeof value === "string" || Array.isArray(value)) return value.length;
  return 0;
}

/**
 * The text of a rule: the message given by the caller, or the default of the current
 * language. It is read when the rule runs, so a language change reaches rules already created.
 */
function text(message: string | undefined, key: LostKey, params?: Record<string, unknown>) {
  return message ?? translate(key, params);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(lostI18n.language, { dateStyle: "medium" }).format(date);
}

/** The dates in a value: one `Date`, or the ends of a `{ from, to }` range. */
function datesOf(value: unknown): Date[] {
  if (value instanceof Date) return [value];
  if (typeof value === "object" && value !== null) {
    return Object.values(value).filter((part): part is Date => part instanceof Date);
  }
  return [];
}

function filesOf(value: unknown): File[] {
  return Array.isArray(value) ? value.filter((item): item is File => item instanceof File) : [];
}

function runRule<T>(rule: ValidationRule<T>, value: T): RuleResult | Promise<RuleResult> {
  return typeof rule === "function" ? rule(value, patterns) : patterns[rule](value);
}

export const rules = {
  required:
    (message?: string): ValidationRule =>
    (value) =>
      !isEmpty(value) || text(message, "rules.required"),

  /** Required only while `condition()` is true, e.g. a company name when "business" is on. */
  requiredIf:
    (condition: () => boolean, message?: string): ValidationRule =>
    (value) =>
      !condition() || !isEmpty(value) || text(message, "rules.requiredIf"),

  /** Characters of a text, or items of a list. */
  minLength:
    (length: number, message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) ||
      sizeOf(value) >= length ||
      text(message, Array.isArray(value) ? "rules.minItems" : "rules.minLength", { limit: length }),

  maxLength:
    (length: number, message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) ||
      sizeOf(value) <= length ||
      text(message, Array.isArray(value) ? "rules.maxItems" : "rules.maxLength", { limit: length }),

  /** At least `length` items of a list. */
  minItems:
    (length: number, message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) ||
      sizeOf(value) >= length ||
      text(message, "rules.minItems", { limit: length }),

  /** At most `length` items of a list. */
  maxItems:
    (length: number, message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) ||
      sizeOf(value) <= length ||
      text(message, "rules.maxItems", { limit: length }),

  min:
    (limit: number, message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) || Number(value) >= limit || text(message, "rules.min", { limit }),

  max:
    (limit: number, message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) || Number(value) <= limit || text(message, "rules.max", { limit }),

  between:
    (min: number, max: number, message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) ||
      (Number(value) >= min && Number(value) <= max) ||
      text(message, "rules.between", { min, max }),

  integer:
    (message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) || Number.isInteger(Number(value)) || text(message, "rules.integer"),

  email:
    (message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) || patterns.email(value) || text(message, "rules.email"),

  url:
    (message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) || patterns.url(value) || text(message, "rules.url"),

  pattern:
    (expression: RegExp, message?: string): ValidationRule =>
    (value) => {
      if (isEmpty(value)) return true;
      // a `g` or `y` expression keeps a position between calls and would answer differently each time
      expression.lastIndex = 0;
      return (
        (typeof value === "string" && expression.test(value)) || text(message, "rules.pattern")
      );
    },

  /** One of `options`; a list passes when every item is one of them. */
  oneOf:
    (options: readonly unknown[], message?: string): ValidationRule =>
    (value) =>
      isEmpty(value) ||
      (Array.isArray(value)
        ? value.every((item) => options.includes(item))
        : options.includes(value)) ||
      text(message, "rules.oneOf"),

  matches:
    (other: () => unknown, message?: string): ValidationRule =>
    (value) =>
      Object.is(value, other()) || text(message, "rules.matches"),

  /** A `Date` (or both ends of a `{ from, to }` range) on or after `limit`. */
  minDate:
    (limit: Date, message?: string): ValidationRule =>
    (value) =>
      datesOf(value).every((date) => date >= limit) ||
      text(message, "rules.minDate", { limit: formatDate(limit) }),

  /** A `Date` (or both ends of a `{ from, to }` range) on or before `limit`. */
  maxDate:
    (limit: Date, message?: string): ValidationRule =>
    (value) =>
      datesOf(value).every((date) => date <= limit) ||
      text(message, "rules.maxDate", { limit: formatDate(limit) }),

  /** Every file of a `File[]` at most `bytes` big. */
  fileSize:
    (bytes: number, message?: string): ValidationRule =>
    (value) =>
      filesOf(value).every((file) => file.size <= bytes) ||
      text(message, "rules.fileSize", { limit: formatSize(bytes) }),

  /** Every file of a `File[]` fits an `accept` list such as `"image/*,.pdf"`. */
  fileType:
    (accept: string, message?: string): ValidationRule =>
    (value) =>
      filesOf(value).every((file) => matchesAccept(file, accept)) ||
      text(message, "rules.fileType"),

  /** Runs `rule` only when `condition(value)` is true; otherwise the value passes. */
  when:
    <T = unknown>(condition: (value: T) => boolean, rule: ValidationRule<T>): ValidationRule<T> =>
    (value) =>
      condition(value) ? runRule(rule, value) : true,

  /**
   * Waits `delay` ms after the last change before running `rule`, so an asynchronous check
   * (a request) does not fire on every keystroke. A change that arrives meanwhile ends the
   * earlier call without a verdict. Make one per field: it keeps the timer of its own field.
   */
  debounce: <T = unknown>(rule: ValidationRule<T>, delay = 300): ValidationRule<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let supersede: (() => void) | undefined;

    return (value) =>
      new Promise<RuleResult>((resolve, reject) => {
        clearTimeout(timer);
        supersede?.();
        supersede = () => resolve(true);

        timer = setTimeout(() => {
          supersede = undefined;
          Promise.resolve(runRule(rule, value)).then(resolve, reject);
        }, delay);
      });
  },
};
