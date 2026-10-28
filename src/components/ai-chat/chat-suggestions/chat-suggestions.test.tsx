import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { ChatSuggestions } from "./chat-suggestions";
import * as stories from "./chat-suggestions.stories";

const { Playground, Grid, WithAnotherValue, Disabled } = composeStories(stories);

describe("ChatSuggestions", () => {
  it("lists the suggestions as buttons", () => {
    render(<Playground />);
    expect(screen.getByRole("list", { name: "Suggestions" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("sends the text of the suggestion that is picked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Playground onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Plan a launch campaign" }));
    expect(onSelect).toHaveBeenCalledWith("Plan a launch campaign");
  });

  it("sends another text when the suggestion has a value", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<WithAnotherValue onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Ideas" }));
    expect(onSelect).toHaveBeenCalledWith("Give me five content ideas for this week");
  });

  it("lays out cards in two columns in the grid layout, with icons", () => {
    const { container } = render(<Grid />);
    expect(container.querySelector("[data-layout='grid']")).toHaveClass("sm:grid-cols-2");
    expect(container.querySelector("svg.lucide-calendar")).not.toBeNull();
  });

  it("can be disabled", () => {
    render(<Disabled />);
    for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <ChatSuggestions suggestions={["Oi"]} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("list", { name: "Sugestões" })).toBeInTheDocument();
  });
});
