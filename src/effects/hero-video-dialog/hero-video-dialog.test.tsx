import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./hero-video-dialog.stories";

const { Playground } = composeStories(stories);

describe("HeroVideoDialog", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the thumbnail", () => {
    render(<Playground />);
    expect(screen.getByAltText("Hero video")).toBeInTheDocument();
  });

  it("opens the video when clicked", () => {
    const { container } = render(<Playground />);
    fireEvent.click(container.querySelector("button") as HTMLElement);
    expect(document.querySelector("iframe")).not.toBeNull();
  });
});

describe("hero-video-dialog stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
