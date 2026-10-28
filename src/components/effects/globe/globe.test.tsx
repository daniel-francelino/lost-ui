import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import createGlobe from "cobe";
import * as stories from "./globe.stories";

vi.mock("cobe", () => ({ default: vi.fn(() => ({ destroy: vi.fn(), update: vi.fn() })) }));

const { Playground } = composeStories(stories);

describe("Globe", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("creates the globe on a canvas", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("canvas")).not.toBeNull();
    expect(createGlobe).toHaveBeenCalled();
  });
});

describe("globe stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
