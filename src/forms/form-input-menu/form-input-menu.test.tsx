import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-menu.stories";

const { Playground, Preselected, Creatable, Required, Disabled } = composeStories(stories);

describe("FormInputMenu", () => {
  it("renders a labelled combobox that starts closed", () => {
    render(<Playground />);
    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("shows the label of the selected item", () => {
    render(<Preselected />);
    expect(screen.getByRole("combobox")).toHaveValue("Porto");
  });

  it("opens the menu when the user types and filters the items", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.type(screen.getByRole("combobox"), "po");

    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Porto/ })).toBeInTheDocument();
  });

  it("matches without regard to case", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.type(screen.getByRole("combobox"), "LISB");

    expect(screen.getByRole("option", { name: /Lisbon/ })).toBeInTheDocument();
  });

  it("selects an option on click and closes the menu", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByRole("combobox"), "lis");
    await user.click(screen.getByRole("option", { name: /Lisbon/ }));

    expect(onValueChange).toHaveBeenLastCalledWith("lisbon");
    expect(screen.getByRole("combobox")).toHaveValue("Lisbon");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("selects with the keyboard", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith("porto");
  });

  it("closes without selecting on Escape", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByRole("combobox"), "po");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("shows an empty message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.type(screen.getByRole("combobox"), "zzz");

    expect(screen.getByRole("status")).toHaveTextContent("No results");
  });

  it("keeps the typed text as the value when creatable", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Creatable onValueChange={onValueChange} />);

    await user.type(screen.getByRole("combobox"), "Faro{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith("Faro");
  });

  it("blocks a form until an item is chosen", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Choose a city")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
