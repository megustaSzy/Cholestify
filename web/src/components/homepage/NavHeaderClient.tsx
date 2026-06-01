"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";
import Image from "next/image";
import { useFetchData } from "@/hooks/useFetchData";

type NavHeaderClientProps = {
  hasToken: boolean;
};

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
  name?: string;
  email?: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  imageUrl?: string | null;
  profileImage?: string | null;
};

function getAvatarUrl(src?: string | null) {
  if (!src) return null;

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

function UserIconButton({
  name,
  avatar,
}: {
  name: string;
  avatar?: string | null;
}) {
  if (avatar) {
    return (
      <Link
        href="/user/dashboard"
        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-md transition hover:ring-2 hover:ring-blue-100"
        aria-label="Go to dashboard"
      >
        <Image
          src={avatar}
          alt={name || "User avatar"}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      </Link>
    );
  }

  return (
    <Link
      href="/user/dashboard"
      className="flex h-10 w-12 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-50"
      aria-label="Go to dashboard"
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v1.5c0 .28.22.5.5.5h15c.28 0 .5-.22.5-.5V18c0-2.66-5.33-4-8-4Z" />
      </svg>
    </Link>
  );
}

export default function NavHeaderClient({ hasToken }: NavHeaderClientProps) {
  const pathname = usePathname();

  const { data: userResponse } = useFetchData<ApiResponse<UserProfile>>(
    hasToken ? "/users/me" : null,
  );

  const user = userResponse?.data;
  const userName = user?.nama ?? user?.name ?? "User";

  const avatarUrl = getAvatarUrl(
    user?.avatarUrl ?? user?.avatar ?? user?.imageUrl ?? user?.profileImage,
  );

  const menus = [
    { label: "Home", href: "/" },
    { label: "Kandungan Makanan", href: "/food-directory" },
    { label: "Scan Mata", href: "/user/scan-mata" },
    { label: "Kalkulator RHR", href: "/calculator-hdr" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm group/nav">
      <Input type="checkbox" id="mobile-menu" className="hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo.png"
            alt="Cholestify"
            width={150}
            height={40}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {menus.map(({ label, href }) => {
            const active = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-blue-600 border-b-2 border-blue-600 pb-0.5"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {hasToken ? (
            <UserIconButton name={userName} avatar={avatarUrl} />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-800 hover:bg-gray-400 hover:text-white transition-colors bg-gray-300 rounded-lg px-4 py-2"
              >
                Masuk
              </Link>

              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95"
              >
                Mulai Sekarang
              </Link>
            </>
          )}
        </div>

        <label
          htmlFor="mobile-menu"
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <svg
            className="w-5 h-5 block group-has-[:checked]/nav:hidden"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>

          <svg
            className="w-5 h-5 hidden group-has-[:checked]/nav:block"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
      </div>

      <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg max-h-0 overflow-hidden opacity-0 group-has-[:checked]/nav:max-h-[32rem] group-has-[:checked]/nav:opacity-100 transition-all duration-300 ease-in-out">
        <div className="px-4 sm:px-6 pb-5 pt-2 flex flex-col gap-2">
          {menus.map(({ label, href }) => {
            const active = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-medium py-3 text-center rounded-lg transition-colors ${
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <hr className="border-gray-100 my-2" />

          {hasToken ? (
            <Link
              href="/user/dashboard"
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-800 hover:bg-gray-400 hover:text-white transition-colors py-2 text-center rounded-lg bg-gray-300"
              >
                Masuk
              </Link>

              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95 text-center"
              >
                Mulai Sekarang
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
