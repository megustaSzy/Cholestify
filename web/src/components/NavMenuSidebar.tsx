"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMenuSidebar({
  items,
}: {
  items: {
    name: string;
    url?: string;
    icon: React.ReactNode;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={isParentActive}
                render={<Link href={item.url || "#"} />}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                  isParentActive
                    ? "!text-blue-600 !font-semibold !bg-transparent border-l-[3px] border-blue-600 rounded-none pl-[calc(0.75rem-3px)]"
                    : "border-l-[3px] border-transparent rounded-none pl-[calc(0.75rem-3px)]",
                ].join(" ")}
              >
                <span
                  className={isParentActive ? "text-blue-600" : "text-gray-400"}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </SidebarMenuButton>

              {item.items?.length ? (
                <SidebarMenuSub className="ml-0 border-l-0 pl-0">
                  {item.items.map((sub) => (
                    <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton
                        isActive={pathname === sub.url}
                        render={<Link href={sub.url} />}
                        className={[
                          "flex items-center px-3 py-1.5 rounded-lg transition-all",
                          "ml-9",
                          pathname === sub.url
                            ? "!text-blue-600 !font-semibold !bg-transparent border-l-[3px] border-blue-600 rounded-none"
                            : "text-gray-400 hover:text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent rounded-none",
                        ].join(" ")}
                      >
                        {sub.title}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : null}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
