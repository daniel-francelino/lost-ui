import type { Meta, StoryObj } from "@storybook/react-vite";
import HexagonPatternDashedExample from "./examples/hexagon-pattern-dashed";
import hexagonPatternDashedExampleSource from "./examples/hexagon-pattern-dashed.tsx?raw";
import HexagonPatternDemoExample from "./examples/hexagon-pattern-demo";
import hexagonPatternDemoExampleSource from "./examples/hexagon-pattern-demo.tsx?raw";
import HexagonPatternLinearGradientExample from "./examples/hexagon-pattern-linear-gradient";
import hexagonPatternLinearGradientExampleSource from "./examples/hexagon-pattern-linear-gradient.tsx?raw";
import HexagonPatternSpacingExample from "./examples/hexagon-pattern-spacing";
import hexagonPatternSpacingExampleSource from "./examples/hexagon-pattern-spacing.tsx?raw";

import { HexagonPattern } from "./hexagon-pattern";

const meta = {
  title: "Effects/Backgrounds/HexagonPattern",
  component: HexagonPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof HexagonPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    radius: 30,
    gap: 4,
    hexagons: [
      [2, 1],
      [3, 2],
    ],
  },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <HexagonPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};

export const Dashed: StoryObj = {
  render: () => <HexagonPatternDashedExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: hexagonPatternDashedExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <HexagonPatternDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: hexagonPatternDemoExampleSource, language: "tsx" } },
  },
};

export const LinearGradient: StoryObj = {
  render: () => <HexagonPatternLinearGradientExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: hexagonPatternLinearGradientExampleSource, language: "tsx" } },
  },
};

export const Spacing: StoryObj = {
  render: () => <HexagonPatternSpacingExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: hexagonPatternSpacingExampleSource, language: "tsx" } },
  },
};
