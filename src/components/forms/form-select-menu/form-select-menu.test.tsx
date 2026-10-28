import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-select-menu.stories";

const { Playground, Preselected, Multiple, Required, Disabled } = composeStories(stories);

describe("FormSelectMenu", () => {
  it("shows the placeholder until something is chosen", () => {
    render(<Playground />);
    expect(screen.getByRole("combobox", { name: /Language/ })).toHaveTextContent(
      "Select a language",
    );
  });

  it("shows the label of the default value", () => {
    render(<Preselected />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Rust");
  });

  it("opens a searchable list of options", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByRole("searchbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("filters the options while searching", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("combobox"));
    await user.type(await screen.findByRole("searchbox"), "script");

    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.queryByRole("option", { name: /Rust/ })).toBeNull();
  });

  it("chooses an option and closes in single mode", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: /Rust/ }));

    expect(onValueChange).toHaveBeenLastCalledWith("rs");
    expect(screen.getByRole("combobox")).toHaveTextContent("Rust");
    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("keeps the list open and toggles options in multiple mode", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Multiple onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: /Rust/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["ts", "rs"]);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: /TypeScript/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["rs"]);
  });

  it("summarises many selections by count", () => {
    render(<Multiple defaultValue={["ts", "js", "rs"]} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("3 selected");
  });

  it("selects with the keyboard from the search box", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await screen.findByRole("searchbox");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith("js");
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

    expect(await screen.findByText("Choose a language")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
