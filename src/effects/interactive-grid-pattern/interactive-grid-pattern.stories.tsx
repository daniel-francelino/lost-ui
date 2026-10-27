import type { Meta, StoryObj } from "@storybook/react-vite";
import InteractiveGridPatternDemoExample from "./examples/interactive-grid-pattern-demo";
import interactiveGridPatternDemoExampleSource from "./examples/interactive-grid-pattern-demo.tsx?raw";
import InteractiveGridPatternDemo2Example from "./examples/interactive-grid-pattern-demo-2";
import interactiveGridPatternDemo2ExampleSource from "./examples/interactive-grid-pattern-demo-2.tsx?raw";

import { InteractiveGridPattern } from "./interactive-grid-pattern";

const meta = {
  title: "Effects/Backgrounds/InteractiveGridPattern",
  component: InteractiveGridPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof InteractiveGridPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { width: 40, height: 40, squares: [20, 10] },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <InteractiveGridPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <InteractiveGridPatternDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: interactiveGridPatternDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <InteractiveGridPatternDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: interactiveGridPatternDemo2ExampleSource, language: "tsx" } },
  },
};
