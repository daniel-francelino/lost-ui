import { weekDays } from "../calendar-model/dates";
import type { WeekStart } from "../calendar-model/types";
import { TimeGrid, type TimeGridProps } from "../time-grid";

export type WeekViewProps = Omit<TimeGridProps, "days"> & {
  /** Any day of the week to show. */
  date: Date;
  weekStartsOn?: WeekStart;
};

/** A week: seven columns of hours. */
export function WeekView({ date, weekStartsOn = 0, ...grid }: WeekViewProps) {
  return <TimeGrid days={weekDays(date, weekStartsOn)} {...grid} />;
}
