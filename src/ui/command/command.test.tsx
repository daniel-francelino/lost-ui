import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./command.stories";

const { Default } = composeStories(stories);

describe("Command", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("lists the commands", () => {
    render(<Default />);
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type a command or search...")).toBeInTheDocument();
  });

  it("filters while typing", async () => {
    render(<Default />);
    await userEvent.type(screen.getByPlaceholderText("Type a command or search..."), "calc");
    expect(screen.getByText("Calculator")).toBeInTheDocument();
    expect(screen.queryByText("Calendar")).toBeNull();
  });
});
