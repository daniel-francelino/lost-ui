import { composeStories } from "@storybook/react-vite";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-date.stories";

const { Playground, Preselected, Bounded, Range, WithTime, Required, Disabled } =
  composeStories(stories);

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

  describe("with time", () => {
    it("shows the time next to the date", () => {
      render(<WithTime />);
      expect(screen.getByRole("button", { name: /Jan 15, 2026.*2:30/ })).toBeInTheDocument();
    });

    it("opens a time field holding the time of the value", async () => {
      const user = userEvent.setup();
      render(<WithTime />);

      await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));

      expect(await screen.findByLabelText("Time")).toHaveValue("14:30");
    });

    it("keeps the calendar open and the time when another day is picked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<WithTime onValueChange={onValueChange} />);

      await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));
      const grid = await screen.findByRole("grid");
      await user.click(within(grid).getByRole("button", { name: /January 20th, 2026/ }));

      const picked = onValueChange.mock.calls.at(-1)?.[0] as Date;
      expect([picked.getDate(), picked.getHours(), picked.getMinutes()]).toEqual([20, 14, 30]);
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("changes the time and keeps the day", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<WithTime onValueChange={onValueChange} />);

      await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));
      const time = await screen.findByLabelText("Time");
      await user.clear(time);
      await user.type(time, "0915");

      const picked = onValueChange.mock.calls.at(-1)?.[0] as Date;
      expect([picked.getDate(), picked.getHours(), picked.getMinutes()]).toEqual([15, 9, 15]);
    });

    it("starts at midnight when no time was chosen yet", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<WithTime defaultValue={null} onValueChange={onValueChange} />);

      await user.click(screen.getByRole("button", { name: /Pick a date/ }));
      expect(await screen.findByLabelText("Time")).toBeDisabled();
      const grid = screen.getByRole("grid");
      await user.click(within(grid).getAllByRole("button", { name: /\d(st|nd|rd|th),/ })[10]!);

      const picked = onValueChange.mock.calls.at(-1)?.[0] as Date;
      expect([picked.getHours(), picked.getMinutes()]).toEqual([0, 0]);
      expect(screen.getByLabelText("Time")).toHaveValue("00:00");
    });

    it("closes with the Done button", async () => {
      const user = userEvent.setup();
      render(<WithTime />);

      await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));
      await user.click(await screen.findByRole("button", { name: "Done" }));

      expect(screen.queryByRole("grid")).toBeNull();
    });

    it("submits the date and time under the field name", () => {
      const { container } = render(<WithTime name="meeting" />);
      expect(container.querySelector('input[type="hidden"][name="meeting"]')).toHaveValue(
        "2026-01-15T14:30",
      );
    });

    it("does not show a time field without the prop", async () => {
      const user = userEvent.setup();
      render(<Preselected />);

      await user.click(screen.getByRole("button", { name: /Jan 15, 2026/ }));
      await screen.findByRole("grid");

      expect(screen.queryByLabelText("Time")).toBeNull();
    });
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
