"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "user");
  const breadcrumb = segments.map((segment) =>
    segment.replaceAll("-", " ").toUpperCase(),
  );
  // const getTitle = () => {
  //   if (pathname === "/dashboard") return "Dashboard";
  //   if (pathname === "/user/screening") return "Screening";
  //   if (pathname === "/user/profile") return "Profile";

  //   return "Dashboard";
  // };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <div className="flex gap-2 text-sm text-gray-500">
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {item}
              {index < breadcrumb.length - 1 && (
                <span className="mx-0.5">{">"}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
