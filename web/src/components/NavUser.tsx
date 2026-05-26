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
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarUrl(src?: string | null) {
  if (!src) return "";

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
    /\/api\/?$/,
    "",
  );

  if (!apiOrigin) return src;

  return `${apiOrigin}${src.startsWith("/") ? src : `/${src}`}`;
}

export function NavUser() {
  const { data, isLoading } = useCurrentUser();

  const user = data?.data;

  const name = user?.nama || user?.name || "User";
  const email = user?.email || "Email belum tersedia";

  const avatar = getAvatarUrl(
    user?.avatarUrl ?? user?.avatar ?? user?.imageUrl ?? user?.profileImage,
  );

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
            <Avatar className="size-8 rounded-lg">
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
