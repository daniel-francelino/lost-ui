import type { Meta, StoryObj } from "@storybook/react-vite";
import GridPatternDashedExample from "./examples/grid-pattern-dashed";
import gridPatternDashedExampleSource from "./examples/grid-pattern-dashed.tsx?raw";
import GridPatternDemoExample from "./examples/grid-pattern-demo";
import gridPatternDemoExampleSource from "./examples/grid-pattern-demo.tsx?raw";
import GridPatternLinearGradientExample from "./examples/grid-pattern-linear-gradient";
import gridPatternLinearGradientExampleSource from "./examples/grid-pattern-linear-gradient.tsx?raw";

import { GridPattern } from "./grid-pattern";

const meta = {
  title: "Effects/Backgrounds/GridPattern",
  component: GridPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof GridPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    width: 40,
    height: 40,
    x: -1,
    y: -1,
    squares: [
      [4, 4],
      [5, 1],
      [8, 2],
      [5, 3],
    ],
  },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <GridPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};

export const Dashed: StoryObj = {
  render: () => <GridPatternDashedExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: gridPatternDashedExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <GridPatternDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: gridPatternDemoExampleSource, language: "tsx" } },
  },
};

export const LinearGradient: StoryObj = {
  render: () => <GridPatternLinearGradientExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: gridPatternLinearGradientExampleSource, language: "tsx" } },
  },
};
