import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./hero-video-dialog.stories";

const { Default } = composeStories(stories);

describe("HeroVideoDialog", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the thumbnail", () => {
    render(<Default />);
    expect(screen.getByAltText("Hero video")).toBeInTheDocument();
  });

  it("opens the video when clicked", () => {
    const { container } = render(<Default />);
    fireEvent.click(container.querySelector("button") as HTMLElement);
    expect(document.querySelector("iframe")).not.toBeNull();
  });
});
