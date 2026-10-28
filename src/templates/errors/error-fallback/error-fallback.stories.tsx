import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ErrorFallback } from "./error-fallback";

const meta = {
  title: "Templates/ErrorFallback",
  component: ErrorFallback,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { onRetry: fn(), homeHref: "/admin" },
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CustomText: Story = {
  args: {
    eyebrow: "Report failed",
    title: "The report did not load",
    description: "Try again in a moment.",
    children: <p className="mt-4 font-mono text-xs">Error id: 4f3a</p>,
  },
};

export const RetryOnly: Story = { args: { homeHref: undefined } };

export const NoActions: Story = { args: { homeHref: undefined, onRetry: undefined } };
