import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./form-fieldset.stories";

const { Playground, Section, Boxed, HiddenLegend, Compact, Disabled } = composeStories(stories);

describe("FormFieldset", () => {
  it("groups its fields under a legend", () => {
    render(<Playground />);
    const group = screen.getByRole("group", { name: "Contact" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group).toContainElement(screen.getByLabelText("Name"));
    expect(group).toContainElement(screen.getByLabelText("Email"));
  });

  it("describes the group with the description", () => {
    render(<Playground />);
    expect(screen.getByRole("group")).toHaveAccessibleDescription("How we reach you.");
  });

  it("has no description relation when there is none", () => {
    render(<Boxed />);
    expect(screen.getByRole("group")).not.toHaveAttribute("aria-describedby");
  });

  it("applies the variant", () => {
    const { rerender } = render(<Boxed />);
    expect(screen.getByRole("group")).toHaveAttribute("data-variant", "boxed");
    expect(screen.getByRole("group")).toHaveClass("border");

    rerender(<Section />);
    expect(screen.getByRole("group")).toHaveAttribute("data-variant", "section");
    expect(screen.getByRole("group")).not.toHaveClass("border");
  });

  it("shows the icon beside the legend", () => {
    const { container } = render(<Section />);
    expect(container.querySelector("legend svg")).not.toBeNull();
  });

  it("keeps a hidden legend available to screen readers", () => {
    render(<HiddenLegend />);
    expect(screen.getByRole("group", { name: "Contact" })).toBeInTheDocument();
    expect(screen.getByText("Contact")).toHaveClass("sr-only");
  });

  it("changes the spacing between fields", () => {
    const { container, rerender } = render(<Playground />);
    expect(container.querySelector("fieldset > div")).toHaveClass("gap-4");

    rerender(<Compact />);
    expect(container.querySelector("fieldset > div")).toHaveClass("gap-2");
  });

  it("disables every control inside", () => {
    render(<Disabled />);
    expect(screen.getByRole("group")).toBeDisabled();
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });
});
