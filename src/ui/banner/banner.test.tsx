import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LostI18nProvider, lostI18n } from "../../i18n";
import { Banner } from "./banner";
import * as stories from "./banner.stories";

const { Playground, WithIcon, Colors, Closable, Persistent, WithActions, AsLink, CustomContent } =
  composeStories(stories);

afterEach(async () => {
  window.localStorage.clear();
  await lostI18n.changeLanguage("en");
});

describe("Banner", () => {
  it("shows the title", () => {
    render(<Playground />);
    expect(screen.getByText("Version 2 is out: read what is new.")).toBeInTheDocument();
  });

  it("shows the icon and hides it from screen readers", () => {
    const { container } = render(<WithIcon />);
    expect(container.querySelector("span[aria-hidden='true'] svg")).not.toBeNull();
  });

  it("applies each colour", () => {
    render(<Colors />);
    expect(screen.getByText("primary").closest("[data-slot=banner]")).toHaveClass("bg-primary");
    expect(screen.getByText("success").closest("[data-slot=banner]")).toHaveClass("bg-success");
    expect(screen.getByText("destructive").closest("[data-slot=banner]")).toHaveClass(
      "bg-destructive",
    );
  });

  it("has no close button by default", () => {
    render(<Playground />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("closes with the close button and reports it", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Closable onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByText(/Version 2/)).toBeNull();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("names the close button in the current language or by prop", () => {
    const { unmount } = render(
      <LostI18nProvider language="pt">
        <Banner title="x" close />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    unmount();

    render(<Banner title="x" close closeLabel="Dismiss" />);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("remembers a dismissed banner with an id", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Persistent />);

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(window.localStorage.getItem("lost-ui:banner:release-2")).toBe("dismissed");
    unmount();

    render(<Persistent />);
    expect(await screen.findByRole("button", { name: "Close" }).catch(() => null)).toBeNull();
    expect(screen.queryByText(/Version 2/)).toBeNull();
  });

  it("shows again on a page where it was not dismissed, and ignores storage without close", () => {
    window.localStorage.setItem("lost-ui:banner:release-2", "dismissed");

    render(<Banner id="release-2" title="Still here" />);

    expect(screen.getByText("Still here")).toBeInTheDocument();
  });

  it("closes for this visit when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const user = userEvent.setup();
    render(<Persistent />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByText(/Version 2/)).toBeNull();
    vi.restoreAllMocks();
  });

  it("shows actions as buttons and links", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <WithActions
        actions={[
          { label: "Upgrade", onClick },
          { label: "Changelog", href: "/changelog" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Changelog" })).toHaveAttribute("href", "/changelog");
  });

  it("makes the whole banner a link", () => {
    render(<AsLink />);
    const link = screen.getByRole("link", { name: /Version 2/ });
    expect(link).toHaveAttribute("href", "/changelog");
    expect(link).toHaveClass("after:absolute", "after:inset-0");
  });

  it("opens a link in a new tab safely", () => {
    render(<Banner title="Go" href="https://example.com" target="_blank" />);
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows custom content instead of the title", () => {
    render(<CustomContent />);
    expect(screen.getByText("Saturday").tagName).toBe("STRONG");
  });

  it("is a labelled region only when it has a label", () => {
    const { rerender } = render(<Playground />);
    expect(screen.queryByRole("region")).toBeNull();

    rerender(<Playground label="Announcement" />);
    expect(screen.getByRole("region", { name: "Announcement" })).toBeInTheDocument();
  });
});
