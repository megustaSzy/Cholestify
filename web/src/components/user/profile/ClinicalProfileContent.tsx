"use client";
import React from "react";
import { ReactNode } from "react";
import { CalendarDays, Droplets, Mail, Phone } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";
import { isAuthError, isNoDataError } from "@/lib/ApiErrorResponse";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Image from "next/image";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status: number;
  };
  data: T;
};

type UserProfile = {
  id?: number | string;
  nama?: string;
  email?: string;
  notelp?: string;
  dob?: string | null;
  bloodType?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  imageUrl?: string | null;
  profileImage?: string | null;
};

type Biometrics = {
  height?: number;
  weight?: number;
  bmi?: number;
  bmiCategory?: string;
};

type LipidPanel = {
  id?: number;
  totalCholesterol?: number;
  triglycerides?: number;
  ldl?: number;
  hdl?: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Recommendation = {
  dietaryAdvice?: string;
  activityAdvice?: string;
  generatedAt?: string;
};

type HealthSummary = {
  biometrics?: Biometrics | null;
  lipidPanel?: LipidPanel | null;
  recommendation?: Recommendation | null;
};

function Avatar({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-xl font-semibold text-gray-700">
      {src ? (
        <Image
          src={src}
          alt={name || "User avatar"}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        initials || "U"
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon,
  extra,
}: {
  label: string;
  value: string | number;
  unit: string;
  icon?: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>

      <div className="flex items-end gap-1 mt-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500 mb-0.5">{unit}</span>
        {extra}
      </div>
    </div>
  );
}

function LipidCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="bg-blue-50/80 rounded-xl p-4 min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>

      <div className="flex items-end gap-0.5 mb-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-xs text-gray-500 mb-0.5">{unit}</span>
      </div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toDisplayNumber(value?: number, fractionDigits = 0) {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionDigits).replace(/\.0$/, "");
}

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

export default function ClinicalProfileContent() {
  const {
    data: userResponse,
    error: userError,
    isLoading: isUserLoading,
  } = useCurrentUser();

  const {
    data: healthResponse,
    error: healthError,
    isLoading: isHealthLoading,
  } = useFetchData<ApiResponse<HealthSummary>>("/health-summary");

  const {
    data: lipidHistoryResponse,
    error: lipidHistoryError,
    isLoading: isLipidHistoryLoading,
  } = useFetchData<ApiResponse<LipidPanel[]>>(
    "/lipid-panels/me?page=1&limit=1",
  );

  const user = userResponse?.data;
  const healthSummary = healthResponse?.data;
  const biometrics = healthSummary?.biometrics;

  const summaryLipidPanel = healthSummary?.lipidPanel ?? null;
  const latestHistoryLipidPanel = lipidHistoryResponse?.data?.[0] ?? null;

  const lipidPanel: LipidPanel | null =
    summaryLipidPanel || latestHistoryLipidPanel
      ? {
          id: summaryLipidPanel?.id ?? latestHistoryLipidPanel?.id,
          totalCholesterol:
            summaryLipidPanel?.totalCholesterol ??
            latestHistoryLipidPanel?.totalCholesterol,
          triglycerides:
            summaryLipidPanel?.triglycerides ??
            latestHistoryLipidPanel?.triglycerides,
          ldl: summaryLipidPanel?.ldl ?? latestHistoryLipidPanel?.ldl,
          hdl: summaryLipidPanel?.hdl ?? latestHistoryLipidPanel?.hdl,
          date: summaryLipidPanel?.date ?? latestHistoryLipidPanel?.date,
          createdAt:
            summaryLipidPanel?.createdAt ?? latestHistoryLipidPanel?.createdAt,
          updatedAt:
            summaryLipidPanel?.updatedAt ?? latestHistoryLipidPanel?.updatedAt,
        }
      : null;

  const patientName = user?.nama ?? "User";
  const patientId = user?.id ? `#HC-${String(user.id).padStart(4, "0")}` : "-";
  // const email = user?.email ?? "-";
  // const phone = user?.notelp ?? "-";
  const birthDate = formatDate(user?.dob ?? undefined);
  const bloodType = user?.bloodType ?? "-";
  const patientAvatar = getAvatarUrl(
    user?.avatarUrl ?? user?.avatar ?? user?.imageUrl ?? user?.profileImage,
  );
  const lastLipidDate = formatDate(lipidPanel?.date);
  const clinicalErrors = [userError, healthError, lipidHistoryError];

  const hasAuthError = clinicalErrors.some(isAuthError);
  const hasNoDataError = clinicalErrors.some(isNoDataError);

  const hasUnknownError = clinicalErrors.some((error) => {
    return Boolean(error) && !isAuthError(error) && !isNoDataError(error);
  });

  const isClinicalDataEmpty =
    !isUserLoading &&
    !isHealthLoading &&
    !isLipidHistoryLoading &&
    !hasAuthError &&
    !hasUnknownError &&
    !biometrics &&
    !lipidPanel;
  return (
    <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
      <div className="flex flex-1 gap-0">
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-8">
          <div className="w-full max-w-[900px] mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profil Klinis
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Kelola informasi klinis dan metrik kesehatan Anda.
              </p>
            </div>

            {(isUserLoading || isHealthLoading || isLipidHistoryLoading) && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
                Loading clinical profile...
              </div>
            )}

            {hasAuthError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">
                Sesi login berakhir. Silakan login ulang.
              </div>
            )}

            {!hasAuthError && hasUnknownError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">
                Gagal mengambil data profile. Silakan coba lagi.
              </div>
            )}

            {!hasAuthError &&
              !hasUnknownError &&
              (hasNoDataError || isClinicalDataEmpty) && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-700">
                  Buatlah terlebih dahulu metric data diri anda.
                </div>
              )}

            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
              <Avatar name={patientName} src={patientAvatar} />

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900">
                  {patientName}
                </h2>

                <p className="text-xs text-gray-400 mt-0.5">
                  ID: {patientId}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    Tanggal Lahir: {birthDate}
                  </span>

                  <span className="flex items-center gap-1">
                    <Droplets size={12} />
                    Gol. Darah: {bloodType}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                label="Tinggi Badan"
                value={toDisplayNumber(biometrics?.height)}
                unit="cm"
              />

              <StatCard
                label="Berat Badan"
                value={toDisplayNumber(biometrics?.weight)}
                unit="kg"
              />

              <StatCard
                label="BMI"
                value={toDisplayNumber(biometrics?.bmi, 1)}
                unit=""
                extra={
                  biometrics?.bmiCategory ? (
                    <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded ml-1 mb-0.5">
                      {biometrics.bmiCategory}
                    </span>
                  ) : null
                }
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  Data Lipid Terakhir
                </h3>

                <span className="text-xs text-gray-500">{lastLipidDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LipidCard
                  label="TOTAL"
                  value={toDisplayNumber(lipidPanel?.totalCholesterol)}
                  unit="mg/dL"
                />

                <LipidCard
                  label="TRIGLYCERIDES"
                  value={toDisplayNumber(lipidPanel?.triglycerides)}
                  unit="mg/dL"
                />

                <LipidCard
                  label="LDL (Jahat)"
                  value={toDisplayNumber(lipidPanel?.ldl)}
                  unit="mg/dL"
                />

                <LipidCard
                  label="HDL (Baik)"
                  value={toDisplayNumber(lipidPanel?.hdl)}
                  unit="mg/dL"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
