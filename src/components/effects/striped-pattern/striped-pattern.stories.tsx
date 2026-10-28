import type { Meta, StoryObj } from "@storybook/react-vite";
import StripedPatternDashedExample from "./examples/striped-pattern-dashed";
import stripedPatternDashedExampleSource from "./examples/striped-pattern-dashed.tsx?raw";
import StripedPatternDemoExample from "./examples/striped-pattern-demo";
import stripedPatternDemoExampleSource from "./examples/striped-pattern-demo.tsx?raw";
import StripedPatternRightExample from "./examples/striped-pattern-right";
import stripedPatternRightExampleSource from "./examples/striped-pattern-right.tsx?raw";

import { StripedPattern } from "./striped-pattern";

const meta = {
  title: "Effects/Backgrounds/StripedPattern",
  component: StripedPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof StripedPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { direction: "left" },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <StripedPattern
        {...args}
        className="text-muted-foreground [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};

export const Dashed: StoryObj = {
  render: () => <StripedPatternDashedExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: stripedPatternDashedExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <StripedPatternDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: stripedPatternDemoExampleSource, language: "tsx" } },
  },
};

export const Right: StoryObj = {
  render: () => <StripedPatternRightExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: stripedPatternRightExampleSource, language: "tsx" } },
  },
};
