import { composeStories } from "@storybook/react-vite";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./day-view.stories";

const { Playground, AllDayEvent, NoEvents } = composeStories(stories);

describe("DayView", () => {
  it("is one column with the weekday and the date", () => {
    render(<Playground />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(1);
    expect(screen.getByRole("columnheader")).toHaveTextContent("Wed");
    expect(screen.getByRole("columnheader")).toHaveTextContent("28");
    expect(screen.getAllByRole("gridcell")).toHaveLength(1);
  });

  it("shows the events of that day, side by side when they overlap", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Design review/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lunch with Ana/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Photo shoot/ })).toBeNull();
  });

  it("shows a day-long event in the all-day row", () => {
    const { container } = render(<AllDayEvent />);
    const row = container.querySelector("[data-slot='time-grid-all-day']") as HTMLElement;
    expect(within(row).getByRole("button", { name: "Launch day" })).toBeInTheDocument();
  });

  it("has the hours and the line of now, even with no events", () => {
    const { container } = render(<NoEvents />);
    expect(screen.getByText("9 AM")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='time-grid-event']")).toBeNull();
    expect(container.querySelector("[data-slot='time-grid-now']")).toBeNull();
  });
});
