import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-subscribe-button.stories";

const { Playground } = composeStories(stories);

describe("AnimatedSubscribeButton", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the idle label first", () => {
    render(<Playground />);
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });
});
