import { afterEach, describe, expect, it, vi } from "vitest";

import { lostI18n } from "../../i18n";
import { patterns, rules } from "./index";

const check = (rule: ReturnType<(typeof rules)["required"]>, value: unknown) =>
  typeof rule === "function" ? rule(value, patterns) : undefined;

const file = (name: string, size: number, type = "") => {
  const made = new File(["x"], name, { type });
  Object.defineProperty(made, "size", { value: size });
  return made;
};

afterEach(async () => {
  vi.useRealTimers();
  await lostI18n.changeLanguage("en");
});

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

  it("required treats a range with no date as empty", () => {
    const rule = rules.required("Needed");
    expect(check(rule, {})).toBe("Needed");
    expect(check(rule, { from: undefined, to: undefined })).toBe("Needed");
    expect(check(rule, { from: new Date() })).toBe(true);
  });

  it("required has a default message", () => {
    expect(check(rules.required(), "")).toBe("This field is required");
  });

  it("minLength and maxLength count characters and items", () => {
    expect(check(rules.minLength(3), "ab")).toBe("Use at least 3 characters");
    expect(check(rules.minLength(3), "abc")).toBe(true);
    expect(check(rules.minLength(2), ["a"])).toBe("Choose at least 2 items");
    expect(check(rules.maxLength(3), "abcd")).toBe("Use at most 3 characters");
    expect(check(rules.maxLength(3), "abc")).toBe(true);
    expect(check(rules.maxLength(1), ["a", "b"])).toBe("Choose at most 1 items");
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

describe("rules in other languages", () => {
  it("writes the default message in the current language", async () => {
    const rule = rules.required();
    expect(check(rule, "")).toBe("This field is required");

    await lostI18n.changeLanguage("pt");
    expect(check(rule, "")).toBe("Este campo é obrigatório");

    await lostI18n.changeLanguage("es");
    expect(check(rule, "")).toBe("Este campo es obligatorio");
  });

  it("fills the limits into the message", async () => {
    await lostI18n.changeLanguage("pt");
    expect(check(rules.minLength(3), "ab")).toBe("Use pelo menos 3 caracteres");
    expect(check(rules.between(1, 5), 9)).toBe("Deve estar entre 1 e 5");
  });

  it("keeps the message the caller gave", async () => {
    await lostI18n.changeLanguage("pt");
    expect(check(rules.required("Custom"), "")).toBe("Custom");
  });
});

describe("rules for conditions", () => {
  it("requiredIf asks for a value only while the condition holds", () => {
    let needed = false;
    const rule = rules.requiredIf(() => needed);
    expect(check(rule, "")).toBe(true);
    needed = true;
    expect(check(rule, "")).toBe("This field is required");
    expect(check(rule, "x")).toBe(true);
  });

  it("when runs a rule only while the condition holds", () => {
    const rule = rules.when((value: string) => value.startsWith("+"), rules.minLength(5));
    expect(check(rule as never, "abc")).toBe(true);
    expect(check(rule as never, "+ab")).toBe("Use at least 5 characters");
  });

  it("when accepts the name of a pattern", () => {
    const rule = rules.when((value: string) => value !== "", "email");
    expect(check(rule as never, "")).toBe(true);
    expect(check(rule as never, "nope")).toBe(false);
  });
});

describe("rules for numbers", () => {
  it("min and max treat an empty text as empty, not as zero", () => {
    expect(check(rules.min(5), "")).toBe(true);
    expect(check(rules.max(5), "")).toBe(true);
  });

  it("min and max reject what is not a number", () => {
    expect(check(rules.min(5), "abc")).toBe("Must be at least 5");
    expect(check(rules.max(5), "abc")).toBe("Must be at most 5");
  });

  it("between keeps a number inside both ends", () => {
    expect(check(rules.between(1, 5), 0)).toBe("Must be between 1 and 5");
    expect(check(rules.between(1, 5), 6)).toBe("Must be between 1 and 5");
    expect(check(rules.between(1, 5), 1)).toBe(true);
    expect(check(rules.between(1, 5), 5)).toBe(true);
    expect(check(rules.between(1, 5), null)).toBe(true);
  });

  it("integer rejects a fraction", () => {
    expect(check(rules.integer(), 1.5)).toBe("Must be a whole number");
    expect(check(rules.integer(), 2)).toBe(true);
    expect(check(rules.integer(), "")).toBe(true);
  });
});

describe("rules for lists", () => {
  it("minItems and maxItems count the items", () => {
    expect(check(rules.minItems(2), ["a"])).toBe("Choose at least 2 items");
    expect(check(rules.minItems(2), ["a", "b"])).toBe(true);
    expect(check(rules.maxItems(2), ["a", "b", "c"])).toBe("Choose at most 2 items");
    expect(check(rules.maxItems(2), [])).toBe(true);
  });

  it("oneOf accepts a list whose items are all allowed", () => {
    const rule = rules.oneOf(["a", "b"]);
    expect(check(rule, ["a", "b"])).toBe(true);
    expect(check(rule, ["a", "z"])).toBe("Choose a valid option");
  });
});

describe("pattern", () => {
  it("answers the same on every call for a global expression", () => {
    const rule = rules.pattern(/^\d+$/g, "Digits only");
    expect(check(rule, "123")).toBe(true);
    expect(check(rule, "123")).toBe(true);
    expect(check(rule, "123")).toBe(true);
  });

  it("leaves an empty value to required", () => {
    expect(check(rules.pattern(/^\d+$/), "")).toBe(true);
  });
});

describe("rules for dates", () => {
  const limit = new Date(2026, 0, 15);

  it("minDate and maxDate compare a date", () => {
    expect(check(rules.minDate(limit), new Date(2026, 0, 14))).toContain("or later");
    expect(check(rules.minDate(limit), new Date(2026, 0, 15))).toBe(true);
    expect(check(rules.maxDate(limit), new Date(2026, 0, 16))).toContain("or earlier");
    expect(check(rules.maxDate(limit), new Date(2026, 0, 15))).toBe(true);
  });

  it("names the limit in the message", () => {
    expect(check(rules.minDate(limit), new Date(2026, 0, 1))).toBe("Choose Jan 15, 2026 or later");
  });

  it("checks both ends of a range", () => {
    const late = { from: new Date(2026, 0, 10), to: new Date(2026, 0, 20) };
    const early = { from: new Date(2026, 0, 10), to: new Date(2026, 0, 12) };
    expect(check(rules.maxDate(limit), late)).toContain("or earlier");
    expect(check(rules.maxDate(limit), early)).toBe(true);
  });

  it("passes when there is no date yet", () => {
    expect(check(rules.minDate(limit), null)).toBe(true);
    expect(check(rules.maxDate(limit), {})).toBe(true);
  });
});

describe("rules for files", () => {
  it("fileSize names the limit and rejects a big file", () => {
    expect(check(rules.fileSize(1024), [file("a.txt", 2048)])).toBe(
      "Each file must be at most 1.0 KB",
    );
    expect(check(rules.fileSize(2 * 1024 * 1024), [file("a.txt", 3 * 1024 * 1024)])).toBe(
      "Each file must be at most 2.0 MB",
    );
    expect(check(rules.fileSize(2048), [file("a.txt", 2048), file("b.txt", 10)])).toBe(true);
  });

  it("fileType rejects a file outside the accept list", () => {
    const rule = rules.fileType("image/*,.pdf");
    expect(check(rule, [file("a.png", 1, "image/png"), file("b.pdf", 1)])).toBe(true);
    expect(check(rule, [file("a.zip", 1, "application/zip")])).toBe("File type not allowed");
  });

  it("passes when there are no files", () => {
    expect(check(rules.fileSize(1), [])).toBe(true);
    expect(check(rules.fileType("image/*"), [])).toBe(true);
  });
});

describe("debounce", () => {
  it("runs the rule once after the delay with the last value", async () => {
    vi.useFakeTimers();
    const seen: string[] = [];
    const rule = rules.debounce(async (value: string) => {
      seen.push(value);
      return value !== "taken" || "In use";
    }, 200);

    const first = check(rule as never, "t");
    const second = check(rule as never, "ta");
    const third = check(rule as never, "taken");
    await vi.advanceTimersByTimeAsync(200);

    expect(seen).toEqual(["taken"]);
    expect(await third).toBe("In use");
    expect(await first).toBe(true);
    expect(await second).toBe(true);
  });

  it("passes on the error of a rule that fails", async () => {
    vi.useFakeTimers();
    const rule = rules.debounce(() => Promise.reject(new Error("offline")), 10);

    const caught = Promise.resolve(check(rule as never, "x")).catch(
      (error: Error) => error.message,
    );
    await vi.advanceTimersByTimeAsync(10);

    expect(await caught).toBe("offline");
  });

  it("takes the name of a pattern", async () => {
    vi.useFakeTimers();
    const rule = rules.debounce("email", 10);

    const result = check(rule as never, "nope");
    await vi.advanceTimersByTimeAsync(10);

    expect(await result).toBe(false);
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
