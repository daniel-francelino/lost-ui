import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Form } from "../form";
import * as stories from "./form-checkbox-group.stories";

const { Playground, Preselected, Horizontal, PickTwo, Disabled } = composeStories(stories);

describe("FormCheckboxGroup", () => {
  it("renders a labelled group with one checkbox per item", () => {
    render(<Playground />);
    expect(screen.getByRole("group", { name: "Toppings" })).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(screen.getByText("Mozzarella")).toBeInTheDocument();
  });

  it("adds every checked item to the value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(screen.getByRole("checkbox", { name: /Cheese/ }));
    await user.click(screen.getByRole("checkbox", { name: /Olive/ }));

    expect(onValueChange).toHaveBeenLastCalledWith(["cheese", "olive"]);
  });

  it("removes an item when it is unchecked", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Preselected onValueChange={onValueChange} />);

    await user.click(screen.getByRole("checkbox", { name: /Cheese/ }));

    expect(onValueChange).toHaveBeenLastCalledWith(["olive"]);
    expect(screen.getByRole("checkbox", { name: /Cheese/ })).not.toBeChecked();
  });

  it("starts with the default values checked", () => {
    render(<Preselected />);
    expect(screen.getByRole("checkbox", { name: /Cheese/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Mushroom/ })).not.toBeChecked();
  });

  it("does not check a disabled item", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("checkbox", { name: /Anchovy/ }));

    expect(screen.getByRole("checkbox", { name: /Anchovy/ })).not.toBeChecked();
  });

  it("lays the options in a row when horizontal", () => {
    render(<Horizontal />);
    expect(screen.getByRole("group")).toHaveClass("grid-flow-col");
  });

  it("enforces a minimum number of choices through its rules", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={onSubmit}>
        <PickTwo />
        <button type="submit">Go</button>
      </Form>,
    );

    await user.click(screen.getByRole("checkbox", { name: /Cheese/ }));
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Pick at least two toppings")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("checkbox", { name: /Olive/ }));
    await user.click(screen.getByRole("button", { name: "Go" }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("disables every checkbox when locked", () => {
    render(<Disabled />);
    screen.getAllByRole("checkbox").forEach((box) => expect(box).toBeDisabled());
  });
});
