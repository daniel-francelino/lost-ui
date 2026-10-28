import { describe, expect, it } from "vitest";

import { isFailure, isThenable, patterns, runRules, type ValidationRule } from "./validation";

describe("runRules", () => {
  it("passes when there are no rules", () => {
    expect(runRules<string>([], "x")).toEqual({ kind: "passed" });
  });

  it("passes when every rule returns true", () => {
    expect(runRules<string>([() => true, () => true], "x")).toEqual({ kind: "passed" });
  });

  it("treats undefined as a pass, like Quasar", () => {
    expect(runRules<string>([() => undefined], "x")).toEqual({ kind: "passed" });
  });

  it("fails with the message of a rule that returns a string", () => {
    expect(runRules<string>([() => "Nope"], "x")).toEqual({ kind: "failed", message: "Nope" });
  });

  it("fails without a message when a rule returns false", () => {
    expect(runRules<string>([() => false], "x")).toEqual({ kind: "failed", message: null });
  });

  it("stops at the first failing synchronous rule", () => {
    let reached = false;
    const outcome = runRules<string>(
      [
        () => "First",
        () => {
          reached = true;
          return "Second";
        },
      ],
      "x",
    );

    expect(outcome).toEqual({ kind: "failed", message: "First" });
    expect(reached).toBe(false);
  });

  it("hands the value and the patterns to each rule", () => {
    const seen: unknown[] = [];
    runRules<string>(
      [
        (value, test) => {
          seen.push(value, test);
          return true;
        },
      ],
      "abc",
    );
    expect(seen[0]).toBe("abc");
    expect(seen[1]).toBe(patterns);
  });

  it("collects the promises of asynchronous rules", () => {
    const outcome = runRules<string>(
      [() => Promise.resolve(true), () => Promise.resolve("Late")],
      "x",
    );
    expect(outcome.kind).toBe("pending");
    if (outcome.kind === "pending") expect(outcome.promises).toHaveLength(2);
  });

  it("fails fast on a synchronous failure even when promises came first", () => {
    const outcome = runRules<string>([() => Promise.resolve(true), () => "Sync failure"], "x");
    expect(outcome).toEqual({ kind: "failed", message: "Sync failure" });
  });

  it("accepts the name of a pattern as a rule", () => {
    expect(runRules<string>(["email"], "me@lost.ui")).toEqual({ kind: "passed" });
    expect(runRules<string>(["email"], "nope")).toEqual({ kind: "failed", message: null });
  });

  it("fails an unknown pattern name instead of accepting anything", () => {
    const unknown = "nonsense" as unknown as ValidationRule<string>;
    expect(runRules<string>([unknown], "x")).toEqual({ kind: "failed", message: null });
  });
});

describe("helpers", () => {
  it("isFailure recognises false and strings only", () => {
    expect(isFailure(false)).toBe(true);
    expect(isFailure("msg")).toBe(true);
    expect(isFailure(true)).toBe(false);
    expect(isFailure(undefined)).toBe(false);
    expect(isFailure(0)).toBe(false);
  });

  it("isThenable recognises promises", () => {
    expect(isThenable(Promise.resolve())).toBe(true);
    expect(isThenable({ then: () => undefined })).toBe(true);
    expect(isThenable({})).toBe(false);
    expect(isThenable(null)).toBe(false);
    expect(isThenable("x")).toBe(false);
  });
});
