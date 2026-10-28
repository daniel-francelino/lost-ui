import type { Meta, StoryObj } from "@storybook/react-vite";

import { Kbd } from "./kbd";

const meta = {
  title: "UI/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { value: "K" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Children: Story = { args: { value: undefined, children: "Esc" } };

export const SpecialKey: Story = { args: { value: "meta" } };

export const Shortcut: Story = {
  render: () => (
    <span className="inline-flex items-center gap-1">
      <Kbd value="meta" />
      <Kbd value="shift" />
      <Kbd value="K" />
    </span>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-2">
      {(["outline", "soft", "subtle", "solid"] as const).map((variant) => (
        <Kbd key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex gap-2">
      {(
        ["primary", "secondary", "success", "info", "warning", "destructive", "neutral"] as const
      ).map((color) => (
        <Kbd key={color} {...args} color={color} variant="subtle" />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Kbd key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
