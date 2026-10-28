import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "w-80" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>Card content</CardContent>
      <CardFooter>Card footer</CardFooter>
    </Card>
  ),
};
