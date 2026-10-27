import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./tabs.stories";

const { Default } = composeStories(stories);

describe("Tabs", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the content of the selected tab", async () => {
    render(<Default />);
    expect(screen.getByText("Manage your account.")).toBeVisible();
    await userEvent.click(screen.getByRole("tab", { name: "Password" }));
    expect(screen.getByText("Change your password.")).toBeVisible();
  });
});
