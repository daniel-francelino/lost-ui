import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./number-ticker.stories";

const { Playground, CountingDown } = composeStories(stories);

describe("NumberTicker", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the counting down story", () => {
    const { container } = render(<CountingDown />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("starts from the start value", () => {
    const { container } = render(<Playground />);
    expect(container).toHaveTextContent("0");
  });
});

describe("number-ticker stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
