"use client";

import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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

function UserAvatar({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .join("")
    .slice(0, 1)
    .toUpperCase();

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
      {src ? (
        <Image
          src={src}
          alt={name || "User avatar"}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      ) : (
        initials || "U"
      )}
    </div>
  );
}

export default function MobileTopHeader() {
  const { data } = useCurrentUser();

  const user = data?.data;
  const displayName = user?.nama ?? "User";

  const avatarUrl = getAvatarUrl(
    user?.avatarUrl ?? user?.avatar ?? user?.imageUrl ?? user?.profileImage,
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-[150px] overflow-hidden">
            <Image
              src="/Logo.png"
              alt="Cholestify"
              width={220}
              height={80}
              className="absolute left-0 top-1/2 h-auto w-[145px] -translate-y-1/2 object-contain"
              priority
            />
          </div>
        </Link>

        <Link href="/user/profile/profile-klinis">
          <UserAvatar name={displayName} src={avatarUrl} />
        </Link>
      </div>
    </header>
  );
}
