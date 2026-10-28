import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-pin-input.stories";

const { Playground, FourDigits, Grouped, AlphaNumeric, Complete, Disabled } =
  composeStories(stories);

describe("FormPinInput", () => {
  it("renders one slot per digit and a labelled input", () => {
    const { container } = render(<FourDigits />);
    expect(screen.getByLabelText("PIN")).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-slot='input-otp-slot'], .relative.flex").length,
    ).toBeGreaterThanOrEqual(4);
  });

  it("limits the input to the length", () => {
    render(<FourDigits />);
    expect(screen.getByLabelText("PIN")).toHaveAttribute("maxlength", "4");
  });

  it("keeps the typed digits and reports them", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<FourDigits onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("PIN"), "123");

    expect(onValueChange).toHaveBeenLastCalledWith("123");
  });

  it("calls onComplete when every slot is filled", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<FourDigits onComplete={onComplete} />);

    await user.type(screen.getByLabelText("PIN"), "4321");

    expect(onComplete).toHaveBeenCalledWith("4321");
  });

  it("rejects letters when the pin is numeric", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<FourDigits onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("PIN"), "ab");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("accepts letters when the type is text", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<AlphaNumeric onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("Invite code"), "ab1");

    expect(onValueChange).toHaveBeenLastCalledWith("ab1");
  });

  it("splits the slots into groups with a separator", () => {
    render(<Grouped />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("blocks a form until the code is complete", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Complete />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.type(screen.getByLabelText("Verification code"), "12");
    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Enter all 4 digits")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the description", () => {
    render(<Playground />);
    expect(screen.getByText("Sent by email.")).toBeInTheDocument();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByLabelText("Code")).toBeDisabled();
  });
});
