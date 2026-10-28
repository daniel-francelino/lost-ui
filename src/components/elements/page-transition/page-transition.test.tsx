import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PageTransition } from "./page-transition";
import * as stories from "./page-transition.stories";

const { Playground, Fade, Slide } = composeStories(stories);

describe("PageTransition", () => {
  it("shows the content with no animation on the first render", () => {
    render(<Playground />);
    expect(screen.getByText("Page 1")).toBeVisible();
  });

  it("swaps the content when the key changes", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByText("Page 2")).toBeInTheDocument();
    await screen.findByText("Page 2");
    expect(screen.queryByText("Page 1")).toBeNull();
  });

  it("works for the other variants", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Fade />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Page 2")).toBeInTheDocument();
    unmount();

    render(<Slide />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Page 2")).toBeInTheDocument();
  });

  it("keeps the same content while the key stays", () => {
    const { rerender } = render(
      <PageTransition transitionKey="a">
        <p>Same</p>
      </PageTransition>,
    );
    rerender(
      <PageTransition transitionKey="a">
        <p>Same</p>
      </PageTransition>,
    );
    expect(screen.getAllByText("Same")).toHaveLength(1);
  });

  it("passes the class to the wrapper", () => {
    const { container } = render(
      <PageTransition transitionKey="a" className="rounded-md">
        <p>Body</p>
      </PageTransition>,
    );
    expect(container.querySelector("[data-slot='page-transition']")).toHaveClass("rounded-md");
  });
});
