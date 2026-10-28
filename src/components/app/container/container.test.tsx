import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./container.stories";

const { Playground, NarrowerByVariable, AsSection } = composeStories(stories);

describe("Container", () => {
  it("centres its content and limits the width", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).toHaveClass(
      "mx-auto",
      "w-full",
      "max-w-[var(--container-width,80rem)]",
    );
  });

  it("pads the sides more on larger screens", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).toHaveClass("px-4", "sm:px-6", "lg:px-8");
  });

  it("renders its children", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  it("takes the width from a CSS variable", () => {
    const { container } = render(<NarrowerByVariable />);
    expect(
      (container.firstElementChild as HTMLElement).style.getPropertyValue("--container-width"),
    ).toBe("40rem");
  });

  it("can be another element", () => {
    render(<AsSection />);
    expect(screen.getByRole("region", { name: "Content" }).tagName).toBe("SECTION");
  });

  it("keeps a class from the app", () => {
    const { container } = render(<Playground className="py-8" />);
    expect(container.firstElementChild).toHaveClass("py-8", "mx-auto");
  });
});
