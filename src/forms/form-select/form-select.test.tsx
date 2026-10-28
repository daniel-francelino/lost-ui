import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-select.stories";

const { Playground, Preselected, StringItems, Required, Disabled } = composeStories(stories);

describe("FormSelect", () => {
  it("shows the placeholder until something is chosen", () => {
    render(<Playground />);
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent("Select a country");
  });

  it("shows the label of the default value", () => {
    render(<Preselected />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Portugal");
  });

  it("opens the list and chooses an option", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Brazil" }));

    expect(screen.getByRole("combobox")).toHaveTextContent("Brazil");
    expect(onValueChange).toHaveBeenLastCalledWith("br");
  });

  it("lists plain strings as options", async () => {
    const user = userEvent.setup();
    render(<StringItems />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByRole("option", { name: "Large" })).toBeInTheDocument();
  });

  it("does not offer a disabled option for selection", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByRole("option", { name: "United States" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("blocks a form until an option is chosen", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Choose a country")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
