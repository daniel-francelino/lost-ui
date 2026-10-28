import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./chat-palette.stories";

const { Playground, WithoutPrompt, InAModal } = composeStories(stories);

describe("ChatPalette", () => {
  it("fills its box, with the conversation above and the prompt pinned below", () => {
    const { container } = render(<Playground />);
    const palette = container.querySelector("[data-slot='chat-palette']");
    expect(palette).toHaveClass("h-full", "flex-col");
    expect(container.querySelector("[data-slot='chat-palette-content']")).toContainElement(
      screen.getByRole("log"),
    );
    expect(container.querySelector("[data-slot='chat-palette-prompt']")).toContainElement(
      screen.getByRole("textbox"),
    );
    expect(container.querySelector("[data-slot='chat-palette-prompt']")).toHaveClass("shrink-0");
  });

  it("leaves the prompt area out when there is no prompt", () => {
    const { container } = render(<WithoutPrompt />);
    expect(container.querySelector("[data-slot='chat-palette-prompt']")).toBeNull();
  });

  it("works inside a modal", () => {
    render(<InAModal />);
    expect(screen.getByRole("dialog")).toContainElement(screen.getByRole("textbox"));
    expect(screen.getByText(/bakery reel/)).toBeInTheDocument();
  });
});
