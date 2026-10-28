const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * The group a date belongs to in a list by day: `today`, `yesterday`, or the date written for
 * `language`. The key is stable, so a list can be grouped by it.
 */
export function dayLabel(
  value: Date | string | number,
  language: string,
  now: Date = new Date(),
): { key: string; kind: "today" | "yesterday" | "date"; text: string } {
  const date = new Date(value);
  const days = Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  if (days === 0) return { key, kind: "today", text: "" };
  if (days === 1) return { key, kind: "yesterday", text: "" };
  return {
    key,
    kind: "date",
    text: new Intl.DateTimeFormat(language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
  };
}
