"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      const isParentActive =
        pathname === item.url ||
        item.items?.some((sub) => pathname === sub.url);
      if (isParentActive) initial[item.name] = true;
    });
    return initial;
  });

  const toggleItem = (name: string) => {
    setOpenItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);
          const isOpen = openItems[item.name] ?? false;

          if (item.items?.length) {
            return (
              <Collapsible
                key={item.name}
                open={isOpen}
                onOpenChange={() => toggleItem(item.name)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    className={[
                      "flex items-center gap-3 px-3 py-2 transition-all w-full",
                      "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                      isParentActive
                        ? "text-blue-600 font-semibold bg-transparent border-l-[3px] border-blue-600 pl-[calc(0.75rem-3px)]"
                        : "border-l-[3px] border-transparent pl-[calc(0.75rem-3px)]",
                    ].join(" ")}
                  >
                    <span className={isParentActive ? "text-blue-600" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left text-sm">{item.name}</span>
                    <ChevronRight
                      className={[
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isOpen ? "rotate-90" : "rotate-0",
                      ].join(" ")}
                    />
                  </CollapsibleTrigger>

                  <CollapsibleContent>
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
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

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
                <span className={isParentActive ? "text-blue-600" : "text-gray-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}