"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ChevronRight,
  Eye,
  FileText,
  History,
  Home,
  Utensils,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "./ui/button";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  match: string[];
  children?: NavChild[];
};

const navItems: NavItem[] = [
  {
    label: "Beranda",
    href: "/user/dashboard",
    icon: Home,
    match: ["/user/dashboard"],
  },
  {
    label: "Scan",
    href: "/user/scan-mata",
    icon: Eye,
    match: ["/user/scan-mata"],
  },
  {
    label: "Makanan",
    href: "/user/list-makanan",
    icon: Utensils,
    match: ["/user/list-makanan"],
  },
  {
    label: "Laporan",
    href: "/user/laporan",
    icon: FileText,
    match: ["/user/laporan"],
  },
  {
    label: "Metric",
    icon: Activity,
    match: ["/user/metric"],
    children: [
      {
        label: "Data Lipid Panel",
        href: "/user/metric/data-lipid-panel",
      },
      {
        label: "Tujuan Kesehatan",
        href: "/user/metric/tujuan-kesehatan",
      },
      {
        label: "Data Biometrik",
        href: "/user/metric/data-biometrik",
      },
      {
        label: "Pengukuran Harian",
        href: "/user/metric/pengukuran-harian",
      },
    ],
  },
  {
    label: "Riwayat",
    icon: History,
    match: ["/user/riwayat"],
    children: [
      {
        label: "Scan Mata",
        href: "/user/riwayat/scan-mata",
      },
      {
        label: "Lipid Panel",
        href: "/user/riwayat/lipid-panel",
      },
    ],
  },
  {
    label: "Profil",
    icon: UserRound,
    match: ["/user/profile"],
    children: [
      {
        label: "Profile Klinik",
        href: "/user/profile/profile-klinis",
      },
      {
        label: "Target kesehatan",
        href: "/user/profile/target-kesehatan",
      },
      {
        label: "Pengaturan Akun",
        href: "/user/profile/pengaturan-akun",
      },
    ],
  },
];

function isActivePath(pathname: string, match: string[]) {
  return match.some(
    (item) => pathname === item || pathname.startsWith(`${item}/`),
  );
}

function isChildActive(pathname: string, children?: NavChild[]) {
  if (!children) return false;

  return children.some(
    (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const selectedMenu = navItems.find((item) => item.label === openMenu);

  return (
    <>
      {selectedMenu?.children && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] md:hidden"
          onClick={() => setOpenMenu(null)}
        >
          <div
            className="absolute inset-x-4 bottom-[92px] rounded-3xl border border-gray-200 bg-white p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {selectedMenu.label}
                </p>
                <p className="text-xs text-gray-400">
                  Pilih menu yang ingin dibuka
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="grid gap-2">
              {selectedMenu.children.map((child) => {
                const active =
                  pathname === child.href ||
                  pathname.startsWith(`${child.href}/`);

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpenMenu(null)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "border-blue-100 bg-blue-50 text-blue-700"
                        : "border-gray-100 bg-gray-200 text-gray-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <span>{child.label}</span>
                    <ChevronRight size={16} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-1 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="grid grid-cols-7 items-end gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              isActivePath(pathname, item.match) ||
              isChildActive(pathname, item.children);

            if (item.children) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setOpenMenu((prev) =>
                      prev === item.label ? null : item.label,
                    )
                  }
                  className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-2 transition active:scale-95"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-2xl transition ${
                      active || openMenu === item.label
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={17} />
                  </span>

                  <span
                    className={`max-w-full truncate text-[9px] font-medium ${
                      active || openMenu === item.label
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href ?? "#"}
                onClick={() => setOpenMenu(null)}
                className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-2 transition active:scale-95"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-2xl transition ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Icon size={17} />
                </span>

                <span
                  className={`max-w-full truncate text-[9px] font-medium ${
                    active ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
