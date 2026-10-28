import type { Meta, StoryObj } from "@storybook/react-vite";
import ScrollBasedVelocityDemoExample from "./examples/scroll-based-velocity-demo";
import scrollBasedVelocityDemoExampleSource from "./examples/scroll-based-velocity-demo.tsx?raw";
import ScrollBasedVelocityImagesDemoExample from "./examples/scroll-based-velocity-images-demo";
import scrollBasedVelocityImagesDemoExampleSource from "./examples/scroll-based-velocity-images-demo.tsx?raw";

import { ScrollVelocityContainer, ScrollVelocityRow } from "./scroll-based-velocity";

const meta = {
  title: "Effects/Layout/ScrollVelocity",
  component: ScrollVelocityContainer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ScrollVelocityContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  render: (args) => (
    <ScrollVelocityContainer {...args} className="w-full py-12 text-4xl font-bold">
      <ScrollVelocityRow baseVelocity={3}>Scroll velocity &nbsp;•&nbsp; </ScrollVelocityRow>
      <ScrollVelocityRow baseVelocity={3} direction={-1}>
        Another row &nbsp;•&nbsp;
      </ScrollVelocityRow>
    </ScrollVelocityContainer>
  ),
};

export const Default: StoryObj = {
  render: () => <ScrollBasedVelocityDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: scrollBasedVelocityDemoExampleSource, language: "tsx" } },
  },
};

export const Images: StoryObj = {
  render: () => <ScrollBasedVelocityImagesDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: scrollBasedVelocityImagesDemoExampleSource, language: "tsx" } },
  },
};
