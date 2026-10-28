import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { optionId } from "./form-option-list";
import * as stories from "./form-option-list.stories";

const { Playground, WithActiveOption, Multiple, Empty } = composeStories(stories);

describe("FormOptionList", () => {
  it("renders a listbox with an option per item", () => {
    render(<Playground />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByText("First letter")).toBeInTheDocument();
  });

  it("marks the selected options", () => {
    render(<Playground />);
    expect(screen.getByRole("option", { name: /Alpha/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: /Beta/ })).toHaveAttribute("aria-selected", "false");
  });

  it("gives every option a stable id", () => {
    render(<Playground />);
    expect(screen.getAllByRole("option")[1]).toHaveAttribute("id", optionId("options", 1));
  });

  it("highlights the active option", () => {
    render(<WithActiveOption />);
    expect(screen.getByRole("option", { name: /Beta/ })).toHaveAttribute("data-active");
    expect(screen.getByRole("option", { name: /Alpha/ })).not.toHaveAttribute("data-active");
  });

  it("calls onSelect with the clicked item", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Playground onSelect={onSelect} />);

    await user.click(screen.getByRole("option", { name: /Beta/ }));

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "b" }));
  });

  it("does not call onSelect for a disabled option", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Playground onSelect={onSelect} />);

    await user.click(screen.getByRole("option", { name: /Gamma/ }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("reports the hovered option", async () => {
    const onActiveChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onActiveChange={onActiveChange} />);

    await user.hover(screen.getByRole("option", { name: /Beta/ }));

    expect(onActiveChange).toHaveBeenCalledWith(1);
  });

  it("announces multiple selection", () => {
    render(<Multiple />);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("shows the empty text without items", () => {
    render(<Empty />);
    expect(screen.getByRole("status")).toHaveTextContent("Nothing found");
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
