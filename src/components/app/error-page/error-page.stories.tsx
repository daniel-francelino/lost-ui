import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileXIcon, HomeIcon } from "lucide-react";
import { fn } from "storybook/test";

import { ErrorPage } from "./error-page";

const meta = {
  title: "App/ErrorPage",
  component: ErrorPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { error: { statusCode: 404, message: "The page you are looking for does not exist." } },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcon: Story = { args: { icon: <FileXIcon /> } };

export const ServerError: Story = { args: { error: { statusCode: 500 } } };

export const CustomStatusMessage: Story = {
  args: { error: { statusCode: 418, statusMessage: "I am a teapot", message: "Short and stout." } },
};

export const WithoutStatusCode: Story = { args: { error: { message: "Try again in a moment." } } };

export const CustomClearButton: Story = {
  args: {
    clear: { label: "Take me home", variant: "outline", icon: <HomeIcon /> },
    redirect: "/home",
  },
};

export const WithoutClearButton: Story = { args: { clear: false } };

export const OnClear: Story = { args: { onClear: fn() } };

export const WithLeadingAndContent: Story = {
  args: {
    leading: <strong>◆ lost-ui</strong>,
    children: <p className="text-sm">Error id: 4f3a</p>,
  },
};
