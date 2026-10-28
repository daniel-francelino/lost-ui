import { startOfDay } from "../calendar-model/dates";
import { TimeGrid, type TimeGridProps } from "../time-grid";

export type DayViewProps<T = unknown> = Omit<TimeGridProps<T>, "days"> & {
  date: Date;
};

/** One day: a column of hours. */
export function DayView<T = unknown>({ date, ...grid }: DayViewProps<T>) {
  return <TimeGrid<T> days={[startOfDay(date)]} {...grid} />;
}
