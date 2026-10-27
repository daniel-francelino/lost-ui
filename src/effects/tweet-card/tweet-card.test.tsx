import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./tweet-card.stories";

const { Playground, Loading, NotFound } = composeStories(stories);

describe("TweetCard", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the loading story", () => {
    const { container } = render(<Loading />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the not found story", () => {
    const { container } = render(<NotFound />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the author and the text", () => {
    render(<Playground />);
    expect(screen.getByText("Lost UI")).toBeInTheDocument();
    expect(screen.getByText(/mostly naming things/)).toBeInTheDocument();
  });
});

describe("tweet-card stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
