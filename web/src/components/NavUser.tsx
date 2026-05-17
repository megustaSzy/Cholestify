"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useFetchData } from "@/hooks/useFetchData";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type UserProfile = {
  nama?: string;
  email?: string;
  avatar?: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NavUser() {
  const { isMobile } = useSidebar();

  const { data, isLoading } =
    useFetchData<ApiResponse<UserProfile>>("/users/me");

  const user = data?.data;

  const name = user?.nama || "User";
  const email = user?.email || "Email belum tersedia";
  const avatar = user?.avatar || "";
  const initials = getInitials(name) || "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="hover:bg-transparent active:bg-transparent"
              />
            }
          >
            <Avatar className="size-8 rounded-lg grayscale">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="rounded-lg">
                {isLoading ? "..." : initials}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {isLoading ? "Loading..." : name}
              </span>
              <span className="truncate text-xs text-foreground/70">
                {isLoading ? "Mengambil data..." : email}
              </span>
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
