import { composeStories } from "@storybook/react-vite";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./form-color-picker.stories";

const { Playground, WithSwatches, Validated, Disabled } = composeStories(stories);

describe("FormColorPicker", () => {
  it("shows the color in the picker and as text", () => {
    render(<Playground />);
    expect(screen.getByLabelText("Brand color")).toHaveValue("#3b82f6");
    expect(screen.getByLabelText("Pick a color")).toHaveValue("#3b82f6");
  });

  it("reports what the user types", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} defaultValue="" />);

    await user.type(screen.getByLabelText("Brand color"), "#abcdef");

    expect(onValueChange).toHaveBeenLastCalledWith("#abcdef");
  });

  it("reports the color chosen in the native picker", () => {
    const onValueChange = vi.fn();
    render(<Playground onValueChange={onValueChange} />);

    fireEvent.change(screen.getByLabelText("Pick a color"), { target: { value: "#00ff00" } });

    expect(onValueChange).toHaveBeenLastCalledWith("#00ff00");
  });

  it("offers swatches and marks the selected one", () => {
    render(<WithSwatches />);
    expect(screen.getAllByRole("button", { name: /^Use #/ })).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Use #22c55e" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("picks a swatch on click", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<WithSwatches onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Use #8b5cf6" }));

    expect(onValueChange).toHaveBeenLastCalledWith("#8b5cf6");
    expect(screen.getByLabelText("Accent")).toHaveValue("#8b5cf6");
  });

  it("validates the text with its rules", async () => {
    const user = userEvent.setup();
    render(<Validated />);

    await user.type(screen.getByLabelText("Hex color"), "blue");

    expect(await screen.findByText("Enter a hex color like #1a2b3c")).toBeInTheDocument();
  });

  it("falls back to black in the picker for an invalid hex", async () => {
    const user = userEvent.setup();
    render(<Validated />);

    await user.type(screen.getByLabelText("Hex color"), "nope");

    expect(screen.getByLabelText("Pick a color")).toHaveValue("#000000");
  });

  it("disables the inputs and the swatches when locked", () => {
    render(<Disabled />);
    expect(screen.getByLabelText("Color")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Use #ef4444" })).toBeDisabled();
  });
});
