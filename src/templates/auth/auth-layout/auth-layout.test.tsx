import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./auth-layout.stories";

const { Playground, Split, Minimal, SingleCard, WithLegal, SplitCard, SplitCardWithoutImage } =
  composeStories(stories);

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

  it("puts the form and the image side by side in a card in the split-card variant", () => {
    const { container } = render(<SplitCard />);
    const layout = container.querySelector("[data-variant='split-card']");
    expect(layout).not.toBeNull();
    expect(layout?.querySelector("[class*='md:grid-cols-2']")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("The form goes here.")).toBeInTheDocument();
    expect(screen.getByRole("complementary", { hidden: true })).toBeInTheDocument();
  });

  it("centres the title and puts the footer under the card", () => {
    render(<SplitCard />);
    expect(screen.getByRole("heading", { name: "Sign in" }).parentElement).toHaveClass(
      "text-center",
    );
    expect(screen.getByRole("link", { name: "Create an account" })).toBeInTheDocument();
  });

  it("is a single narrow column in the split-card variant without an image", () => {
    const { container } = render(<SplitCardWithoutImage />);
    expect(screen.queryByRole("complementary", { hidden: true })).toBeNull();
    expect(container.querySelector("[class*='md:grid-cols-2']")).toBeNull();
    expect(container.querySelector(".max-w-sm")).not.toBeNull();
  });

  it("is the split-card variant by default, with the footer inside the card", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-variant='split-card']")).not.toBeNull();
    expect(
      screen.getByRole("link", { name: "Create an account" }).closest(".overflow-hidden"),
    ).not.toBeNull();
  });

  it("puts the footer under the card in the card variant", () => {
    const { container } = render(<SingleCard />);
    expect(container.querySelector("[data-variant='card']")).not.toBeNull();
    expect(
      screen.getByRole("link", { name: "Create an account" }).closest(".overflow-hidden"),
    ).toBeNull();
  });

  it("puts the small print under the card", () => {
    render(<WithLegal />);
    const terms = screen.getByRole("link", { name: "Terms of Service" });
    expect(terms).toBeInTheDocument();
    expect(terms.closest(".overflow-hidden")).toBeNull();
  });
});
