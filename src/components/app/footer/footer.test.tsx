import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./footer.stories";

const { Playground, WithTopAndBottom, NotContained, OnlyLeft } = composeStories(stories);

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);

describe("Footer", () => {
  it("is the contentinfo landmark", () => {
    render(<Playground />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("puts the left, the middle and the right content in their places", () => {
    render(<Playground />);
    expect(slot("footer-left")).toHaveTextContent("© 2026 lost-ui");
    expect(slot("footer-center")).toHaveTextContent("DocsBlog");
    expect(slot("footer-right")?.querySelectorAll("button")).toHaveLength(2);
  });

  it("keeps the rows inside a container", () => {
    render(<Playground />);
    expect(slot("footer-main")).toHaveAttribute("data-slot", "footer-main");
    expect(slot("footer-main")).toHaveClass("mx-auto");
  });

  it("can leave the container out", () => {
    render(<NotContained />);
    expect(slot("footer-main")).not.toHaveClass("mx-auto");
  });

  it("shows a row above and a row below the main one", () => {
    render(<WithTopAndBottom />);
    expect(slot("footer-top")?.querySelector("nav")).not.toBeNull();
    expect(slot("footer-bottom")).toHaveTextContent("Made with care.");
  });

  it("draws no top or bottom row without content", () => {
    render(<Playground />);
    expect(slot("footer-top")).toBeNull();
    expect(slot("footer-bottom")).toBeNull();
  });

  it("draws no main row when it is empty", () => {
    render(<Playground left={undefined} right={undefined} children={undefined} />);
    expect(slot("footer-main")).toBeNull();
  });

  it("keeps working with only a left side", () => {
    render(<OnlyLeft />);
    expect(slot("footer-left")).toHaveTextContent("© 2026 lost-ui");
  });

  it("can be another element and keeps a class from the app", () => {
    render(<Playground as="div" className="bg-muted" />);
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(slot("footer")).toHaveClass("bg-muted");
  });
});
