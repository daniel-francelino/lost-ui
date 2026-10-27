import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./button.stories";

const { Default, Destructive, Outline, Secondary, Ghost, Link, Rainbow, Small } =
  composeStories(stories);

describe("Button", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the destructive story", () => {
    const { container } = render(<Destructive />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the outline story", () => {
    const { container } = render(<Outline />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the secondary story", () => {
    const { container } = render(<Secondary />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the ghost story", () => {
    const { container } = render(<Ghost />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the link story", () => {
    const { container } = render(<Link />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the rainbow story", () => {
    const { container } = render(<Rainbow />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the small story", () => {
    const { container } = render(<Small />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<Default onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Button" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire when disabled", () => {
    const onClick = vi.fn();
    render(<Default disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the variant styles", () => {
    render(<Destructive />);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });

  it("renders its child element with asChild", () => {
    render(
      <Default asChild>
        <a href="/docs">Docs</a>
      </Default>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("data-slot", "button");
  });
});
