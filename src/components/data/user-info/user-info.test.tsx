import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./user-info.stories";

const {
  Playground,
  NameOnly,
  WithImage,
  WithIcon,
  WithChip,
  Sizes,
  Vertical,
  AsLink,
  AsButton,
  CustomSlots,
} = composeStories(stories);

describe("UserInfo", () => {
  it("shows the name and the description", () => {
    render(<Playground />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Software engineer")).toBeInTheDocument();
  });

  it("shows the initials of the name while there is no image", () => {
    render(<Playground />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("takes at most two initials", () => {
    render(<Playground name="Ada Augusta King Lovelace" />);
    expect(screen.getByText("AA")).toBeInTheDocument();
  });

  it("shows no description when there is none", () => {
    const { container } = render(<NameOnly />);
    expect(container.querySelector('[data-slot="user-info-description"]')).toBeNull();
  });

  it("falls back to the initials until the image loads", () => {
    render(<WithImage />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("uses a given fallback instead of the initials", () => {
    render(<Playground avatar={{ fallback: "??" }} />);
    expect(screen.getByText("??")).toBeInTheDocument();
    expect(screen.queryByText("AL")).toBeNull();
  });

  it("shows an icon when there is no name to take initials from", () => {
    const { container } = render(<WithIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("shows a chip on the avatar and says what it means", () => {
    const { container } = render(<WithChip />);
    const chip = container.querySelector('[data-slot="user-info-chip"]');
    expect(chip).toHaveClass("bg-success", "bottom-right-0".replace("-right-0", "-0"));
    expect(chip).toHaveClass("bottom-0", "right-0");
    expect(screen.getByText("Online")).toHaveClass("sr-only");
  });

  it("shows no chip by default and a default chip with true", () => {
    const { container, rerender } = render(<Playground />);
    expect(container.querySelector('[data-slot="user-info-chip"]')).toBeNull();

    rerender(<Playground chip />);
    expect(container.querySelector('[data-slot="user-info-chip"]')).toHaveClass(
      "bg-primary",
      "top-0",
      "right-0",
    );
  });

  it("applies each size to the avatar and the name", () => {
    const { container } = render(<Sizes />);
    const users = container.querySelectorAll('[data-slot="user-info"]');
    expect(users[0]?.querySelector("[data-slot='avatar'], span.size-6")).not.toBeNull();
    expect(users[0]?.querySelector('[data-slot="user-info-name"]')).toHaveClass("text-xs");
    expect(users[4]?.querySelector('[data-slot="user-info-name"]')).toHaveClass("text-lg");
  });

  it("stacks the content when vertical", () => {
    const { container } = render(<Vertical />);
    expect(container.querySelector('[data-slot="user-info"]')).toHaveClass("flex-col");
  });

  it("is a link with href and opens safely in a new tab", () => {
    render(<AsLink />);
    const link = screen.getByRole("link", { name: /Ada Lovelace/ });
    expect(link).toHaveAttribute("href", "https://github.com/ada");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lets the app set the rel of a link", () => {
    render(<AsLink rel="author" />);
    expect(screen.getByRole("link")).toHaveAttribute("rel", "author");
  });

  it("is a button with onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<AsButton onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is plain text without a link or a click", () => {
    render(<Playground />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("lets the app draw the avatar, the name and the description", () => {
    render(<CustomSlots renderAvatar={() => <i>avatar</i>} />);
    expect(screen.getByText("avatar").tagName).toBe("I");
    expect(screen.getByText("Dr. Ada").tagName).toBe("STRONG");
    expect(screen.getByText("on call").tagName).toBe("EM");
  });

  it("renders nothing visible for an empty user", () => {
    const { container } = render(<Playground name={undefined} description={undefined} />);
    expect(container.querySelector('[data-slot="user-info"]')).toBeEmptyDOMElement();
  });
});
