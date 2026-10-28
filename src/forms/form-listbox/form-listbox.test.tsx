import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-listbox.stories";

const { Playground, Preselected, Multiple, Required, Empty, Disabled } = composeStories(stories);

describe("FormListbox", () => {
  it("renders a labelled listbox with one option per item", () => {
    render(<Playground />);
    expect(screen.getByRole("listbox", { name: "Framework" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByText("Library")).toBeInTheDocument();
  });

  it("selects an option on click and reports it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("option", { name: /Vue/ }));

    expect(onValueChange).toHaveBeenLastCalledWith("vue");
    expect(screen.getByRole("option", { name: /Vue/ })).toHaveAttribute("aria-selected", "true");
  });

  it("replaces the selection in single mode", async () => {
    const user = userEvent.setup();
    render(<Preselected />);

    await user.click(screen.getByRole("option", { name: /Svelte/ }));

    expect(screen.getByRole("option", { name: /Svelte/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: /Vue/ })).toHaveAttribute("aria-selected", "false");
  });

  it("toggles options in multiple mode", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Multiple onValueChange={onValueChange} />);

    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    await user.click(screen.getByRole("option", { name: /Vue/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "svelte", "vue"]);
    await user.click(screen.getByRole("option", { name: /React/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["svelte", "vue"]);
  });

  it("does not select a disabled option", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("option", { name: /Solid/ }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("navigates with the arrow keys and selects with Enter", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("listbox"));
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith("vue");
  });

  it("skips disabled options when moving with the keyboard", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("listbox"));
    await user.keyboard("{End}{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith("svelte");
  });

  it("exposes the active option to assistive technology", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    const list = screen.getByRole("listbox");

    await user.click(list);
    await user.keyboard("{ArrowDown}");

    expect(list.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0]?.getAttribute("id"),
    );
  });

  it("blocks a form until something is selected", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Choose a framework")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the empty text without items", () => {
    render(<Empty />);
    expect(screen.getByText("Nothing to show")).toBeInTheDocument();
  });

  it("cannot be changed when disabled", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Disabled onValueChange={onValueChange} />);

    await user.click(screen.getByRole("option", { name: /Vue/ }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
