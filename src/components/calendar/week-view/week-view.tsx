import { weekDays } from "../calendar-model/dates";
import type { WeekStart } from "../calendar-model/types";
import { TimeGrid, type TimeGridProps } from "../time-grid";

export type WeekViewProps<T = unknown> = Omit<TimeGridProps<T>, "days"> & {
  /** Any day of the week to show. */
  date: Date;
  weekStartsOn?: WeekStart;
};

/** A week: seven columns of hours. */
export function WeekView<T = unknown>({ date, weekStartsOn = 0, ...grid }: WeekViewProps<T>) {
  return <TimeGrid<T> days={weekDays(date, weekStartsOn)} {...grid} />;
}
