import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./accordion.stories";

const { Default } = composeStories(stories);

describe("Accordion", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("opens an item when its trigger is clicked", async () => {
    render(<Default />);
    expect(screen.queryByText(/WAI-ARIA/)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Is it accessible?" }));
    expect(screen.getByText(/WAI-ARIA/)).toBeVisible();
  });
});
