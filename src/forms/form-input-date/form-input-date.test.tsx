import { composeStories } from "@storybook/react-vite";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-date.stories";

const { Playground, Preselected, Bounded, Range, Required, Disabled } = composeStories(stories);

describe("FormInputDate", () => {
  it("shows the placeholder until a date is chosen", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Pick a date/ })).toBeInTheDocument();
  });

  it("shows the date in the locale format", () => {
    render(<Preselected />);
    expect(screen.getByRole("button", { name: /Jan 15, 2026/ })).toBeInTheDocument();
  });

  it("opens a calendar on the month of the value", async () => {
    const user = userEvent.setup();
    render(<Preselected />);

    await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));

    expect(await screen.findByRole("grid")).toBeInTheDocument();
    expect(screen.getByText(/January 2026/)).toBeInTheDocument();
  });

  it("picks a day, reports a Date and closes the calendar", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));
    const grid = await screen.findByRole("grid");
    await user.click(within(grid).getByRole("button", { name: /January 20th, 2026/ }));

    const picked = onValueChange.mock.calls.at(-1)?.[0] as Date;
    expect(picked).toBeInstanceOf(Date);
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 0, 20]);
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("disables the days outside the allowed range", async () => {
    const user = userEvent.setup();
    render(<Bounded />);

    await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));
    const grid = await screen.findByRole("grid");

    expect(within(grid).getByRole("button", { name: /January 5th, 2026/ })).toBeDisabled();
    expect(within(grid).getByRole("button", { name: /January 25th, 2026/ })).toBeDisabled();
    expect(within(grid).getByRole("button", { name: /January 12th, 2026/ })).toBeEnabled();
  });

  it("clears the date with the clear button", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Clear date" }));

    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole("button", { name: /Pick a date/ })).toBeInTheDocument();
  });

  it("shows a range as two dates", () => {
    render(<Range />);
    expect(screen.getByRole("button", { name: /Jan 10, 2026 – Jan 14, 2026/ })).toBeInTheDocument();
  });

  it("blocks a form until a date is chosen", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Choose a date")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("cannot be opened when disabled", () => {
    render(<Disabled />);
    expect(screen.getByRole("button", { name: /Jan 15, 2026/ })).toBeDisabled();
  });
});
