"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { fetcher } from "@/lib/utils";

export function useFetchData<T>(
  endpoint: string | null,
  params?: URLSearchParams,
  options?: SWRConfiguration<T>,
) {
  const key = endpoint
    ? params
      ? `${endpoint}?${params.toString()}`
      : endpoint
    : null;

  const { data, error, isLoading, mutate } = useSWR<T>(key, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 60_000,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}