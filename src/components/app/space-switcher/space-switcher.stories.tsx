import type { Meta, StoryObj } from "@storybook/react-vite";
import { MegaphoneIcon, StoreIcon } from "lucide-react";

import { SpaceSwitcher } from "./space-switcher";

const spaces = [
  { id: "shop", title: "Shop", icon: <StoreIcon />, to: "/admin" },
  {
    id: "marketing",
    title: "Marketing",
    icon: <MegaphoneIcon />,
    to: "/marketing",
    tileClassName: "bg-secondary text-secondary-foreground",
  },
];

const meta = {
  title: "App/SpaceSwitcher",
  component: SpaceSwitcher,
  tags: ["autodocs"],
  args: { spaces, current: "shop" },
} satisfies Meta<typeof SpaceSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OneSpace: Story = { args: { spaces: spaces.slice(0, 1) } };
