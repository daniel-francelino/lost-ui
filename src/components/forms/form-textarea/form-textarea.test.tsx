import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./form-textarea.stories";

const { Playground, WithRules, Autoresize, Disabled, WithHelp } = composeStories(stories);

describe("FormTextarea", () => {
  it("renders a labelled textarea with a placeholder", () => {
    render(<Playground />);
    expect(screen.getByLabelText("Message")).toHaveAttribute("placeholder", "Tell us more…");
    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  it("starts with three rows by default", () => {
    render(<Playground />);
    expect(screen.getByLabelText("Message")).toHaveAttribute("rows", "3");
  });

  it("keeps what the user types and reports it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("Message"), "hello");

    expect(screen.getByLabelText("Message")).toHaveValue("hello");
    expect(onValueChange).toHaveBeenLastCalledWith("hello");
  });

  it("validates with its rules and describes the error", async () => {
    const user = userEvent.setup();
    render(<WithRules />);
    const area = screen.getByRole("textbox", { name: /Message/ });

    await user.type(area, "short");

    const message = await screen.findByText("At least 10 characters");
    expect(area).toHaveAttribute("aria-invalid", "true");
    expect(area.getAttribute("aria-describedby")).toContain(message.id);
  });

  it("is required when asked", () => {
    render(<WithRules />);
    expect(screen.getByRole("textbox", { name: /Message/ })).toBeRequired();
  });

  it("stops the user from resizing it when it grows by itself", () => {
    render(<Autoresize />);
    expect(screen.getByLabelText("Grows with the text")).toHaveClass("resize-none");
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByLabelText("Locked")).toBeDisabled();
  });

  it("shows the description and the help text", () => {
    render(<WithHelp />);
    expect(screen.getByText("Shown on your profile.")).toBeInTheDocument();
    expect(screen.getByText("Markdown is supported.")).toBeInTheDocument();
  });
});
