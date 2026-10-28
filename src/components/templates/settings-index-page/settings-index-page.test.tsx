import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./settings-index-page.stories";

const { Playground, Empty } = composeStories(stories);

describe("SettingsIndexPage", () => {
  it("shows the title and the description", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Settings of the organisation and of the access.")).toBeInTheDocument();
  });

  it("shows a card per area, linking to its page", () => {
    render(<Playground />);
    const link = screen.getByRole("link", { name: /People/ });
    expect(link).toHaveAttribute("href", "/settings/users");
    expect(link).toHaveTextContent("Invitations, profiles and suspended access.");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("leaves out the hidden areas", () => {
    render(<Playground />);
    expect(screen.queryByRole("link", { name: /Audit/ })).toBeNull();
  });

  it("draws the links with renderLink", () => {
    render(
      <Playground
        renderLink={({ item, href, children, ...rest }) => (
          <a href={href} data-routed={item.title} {...rest}>
            {children}
          </a>
        )}
      />,
    );
    expect(screen.getByRole("link", { name: /Roles/ })).toHaveAttribute("data-routed", "Roles");
  });

  it("renders no cards without entries", () => {
    render(<Empty />);
    expect(screen.queryByRole("listitem")).toBeNull();
  });
});
