import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./theme.stories";

const { Playground, Colours, Radius, Dark, Nested, AsSection } = composeStories(stories);

const block = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-slot="theme"]')!;

describe("Theme", () => {
  it("renders its children without a box of its own", () => {
    const { container } = render(<Playground />);
    expect(block(container)).toHaveClass("contents");
    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
  });

  it("sets a variable for each token", () => {
    const { container } = render(<Colours />);
    expect(block(container).style.getPropertyValue("--primary")).toBe("oklch(0.55 0.25 295)");
    expect(block(container).style.getPropertyValue("--primary-foreground")).toBe("white");
  });

  it("uses a name that already starts with two dashes as it is", () => {
    const { container } = render(<Playground tokens={{ "--container-width": "40rem" }} />);
    expect(block(container).style.getPropertyValue("--container-width")).toBe("40rem");
  });

  it("sets the radius", () => {
    const { container } = render(<Radius />);
    expect(block(container).style.getPropertyValue("--radius")).toBe("1.5rem");
  });

  it("sets nothing without tokens or a radius", () => {
    const { container } = render(<Playground />);
    expect(block(container).getAttribute("style")).toBeFalsy();
  });

  it("uses the dark values with dark", () => {
    const { container } = render(<Dark />);
    expect(block(container)).toHaveClass("dark");
  });

  it("is not dark by default", () => {
    const { container } = render(<Playground />);
    expect(block(container)).not.toHaveClass("dark");
  });

  it("nests, each block with its own tokens", () => {
    const { container } = render(<Nested />);
    const blocks = container.querySelectorAll<HTMLElement>('[data-slot="theme"]');
    expect(blocks).toHaveLength(2);
    expect(blocks[0]?.style.getPropertyValue("--primary")).toBe("oklch(0.6 0.2 150)");
    expect(blocks[1]?.style.getPropertyValue("--primary")).toBe("oklch(0.6 0.25 25)");
    expect(blocks[1]?.style.getPropertyValue("--radius")).toBe("0");
  });

  it("can be another element and keeps a class from the app", () => {
    const { container } = render(<AsSection />);
    expect(block(container).tagName).toBe("SECTION");
    expect(block(container)).toHaveClass("block");
  });
});
