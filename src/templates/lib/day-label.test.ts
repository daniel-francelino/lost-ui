import { describe, expect, it } from "vitest";

import { dayLabel } from "./day-label";

const now = new Date(2026, 5, 15, 12);

describe("dayLabel", () => {
  it("calls the same day today, whatever the hour", () => {
    expect(dayLabel(new Date(2026, 5, 15, 0, 1), "en", now).kind).toBe("today");
    expect(dayLabel(new Date(2026, 5, 15, 23, 59), "en", now).kind).toBe("today");
  });

  it("calls the day before yesterday", () => {
    expect(dayLabel(new Date(2026, 5, 14, 23, 59), "en", now).kind).toBe("yesterday");
  });

  it("writes older dates for the language", () => {
    expect(dayLabel(new Date(2026, 5, 10), "en", now)).toMatchObject({
      kind: "date",
      text: "June 10, 2026",
    });
    expect(dayLabel(new Date(2026, 5, 10), "pt", now).text).toBe("10 de junho de 2026");
  });

  it("gives the same key to the same day and a different one to another", () => {
    const a = dayLabel(new Date(2026, 5, 10, 8), "en", now).key;
    const b = dayLabel(new Date(2026, 5, 10, 20), "en", now).key;
    const c = dayLabel(new Date(2026, 5, 9), "en", now).key;
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it("takes strings and timestamps", () => {
    expect(dayLabel(new Date(2026, 5, 15, 9).toISOString(), "en", now).kind).toBe("today");
    expect(dayLabel(new Date(2026, 5, 15, 9).getTime(), "en", now).kind).toBe("today");
  });
});
