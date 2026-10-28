import { composeStories } from "@storybook/react-vite";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./footer-columns.stories";

const { Playground, WithLeftAndRight, HeadingLevel, CustomSlots } = composeStories(stories);

describe("FooterColumns", () => {
  it("is a labelled navigation", () => {
    render(<Playground />);
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
  });

  it("shows a heading and a list of links per column", () => {
    render(<Playground />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Resources",
      "Company",
      "Community",
    ]);
    expect(screen.getAllByRole("list")).toHaveLength(3);
  });

  it("uses the heading level it is given", () => {
    render(<HeadingLevel />);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
  });

  it("links to the address of each item", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
  });

  it("opens an external link in a new tab and marks it", () => {
    render(<Playground />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.querySelectorAll("svg")).toHaveLength(2);
  });

  it("blocks a disabled link", () => {
    render(<Playground />);
    expect(screen.getByText("Archived")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("Archived")).not.toHaveAttribute("href");
  });

  it("runs the click of a link", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Playground columns={[{ label: "Help", children: [{ label: "Chat", onClick }] }]} />);

    await user.click(screen.getByRole("button", { name: "Chat" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows content before and after the columns", () => {
    render(<WithLeftAndRight />);
    const nav = screen.getByRole("navigation");
    expect(within(nav).getByText("lost-ui")).toBeInTheDocument();
    expect(within(nav).getByLabelText("Subscribe to our newsletter")).toBeInTheDocument();
  });

  it("shows no slots without content", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector('[data-slot="footer-columns-left"]')).toBeNull();
    expect(container.querySelector('[data-slot="footer-columns-right"]')).toBeNull();
  });

  it("lets the app draw the labels and the links", () => {
    render(<CustomSlots />);
    expect(screen.getByText("Resources")).toHaveClass("uppercase");
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Documentation").tagName).toBe("SPAN");
  });
});
