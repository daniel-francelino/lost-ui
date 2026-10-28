import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./avatar-group.stories";

const { Playground, Max, Sizes } = composeStories(stories);

describe("AvatarGroup", () => {
  it("is a labelled group of every avatar", () => {
    render(<Playground />);
    const group = screen.getByRole("group", { name: "Team members" });
    expect(group.querySelectorAll("span.rounded-full").length).toBeGreaterThanOrEqual(5);
    for (const initials of ["AL", "GH", "AT", "JC", "LT"]) {
      expect(screen.getByText(initials)).toBeInTheDocument();
    }
  });

  it("keeps the order, with the first avatar on top", () => {
    render(<Playground />);
    const group = screen.getByRole("group");
    expect(group).toHaveClass("flex-row-reverse");
    // later in the DOM, so painted over: the last avatar is first in the list, the first is last
    const order = [...group.querySelectorAll("span.relative")].map((node) => node.textContent);
    expect(order).toEqual(["LT", "JC", "AT", "GH", "AL"]);
  });

  it("shows a count for the avatars over max", () => {
    render(<Max />);
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("AT")).toBeInTheDocument();
    expect(screen.queryByText("JC")).toBeNull();
  });

  it("shows no count when everything fits", () => {
    render(<Playground max={10} />);
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it("shows only the count when max is zero", () => {
    render(<Playground max={0} />);
    expect(screen.getByText("+5")).toBeInTheDocument();
    expect(screen.queryByText("AL")).toBeNull();
  });

  it("applies each size to the avatars", () => {
    render(<Sizes />);
    const groups = screen.getAllByRole("group");
    expect(groups[0]).toHaveClass("[&>*]:size-6!");
    expect(groups[2]).toHaveClass("[&>*]:size-10!");
    expect(groups[4]).toHaveClass("[&>*]:size-14!");
  });

  it("separates the avatars with a ring", () => {
    render(<Playground />);
    expect(screen.getByRole("group")).toHaveClass("[&>*]:ring-2", "[&>*]:ring-background");
  });
});
