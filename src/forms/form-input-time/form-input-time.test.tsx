import { composeStories } from "@storybook/react-vite";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-time.stories";

const { Playground, WithSeconds, BusinessHours, Required, Disabled } = composeStories(stories);

describe("FormInputTime", () => {
  it("renders a labelled time input with its value", () => {
    render(<Playground />);
    const input = screen.getByLabelText("Meeting time");
    expect(input).toHaveAttribute("type", "time");
    expect(input).toHaveValue("09:30");
  });

  it("steps by a minute by default and by a second with seconds", () => {
    const { unmount } = render(<Playground />);
    expect(screen.getByLabelText("Meeting time")).toHaveAttribute("step", "60");
    unmount();
    render(<WithSeconds />);
    expect(screen.getByLabelText("Timestamp")).toHaveAttribute("step", "1");
  });

  it("reports the new time as text", () => {
    const onValueChange = vi.fn();
    render(<Playground onValueChange={onValueChange} />);

    fireEvent.change(screen.getByLabelText("Meeting time"), { target: { value: "14:45" } });

    expect(onValueChange).toHaveBeenLastCalledWith("14:45");
  });

  it("passes the min and max to the input", () => {
    render(<BusinessHours />);
    const input = screen.getByLabelText("Pick up");
    expect(input).toHaveAttribute("min", "09:00");
    expect(input).toHaveAttribute("max", "18:00");
  });

  it("validates against its rules", async () => {
    render(<BusinessHours />);

    fireEvent.change(screen.getByLabelText("Pick up"), { target: { value: "22:00" } });

    expect(await screen.findByText("Between 09:00 and 18:00")).toBeInTheDocument();
  });

  it("blocks a form without a time", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Choose a time")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByLabelText("Time")).toBeDisabled();
  });
});
