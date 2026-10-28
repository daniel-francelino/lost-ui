import { composeStories } from "@storybook/react-vite";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { events, now } from "../calendar.fixtures";
import { EventCalendar } from "./event-calendar";
import * as stories from "./event-calendar.stories";

const {
  Playground,
  Week,
  Day,
  WithCalendarList,
  ToggleCalendars,
  ReadOnly,
  OwnObjects,
  PortugueseDatesAndHalfHours,
  OnlyWeekAndDay,
} = composeStories(stories);

describe("EventCalendar", () => {
  it("opens on the month of the date, with the bar over it", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { name: "October 2026" })).toBeInTheDocument();
    expect(screen.getByRole("grid", { name: "Month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute("aria-pressed", "true");
  });

  it("can open on the week or on the day", () => {
    const { unmount } = render(<Week />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
    unmount();
    render(<Day />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(1);
  });

  it("switches the view and tells the app", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    render(<Playground onViewChange={onViewChange} />);
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(onViewChange).toHaveBeenCalledWith("week");
    expect(screen.queryByRole("grid", { name: "Month" })).toBeNull();
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
  });

  it("steps through the months and tells the app the new date", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();
    render(<Playground onDateChange={onDateChange} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "November 2026" })).toBeInTheDocument();
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 10, 28, 10, 30));
  });

  it("goes to the day when a date is clicked in the month", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: /Go to Oct 29, 2026/ }));
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading")).toHaveTextContent("Thursday, October 29, 2026");
    expect(screen.getByRole("button", { name: "Launch day" })).toBeInTheDocument();
  });

  it("can be controlled", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    const { rerender } = render(
      <EventCalendar
        events={events}
        view="week"
        date={now}
        now={now}
        onViewChange={onViewChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Month" }));
    expect(onViewChange).toHaveBeenCalledWith("month");
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
    rerender(
      <EventCalendar
        events={events}
        view="month"
        date={now}
        now={now}
        onViewChange={onViewChange}
      />,
    );
    expect(screen.getByRole("grid", { name: "Month" })).toBeInTheDocument();
  });

  it("hides the events of a calendar that is turned off", () => {
    render(
      <EventCalendar
        events={events}
        calendars={[
          { id: "work", name: "Work", visible: false },
          { id: "personal", name: "Personal" },
          { id: "campaign", name: "Campaigns" },
        ]}
        defaultDate={now}
        now={now}
        defaultView="week"
      />,
    );
    expect(screen.queryByRole("button", { name: /Design review/ })).toBeNull();
    expect(screen.getByRole("button", { name: /Lunch with Ana/ })).toBeInTheDocument();
  });

  it("keeps events with no calendar", () => {
    render(
      <EventCalendar
        events={[
          {
            id: "x",
            title: "Loose",
            start: new Date(2026, 9, 28, 9),
            end: new Date(2026, 9, 28, 10),
          },
        ]}
        calendars={[{ id: "work", name: "Work", visible: false }]}
        defaultDate={now}
        now={now}
      />,
    );
    expect(screen.getByRole("button", { name: /Loose/ })).toBeInTheDocument();
  });

  it("shows the list of calendars when the app can toggle them, and calls it", async () => {
    const user = userEvent.setup();
    const onCalendarToggle = vi.fn();
    render(<WithCalendarList onCalendarToggle={onCalendarToggle} />);
    await user.click(screen.getByRole("checkbox", { name: "Show Work" }));
    expect(onCalendarToggle).toHaveBeenCalledWith("work");
  });

  it("does not show the list without a handler", () => {
    render(<Playground />);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("hides and shows the events as the app toggles a calendar", async () => {
    const user = userEvent.setup();
    render(<ToggleCalendars defaultView="week" />);
    expect(screen.getByRole("button", { name: /Design review/ })).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Show Work" }));
    expect(screen.queryByRole("button", { name: /Design review/ })).toBeNull();
    await user.click(screen.getByRole("checkbox", { name: "Show Work" }));
    expect(screen.getByRole("button", { name: /Design review/ })).toBeInTheDocument();
  });

  it("has a New event button that proposes an hour on the day shown", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Playground onCreate={onCreate} />);
    await user.click(screen.getByRole("button", { name: "New event" }));
    const [range] = onCreate.mock.lastCall as [{ start: Date; end: Date; allDay: boolean }];
    expect(range.allDay).toBe(false);
    expect(range.start.toDateString()).toBe(now.toDateString());
    expect(range.end.getTime() - range.start.getTime()).toBe(3_600_000);
  });

  it("has no New event button when it cannot create", () => {
    render(<ReadOnly />);
    expect(screen.queryByRole("button", { name: "New event" })).toBeNull();
  });

  it("creates a whole-day event when a day of the month is clicked", () => {
    const onCreate = vi.fn();
    render(<Playground onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("gridcell", { name: /Oct 15, 2026/ }));
    expect(onCreate).toHaveBeenCalledWith({
      start: new Date(2026, 9, 15),
      end: new Date(2026, 9, 15),
      allDay: true,
    });
  });

  it("creates an hour when a time of the week is clicked", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Week onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("gridcell", { name: /Oct 27, 2026/ }), { clientY: 480 });
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ start: new Date(2026, 9, 27, 10, 0), allDay: false }),
    );
    await user.click(screen.getByRole("button", { name: "Month" }));
  });

  it("calls onEventClick with the event", async () => {
    const user = userEvent.setup();
    const onEventClick = vi.fn();
    render(<Playground onEventClick={onEventClick} />);
    await user.click(screen.getByRole("button", { name: /Gym/ }));
    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "gym" }),
      expect.anything(),
    );
  });

  it("is a labelled region that fills its parent", () => {
    const { container } = render(<Playground />);
    const calendar = container.querySelector("[data-slot='event-calendar']");
    expect(calendar).toHaveAttribute("aria-label", "Calendar");
    expect(calendar).toHaveClass("h-full");
    expect(within(calendar as HTMLElement).getByRole("grid")).toBeInTheDocument();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <EventCalendar events={[]} defaultDate={now} now={now} onCreate={() => {}} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("outubro de 2026");
    expect(screen.getByRole("button", { name: "Novo evento" })).toBeInTheDocument();
  });
});

describe("EventCalendar with your own objects", () => {
  type Task = { key: string; what: string; begins: Date; ends: Date; urgent: boolean };
  const tasks: Task[] = [
    {
      key: "t1",
      what: "Write report",
      begins: new Date(2026, 9, 28, 9),
      ends: new Date(2026, 9, 28, 10),
      urgent: true,
    },
    {
      key: "t2",
      what: "Send invoice",
      begins: new Date(2026, 9, 29, 14),
      ends: new Date(2026, 9, 29, 15),
      urgent: false,
    },
  ];
  const accessors = {
    id: "key",
    title: "what",
    start: "begins",
    end: "ends",
    color: (task: Task) => (task.urgent ? "var(--destructive)" : "var(--info)"),
  } as const;

  it("reads the fields it is told to, by name or by function", () => {
    render(
      <EventCalendar
        events={tasks}
        accessors={accessors}
        defaultDate={now}
        now={now}
        defaultView="week"
      />,
    );
    const urgent = screen.getByRole("button", { name: /Write report/ });
    expect(urgent.style.getPropertyValue("--event-color")).toBe("var(--destructive)");
    expect(
      screen.getByRole("button", { name: /Send invoice/ }).style.getPropertyValue("--event-color"),
    ).toBe("var(--info)");
  });

  it("gives your own object back, not a copy", async () => {
    const user = userEvent.setup();
    const onEventClick = vi.fn();
    render(
      <EventCalendar
        events={tasks}
        accessors={accessors}
        defaultDate={now}
        now={now}
        defaultView="week"
        onEventClick={onEventClick}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Send invoice/ }));
    expect(onEventClick.mock.calls[0]![0]).toBe(tasks[1]);
  });

  it("lets you draw an event from your object", () => {
    render(
      <EventCalendar
        events={tasks}
        accessors={accessors}
        defaultDate={now}
        now={now}
        renderEvent={(task) => <span>Task {task.key}</span>}
      />,
    );
    expect(screen.getByText("Task t1")).toBeInTheDocument();
  });

  it("reads ISO strings as dates", () => {
    render(<OwnObjects />);
    expect(screen.getByRole("button", { name: /Ana Lima · A1/ })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ana Lima · A1/ }).style.getPropertyValue("--event-color"),
    ).toBe("var(--warning)");
  });

  it("tells the app the days on screen at the start and each time they change", async () => {
    const user = userEvent.setup();
    const onRangeChange = vi.fn();
    render(<Playground onRangeChange={onRangeChange} />);
    expect(onRangeChange).toHaveBeenCalledTimes(1);
    expect(onRangeChange).toHaveBeenLastCalledWith({
      view: "month",
      start: new Date(2026, 8, 27),
      end: new Date(2026, 10, 8),
    });
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(onRangeChange).toHaveBeenLastCalledWith({
      view: "week",
      start: new Date(2026, 9, 25),
      end: new Date(2026, 10, 1),
    });
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onRangeChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ start: new Date(2026, 10, 1), end: new Date(2026, 10, 8) }),
    );
    expect(onRangeChange).toHaveBeenCalledTimes(3);
  });

  it("does not repeat the range when nothing changed", async () => {
    const onRangeChange = vi.fn();
    const { rerender } = render(<Playground onRangeChange={onRangeChange} />);
    rerender(<Playground onRangeChange={onRangeChange} events={[]} />);
    expect(onRangeChange).toHaveBeenCalledTimes(1);
  });

  it("writes dates in the locale it is given, whatever the language", () => {
    render(<PortugueseDatesAndHalfHours />);
    expect(screen.getByRole("heading").textContent).toMatch(/25\s*[–-]\s*31 de out/);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent(/dom/i);
  });

  it("snaps to the step and makes the event as long as it is told to", () => {
    const onCreate = vi.fn();
    render(<PortugueseDatesAndHalfHours onCreate={onCreate} />);
    // 600 px at 48 px per hour is 12:30; 613 px is 12:46 and snaps to 13:00 with a 30 minute step
    fireEvent.click(screen.getByRole("gridcell", { name: /27 de out/ }), { clientY: 613 });
    expect(onCreate).toHaveBeenCalledWith({
      start: new Date(2026, 9, 27, 13, 0),
      end: new Date(2026, 9, 27, 13, 30),
      allDay: false,
    });
  });

  it("shows only the views it is told to", () => {
    render(<OnlyWeekAndDay />);
    expect(screen.queryByRole("button", { name: "Month" })).toBeNull();
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Day" })).toBeInTheDocument();
  });

  it("puts your own actions beside the New event button", () => {
    render(
      <EventCalendar
        events={[]}
        defaultDate={now}
        now={now}
        onCreate={() => {}}
        actions={<button>Export</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New event" })).toBeInTheDocument();
  });
});
