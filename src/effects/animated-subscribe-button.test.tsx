import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-subscribe-button.stories";

const { Default } = composeStories(stories);

describe("AnimatedSubscribeButton", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the idle label first", () => {
    render(<Default />);
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });
});
