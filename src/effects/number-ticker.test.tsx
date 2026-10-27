import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./number-ticker.stories";

const { Default, CountingDown } = composeStories(stories);

describe("NumberTicker", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the counting down story", () => {
    const { container } = render(<CountingDown />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("starts from the start value", () => {
    const { container } = render(<Default />);
    expect(container).toHaveTextContent("0");
  });
});
