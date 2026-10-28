import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-number.stories";

const { Playground, Bounded, Decimals, WithoutControls, Required, Disabled } =
  composeStories(stories);

describe("FormInputNumber", () => {
  it("shows the value as a spin button", () => {
    render(<Playground />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(input).toHaveValue("1");
    expect(input).toHaveAttribute("aria-valuenow", "1");
  });

  it("increments and decrements with the buttons", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Increment" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    await user.click(screen.getByRole("button", { name: "Decrement" }));
    await user.click(screen.getByRole("button", { name: "Decrement" }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("moves with the arrow keys", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    screen.getByRole("spinbutton").focus();
    await user.keyboard("{ArrowUp}{ArrowUp}");

    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });

  it("reports a number while typing and null when emptied", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} defaultValue={undefined} />);
    const input = screen.getByRole("spinbutton");

    await user.type(input, "42");
    expect(onValueChange).toHaveBeenLastCalledWith(42);
    await user.clear(input);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("allows negative and decimal numbers while typing", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} defaultValue={undefined} />);

    await user.type(screen.getByRole("spinbutton"), "-1.5");

    expect(onValueChange).toHaveBeenLastCalledWith(-1.5);
  });

  it("ignores characters that are not part of a number", async () => {
    const user = userEvent.setup();
    render(<Playground defaultValue={undefined} />);
    const input = screen.getByRole("spinbutton");

    await user.type(input, "1a2");

    expect(input).toHaveValue("12");
  });

  it("stops at the maximum and the minimum", async () => {
    const user = userEvent.setup();
    render(<Bounded defaultValue={10} />);

    expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Decrement" }));
    expect(screen.getByRole("spinbutton")).toHaveValue("9");
  });

  it("clamps a typed value to the range on blur", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Bounded onValueChange={onValueChange} defaultValue={undefined} />);
    const input = screen.getByRole("spinbutton");

    await user.type(input, "99");
    await user.tab();

    expect(onValueChange).toHaveBeenLastCalledWith(10);
    expect(input).toHaveValue("10");
  });

  it("steps by fractions without float drift", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Decimals onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(onValueChange).toHaveBeenLastCalledWith(9.75);
  });

  it("can hide the buttons", () => {
    render(<WithoutControls />);
    expect(screen.queryByRole("button", { name: "Increment" })).toBeNull();
  });

  it("blocks a form while it is empty and required", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Enter a quantity")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("spinbutton")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled();
  });
});
