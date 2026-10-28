import { describe, expect, it } from "vitest";

import {
  addDays,
  addMonths,
  atMinutes,
  eventOnDay,
  isSameDay,
  layoutTimedEvents,
  monthGrid,
  normalizeEvent,
  snapMinutes,
  startOfWeek,
  weekDays,
  type CalendarEvent,
} from ".";

const at = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute);
const event = (id: string, start: Date, end: Date, extra: Partial<CalendarEvent> = {}) =>
  normalizeEvent({ id, title: id, start, end, ...extra });

describe("dates", () => {
  it("reads ISO strings and puts an end before the start at the start", () => {
    const normalized = normalizeEvent({
      id: "a",
      title: "a",
      start: "2026-10-28T14:00:00",
      end: "2026-10-28T13:00:00",
    });
    expect(normalized.start).toEqual(new Date(2026, 9, 28, 14));
    expect(normalized.end).toEqual(normalized.start);
  });

  it("finds the start of the week for each first day", () => {
    // 28 October 2026 is a Wednesday
    expect(startOfWeek(at(28, 15), 0)).toEqual(new Date(2026, 9, 25));
    expect(startOfWeek(at(28, 15), 1)).toEqual(new Date(2026, 9, 26));
    expect(startOfWeek(at(25, 9), 0)).toEqual(new Date(2026, 9, 25));
    expect(startOfWeek(at(25, 9), 1)).toEqual(new Date(2026, 9, 19));
  });

  it("lists seven days of a week and 42 days of a month grid", () => {
    expect(weekDays(at(28, 9), 1).map((d) => d.getDate())).toEqual([26, 27, 28, 29, 30, 31, 1]);
    const grid = monthGrid(at(28, 9), 0);
    expect(grid).toHaveLength(42);
    // 1 October 2026 is a Thursday, so the grid starts on Sunday 27 September
    expect(grid[0]).toEqual(new Date(2026, 8, 27));
    expect(grid[41]).toEqual(new Date(2026, 10, 7));
  });

  it("adds days across a month, and months without overflowing", () => {
    expect(addDays(new Date(2026, 9, 31), 1)).toEqual(new Date(2026, 10, 1));
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
    expect(addMonths(new Date(2026, 11, 15), 1)).toEqual(new Date(2027, 0, 15));
    expect(addMonths(new Date(2026, 0, 15), -1)).toEqual(new Date(2025, 11, 15));
  });

  it("snaps minutes to a step and builds a date from minutes", () => {
    expect(snapMinutes(67)).toBe(60);
    expect(snapMinutes(68)).toBe(75);
    expect(atMinutes(new Date(2026, 9, 28), 90)).toEqual(new Date(2026, 9, 28, 1, 30));
    expect(isSameDay(at(28, 1), at(28, 23))).toBe(true);
    expect(isSameDay(at(28, 1), at(29, 1))).toBe(false);
  });

  it("says which days an event touches", () => {
    const night = event("n", at(28, 22), at(29, 2));
    expect(eventOnDay(night, new Date(2026, 9, 28))).toBe(true);
    expect(eventOnDay(night, new Date(2026, 9, 29))).toBe(true);
    expect(eventOnDay(night, new Date(2026, 9, 30))).toBe(false);
    const trip = event("t", at(28, 0), at(30, 0), { allDay: true });
    expect([27, 28, 29, 30, 31].map((d) => eventOnDay(trip, new Date(2026, 9, d)))).toEqual([
      false,
      true,
      true,
      true,
      false,
    ]);
    const endsAtMidnight = event("m", at(28, 20), at(29, 0));
    expect(eventOnDay(endsAtMidnight, new Date(2026, 9, 29))).toBe(false);
  });
});

describe("layoutTimedEvents", () => {
  const day = new Date(2026, 9, 28);

  it("puts one event at its time with the whole width", () => {
    const [only] = layoutTimedEvents([event("a", at(28, 9), at(28, 10, 30))], day);
    expect(only).toMatchObject({ top: 540, height: 90, left: 0, width: 1 });
  });

  it("gives a short event at least 15 minutes", () => {
    const [short] = layoutTimedEvents([event("a", at(28, 9), at(28, 9, 5))], day);
    expect(short!.height).toBe(15);
  });

  it("places events that do not overlap one after the other, each with the whole width", () => {
    const laid = layoutTimedEvents(
      [event("a", at(28, 9), at(28, 10)), event("b", at(28, 10), at(28, 11))],
      day,
    );
    expect(laid.map((p) => [p.left, p.width])).toEqual([
      [0, 1],
      [0, 1],
    ]);
  });

  it("splits the width between events that overlap", () => {
    const laid = layoutTimedEvents(
      [event("a", at(28, 9), at(28, 11)), event("b", at(28, 10), at(28, 12))],
      day,
    );
    expect(laid.map((p) => [p.event.id, p.left, p.width])).toEqual([
      ["a", 0, 0.5],
      ["b", 0.5, 0.5],
    ]);
  });

  it("reuses a column when an event ends before the next one starts", () => {
    const laid = layoutTimedEvents(
      [
        event("a", at(28, 9), at(28, 12)),
        event("b", at(28, 9, 30), at(28, 10)),
        event("c", at(28, 10), at(28, 11)),
      ],
      day,
    );
    const byId = Object.fromEntries(laid.map((p) => [p.event.id, p]));
    expect(byId.a).toMatchObject({ left: 0, width: 0.5 });
    expect(byId.b).toMatchObject({ left: 0.5, width: 0.5 });
    expect(byId.c).toMatchObject({ left: 0.5, width: 0.5 });
  });

  it("clips an event that crosses midnight to the day", () => {
    const night = event("n", at(28, 22), at(29, 2));
    expect(layoutTimedEvents([night], day)[0]).toMatchObject({ top: 1320, height: 120 });
    expect(layoutTimedEvents([night], new Date(2026, 9, 29))[0]).toMatchObject({
      top: 0,
      height: 120,
    });
  });

  it("leaves out day-long events and events of other days", () => {
    expect(
      layoutTimedEvents(
        [
          event("all", at(28, 0), at(28, 0), { allDay: true }),
          event("other", at(30, 9), at(30, 10)),
        ],
        day,
      ),
    ).toEqual([]);
  });
});
