import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { CalendarList } from "./calendar-list";
import * as stories from "./calendar-list.stories";

const { Playground, SomeHidden, WithCreate, WithoutTitle, Empty } = composeStories(stories);

describe("CalendarList", () => {
  it("lists the calendars with a checkbox each, all on by default", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { name: "Calendars" })).toBeInTheDocument();
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(3);
    for (const box of boxes) expect(box).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Show Work" })).toBeInTheDocument();
  });

  it("shows which ones are hidden", () => {
    render(<SomeHidden />);
    expect(screen.getByRole("checkbox", { name: "Show Work" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Show Personal" })).not.toBeChecked();
    expect(screen.getByText("Personal")).toHaveClass("text-muted-foreground");
  });

  it("tells the app which calendar was toggled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Playground onToggle={onToggle} />);
    await user.click(screen.getByRole("checkbox", { name: "Show Personal" }));
    expect(onToggle).toHaveBeenCalledWith("personal");
  });

  it("paints the box of a calendar with its colour", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("li span[aria-hidden]")).toHaveStyle({
      background: "var(--info)",
    });
  });

  it("adds a button to create, and can drop the heading", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const { unmount } = render(<WithCreate onCreate={onCreate} />);
    await user.click(screen.getByRole("button", { name: "New event" }));
    expect(onCreate).toHaveBeenCalledOnce();
    unmount();
    render(<WithoutTitle />);
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("says when there are no calendars", () => {
    render(<Empty />);
    expect(screen.getByText("No calendars yet")).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <CalendarList calendars={[{ id: "a", name: "Trabalho" }]} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading", { name: "Calendários" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Mostrar Trabalho" })).toBeInTheDocument();
  });
});
