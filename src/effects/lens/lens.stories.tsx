import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../stories/placeholder";

import { Lens } from "./lens";

const meta = {
  title: "Effects/Interactive/Lens",
  component: Lens,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Lens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    zoomFactor: 2,
    lensSize: 150,
    children: (
      <img src={placeholderImage(400, 260, "Lens")} alt="Lens target" className="rounded-xl" />
    ),
  },
};
