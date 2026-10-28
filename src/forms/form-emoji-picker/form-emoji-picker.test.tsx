import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-emoji-picker.stories";

// emoji-picker-react draws its list from element sizes, which jsdom does not have, so the
// picker is replaced by a stub that has the same props and click callback.
vi.mock("emoji-picker-react", () => ({
  default: (props: {
    searchPlaceholder?: string;
    skinTonesDisabled?: boolean;
    onEmojiClick: (emoji: { emoji: string }) => void;
  }) => (
    <div data-testid="picker" data-skin-tones-disabled={props.skinTonesDisabled ? "" : undefined}>
      <input placeholder={props.searchPlaceholder} />
      <button type="button" onClick={() => props.onEmojiClick({ emoji: "🔥" })}>
        fire
      </button>
    </div>
  ),
  EmojiStyle: { NATIVE: "native" },
  Theme: { AUTO: "auto" },
}));

const { Playground, Preselected, WithoutSkinTones, Required, Disabled } = composeStories(stories);

describe("FormEmojiPicker", () => {
  it("shows the placeholder until an emoji is chosen", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Pick an emoji/ })).toBeInTheDocument();
  });

  it("shows the chosen emoji on the button", () => {
    render(<Preselected />);
    expect(screen.getByRole("button", { name: /Icon.*🔥/ })).toBeInTheDocument();
  });

  it("keeps the picker closed until the button is clicked", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    expect(screen.queryByTestId("picker")).toBeNull();

    await user.click(screen.getByRole("button", { name: /Pick an emoji/ }));

    expect(await screen.findByTestId("picker")).toBeInTheDocument();
  });

  it("gives the picker its search placeholder", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: /Pick an emoji/ }));

    expect(await screen.findByPlaceholderText("Search emoji")).toBeInTheDocument();
  });

  it("passes options through to the picker", async () => {
    const user = userEvent.setup();
    render(<WithoutSkinTones />);

    await user.click(screen.getByRole("button", { name: /Pick an emoji/ }));

    expect(await screen.findByTestId("picker")).toHaveAttribute("data-skin-tones-disabled");
  });

  it("picks an emoji, reports it and closes the picker", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: /Pick an emoji/ }));
    await user.click(await screen.findByRole("button", { name: "fire" }));

    expect(onValueChange).toHaveBeenLastCalledWith("🔥");
    expect(screen.queryByTestId("picker")).toBeNull();
    expect(screen.getByRole("button", { name: /Icon.*🔥/ })).toBeInTheDocument();
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
