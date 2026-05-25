"use client";

import { useFetchData } from "@/hooks/useFetchData";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

export type CurrentUser = {
  id?: number | string;
  nama?: string;
  name?: string;
  email?: string;
  notelp?: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  imageUrl?: string;
  profileImage?: string;
  dob?: string;
  bloodType?: string;
};

export function useCurrentUser() {
  return useFetchData<ApiResponse<CurrentUser>>("/users/me", undefined, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    shouldRetryOnError: false,
    dedupingInterval: 5 * 60_000,
  });
}