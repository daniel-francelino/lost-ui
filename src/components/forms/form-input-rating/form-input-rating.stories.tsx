import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeartIcon } from "lucide-react";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputRating } from "./form-input-rating";

const meta = {
  title: "Forms/FormInputRating",
  component: FormInputRating,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { onValueChange: fn() },
} satisfies Meta<typeof FormInputRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "How was it?" } };

export const Preselected: Story = { args: { label: "Rating", defaultValue: 3 } };

export const TenStars: Story = { args: { label: "Score", max: 10, defaultValue: 7 } };

export const CustomIcon: Story = { args: { label: "Love it?", icon: HeartIcon, defaultValue: 2 } };

export const Required: Story = {
  args: { label: "Rating", required: true, rules: [rules.min(1, "Please rate")] },
};

export const ReadOnly: Story = { args: { label: "Average", readOnly: true, defaultValue: 4 } };
