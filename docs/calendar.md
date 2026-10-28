# Calendar

> **Status: first version implemented and tested in jsdom (2026-10-28).** `@danielsoaresf/lost-ui/calendar`, in `src/components/calendar/`. No optional peers. Based on the calendar of kortex (`kortex-app/app/components/appointments/`, Vue). Related: [structure.md](structure.md), [editor.md](editor.md).

`EventCalendar` is a calendar like Google Calendar: month, week and day views, previous / today / next, events of several calendars that can be shown or hidden, a click on an empty time to create an event. It draws what it is given; the app keeps the events, expands recurring ones and decides what a click does.

| Piece                              | What it does                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `EventCalendar`                    | the whole screen: the bar, the views, the list of calendars, creation, `onRangeChange`                                                     |
| `MonthView`, `WeekView`, `DayView` | the three views on their own (`WeekView` and `DayView` are a `TimeGrid` of 7 days and of 1 day)                                            |
| `TimeGrid`                         | columns over hours: all-day row, events side by side when they overlap, the red line of now, zoom, snap                                    |
| `CalendarDateNav`                  | previous, next, today, the title of the period and the switch between views                                                                |
| `CalendarList`                     | the calendars with a colour and a checkbox to show or hide each                                                                            |
| `CalendarEventChip`                | one event as a button: a `chip` for the month and the all-day row, a `block` for the time grid                                             |
| `calendar-model`                   | types, date helpers (`startOfWeek`, `monthGrid`, `addMonths`…), `layoutTimedEvents`, `toCalendarEvent`, `visibleRange`, `formatWeekTitle`… |

## Use it with any object

Events are **your own objects**. Say which fields hold what with `accessors` (a field name or a function); fields with the usual names (`id`, `title`, `start`, `end`, `allDay`, `calendarId`, `color`, `location`) need nothing. Handlers get **your object back**, not a copy.

```tsx
import { EventCalendar } from "@danielsoaresf/lost-ui/calendar";

type Booking = { code: string; guest: string; from: string; to: string; vip: boolean };

<EventCalendar<Booking>
  events={bookings}
  accessors={{
    id: "code",
    title: (b) => b.guest,
    start: "from",
    end: "to",
    color: (b) => (b.vip ? "var(--warning)" : "var(--info)"),
  }}
  onEventClick={(booking) => openBooking(booking.code)}
  onCreate={({ start, end, allDay }) => openForm({ start, end, allDay })}
  onRangeChange={({ start, end }) => load(start, end)}
  locale="pt-BR"
/>;
```

Dates can be `Date`s or ISO strings. `calendars` (`{ id, name, color?, visible? }`) gives a colour to the events that name a `calendarId` and, with `onCalendarToggle`, adds the list at the side; the app keeps `visible`.

## Props that make it fit

| Prop                                             | Use                                                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `view` / `defaultView` / `onViewChange`, `views` | which view is on, and which ones the switch offers (one view hides the switch)                                                        |
| `date` / `defaultDate` / `onDateChange`          | the day shown                                                                                                                         |
| `onRangeChange`                                  | the days on screen (`{ view, start, end }`, `end` is the day after the last), at the start and at each change: load only those events |
| `weekStartsOn`                                   | `0` to `6`                                                                                                                            |
| `locale`                                         | the `Intl` locale for dates and times, e.g. `"pt-BR"`, `"en-GB"`; defaults to the language of the library                             |
| `hourHeight`, `scrollToHour`                     | zoom of the week and day views, and where they open                                                                                   |
| `snap`, `defaultDuration`                        | minutes a click snaps to, and how long a new event is (15 and 60)                                                                     |
| `renderEvent`                                    | draws an event your way; gets your object and its colour                                                                              |
| `actions`                                        | your buttons beside "New event"                                                                                                       |
| `now`                                            | the moment taken as now (tests, demos); without it the clock is used and the red line moves                                           |

## Not done yet

kortex has more: the app expands recurring events (RRULE) and the library does not; there is no time zone per event (dates show in the time zone of the browser); no drag to move or resize an event; no pinch zoom; no popovers, slide-over or forms (`EventPopover`, `QuickCreatePopover`, `EventDetailSlideover`, `EventCreateModal`: use `Modal`, `Slideover` and the forms of the library from `onEventClick` and `onCreate`); no public booking flow or scheduling links; no mini month picker; no week numbers. Checked in jsdom only; the layout, the scroll and the red line were not looked at in a real browser.
