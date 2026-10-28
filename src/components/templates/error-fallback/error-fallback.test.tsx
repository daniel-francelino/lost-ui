import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./error-fallback.stories";

const { Playground, CustomText, RetryOnly, NoActions } = composeStories(stories);

describe("ErrorFallback", () => {
  it("is an alert with the default texts", () => {
    render(<Playground />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByText("The page did not open")).toBeInTheDocument();
    expect(screen.getByText(/could not be loaded/i)).toBeInTheDocument();
  });

  it("calls onRetry from Try again", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<Playground onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("links back to home", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/admin");
  });

  it("takes the texts and the detail it is given", () => {
    render(<CustomText />);
    expect(screen.getByRole("heading", { name: "The report did not load" })).toBeInTheDocument();
    expect(screen.getByText("Report failed")).toBeInTheDocument();
    expect(screen.getByText("Error id: 4f3a")).toBeInTheDocument();
  });

  it("leaves out the buttons it has no use for", () => {
    const { unmount } = render(<RetryOnly />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    unmount();
    render(<NoActions />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
