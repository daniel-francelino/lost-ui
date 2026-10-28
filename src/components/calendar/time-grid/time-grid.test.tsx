import { composeStories } from "@storybook/react-vite";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as weekStories from "../week-view/week-view.stories";

const { Playground, MondayFirst, Zoomed } = composeStories(weekStories);

const column = (label: RegExp) => screen.getByRole("gridcell", { name: label });
const eventBox = (_container: HTMLElement, title: string) =>
  screen
    .getByRole("button", { name: new RegExp(title) })
    .closest<HTMLElement>("[data-slot='time-grid-event']")!;

describe("TimeGrid", () => {
  it("has a column for each day, with the weekday and the date in the header", () => {
    render(<Playground />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent("Sun");
    expect(headers[0]).toHaveTextContent("25");
    expect(screen.getAllByRole("gridcell")).toHaveLength(7);
  });

  it("starts the week on Monday when told to", () => {
    render(<MondayFirst />);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Mon");
  });

  it("marks today in the header", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Go to Oct 28, 2026/ })).toHaveAttribute(
      "data-today",
    );
    expect(screen.getByRole("button", { name: /Go to Oct 27, 2026/ })).not.toHaveAttribute(
      "data-today",
    );
  });

  it("writes the hours down the side", () => {
    render(<Playground />);
    expect(screen.getByText("9 AM")).toBeInTheDocument();
    expect(screen.getByText("12 PM")).toBeInTheDocument();
  });

  it("puts an event where its time is, in pixels per hour", () => {
    const { container } = render(<Playground />);
    const gym = eventBox(container, "Gym");
    // 18:00 at 48 px per hour, one hour long
    expect(gym.style.top).toBe("864px");
    expect(gym.style.height).toBe("48px");
    expect(gym.style.width).toBe("100%");
  });

  it("follows the zoom", () => {
    const { container } = render(<Zoomed />);
    expect(eventBox(container, "Gym").style.top).toBe("1440px");
    expect(eventBox(container, "Gym").style.height).toBe("80px");
  });

  it("puts events that overlap side by side", () => {
    const { container } = render(<Playground />);
    const review = eventBox(container, "Design review");
    const lunch = eventBox(container, "Lunch with Ana");
    expect(review.style.width).toBe("50%");
    expect(review.style.left).toBe("0%");
    expect(lunch.style.width).toBe("50%");
    expect(lunch.style.left).toBe("50%");
  });

  it("draws the line of now in today only, where the time is", () => {
    const { container } = render(<Playground />);
    const lines = container.querySelectorAll<HTMLElement>("[data-slot='time-grid-now']");
    expect(lines).toHaveLength(1);
    // 10:30 at 48 px per hour
    expect(lines[0]!.style.top).toBe("504px");
    expect(column(/Oct 28, 2026/)).toContainElement(lines[0]!);
  });

  it("shows the day-long events in their own row", () => {
    const { container } = render(<Playground />);
    const row = container.querySelector("[data-slot='time-grid-all-day']") as HTMLElement;
    expect(within(row).getByRole("button", { name: "Launch day" })).toBeInTheDocument();
    expect(within(row).getByText("All day")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot='time-grid-event']")).toHaveLength(5);
  });

  it("has no day-long row when there are no day-long events", () => {
    const { container } = render(<Playground events={[]} />);
    expect(container.querySelector("[data-slot='time-grid-all-day']")).toBeNull();
  });

  it("scrolls to the hour it is told to", () => {
    const { container } = render(<Playground scrollToHour={7} />);
    expect(
      (container.querySelector("[data-slot='time-grid-scroll']") as HTMLElement).scrollTop,
    ).toBe(336);
  });

  it("creates an hour at the time that was clicked, snapped to 15 minutes", () => {
    const onCreate = vi.fn();
    render(<Playground onCreate={onCreate} />);
    // 600 px at 48 px per hour is 12:30
    fireEvent.click(column(/Oct 27, 2026/), { clientY: 600 });
    expect(onCreate).toHaveBeenCalledWith({
      start: new Date(2026, 9, 27, 12, 30),
      end: new Date(2026, 9, 27, 13, 30),
      allDay: false,
    });
    fireEvent.click(column(/Oct 27, 2026/), { clientY: 613 });
    expect(onCreate).toHaveBeenLastCalledWith(
      expect.objectContaining({ start: new Date(2026, 9, 27, 12, 45) }),
    );
  });

  it("does not create when nothing handles it", () => {
    render(<Playground onCreate={undefined} />);
    expect(() => fireEvent.click(column(/Oct 27, 2026/), { clientY: 600 })).not.toThrow();
  });

  it("opens an event without creating one", async () => {
    const user = userEvent.setup();
    const onEventClick = vi.fn();
    const onCreate = vi.fn();
    render(<Playground onEventClick={onEventClick} onCreate={onCreate} />);
    await user.click(screen.getByRole("button", { name: /Photo shoot/ }));
    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "shoot" }),
      expect.anything(),
    );
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("goes to a day when its date is clicked", async () => {
    const user = userEvent.setup();
    const onDayClick = vi.fn();
    render(<Playground onDayClick={onDayClick} />);
    await user.click(screen.getByRole("button", { name: /Go to Oct 30, 2026/ }));
    expect(onDayClick).toHaveBeenCalledWith(new Date(2026, 9, 30));
  });

  it("paints an event with the colour of its calendar", () => {
    render(<Playground />);
    expect(
      screen.getByRole("button", { name: /Photo shoot/ }).style.getPropertyValue("--event-color"),
    ).toBe("var(--info)");
  });
});
