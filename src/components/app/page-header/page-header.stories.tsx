import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../ui/button";
import { PageHeader } from "./page-header";

const meta = {
  title: "App/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: { title: "Products", description: "Everything in the catalogue." },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithActions: Story = { args: { actions: <Button>New product</Button> } };

export const WithLeading: Story = {
  args: { leading: <a href="/admin">← Back</a>, headingLevel: 2 },
};
