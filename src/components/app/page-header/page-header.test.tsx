import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./page-header.stories";

const { Playground, WithActions, WithLeading } = composeStories(stories);

describe("PageHeader", () => {
  it("shows the title as the main heading and the description", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 1, name: "Products" })).toBeInTheDocument();
    expect(screen.getByText("Everything in the catalogue.")).toBeInTheDocument();
  });

  it("shows the actions", () => {
    render(<WithActions />);
    expect(screen.getByRole("button", { name: "New product" })).toBeInTheDocument();
  });

  it("uses the heading level it is given and shows what leads", () => {
    render(<WithLeading />);
    expect(screen.getByRole("heading", { level: 2, name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Back" })).toBeInTheDocument();
  });

  it("has no actions area without actions", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("[data-slot='page-header'] > div")).toHaveLength(1);
  });
});
