import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./label.stories";

const { Default } = composeStories(stories);

describe("Label", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("labels its control", () => {
    render(<Default />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
