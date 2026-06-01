"use client";
import * as React from "react";
import { NavMenuSidebar } from "@/components/NavMenuSidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
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
import Link from "next/link";
import Image from "next/image";

const menuIconClass = "size-5 shrink-0 stroke-[1.8]";

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },

  navSecondary: [
    {
      title: "Keluar",
      // url: "/",
      icon: <LogOutIcon className={menuIconClass} />,
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
      icon: <DatabaseIcon className={menuIconClass} />,
    },
    {
      name: "Scan Mata",
      url: "/user/scan-mata",
      icon: <Eye className={menuIconClass} />,
    },
    {
      name: "List Makanan",
      url: "/user/list-makanan",
      icon: <UtensilsCrossed className={menuIconClass} />,
    },
    {
      name: "Laporan",
      url: "/user/laporan",
      icon: <FileIcon className={menuIconClass} />,
    },
    {
      name: "Metrik",
      // url: "",
      icon: <BarChart className={menuIconClass} />,
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
      icon: <HistoryIcon className={menuIconClass} />,
      items: [
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
      name: "Profil",
      // url: "/user/profile/clinical-profile",
      icon: <User className={menuIconClass} />,
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
      <SidebarHeader className="px-5 pt-5 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto cursor-default p-0 hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit">
              <div className="flex w-full flex-col items-start">
                <div className="relative h-9 w-[170px] overflow-hidden">
                  <Link href="/">
                    <Image
                      src="/Logo.png"
                      alt="Cholestify"
                      width={220}
                      height={80}
                      className="absolute left-0 top-1/2 h-auto w-[160px] -translate-y-1/2 object-contain"
                      priority
                    />
                  </Link>
                </div>

                <span className="mt-2 text-xs font-medium text-muted-foreground pl-0">
                  Version 1.0
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavMenuSidebar className="font-semibold" items={data.menu} />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto px-5 pb-4 pt-2"
        />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
    </Sidebar>
  );
}
