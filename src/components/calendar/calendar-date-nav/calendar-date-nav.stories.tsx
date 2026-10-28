import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "../../ui/button";
import { CalendarDateNav } from "./calendar-date-nav";

const meta = {
  title: "Calendar/CalendarDateNav",
  component: CalendarDateNav,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    date: new Date(2026, 9, 28),
    view: "month",
    onDateChange: fn(),
    onViewChange: fn(),
  },
} satisfies Meta<typeof CalendarDateNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Week: Story = { args: { view: "week" } };

export const Day: Story = { args: { view: "day" } };

export const WeekAcrossTwoMonths: Story = {
  args: { view: "week", date: new Date(2026, 9, 28), weekStartsOn: 1 },
};

export const WithoutViews: Story = { args: { onViewChange: undefined } };

export const WithAction: Story = { args: { actions: <Button>New event</Button> } };
