import { composeStories } from "@storybook/react-vite";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Link, isActivePath } from "./link";
import * as stories from "./link.stories";

const {
  Playground,
  Active,
  ActiveParent,
  Exact,
  ForcedActive,
  External,
  AsButton,
  Disabled,
  Raw,
  AsChild,
} = composeStories(stories);

afterEach(() => {
  window.history.pushState({}, "", "/");
});

describe("Link", () => {
  it("is an anchor with an href", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute(
      "href",
      "/docs/components/link",
    );
  });

  it("is inactive on another page", () => {
    render(<Playground />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("data-active");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link).toHaveClass("text-muted-foreground");
  });

  it("is active on its page and says so", () => {
    render(<Active />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("data-active");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("text-primary");
  });

  it("is active on a page below it, unless exact", () => {
    const { rerender } = render(<ActiveParent />);
    expect(screen.getByRole("link")).toHaveAttribute("data-active");

    rerender(<Exact />);
    expect(screen.getByRole("link")).not.toHaveAttribute("data-active");
  });

  it("can be forced active", () => {
    render(<ForcedActive />);
    expect(screen.getByRole("link")).toHaveAttribute("data-active");
  });

  it("reads the address of the page and follows it", () => {
    window.history.pushState({}, "", "/docs/components/link");
    render(<Link href="/docs/components/link">Here</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("data-active");

    act(() => {
      window.history.pushState({}, "", "/elsewhere");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByRole("link")).not.toHaveAttribute("data-active");
  });

  it("opens an external link safely and is never active", () => {
    render(<External />);
    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).not.toHaveAttribute("data-active");
  });

  it("is a button without an href", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<AsButton onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "Do it" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("can be another element without an href", () => {
    render(<Link as="span">Text</Link>);
    expect(screen.getByText("Text").tagName).toBe("SPAN");
  });

  it("cannot be followed when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Disabled onClick={onClick} />);

    const link = screen.getByText("Link");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("tabindex", "-1");
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables the button of a link without an href", () => {
    render(<Link disabled>Off</Link>);
    expect(screen.getByRole("button", { name: "Off" })).toBeDisabled();
  });

  it("drops the library styles when raw, and keeps the classes of the app", () => {
    render(<Raw />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveClass("inline-flex");
    expect(link).toHaveClass("text-muted-foreground", "font-bold", "text-foreground");
  });

  it("applies the inactive class off the page", () => {
    render(<Raw currentPath="/other" inactiveClassName="opacity-50" />);
    expect(screen.getByRole("link")).toHaveClass("opacity-50");
    expect(screen.getByRole("link")).not.toHaveClass("font-bold");
  });

  it("gives its look and state to the child with asChild", () => {
    render(<AsChild />);
    const link = screen.getByRole("link", { name: "Router link" });
    expect(link).toHaveAttribute("data-active");
    expect(link).toHaveClass("text-primary");
    expect(link.parentElement?.tagName).not.toBe("A");
  });
});

describe("isActivePath", () => {
  it("compares paths without the query, the hash or a trailing slash", () => {
    expect(isActivePath("/docs/?a=1#b", "/docs")).toBe(true);
    expect(isActivePath("/docs", "/docs/")).toBe(true);
  });

  it("counts a page below it unless exact", () => {
    expect(isActivePath("/docs", "/docs/a/b")).toBe(true);
    expect(isActivePath("/docs", "/docs/a/b", true)).toBe(false);
    expect(isActivePath("/docs", "/documents")).toBe(false);
  });

  it("makes the root active only on the root", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/", "/docs")).toBe(false);
  });

  it("is not active for an external address or a hash", () => {
    expect(isActivePath("https://example.com/docs", "/docs")).toBe(false);
    expect(isActivePath("//example.com", "/")).toBe(false);
    expect(isActivePath("mailto:a@b.c", "/")).toBe(false);
    expect(isActivePath("#top", "/")).toBe(false);
  });
});
