import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormSlider } from "./form-slider";

const meta = {
  title: "Forms/FormSlider",
  component: FormSlider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", onValueChange: fn() },
} satisfies Meta<typeof FormSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Volume", defaultValue: 40, showValue: true } };

export const Range: Story = {
  args: { label: "Price range", defaultValue: [20, 80], showValue: true },
};

export const Stepped: Story = {
  args: { label: "Rating", min: 0, max: 10, step: 2, defaultValue: 4 },
};

export const AtLeast: Story = {
  args: {
    label: "Volume",
    defaultValue: 0,
    rules: [rules.min(10, "Volume must be at least 10")],
  },
};

export const Disabled: Story = { args: { label: "Volume", disabled: true, defaultValue: 30 } };
