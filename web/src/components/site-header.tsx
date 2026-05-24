"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { User } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const rawSegments = pathname.split("/").filter(Boolean);
  const disabledBreadcrumbSegments = ["metric", "riwayat", "profile"];

  const breadcrumbItems = rawSegments
    .map((segment, index) => {
      const href = "/" + rawSegments.slice(0, index + 1).join("/");
      return { segment, href };
    })
    .filter(({ segment }) => segment !== "user")
    .map((item) => ({
      ...item,
      label: item.segment.replaceAll("-", " ").toUpperCase(),
    }));

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-white">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />

          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-vertical:self-auto"
          />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="font-medium text-gray-600 transition hover:text-blue-600"
                >
                  HOMEPAGE
                </BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                const isDisabled = disabledBreadcrumbSegments.includes(
                  item.segment,
                );

                return (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : isDisabled ? (
                        <span className="cursor-default font-medium text-gray-500">
                          {item.label}
                        </span>
                      ) : (
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Link
          href="/user/profile/pengaturan-akun"
          className="ml-auto mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-600 sm:size-9"
          aria-label="Buka pengaturan akun"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v1.5c0 .28.22.5.5.5h15c.28 0 .5-.22.5-.5V18c0-2.66-5.33-4-8-4Z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
