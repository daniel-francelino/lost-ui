import { describe, expect, it } from "vitest";

import { patterns, rules } from "./index";

const check = (rule: ReturnType<(typeof rules)["required"]>, value: unknown) =>
  typeof rule === "function" ? rule(value, patterns) : undefined;

describe("rules", () => {
  it("required rejects empty values and accepts filled ones", () => {
    const rule = rules.required("Needed");
    expect(check(rule, "")).toBe("Needed");
    expect(check(rule, "   ")).toBe("Needed");
    expect(check(rule, null)).toBe("Needed");
    expect(check(rule, undefined)).toBe("Needed");
    expect(check(rule, [])).toBe("Needed");
    expect(check(rule, false)).toBe("Needed");
    expect(check(rule, "x")).toBe(true);
    expect(check(rule, 0)).toBe(true);
    expect(check(rule, ["a"])).toBe(true);
    expect(check(rule, true)).toBe(true);
    expect(check(rule, new Date())).toBe(true);
  });

  it("required has a default message", () => {
    expect(check(rules.required(), "")).toBe("This field is required");
  });

  it("minLength and maxLength count characters and items", () => {
    expect(check(rules.minLength(3), "ab")).toBe("Use at least 3 characters");
    expect(check(rules.minLength(3), "abc")).toBe(true);
    expect(check(rules.minLength(2), ["a"])).toBe("Use at least 2 characters");
    expect(check(rules.maxLength(3), "abcd")).toBe("Use at most 3 characters");
    expect(check(rules.maxLength(3), "abc")).toBe(true);
  });

  it("length rules leave an empty value to required", () => {
    expect(check(rules.minLength(3), "")).toBe(true);
    expect(check(rules.maxLength(3), "")).toBe(true);
  });

  it("min and max compare numbers and ignore an empty value", () => {
    expect(check(rules.min(5), 4)).toBe("Must be at least 5");
    expect(check(rules.min(5), 5)).toBe(true);
    expect(check(rules.max(5), 6)).toBe("Must be at most 5");
    expect(check(rules.max(5), 5)).toBe(true);
    expect(check(rules.min(5), null)).toBe(true);
  });

  it("email and url validate their format", () => {
    expect(check(rules.email(), "nope")).toBe("Enter a valid email");
    expect(check(rules.email(), "me@lost.ui")).toBe(true);
    expect(check(rules.email(), "")).toBe(true);
    expect(check(rules.url(), "not a url")).toBe("Enter a valid URL");
    expect(check(rules.url(), "https://lost.ui")).toBe(true);
  });

  it("pattern tests a regular expression", () => {
    const rule = rules.pattern(/^\d+$/, "Digits only");
    expect(check(rule, "12a")).toBe("Digits only");
    expect(check(rule, "123")).toBe(true);
  });

  it("oneOf accepts only listed values", () => {
    const rule = rules.oneOf(["a", "b"], "Pick a or b");
    expect(check(rule, "c")).toBe("Pick a or b");
    expect(check(rule, "a")).toBe(true);
  });

  it("matches compares with another value read at validation time", () => {
    let other = "secret";
    const rule = rules.matches(() => other, "Passwords differ");
    expect(check(rule, "secret")).toBe(true);
    other = "changed";
    expect(check(rule, "secret")).toBe("Passwords differ");
  });
});

describe("patterns", () => {
  it("recognises emails, urls, times and dates", () => {
    expect(patterns.email("a@b.co")).toBe(true);
    expect(patterns.email("a@b")).toBe(false);
    expect(patterns.url("https://x.io/path")).toBe(true);
    expect(patterns.url("x.io")).toBe(false);
    expect(patterns.time("09:30")).toBe(true);
    expect(patterns.time("24:00")).toBe(false);
    expect(patterns.fulltime("09:30:15")).toBe(true);
    expect(patterns.date("2026-01-15")).toBe(true);
    expect(patterns.date("15/01/2026")).toBe(false);
  });

  it("recognises colors", () => {
    expect(patterns.hexColor("#fff")).toBe(true);
    expect(patterns.hexColor("#1a2b3c")).toBe(true);
    expect(patterns.hexColor("#12345")).toBe(false);
    expect(patterns.hexaColor("#1a2b3c4d")).toBe(true);
    expect(patterns.hexOrHexaColor("#1a2b3c4d")).toBe(true);
    expect(patterns.rgbColor("rgb(1, 2, 3)")).toBe(true);
    expect(patterns.rgbColor("rgb(1, 2)")).toBe(false);
  });

  it("recognises numbers", () => {
    expect(patterns.integer(3)).toBe(true);
    expect(patterns.integer(3.5)).toBe(false);
    expect(patterns.number(3.5)).toBe(true);
    expect(patterns.number(Number.NaN)).toBe(false);
    expect(patterns.number("3")).toBe(false);
  });
});
