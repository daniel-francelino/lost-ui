import type { Meta, StoryObj } from "@storybook/react-vite";

import { DottedMap } from "./dotted-map";

const meta = {
  title: "Effects/Media/DottedMap",
  component: DottedMap,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof DottedMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
