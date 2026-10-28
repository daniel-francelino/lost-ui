import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { CalendarDateNav } from "./calendar-date-nav";
import * as stories from "./calendar-date-nav.stories";

const { Playground, Week, Day, WeekAcrossTwoMonths, WithoutViews, WithAction } =
  composeStories(stories);

describe("CalendarDateNav", () => {
  it("names the month, the week or the day", () => {
    const { unmount } = render(<Playground />);
    expect(screen.getByRole("heading", { name: "October 2026" })).toBeInTheDocument();
    unmount();
    const week = render(<Week />);
    expect(screen.getByRole("heading").textContent).toMatch(/Oct 25\s*[–-]\s*31,? 2026/);
    week.unmount();
    render(<Day />);
    expect(screen.getByRole("heading")).toHaveTextContent("Wednesday, October 28, 2026");
  });

  it("names a week that crosses two months", () => {
    render(<WeekAcrossTwoMonths />);
    expect(screen.getByRole("heading").textContent).toMatch(/Oct 26\s*[–-]\s*Nov 1,? 2026/);
  });

  it("steps a month, a week or a day", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();
    const { rerender } = render(<Playground onDateChange={onDateChange} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onDateChange).toHaveBeenLastCalledWith(new Date(2026, 10, 28));
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(onDateChange).toHaveBeenLastCalledWith(new Date(2026, 8, 28));

    rerender(<Week onDateChange={onDateChange} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onDateChange).toHaveBeenLastCalledWith(new Date(2026, 10, 4));

    rerender(<Day onDateChange={onDateChange} />);
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(onDateChange).toHaveBeenLastCalledWith(new Date(2026, 9, 27));
  });

  it("goes to today", async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();
    render(<Playground onDateChange={onDateChange} />);
    await user.click(screen.getByRole("button", { name: "Today" }));
    const [today] = onDateChange.mock.lastCall as [Date];
    expect(today.toDateString()).toBe(new Date().toDateString());
  });

  it("switches the view and says which one is on", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    render(<Week onViewChange={onViewChange} />);
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("button", { name: "Day" }));
    expect(onViewChange).toHaveBeenCalledWith("day");
  });

  it("has no switch without a handler", () => {
    render(<WithoutViews />);
    expect(screen.queryByRole("group", { name: "View" })).toBeNull();
  });

  it("shows the actions at the end", () => {
    render(<WithAction />);
    expect(screen.getByRole("button", { name: "New event" })).toBeInTheDocument();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <CalendarDateNav
          date={new Date(2026, 9, 28)}
          view="month"
          onDateChange={() => {}}
          onViewChange={() => {}}
        />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("outubro de 2026");
    expect(screen.getByRole("button", { name: "Hoje" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mês" })).toBeInTheDocument();
  });
});
