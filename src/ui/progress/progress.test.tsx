import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./progress.stories";

const { Default } = composeStories(stories);

describe("Progress", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("exposes its value", () => {
    render(<Default />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
  });
});
