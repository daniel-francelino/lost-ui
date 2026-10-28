import type { Meta, StoryObj } from "@storybook/react-vite";

import { ForbiddenPage } from "./forbidden-page";

const meta = {
  title: "Templates/ForbiddenPage",
  component: ForbiddenPage,
  tags: ["autodocs"],
  args: { homeHref: "/admin" },
} satisfies Meta<typeof ForbiddenPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutHomeButton: Story = { args: { homeHref: undefined } };

export const CustomText: Story = {
  args: { title: "Admins only", description: "Ask an admin for access to settings." },
};
