import type { Meta, StoryObj } from "@storybook/react-vite";
import ScrollProgressDemoExample from "./examples/scroll-progress-demo";
import scrollProgressDemoExampleSource from "./examples/scroll-progress-demo.tsx?raw";

import { ScrollProgress } from "./scroll-progress";

const meta = {
  title: "Effects/Layout/ScrollProgress",
  component: ScrollProgress,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  render: (args) => (
    <div className="h-[200vh] w-full p-8">
      <ScrollProgress {...args} />
      <p>Scroll down to fill the progress bar at the top.</p>
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <ScrollProgressDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: scrollProgressDemoExampleSource, language: "tsx" } },
  },
};
