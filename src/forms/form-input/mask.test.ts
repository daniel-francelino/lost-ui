import { describe, expect, it } from "vitest";

import { applyMask, unmaskValue } from "./mask";

describe("applyMask", () => {
  it("fills digit slots and adds the literals around them", () => {
    expect(applyMask("11987654321", "(##) #####-####").text).toBe("(11) 98765-4321");
  });

  it("shows a literal only once a character follows it", () => {
    expect(applyMask("12", "##/##").text).toBe("12");
    expect(applyMask("123", "##/##").text).toBe("12/3");
  });

  it("accepts input that already has the literals", () => {
    expect(applyMask("(11) 98765-4321", "(##) #####-####").text).toBe("(11) 98765-4321");
  });

  it("drops characters that do not fit the slot", () => {
    expect(applyMask("1a2b3", "##/##").text).toBe("12/3");
  });

  it("does not add a literal for characters that no slot accepts", () => {
    expect(applyMask("12b", "(##) ###").text).toBe("(12");
    expect(applyMask("(12)", "(##) ###").text).toBe("(12)");
  });

  it("stops when the mask is full", () => {
    expect(applyMask("123456", "##/##").text).toBe("12/34");
  });

  it("returns an empty text for an empty input", () => {
    expect(applyMask("", "(##)")).toEqual({ text: "", raw: "", trailing: 0 });
  });

  it("returns the typed characters without literals as raw", () => {
    expect(applyMask("123", "##/##").raw).toBe("123");
  });

  it("counts the literals that close the text", () => {
    expect(applyMask("12/", "##/##")).toEqual({ text: "12/", raw: "12", trailing: 1 });
    expect(applyMask("12", "##/##").trailing).toBe(0);
  });

  it("changes the case with A and a", () => {
    expect(applyMask("abc123", "AAA-###").text).toBe("ABC-123");
    expect(applyMask("ABC", "aaa").text).toBe("abc");
  });

  it("takes letters or digits with N and X", () => {
    expect(applyMask("a1-b2", "NN NN").text).toBe("a1 b2");
    expect(applyMask("a1b2", "XXXX").text).toBe("A1B2");
  });

  it("takes only letters with S", () => {
    expect(applyMask("a1b2", "SS").text).toBe("ab");
  });

  it("uses a character after a backslash as a literal", () => {
    expect(applyMask("ff", "\\#XX").text).toBe("#FF");
  });

  it("uses custom tokens", () => {
    const tokens = { H: { pattern: /[0-9a-f]/i, transform: (char: string) => char.toUpperCase() } };
    expect(applyMask("ff00zz", "HHHHHH", tokens).text).toBe("FF00");
  });

  it("picks the shortest mask that holds every typed character", () => {
    const masks = ["###.###.###-##", "##.###.###/####-##"];
    expect(applyMask("12345678901", masks).text).toBe("123.456.789-01");
    expect(applyMask("123456789012", masks).text).toBe("12.345.678/9012");
    expect(applyMask("12345678901234", masks).text).toBe("12.345.678/9012-34");
  });
});

describe("unmaskValue", () => {
  it("removes the literals", () => {
    expect(unmaskValue("(11) 98765-4321", "(##) #####-####")).toBe("11987654321");
  });
});
