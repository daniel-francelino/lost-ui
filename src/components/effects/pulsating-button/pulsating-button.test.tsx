import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./pulsating-button.stories";

const { Playground, Ripple } = composeStories(stories);

describe("PulsatingButton", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the ripple story", () => {
    const { container } = render(<Ripple />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("uses the namespaced pulse animation", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector(".animate-lost-pulse")).not.toBeNull();
  });

  it("uses the namespaced ripple animation", () => {
    const { container } = render(<Ripple />);
    expect(container.querySelector(".animate-lost-pulse-ripple")).not.toBeNull();
  });
});

describe("pulsating-button stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
