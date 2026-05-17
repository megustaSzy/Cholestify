"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export function useFetchData<T>(endpoint: string, params?: URLSearchParams) {
  const key = params ? `${endpoint}?${params.toString()}` : endpoint;

  const { data, error, isLoading, mutate } = useSWR<T>(
    endpoint ? key : null,
    fetcher,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
