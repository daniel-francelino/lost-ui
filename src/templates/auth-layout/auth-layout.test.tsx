import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./auth-layout.stories";

const { Playground, Split, Minimal } = composeStories(stories);

describe("AuthLayout", () => {
  it("is the main landmark with the title as its heading", () => {
    render(<Playground />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
  });

  it("shows the logo, the description, the content and the footer", () => {
    render(<Playground />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Use your email or your username.")).toBeInTheDocument();
    expect(screen.getByText("The form goes here.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create an account" })).toBeInTheDocument();
  });

  it("adds a panel at the side in the split variant", () => {
    const { container } = render(<Split />);
    expect(container.querySelector("[data-variant='split']")).not.toBeNull();
    expect(screen.getByText(/It does what it says/)).toBeInTheDocument();
    expect(screen.getByRole("complementary", { hidden: true })).toBeInTheDocument();
  });

  it("works with only a title", () => {
    render(<Minimal />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.queryByText("Acme")).toBeNull();
  });
});
