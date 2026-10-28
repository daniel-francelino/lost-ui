import type { Meta, StoryObj } from "@storybook/react-vite";
import LensDemoExample from "./examples/lens-demo";
import lensDemoExampleSource from "./examples/lens-demo.tsx?raw";
import LensDemo2Example from "./examples/lens-demo-2";
import lensDemo2ExampleSource from "./examples/lens-demo-2.tsx?raw";
import LensDemo3Example from "./examples/lens-demo-3";
import lensDemo3ExampleSource from "./examples/lens-demo-3.tsx?raw";
import { placeholderImage } from "../../../stories/placeholder";

import { Lens } from "./lens";

const meta = {
  title: "Effects/Interactive/Lens",
  component: Lens,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Lens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    zoomFactor: 2,
    lensSize: 150,
    children: (
      <img src={placeholderImage(400, 260, "Lens")} alt="Lens target" className="rounded-xl" />
    ),
  },
};

export const Default: StoryObj = {
  render: () => <LensDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: lensDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <LensDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: lensDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <LensDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: lensDemo3ExampleSource, language: "tsx" } },
  },
};
