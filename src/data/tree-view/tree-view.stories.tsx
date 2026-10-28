import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileCodeIcon, FileTextIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Checkbox } from "../../ui/checkbox";
import { TreeView, type TreeItem } from "./tree-view";

const files: TreeItem[] = [
  {
    id: "app",
    label: "app",
    defaultExpanded: true,
    children: [
      {
        id: "app/components",
        label: "components",
        defaultExpanded: true,
        children: [
          { id: "app/components/button", label: "Button.tsx", icon: <FileCodeIcon /> },
          { id: "app/components/card", label: "Card.tsx", icon: <FileCodeIcon /> },
        ],
      },
      { id: "app/app", label: "App.tsx", icon: <FileCodeIcon /> },
      { id: "app/index", label: "index.ts", icon: <FileCodeIcon /> },
    ],
  },
  {
    id: "docs",
    label: "docs",
    children: [{ id: "docs/readme", label: "README.md", icon: <FileTextIcon /> }],
  },
  { id: "package", label: "package.json", icon: <FileCodeIcon /> },
];

const meta = {
  title: "Data/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: files, className: "w-72", "aria-label": "Files", onValueChange: fn() },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Preselected: Story = { args: { defaultValue: ["app/app"] } };

export const MultipleSelection: Story = { args: { multiple: true } };

export const ReplaceBehavior: Story = { args: { selectionBehavior: "replace" } };

export const WithCheckboxes: Story = {
  args: {
    multiple: true,
    propagateSelect: true,
    bubbleSelect: true,
    renderLeading: (_item, state) => (
      <Checkbox
        tabIndex={-1}
        aria-label="Select"
        checked={state.indeterminate ? "indeterminate" : state.selected}
        onClick={(event) => event.stopPropagation()}
        onCheckedChange={() => state.select()}
      />
    ),
  },
};

export const DisabledItems: Story = {
  args: {
    items: [
      { id: "a", label: "Available" },
      { id: "b", label: "Locked", disabled: true, children: [{ id: "b1", label: "Inside" }] },
      { id: "c", label: "Also available" },
    ],
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const ControlledExpansion: Story = {
  args: { expanded: ["docs"] },
};

export const Looping: Story = { args: { loop: true } };

export const Colors: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["primary", "success", "info", "warning", "destructive", "neutral"] as const).map(
        (color) => (
          <TreeView key={color} {...args} color={color} defaultValue={["package"]} />
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <TreeView key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const CustomRender: Story = {
  args: {
    renderTrailing: (item) =>
      item.children ? (
        <span className="text-xs text-muted-foreground">{item.children.length}</span>
      ) : null,
    renderLabel: (item) => <em>{item.label}</em>,
  },
};

export const BlockedSelection: Story = {
  args: { onSelect: (_item, context) => context.preventDefault() },
};

export const BlockedToggle: Story = {
  args: { onToggle: (_item, context) => context.preventDefault() },
};
