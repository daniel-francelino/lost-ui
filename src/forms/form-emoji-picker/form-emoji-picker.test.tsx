import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import { defaultEmojis } from "./form-emoji-picker";
import * as stories from "./form-emoji-picker.stories";

const { Playground, Preselected, CustomSet, Required, Disabled } = composeStories(stories);

describe("FormEmojiPicker", () => {
  it("shows the placeholder until an emoji is chosen", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Pick an emoji/ })).toBeInTheDocument();
  });

  it("shows the chosen emoji on the button", () => {
    render(<Preselected />);
    expect(screen.getByRole("button", { name: /Icon.*🔥/ })).toBeInTheDocument();
  });

  it("opens a grid of emojis", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: /Pick an emoji/ }));

    const group = await screen.findByRole("group", { name: "Emojis" });
    expect(group.querySelectorAll("button")).toHaveLength(defaultEmojis.length);
  });

  it("picks an emoji and closes the grid", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: /Pick an emoji/ }));
    await user.click(await screen.findByRole("button", { name: "🎉" }));

    expect(onValueChange).toHaveBeenLastCalledWith("🎉");
    expect(screen.queryByRole("group", { name: "Emojis" })).toBeNull();
    expect(screen.getByRole("button", { name: /Icon.*🎉/ })).toBeInTheDocument();
  });

  it("marks the current emoji as pressed", async () => {
    const user = userEvent.setup();
    render(<Preselected />);

    await user.click(screen.getByRole("button", { name: /Icon.*🔥/ }));

    expect(await screen.findByRole("button", { name: "🔥", pressed: true })).toBeInTheDocument();
  });

  it("only offers the emojis it was given", async () => {
    const user = userEvent.setup();
    render(<CustomSet />);

    await user.click(screen.getByRole("button", { name: /Pick an emoji/ }));

    const group = await screen.findByRole("group", { name: "Emojis" });
    expect(group.querySelectorAll("button")).toHaveLength(3);
  });

  it("clears the emoji with the clear button", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Clear emoji" }));

    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(screen.getByRole("button", { name: /Pick an emoji/ })).toBeInTheDocument();
  });

  it("submits the emoji under the field name", () => {
    const { container } = render(<Preselected name="icon" />);
    expect(container.querySelector('input[type="hidden"][name="icon"]')).toHaveValue("🔥");
  });

  it("blocks a form until an emoji is chosen", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <Required />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Pick an icon")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("cannot be opened when disabled", () => {
    render(<Disabled />);
    expect(screen.getByRole("button", { name: /Icon.*🔥/ })).toBeDisabled();
  });
});
