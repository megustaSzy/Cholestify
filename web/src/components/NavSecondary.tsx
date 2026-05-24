"use client";

import * as React from "react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavSecondaryItem = {
  title: string;
  url?: string;
  icon: React.ReactNode;
  onClick?: () => void | Promise<void>;
};

export function NavSecondary({
  items,
  ...props
}: {
  items: NavSecondaryItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [confirmItem, setConfirmItem] = React.useState<NavSecondaryItem | null>(
    null,
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirmLogout = async () => {
    if (!confirmItem?.onClick) return;

    try {
      setIsLoading(true);
      await confirmItem.onClick();
    } finally {
      setIsLoading(false);
      setConfirmItem(null);
    }
  };

  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.onClick ? (
                  <SidebarMenuButton
                    onClick={() => setConfirmItem(item)}
                    className=" hover:bg-gray-200 "
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton render={<Link href={item.url || "#"} />}>
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {confirmItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 ">
              {confirmItem.icon}
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-bold text-gray-950">
                Keluar dari akun?
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Anda akan keluar dari sesi saat ini. Pastikan semua perubahan
                sudah tersimpan sebelum melanjutkan.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmItem(null)}
                disabled={isLoading}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoading}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Keluar..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
