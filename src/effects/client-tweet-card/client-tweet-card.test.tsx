import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./client-tweet-card.stories";

const { Playground } = composeStories(stories);

describe("ClientTweetCard", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows a skeleton while the tweet loads", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});
