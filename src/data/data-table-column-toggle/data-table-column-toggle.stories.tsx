import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { DataTableColumnToggle } from "./data-table-column-toggle";

const columns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
];

const meta = {
  title: "Data/DataTableColumnToggle",
  component: DataTableColumnToggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { columns, visibility: {}, onVisibilityChange: () => {} },
} satisfies Meta<typeof DataTableColumnToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [visibility, setVisibility] = useState<Record<string, boolean>>({ role: false });

    return (
      <DataTableColumnToggle
        {...args}
        visibility={visibility}
        onVisibilityChange={(id, visible) => setVisibility((now) => ({ ...now, [id]: visible }))}
      />
    );
  },
};

export const CustomLabel: Story = { args: { label: "View" } };

export const Disabled: Story = { args: { disabled: true } };
