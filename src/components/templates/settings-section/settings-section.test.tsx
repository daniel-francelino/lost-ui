import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./settings-section.stories";

const { Playground, AsForm, WithActions, BodyOnly } = composeStories(stories);

describe("SettingsSection", () => {
  it("shows the title, the description, the body and the footer", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 2, name: "Name" })).toBeInTheDocument();
    expect(screen.getByText("Shown to the other people in the team.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("is a section by default", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("section[data-slot='settings-section']")).not.toBeNull();
  });

  it("can be a form that submits with Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const { container } = render(<AsForm onSubmit={onSubmit} />);
    expect(container.querySelector("form[data-slot='settings-section']")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("shows actions beside the title", () => {
    render(<WithActions />);
    expect(screen.getByRole("link", { name: "Help" })).toBeInTheDocument();
  });

  it("draws only the body without a title or footer", () => {
    render(<BodyOnly />);
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });
});
