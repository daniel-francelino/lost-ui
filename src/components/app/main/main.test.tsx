import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./main.stories";

const { Playground, AsDiv } = composeStories(stories);

describe("Main", () => {
  it("is the main landmark with the page content", () => {
    render(<Playground />);
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
  });

  it("fills the screen under the header", () => {
    render(<Playground />);
    expect(screen.getByRole("main")).toHaveClass("min-h-[calc(100vh-var(--header-height,0px))]");
  });

  it("can be another element", () => {
    render(<AsDiv />);
    expect(screen.queryByRole("main")).toBeNull();
  });

  it("keeps a class from the app", () => {
    render(<Playground className="bg-muted" />);
    expect(screen.getByRole("main")).toHaveClass("bg-muted");
  });
});
