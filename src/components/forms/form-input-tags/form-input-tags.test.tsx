import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-input-tags.stories";

const { Playground, Preselected, MaxThree, AllowDuplicates, AtLeastOne, Disabled } =
  composeStories(stories);

describe("FormInputTags", () => {
  it("renders a labelled input with a placeholder", () => {
    render(<Playground />);
    expect(screen.getByLabelText("Tags")).toHaveAttribute("placeholder", "Type and press Enter");
  });

  it("adds a tag with Enter and clears the input", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Tags");

    await user.type(input, "react{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith(["react"]);
    expect(input).toHaveValue("");
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("adds a tag when the delimiter is typed", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("Tags"), "vue,");

    expect(onValueChange).toHaveBeenLastCalledWith(["vue"]);
  });

  it("splits a pasted list on the delimiter", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByLabelText("Tags"));
    await user.paste("a, b, c");
    await user.keyboard("{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b", "c"]);
  });

  it("adds the pending text on blur", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("Tags"), "svelte");
    await user.tab();

    expect(onValueChange).toHaveBeenLastCalledWith(["svelte"]);
  });

  it("removes the last tag with Backspace on an empty input", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    await user.click(screen.getByLabelText("Tags"));
    await user.keyboard("{Backspace}");

    expect(onValueChange).toHaveBeenLastCalledWith(["react"]);
  });

  it("removes a tag with its button", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Remove react" }));

    expect(onValueChange).toHaveBeenLastCalledWith(["tailwind"]);
  });

  it("ignores a duplicate unless duplicates are allowed", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(<Preselected onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText("Tags"), "react{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    render(<AllowDuplicates onValueChange={onValueChange} />);
    await user.type(screen.getByLabelText("Words"), "go{Enter}");
    await user.type(screen.getByLabelText("Words"), "go{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["go", "go"]);
  });

  it("stops accepting tags at the maximum", async () => {
    const user = userEvent.setup();
    render(<MaxThree />);

    await user.type(screen.getByLabelText("Top skills"), "c{Enter}");

    expect(screen.getByLabelText("Top skills")).toBeDisabled();
    expect(screen.getByText("c")).toBeInTheDocument();
  });

  it("blocks a form without tags", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <AtLeastOne />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(await screen.findByText("Add at least one tag")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("cannot be edited when disabled", () => {
    render(<Disabled />);
    expect(screen.getByLabelText("Tags")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Remove locked" })).toBeNull();
  });
});
