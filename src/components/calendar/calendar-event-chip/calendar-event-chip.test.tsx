import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { CalendarEventChip } from "./calendar-event-chip";
import * as stories from "./calendar-event-chip.stories";

const { Playground, WithTime, Block, AllDay, Coloured, WithoutTitle } = composeStories(stories);

describe("CalendarEventChip", () => {
  it("is a button with the title, and the time and place in its tooltip", () => {
    render(<Playground />);
    const chip = screen.getByRole("button", { name: "Design review" });
    expect(chip).toHaveAttribute("data-variant", "chip");
    expect(chip.title).toContain("Design review");
    expect(chip.title).toContain("Room 2");
    expect(chip.title).toMatch(/10:00\s?AM/);
  });

  it("writes the time before the title when asked", () => {
    render(<WithTime />);
    expect(screen.getByText(/10:00\s?AM/)).toBeInTheDocument();
  });

  it("shows the title, the time range and the place in a block", () => {
    render(<Block />);
    expect(screen.getByText("Design review")).toHaveClass("font-medium");
    expect(screen.getByText(/10:00\s?AM – 11:30\s?AM/)).toBeInTheDocument();
    expect(screen.getByText("Room 2")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("h-full");
  });

  it("has no time when it lasts all day", () => {
    render(<AllDay />);
    expect(screen.getByRole("button").title).toBe("Design review · Room 2");
  });

  it("takes the colour it is given", () => {
    render(<Coloured />);
    expect(screen.getByRole("button").style.getPropertyValue("--event-color")).toBe(
      "var(--success)",
    );
  });

  it("names an event with no title", () => {
    render(<WithoutTitle />);
    expect(screen.getByRole("button", { name: "(No title)" })).toBeInTheDocument();
  });

  it("calls onClick with the event, and does not let the click through to what is under it", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const outer = vi.fn();
    render(
      <div onClick={outer}>
        <Playground onClick={onClick} />
      </div>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }), expect.anything());
    expect(outer).not.toHaveBeenCalled();
  });

  it("takes children in place of its content", () => {
    render(
      <CalendarEventChip event={Playground.args.event!}>
        <b>Mine</b>
      </CalendarEventChip>,
    );
    expect(screen.getByText("Mine")).toBeInTheDocument();
  });

  it("writes the time as the language does", () => {
    render(
      <LostI18nProvider language="pt">
        <CalendarEventChip event={Playground.args.event!} variant="block" />
      </LostI18nProvider>,
    );
    expect(screen.getByText(/10:00 – 11:30/)).toBeInTheDocument();
  });
});
