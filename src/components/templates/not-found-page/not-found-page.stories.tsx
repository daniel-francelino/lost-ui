import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotFoundPage } from "./not-found-page";

const meta = {
  title: "Templates/NotFoundPage",
  component: NotFoundPage,
  tags: ["autodocs"],
  args: { homeHref: "/admin" },
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutHomeButton: Story = { args: { homeHref: undefined } };

export const CustomText: Story = {
  args: { title: "No such order", description: "Check the number and try again." },
};
