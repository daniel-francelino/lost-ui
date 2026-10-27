import type { Meta, StoryObj } from "@storybook/react-vite";

import { CoolMode } from "./cool-mode";

const meta = {
  title: "Effects/Interactive/CoolMode",
  component: CoolMode,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof CoolMode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <button type="button" className="rounded-lg border px-4 py-2">
        Click me
      </button>
    ),
  },
};
