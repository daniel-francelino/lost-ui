import { composeStories } from "@storybook/react-vite";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { MonthView } from "./month-view";
import * as stories from "./month-view.stories";

const { Playground, BusyDay, MondayFirst, Empty, CustomEvents } = composeStories(stories);

const cell = (label: RegExp) => screen.getByRole("gridcell", { name: label });

describe("MonthView", () => {
  it("is a grid of six weeks with the names of the weekdays", () => {
    render(<Playground />);
    expect(screen.getByRole("grid", { name: "Month" })).toBeInTheDocument();
    expect(screen.getAllByRole("gridcell")).toHaveLength(42);
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual([
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]);
  });

  it("can start the week on Monday", () => {
    render(<MondayFirst />);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Mon");
  });

  it("starts the grid on the week of the first day, with the days of other months dimmed", () => {
    render(<Playground />);
    const cells = screen.getAllByRole("gridcell");
    expect(cells[0]).toHaveAttribute("aria-label", "Sep 27, 2026");
    expect(cells[0]).toHaveAttribute("data-outside");
    expect(cell(/Oct 10, 2026/)).not.toHaveAttribute("data-outside");
    expect(cells[41]).toHaveAttribute("aria-label", "Nov 7, 2026");
  });

  it("marks today", () => {
    render(<Playground />);
    expect(cell(/Oct 28, 2026/)).toHaveAttribute("data-today");
    expect(cell(/Oct 29, 2026/)).not.toHaveAttribute("data-today");
    expect(within(cell(/Oct 28, 2026/)).getByRole("button", { name: /Go to/ })).toHaveClass(
      "bg-primary",
    );
  });

  it("shows the events of each day, with the time before a timed one", () => {
    render(<Playground />);
    const wednesday = within(cell(/Oct 28, 2026/));
    expect(wednesday.getByRole("button", { name: /Design review/ })).toBeInTheDocument();
    expect(wednesday.getByText(/10:00\s?AM/)).toBeInTheDocument();
    expect(
      within(cell(/Oct 29, 2026/)).getByRole("button", { name: "Launch day" }),
    ).toBeInTheDocument();
  });

  it("shows a day-long event on every day it covers", () => {
    render(
      <MonthView
        date={new Date(2026, 9, 28)}
        events={[
          {
            id: "t",
            title: "Trip",
            start: new Date(2026, 9, 20),
            end: new Date(2026, 9, 22),
            allDay: true,
          },
        ]}
      />,
    );
    for (const day of [20, 21, 22]) {
      expect(within(cell(new RegExp(`Oct ${day}, 2026`))).getByText("Trip")).toBeInTheDocument();
    }
    expect(within(cell(/Oct 23, 2026/)).queryByText("Trip")).toBeNull();
  });

  it("limits the events of a day and says how many are left", async () => {
    const user = userEvent.setup();
    const onDayClick = vi.fn();
    render(<BusyDay onDayClick={onDayClick} />);
    const day = within(cell(/Oct 28, 2026/));
    expect(day.getAllByRole("button", { name: /^(?!Go to)/ }).length).toBeLessThanOrEqual(4);
    await user.click(day.getByRole("button", { name: "3 more" }));
    expect(onDayClick).toHaveBeenCalledWith(new Date(2026, 9, 28));
  });

  it("goes to a day when its number is clicked, without creating an event", async () => {
    const user = userEvent.setup();
    const onDayClick = vi.fn();
    const onCreate = vi.fn();
    render(<Playground onDayClick={onDayClick} onCreate={onCreate} />);
    await user.click(within(cell(/Oct 10, 2026/)).getByRole("button", { name: /Go to/ }));
    expect(onDayClick).toHaveBeenCalledWith(new Date(2026, 9, 10));
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("creates a whole-day event when an empty part of a day is clicked", () => {
    const onCreate = vi.fn();
    render(<Playground onCreate={onCreate} />);
    fireEvent.click(cell(/Oct 15, 2026/));
    expect(onCreate).toHaveBeenCalledWith({
      start: new Date(2026, 9, 15),
      end: new Date(2026, 9, 15),
      allDay: true,
    });
  });

  it("calls onEventClick with the event and does not create", async () => {
    const user = userEvent.setup();
    const onEventClick = vi.fn();
    const onCreate = vi.fn();
    render(<Playground onEventClick={onEventClick} onCreate={onCreate} />);
    await user.click(screen.getByRole("button", { name: /Gym/ }));
    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "gym" }),
      expect.anything(),
    );
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("paints each event with the colour of its calendar", () => {
    render(<Playground />);
    expect(
      screen.getByRole("button", { name: /Gym/ }).style.getPropertyValue("--event-color"),
    ).toBe("var(--success)");
  });

  it("lets the app draw the events", () => {
    render(<CustomEvents />);
    expect(screen.getAllByText(/● /).length).toBeGreaterThan(0);
  });

  it("is empty with no events", () => {
    render(<Empty />);
    expect(screen.queryByRole("button", { name: /Design review/ })).toBeNull();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <MonthView date={new Date(2026, 9, 28)} events={[]} now={new Date(2026, 9, 28)} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("grid", { name: "Mês" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent(/dom/i);
  });
});
