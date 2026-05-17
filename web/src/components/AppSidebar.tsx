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
  FileIcon,
  LogOutIcon,
  User,
  Eye,
  UtensilsCrossed,
  BarChart,
} from "lucide-react";
import { NavSecondary } from "./NavSecondary";
import { logout } from "@/lib/utils";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navSecondary: [
    {
      title: "Logout",
      // url: "/",
      icon: <LogOutIcon />,
      onClick: () => {
        logout();
      },
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
      name: "Eye Scan",
      url: "/user/eye-scan",
      icon: <Eye />,
    },
    {
      name: "Food Table",
      url: "/user/food-table",
      icon: <UtensilsCrossed />,
    },
    {
      name: "Reports",
      url: "/user/reports",
      icon: <FileIcon />,
    },
    {
      name: "Metric",
      // url: "",
      icon: <BarChart />,
      items: [
        {
          title: "Log Lipid Panel",
          url: "/user/metric/log-lipid-panel",
        },
        {
          title: "Set Helath Goals",
          url: "/user/metric/set-health-goals",
        },
        {
          title: "Log Biometrics",
          url: "/user/metric/log-biometrics",
        },
        {
          title: "Daily Tracking",
          url: "/user/metric/daily-tracking",
        },
      ],
    },
    {
      name: "Profile",
      // url: "/user/profile/clinical-profile",
      icon: <User />,
      items: [
        {
          title: "Clinical Profile",
          url: "/user/profile/clinical-profile",
        },
        {
          title: "Helath Goals",
          url: "/user/profile/health-goals",
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
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5! h-auto hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit cursor-default">
              {/* <CommandIcon className="size-5!" /> */}
              <div className="flex flex-col items-start leading-tight ml-5">
                <span className="text-2xl font-semibold text-blue-600">
                  Cholestify
                </span>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
