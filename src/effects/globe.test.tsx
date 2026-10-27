import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import createGlobe from "cobe";
import * as stories from "./globe.stories";

vi.mock("cobe", () => ({ default: vi.fn(() => ({ destroy: vi.fn(), update: vi.fn() })) }));

const { Default } = composeStories(stories);

describe("Globe", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("creates the globe on a canvas", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("canvas")).not.toBeNull();
    expect(createGlobe).toHaveBeenCalled();
  });
});
