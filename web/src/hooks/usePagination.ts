"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// pagination params
export const useQueryPagination = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get("page"));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const setPage = (newPage: number) => {
    const safePage = Math.max(1, newPage);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(safePage));

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return { page, setPage };
};

// pagination items per page
export const getPaginationItems = (current: number, total: number) => {
  if (total <= 1) return [];

  const pages: (number | "...")[] = [];

  // selalu nampil page pertama
  pages.push(1);

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) pages.push("...");

  // always show last
  if (total > 1) pages.push(total);

  return pages;
};
