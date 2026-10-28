import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./app-topbar.stories";

const { Playground, WithoutTrigger, WithContent } = composeStories(stories);

describe("AppTopbar", () => {
  it("is the banner of the page", () => {
    render(<Playground />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("shows the breadcrumbs, links for the ones before the last", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Catalogue" })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/admin/products",
    );
    expect(screen.getByText("Mug")).toHaveAttribute("aria-current", "page");
  });

  it("has a button for the sidebar, which can be taken out", () => {
    const { unmount } = render(<Playground />);
    expect(screen.getByRole("button", { name: "Open or close the sidebar" })).toBeInTheDocument();
    unmount();
    render(<WithoutTrigger />);
    expect(screen.queryByRole("button", { name: "Open or close the sidebar" })).toBeNull();
  });

  it("shows the actions and the content", () => {
    render(<WithContent />);
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("Draft saved")).toBeInTheDocument();
  });

  it("works without breadcrumbs", () => {
    render(<Playground breadcrumbs={undefined} />);
    expect(screen.queryByRole("navigation", { name: "breadcrumb" })).toBeNull();
  });
});
