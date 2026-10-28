import { startOfDay } from "../calendar-model/dates";
import { TimeGrid, type TimeGridProps } from "../time-grid";

export type DayViewProps = Omit<TimeGridProps, "days"> & {
  date: Date;
};

/** One day: a column of hours. */
export function DayView({ date, ...grid }: DayViewProps) {
  return <TimeGrid days={[startOfDay(date)]} {...grid} />;
}
