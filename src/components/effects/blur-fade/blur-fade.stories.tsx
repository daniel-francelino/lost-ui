import type { Meta, StoryObj } from "@storybook/react-vite";
import BlurFadeDemoExample from "./examples/blur-fade-demo";
import blurFadeDemoExampleSource from "./examples/blur-fade-demo.tsx?raw";
import BlurFadeTextDemoExample from "./examples/blur-fade-text-demo";
import blurFadeTextDemoExampleSource from "./examples/blur-fade-text-demo.tsx?raw";

import { BlurFade } from "./blur-fade";

const meta = {
  title: "Effects/Layout/BlurFade",
  component: BlurFade,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BlurFade>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: <p className="text-2xl font-semibold">Blur fade</p>, delay: 0.1, blur: "8px" },
};

export const Default: StoryObj = {
  render: () => <BlurFadeDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: blurFadeDemoExampleSource, language: "tsx" } },
  },
};

export const Text: StoryObj = {
  render: () => <BlurFadeTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: blurFadeTextDemoExampleSource, language: "tsx" } },
  },
};
