import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { fn } from "storybook/test";

import { DataTableRowActions, type DataTableAction } from "./data-table-row-actions";

type Row = { id: string; name: string };

const row: Row = { id: "1", name: "Ada" };

const edit: DataTableAction<Row> = {
  id: "edit",
  label: "Edit",
  icon: PencilIcon,
  onSelect: fn(),
};
const clone: DataTableAction<Row> = {
  id: "clone",
  label: "Clone",
  icon: CopyIcon,
  onSelect: fn(),
};
const remove: DataTableAction<Row> = {
  id: "delete",
  label: "Delete",
  icon: Trash2Icon,
  destructive: true,
  onSelect: fn(),
};

const meta = {
  title: "Data/DataTableRowActions",
  component: DataTableRowActions<Row>,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { row, label: "Ada", actions: [edit, remove] },
} satisfies Meta<typeof DataTableRowActions<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Menu: Story = { args: { actions: [edit, clone, remove] } };

export const ForcedMenu: Story = { args: { forceMenu: true } };

export const Blocked: Story = {
  args: {
    actions: [edit, { ...remove, disabledReason: "It has open orders" }],
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const NoActions: Story = { args: { actions: [] } };
