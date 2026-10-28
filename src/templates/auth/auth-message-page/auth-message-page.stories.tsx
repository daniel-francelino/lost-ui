import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClockIcon, MailIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "../../../components/ui/button";
import { AuthMessagePage } from "./auth-message-page";

const meta = {
  title: "Templates/AuthMessagePage",
  component: AuthMessagePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { logo: <strong className="text-xl">Acme</strong> },
} satisfies Meta<typeof AuthMessagePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PendingApproval: Story = {
  args: {
    title: "Your request is being reviewed",
    description:
      "Thank you, Ada. The team reviews the account; once it is approved you can sign in.",
    icon: <ClockIcon />,
    actions: (
      <>
        <Button onClick={fn()}>Check again</Button>
        <Button variant="outline" onClick={fn()}>
          Sign out
        </Button>
      </>
    ),
  },
};

export const ConfirmEmail: Story = {
  args: {
    title: "Confirm your email",
    description: "We sent a link to ada@acme.com.",
    icon: <MailIcon />,
    footer: <a href="/login">Back to sign in</a>,
  },
};

export const TextOnly: Story = { args: { title: "Account suspended" } };
