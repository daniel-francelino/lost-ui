import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: "single", defaultValue: "bold", children: null },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        Italic
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
