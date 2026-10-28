import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./radio-group.stories";

const { Default } = composeStories(stories);

describe("RadioGroup", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("selects the clicked option", async () => {
    render(<Default />);
    expect(screen.getByRole("radio", { name: "comfortable" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "compact" }));
    expect(screen.getByRole("radio", { name: "compact" })).toBeChecked();
  });
});
