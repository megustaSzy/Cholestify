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
  HistoryIcon,
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
      title: "Keluar",
      // url: "/",
      icon: <LogOutIcon />,
      onClick: () => {
        logout();
      },
    },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: <CircleHelpIcon />,
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: <Settings2Icon />,
    // },
  ],
  menu: [
    {
      name: "Dashboard",
      url: "/user/dashboard",
      icon: <DatabaseIcon />,
    },
    {
      name: "Scan Mata",
      url: "/user/scan-mata",
      icon: <Eye />,
    },
    {
      name: "List Makanan",
      url: "/user/list-makanan",
      icon: <UtensilsCrossed />,
    },
    {
      name: "Laporan",
      url: "/user/laporan",
      icon: <FileIcon />,
    },
    {
      name: "Metric",
      // url: "",
      icon: <BarChart />,
      items: [
        {
          title: "Data Lipid Panel",
          url: "/user/metric/data-lipid-panel",
        },
        {
          title: "Tujuan Kesehatan",
          url: "/user/metric/tujuan-kesehatan",
        },
        {
          title: "Data Biometrik",
          url: "/user/metric/data-biometrik",
        },
        {
          title: "Pengukuran Harian",
          url: "/user/metric/pengukuran-harian",
        },
      ],
    },
    {
      name: "Riwayat",
      // url: "",
      icon: <HistoryIcon />,
      items: [
        {
          title: "Target Aktifitas",
          url: "/user/riwayat/target-aktivitas",
        },
        {
          title: "Scan Mata",
          url: "/user/riwayat/scan-mata",
        },
        {
          title: "Lipid Panel",
          url: "/user/riwayat/lipid-panel",
        },
      ],
    },
    {
      name: "Profile",
      // url: "/user/profile/clinical-profile",
      icon: <User />,
      items: [
        {
          title: "Profile Klinik",
          url: "/user/profile/profile-klinis",
        },
        {
          title: "Target Kesehatan",
          url: "/user/profile/target-kesehatan",
        },
        {
          title: "Pengaturan Akun",
          url: "/user/profile/pengaturan-akun",
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
                  Version 1.0
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
