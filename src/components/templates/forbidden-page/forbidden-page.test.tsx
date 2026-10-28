import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./forbidden-page.stories";

const { Playground, WithoutHomeButton, CustomText } = composeStories(stories);

describe("ForbiddenPage", () => {
  it("says the user has no access", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { name: "Forbidden" })).toBeInTheDocument();
    expect(screen.getByText("You do not have access to this page.")).toBeInTheDocument();
  });

  it("links back to home, unless there is no address", () => {
    const { unmount } = render(<Playground />);
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/admin");
    unmount();
    render(<WithoutHomeButton />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("takes custom texts", () => {
    render(<CustomText />);
    expect(screen.getByRole("heading", { name: "Admins only" })).toBeInTheDocument();
    expect(screen.getByText("Ask an admin for access to settings.")).toBeInTheDocument();
  });
});
