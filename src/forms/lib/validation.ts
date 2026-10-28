export type RuleResult = boolean | string | undefined | void;

export const patterns = {
  email: (value: unknown) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  url: (value: unknown) => {
    if (typeof value !== "string") return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  date: (value: unknown) =>
    typeof value === "string" && /^-?\d+[/-][0-1]\d[/-][0-3]\d$/.test(value),
  time: (value: unknown) => typeof value === "string" && /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(value),
  fulltime: (value: unknown) =>
    typeof value === "string" && /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value),
  hexColor: (value: unknown) =>
    typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value),
  hexaColor: (value: unknown) =>
    typeof value === "string" && /^#([0-9a-f]{4}|[0-9a-f]{8})$/i.test(value),
  hexOrHexaColor: (value: unknown) =>
    typeof value === "string" && /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value),
  rgbColor: (value: unknown) =>
    typeof value === "string" && /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(value),
  integer: (value: unknown) => typeof value === "number" && Number.isInteger(value),
  number: (value: unknown) => typeof value === "number" && Number.isFinite(value),
};

export type PatternName = keyof typeof patterns;

export type ValidationRule<T = unknown> =
  ((value: T, test: typeof patterns) => RuleResult | Promise<RuleResult>) | PatternName;

export type LazyRules = boolean | "ondemand";

export function isFailure(result: unknown): result is false | string {
  return result === false || typeof result === "string";
}

export function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

export type SyncOutcome =
  | { kind: "failed"; message: string | null }
  | { kind: "passed" }
  | { kind: "pending"; promises: PromiseLike<unknown>[] };

export function runRules<T>(rules: ValidationRule<T>[], value: T): SyncOutcome {
  const promises: PromiseLike<unknown>[] = [];

  for (const rule of rules) {
    let result: unknown;

    if (typeof rule === "function") {
      result = rule(value, patterns);
    } else if (rule in patterns) {
      result = patterns[rule](value);
    } else {
      result = false;
    }

    if (isFailure(result)) {
      return { kind: "failed", message: typeof result === "string" ? result : null };
    }
    if (result !== true && result !== undefined) {
      promises.push(isThenable(result) ? result : Promise.resolve(result));
    }
  }

  return promises.length === 0 ? { kind: "passed" } : { kind: "pending", promises };
}
