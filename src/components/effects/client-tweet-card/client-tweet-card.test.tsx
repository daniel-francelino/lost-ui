import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { useTweet } from "react-tweet";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as stories from "./client-tweet-card.stories";

vi.mock("react-tweet", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-tweet")>()),
  useTweet: vi.fn(),
}));

const { Playground } = composeStories(stories);

describe("ClientTweetCard", () => {
  beforeEach(() => {
    vi.mocked(useTweet).mockReset();
  });

  it("renders the playground story", () => {
    vi.mocked(useTweet).mockReturnValue({ isLoading: true } as never);
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows a skeleton while the tweet loads", () => {
    vi.mocked(useTweet).mockReturnValue({ isLoading: true } as never);
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
    expect(container.textContent).toBe("");
  });

  it("shows the not found card when the tweet cannot be loaded", () => {
    vi.mocked(useTweet).mockReturnValue({
      isLoading: false,
      error: new Error("not found"),
    } as never);
    render(<Playground />);
    expect(screen.getByText("Tweet not found")).toBeInTheDocument();
  });
});
