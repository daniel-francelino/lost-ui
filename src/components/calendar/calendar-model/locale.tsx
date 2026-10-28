import { createContext, useContext } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { calendarLocale } from "./format";

const CalendarLocaleContext = createContext<string | null>(null);

/** Sets the `Intl` locale the calendars below it write dates and times in, e.g. `"pt-BR"`, `"en-GB"`. Without it the language of the library decides. */
export const CalendarLocaleProvider = CalendarLocaleContext.Provider;

/** The locale to write dates in: the one a `CalendarLocaleProvider` sets, or the one of the language of the library. */
export function useCalendarLocale(): string {
  const set = useContext(CalendarLocaleContext);
  const { language } = useLostTranslation();
  return set ?? calendarLocale(language);
}
