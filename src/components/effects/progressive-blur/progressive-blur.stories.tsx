import type { Meta, StoryObj } from "@storybook/react-vite";
import ProgressiveBlurDemoExample from "./examples/progressive-blur-demo";
import progressiveBlurDemoExampleSource from "./examples/progressive-blur-demo.tsx?raw";

import { ProgressiveBlur } from "./progressive-blur";

const meta = {
  title: "Effects/Backgrounds/ProgressiveBlur",
  component: ProgressiveBlur,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ProgressiveBlur>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { position: "bottom", height: "40%" },
  render: (args) => (
    <div className="relative h-72 w-80 overflow-hidden rounded-lg border">
      <div className="space-y-2 p-4 text-sm">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>Line {index + 1} of scrolling content</p>
        ))}
      </div>
      <ProgressiveBlur {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <ProgressiveBlurDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: progressiveBlurDemoExampleSource, language: "tsx" } },
  },
};
