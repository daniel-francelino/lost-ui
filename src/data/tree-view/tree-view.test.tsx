import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TreeView } from "./tree-view";
import * as stories from "./tree-view.stories";

const {
  Playground,
  Preselected,
  MultipleSelection,
  ReplaceBehavior,
  WithCheckboxes,
  DisabledItems,
  Disabled,
  ControlledExpansion,
  Looping,
  Colors,
  Sizes,
  CustomRender,
  BlockedSelection,
  BlockedToggle,
} = composeStories(stories);

const item = (name: string) => screen.getByRole("treeitem", { name });
/** Like `item`, for rows whose name also holds what the app draws inside them. */
const row = (name: string) =>
  screen.getByRole("treeitem", { name: new RegExp(name.replace(".", "\\.")) });
const labels = () => screen.getAllByRole("treeitem").map((node) => node.textContent);

describe("TreeView", () => {
  it("is a labelled tree of items", () => {
    render(<Playground />);
    expect(screen.getByRole("tree", { name: "Files" })).toBeInTheDocument();
    expect(screen.getAllByRole("treeitem").length).toBeGreaterThan(0);
  });

  it("shows the items that start open and hides the rest", () => {
    render(<Playground />);
    expect(labels()).toEqual([
      "app",
      "components",
      "Button.tsx",
      "Card.tsx",
      "App.tsx",
      "index.ts",
      "docs",
      "package.json",
    ]);
  });

  it("tells the level, the size and the position of an item", () => {
    render(<Playground />);
    const button = item("Button.tsx");
    expect(button).toHaveAttribute("aria-level", "3");
    expect(button).toHaveAttribute("aria-setsize", "2");
    expect(button).toHaveAttribute("aria-posinset", "1");
  });

  it("tells which parents are open", () => {
    render(<Playground />);
    expect(item("app")).toHaveAttribute("aria-expanded", "true");
    expect(item("docs")).toHaveAttribute("aria-expanded", "false");
    expect(item("package.json")).not.toHaveAttribute("aria-expanded");
  });

  it("opens and closes a parent with a click", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(item("docs"));
    expect(item("README.md")).toBeInTheDocument();

    await user.click(item("docs"));
    expect(screen.queryByRole("treeitem", { name: "README.md" })).toBeNull();
  });

  it("selects an item and reports its key", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onValueChange={onValueChange} />);

    await user.click(item("App.tsx"));

    expect(onValueChange).toHaveBeenLastCalledWith(["app/app"]);
    expect(item("App.tsx")).toHaveAttribute("aria-selected", "true");
  });

  it("keeps one selection at a time and clears it with a second click", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(item("App.tsx"));
    await user.click(item("index.ts"));
    expect(item("App.tsx")).toHaveAttribute("aria-selected", "false");
    expect(item("index.ts")).toHaveAttribute("aria-selected", "true");

    await user.click(item("index.ts"));
    expect(item("index.ts")).toHaveAttribute("aria-selected", "false");
  });

  it("keeps the selection on a second click with the replace behaviour", async () => {
    const user = userEvent.setup();
    render(<ReplaceBehavior />);

    await user.click(item("App.tsx"));
    await user.click(item("App.tsx"));

    expect(item("App.tsx")).toHaveAttribute("aria-selected", "true");
  });

  it("starts from the selection it is given", () => {
    render(<Preselected />);
    expect(item("App.tsx")).toHaveAttribute("aria-selected", "true");
  });

  it("selects several items with multiple", async () => {
    const user = userEvent.setup();
    render(<MultipleSelection />);

    await user.click(item("App.tsx"));
    await user.click(item("index.ts"));

    expect(item("App.tsx")).toHaveAttribute("aria-selected", "true");
    expect(item("index.ts")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tree")).toHaveAttribute("aria-multiselectable", "true");
  });

  describe("selecting parents and children", () => {
    it("selects everything below a parent", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<WithCheckboxes onValueChange={onValueChange} />);

      await user.click(item("components"));

      expect(new Set(onValueChange.mock.calls.at(-1)?.[0])).toEqual(
        new Set(["app/components", "app/components/button", "app/components/card"]),
      );
    });

    it("selects the parent when all its children are selected", async () => {
      const user = userEvent.setup();
      render(<WithCheckboxes />);

      await user.click(item("Button.tsx"));
      expect(item("components")).toHaveAttribute("aria-selected", "false");

      await user.click(item("Card.tsx"));
      expect(item("components")).toHaveAttribute("aria-selected", "true");
    });

    it("shows a partial state on a parent with only some children selected", async () => {
      const user = userEvent.setup();
      render(<WithCheckboxes />);

      await user.click(item("Button.tsx"));

      const box = item("components").querySelector("[role='checkbox']");
      expect(box).toHaveAttribute("data-state", "indeterminate");
    });

    it("clears the parent when a child is cleared", async () => {
      const user = userEvent.setup();
      render(<WithCheckboxes />);

      await user.click(item("components"));
      await user.click(item("Button.tsx"));

      expect(item("components")).toHaveAttribute("aria-selected", "false");
      expect(item("Card.tsx")).toHaveAttribute("aria-selected", "true");
    });

    it("selects an item from the control the app draws inside it", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<WithCheckboxes onValueChange={onValueChange} />);

      await user.click(item("Button.tsx").querySelector("[role='checkbox']") as HTMLElement);

      expect(onValueChange).toHaveBeenCalledOnce();
    });
  });

  describe("expansion", () => {
    it("reports which items are open", async () => {
      const onExpandedChange = vi.fn();
      const user = userEvent.setup();
      render(<Playground onExpandedChange={onExpandedChange} />);

      await user.click(item("docs"));

      expect(onExpandedChange).toHaveBeenLastCalledWith(["app", "app/components", "docs"]);
    });

    it("can be driven from outside", () => {
      render(<ControlledExpansion />);
      expect(item("docs")).toHaveAttribute("aria-expanded", "true");
      expect(item("app")).toHaveAttribute("aria-expanded", "false");
    });

    it("lets the app stop an item from opening", async () => {
      const user = userEvent.setup();
      render(<BlockedToggle />);

      await user.click(item("docs"));

      expect(item("docs")).toHaveAttribute("aria-expanded", "false");
    });

    it("lets the app stop an item from being selected", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<BlockedSelection onValueChange={onValueChange} />);

      await user.click(item("App.tsx"));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(item("App.tsx")).toHaveAttribute("aria-selected", "false");
    });

    it("tells the app which item was selected or toggled", async () => {
      const onSelect = vi.fn();
      const onToggle = vi.fn();
      const user = userEvent.setup();
      render(<Playground onSelect={onSelect} onToggle={onToggle} />);

      await user.click(item("docs"));

      expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ id: "docs" });
      expect(onToggle.mock.calls[0]?.[0]).toMatchObject({ id: "docs" });
    });
  });

  describe("keyboard", () => {
    it("has one tab stop and moves it with the arrow keys", async () => {
      const user = userEvent.setup();
      render(<Playground />);

      await user.tab();
      expect(item("app")).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(item("components")).toHaveFocus();
      await user.keyboard("{ArrowUp}");
      expect(item("app")).toHaveFocus();
    });

    it("goes to the first and the last item with Home and End", async () => {
      const user = userEvent.setup();
      render(<Playground />);

      await user.tab();
      await user.keyboard("{End}");
      expect(item("package.json")).toHaveFocus();
      await user.keyboard("{Home}");
      expect(item("app")).toHaveFocus();
    });

    it("stops at the ends unless it loops", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Playground />);

      await user.tab();
      await user.keyboard("{ArrowUp}");
      expect(item("app")).toHaveFocus();
      unmount();

      render(<Looping />);
      await user.tab();
      await user.keyboard("{ArrowUp}");
      expect(item("package.json")).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(item("app")).toHaveFocus();
    });

    it("opens a parent with ArrowRight, then goes to its first child", async () => {
      const user = userEvent.setup();
      render(<Playground />);

      await user.click(item("package.json"));
      await user.keyboard("{ArrowUp}");
      expect(item("docs")).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(item("docs")).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{ArrowRight}");
      expect(item("README.md")).toHaveFocus();
    });

    it("closes a parent with ArrowLeft, then goes to its parent", async () => {
      const user = userEvent.setup();
      render(<Playground />);

      await user.tab();
      await user.keyboard("{ArrowDown}{ArrowDown}");
      expect(item("Button.tsx")).toHaveFocus();

      await user.keyboard("{ArrowLeft}");
      expect(item("components")).toHaveFocus();
      await user.keyboard("{ArrowLeft}");
      expect(item("components")).toHaveAttribute("aria-expanded", "false");
    });

    it("selects the focused item with Enter and with Space", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Playground onValueChange={onValueChange} />);

      await user.tab();
      await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
      expect(onValueChange).toHaveBeenLastCalledWith(["app/components/button"]);

      await user.keyboard("{ArrowDown} ");
      expect(onValueChange).toHaveBeenLastCalledWith(["app/components/card"]);
    });

    it("skips the items that are disabled", async () => {
      const user = userEvent.setup();
      render(<DisabledItems />);

      await user.tab();
      await user.keyboard("{ArrowDown}");

      expect(item("Also available")).toHaveFocus();
    });
  });

  describe("disabled", () => {
    it("blocks the items of a disabled item and everything under it", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<DisabledItems onValueChange={onValueChange} />);

      expect(item("Locked")).toHaveAttribute("aria-disabled", "true");
      await user.click(item("Locked"));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(item("Locked")).toHaveAttribute("aria-expanded", "false");
    });

    it("blocks the whole tree", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Disabled onValueChange={onValueChange} />);

      expect(screen.getByRole("tree")).toHaveAttribute("aria-disabled", "true");
      await user.click(item("App.tsx"));

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("drawing", () => {
    it("indents each level", () => {
      render(<Playground />);
      expect(item("app")).toHaveStyle({ paddingLeft: "0px" });
      expect(item("Button.tsx")).toHaveStyle({ paddingLeft: "40px" });
    });

    it("shows the icon of an item and a folder for a parent without one", () => {
      render(<Playground />);
      expect(item("Button.tsx").querySelector("svg")).not.toBeNull();
      expect(item("app").querySelector("svg.lucide-folder-open")).not.toBeNull();
      expect(item("docs").querySelector("svg.lucide-folder")).not.toBeNull();
    });

    it("marks the selected item with the colour", () => {
      render(<Colors />);
      const rows = screen
        .getAllByRole("tree")
        .map((tree) => tree.querySelector("[data-state='selected'] > div")?.className ?? "");
      expect(rows[0]).toContain("text-primary");
      expect(rows[1]).toContain("text-success");
      expect(rows[5]).toContain("text-foreground");
    });

    it("applies each size", () => {
      render(<Sizes />);
      const rows = screen
        .getAllByRole("tree")
        .map((tree) => tree.querySelector("[data-slot='tree-row']")?.className ?? "");
      expect(rows[0]).toContain("text-xs");
      expect(rows[2]).toContain("text-sm");
      expect(rows[4]).toContain("text-base");
    });

    it("lets the app draw the label and the end of an item", () => {
      render(<CustomRender />);
      expect(screen.getByText("app").tagName).toBe("EM");
      expect(item("docs")).toHaveTextContent("1");
    });

    it("uses the text of the label for the key when no id is given", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TreeView
          aria-label="Plain"
          onValueChange={onValueChange}
          items={[{ label: "One", children: [{ label: "Two" }] }]}
          defaultExpanded={["One"]}
        />,
      );

      await user.click(item("Two"));

      expect(onValueChange).toHaveBeenCalledWith(["One/Two"]);
    });

    it("takes the key from getKey", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TreeView
          aria-label="Plain"
          onValueChange={onValueChange}
          getKey={(entry) => `k-${entry.text}`}
          items={[{ label: <b>One</b>, text: "one" }]}
        />,
      );

      await user.click(screen.getByRole("treeitem"));

      expect(onValueChange).toHaveBeenCalledWith(["k-one"]);
    });
  });
});
