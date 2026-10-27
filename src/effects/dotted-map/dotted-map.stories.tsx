import type { Meta, StoryObj } from "@storybook/react-vite";
import DottedMapDemoExample from "./examples/dotted-map-demo";
import dottedMapDemoExampleSource from "./examples/dotted-map-demo.tsx?raw";
import DottedMapDemo2Example from "./examples/dotted-map-demo-2";
import dottedMapDemo2ExampleSource from "./examples/dotted-map-demo-2.tsx?raw";
import DottedMapDemo3Example from "./examples/dotted-map-demo-3";
import dottedMapDemo3ExampleSource from "./examples/dotted-map-demo-3.tsx?raw";

import { DottedMap } from "./dotted-map";

const meta = {
  title: "Effects/Media/DottedMap",
  component: DottedMap,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof DottedMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    width: 150,
    height: 75,
    mapSamples: 1500,
    markers: [
      { lat: 40.7128, lng: -74.006, size: 0.5 },
      { lat: 51.5074, lng: -0.1278, size: 0.5 },
    ],
  },
  render: (args) => (
    <div className="w-[34rem]">
      <DottedMap {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <DottedMapDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dottedMapDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <DottedMapDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dottedMapDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <DottedMapDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dottedMapDemo3ExampleSource, language: "tsx" } },
  },
};
