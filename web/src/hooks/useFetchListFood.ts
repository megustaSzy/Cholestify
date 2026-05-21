"use client";

import { useMemo } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useQueryPagination } from "@/hooks/usePagination";

type FoodStatus = "OPTIMAL" | "NEUTRAL" | "LIMIT";

type FoodListMeta = {
  status?: number;
  ldlGroup?: string;
  page?: number;
  limit?: number;
  totalItems?: number;
  totalPages?: number;
  prev?: string | null;
  next?: string | null;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: FoodListMeta;
  data: T;
};

type UseFetchListFoodOptions = {
  endpoint?: string;
  limit?: number;
  search?: string;
  status?: FoodStatus;
};

export function useFetchListFood<T>({
  endpoint = "/foods",
  limit = 10,
  search = "",
  status,
}: UseFetchListFoodOptions = {}) {
  const { page, setPage } = useQueryPagination();

  const params = useMemo(() => {
    const query = new URLSearchParams();

    query.set("page", String(page));
    query.set("limit", String(limit));

    if (search.trim()) {
      query.set("search", search.trim());
    }

    if (status) {
      query.set("status", status);
    }

    return query;
  }, [page, limit, search, status]);

  const { data, error, isLoading, mutate } = useFetchData<ApiResponse<T>>(
    endpoint,
    params,
  );

  return {
    data: data?.data,
    metadata: data?.metadata,
    error,
    isLoading,
    mutate,
    page,
    setPage,
    totalPages: data?.metadata?.totalPages ?? 1,
    totalItems: data?.metadata?.totalItems ?? 0,
    limit: data?.metadata?.limit ?? limit,
    ldlGroup: data?.metadata?.ldlGroup,
    prev: data?.metadata?.prev,
    next: data?.metadata?.next,
  };
}