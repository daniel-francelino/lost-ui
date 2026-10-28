import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./form-field.stories";

const { Playground, Required, WithError, Horizontal, Disabled, Sizes } = composeStories(stories);

describe("FormField", () => {
  it("labels the control through the label's htmlFor", () => {
    render(<Playground />);
    expect(screen.getByLabelText("Username")).toHaveAttribute("id", "demo");
  });

  it("shows the description, the hint and the help text", () => {
    render(<Playground />);
    expect(screen.getByText("Shown to everyone.")).toHaveAttribute("id", "demo-description");
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByText("Use letters and digits.")).toHaveAttribute("id", "demo-help");
  });

  it("adds a hidden-from-assistive-tech asterisk when required", () => {
    render(<Required />);
    const asterisk = screen.getByText("*");
    expect(asterisk).toHaveAttribute("aria-hidden", "true");
  });

  it("replaces the help text with the error message", () => {
    render(<WithError />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("That username is taken");
    expect(alert).toHaveAttribute("id", "demo-error");
    expect(screen.queryByText("Use letters and digits.")).toBeNull();
  });

  it("marks the field as invalid", () => {
    const { container } = render(<WithError />);
    expect(container.querySelector("[data-slot='form-field']")).toHaveAttribute("data-invalid");
  });

  it("does not show an error message while valid", () => {
    render(<Playground />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("lays the control beside the label when horizontal", () => {
    const { container } = render(<Horizontal />);
    expect(container.querySelector("[data-slot='form-field']")).toHaveClass(
      "grid-cols-[minmax(0,1fr)_auto]",
    );
  });

  it("dims a disabled field", () => {
    const { container } = render(<Disabled />);
    const field = container.querySelector("[data-slot='form-field']");
    expect(field).toHaveAttribute("data-disabled");
    expect(field).toHaveClass("opacity-60");
  });

  it("scales the text with the size", () => {
    const { container } = render(<Sizes />);
    const fields = container.querySelectorAll("[data-slot='form-field']");
    expect(fields[0]).toHaveClass("text-xs");
    expect(fields[2]).toHaveClass("text-base");
  });
});
