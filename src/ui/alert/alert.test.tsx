import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./alert.stories";

const { Default, Destructive } = composeStories(stories);

describe("Alert", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the destructive story", () => {
    const { container } = render(<Destructive />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("exposes the alert role with its text", () => {
    render(<Default />);
    expect(screen.getByRole("alert")).toHaveTextContent("Heads up!");
  });
});
