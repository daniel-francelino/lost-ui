import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { MotionConfig } from "motion/react";
import { describe, expect, it } from "vitest";

import * as stories from "./chat-shimmer.stories";

const { Playground, SlowAndWide, Large } = composeStories(stories);

describe("ChatShimmer", () => {
  it("shows the text with a light that sweeps across it", () => {
    render(<Playground />);
    const text = screen.getByText("Thinking…");
    expect(text).toHaveAttribute("data-slot", "chat-shimmer");
    expect(text).toHaveClass("text-transparent", "bg-clip-text");
    expect(text.style.backgroundImage).toContain("linear-gradient");
  });

  it("makes the highlight as wide as the text times the spread", () => {
    render(<SlowAndWide />);
    // "Searching the web" has 17 characters, spread 4
    expect(screen.getByText("Searching the web").style.backgroundImage).toContain("68px");
  });

  it("takes extra classes", () => {
    render(<Large />);
    expect(screen.getByText("Thinking…")).toHaveClass("text-2xl");
  });

  it("is plain muted text when the user asks for reduced motion", () => {
    render(
      <MotionConfig reducedMotion="always">
        <Playground />
      </MotionConfig>,
    );
    const text = screen.getByText("Thinking…");
    expect(text).toHaveClass("text-muted-foreground");
    expect(text).not.toHaveClass("text-transparent");
  });
});
