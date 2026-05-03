"use client";

import * as React from "react";

import { NavMenuSidebar } from "@/components/NavMenuSidebar";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Settings2Icon,
  CircleHelpIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  LogOutIcon,
} from "lucide-react";
import { NavSecondary } from "./NavSecondary";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navSecondary: [
    {
      title: "Logout",
      url: "/",
      icon: <LogOutIcon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
  menu: [
    {
      name: "Dashboard",
      url: "/user/dashboard",
      icon: <DatabaseIcon />,
    },
    {
      name: "Screening",
      url: "/user/screening",
      icon: <FileIcon />,
    },
    {
      name: "Profile",
      // url: "#",
      icon: <FileChartColumnIcon />,
      items: [
        {
          title: "Foto Profile",
          url: "/signup",
        },
        {
          title: "Status",
          url: "/login",
        },
        {
          title: "Account Setting",
          url: "/user/profile/account-settings",
        },
      ],
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! h-auto"
              render={<Link href="#" />}
            >
              {/* <CommandIcon className="size-5!" /> */}
              <div className="flex flex-col items-start leading-tight ml-5">
                <span className="text-2xl font-semibold">Cholestify</span>
                <span className="text-sm text-muted-foreground">
                  Clinical Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavMenuSidebar items={data.menu} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
