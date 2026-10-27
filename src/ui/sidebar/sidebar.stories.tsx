import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "./sidebar";

const meta = {
  title: "UI/Sidebar",
  component: SidebarProvider,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SidebarProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "min-h-72 w-[40rem] overflow-hidden rounded-lg border" },
  render: (args) => (
    <SidebarProvider {...args}>
      <Sidebar collapsible="none" className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {["Home", "Inbox", "Settings"].map((item) => (
                  <SidebarMenuItem key={item}>
                    <SidebarMenuButton>{item}</SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 text-sm">Main content</div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
