import { MINUTES_PER_DAY, addDays, byStart, minutesOfDay, startOfDay } from "./dates";
import type { NormalizedEvent, PositionedEvent } from "./types";

const MIN_MINUTES = 15;

/**
 * Where the timed events of one day sit: events that overlap share the width in columns, each
 * one taking the first column where it fits (as Google Calendar does). Day-long events are not
 * laid out here.
 */
export function layoutTimedEvents(events: NormalizedEvent[], day: Date): PositionedEvent[] {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, 1);

  const clipped = events
    .filter((event) => !event.allDay && event.start < dayEnd && event.end >= dayStart)
    .sort(byStart)
    .map((event) => {
      const top = event.start < dayStart ? 0 : minutesOfDay(event.start);
      const end = event.end >= dayEnd ? MINUTES_PER_DAY : minutesOfDay(event.end);
      return { event, top, bottom: Math.max(end, top + MIN_MINUTES) };
    });

  const groups: (typeof clipped)[] = [];
  let groupEnd = -1;
  for (const item of clipped) {
    const current = groups.at(-1);
    if (current && item.top < groupEnd) {
      current.push(item);
      groupEnd = Math.max(groupEnd, item.bottom);
    } else {
      groups.push([item]);
      groupEnd = item.bottom;
    }
  }

  return groups.flatMap((group) => {
    const columns: (typeof clipped)[] = [];
    const placed = group.map((item) => {
      let index = columns.findIndex((column) => column.at(-1)!.bottom <= item.top);
      if (index === -1) index = columns.push([]) - 1;
      columns[index]!.push(item);
      return { item, index };
    });
    return placed.map(({ item, index }) => ({
      event: item.event,
      top: item.top,
      height: item.bottom - item.top,
      left: index / columns.length,
      width: 1 / columns.length,
    }));
  });
}
