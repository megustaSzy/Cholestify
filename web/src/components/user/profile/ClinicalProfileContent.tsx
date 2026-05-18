"use client";
import React from "react";
import { ReactNode } from "react";
import {
  Mail,
  Phone,
  Ruler,
  Weight,
  Activity,
  HeartPulse,
  Utensils,
  Dumbbell,
} from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";
import { isAuthError, isNoDataError } from "@/lib/ApiErrorResponse";

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

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-xl flex-shrink-0">
      {initials || "U"}
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
  optimal,
  progressPercent,
}: {
  label: string;
  value: string | number;
  unit: string;
  optimal: string;
  progressPercent: number;
}) {
  return (
    <div className="bg-blue-50/60 rounded-xl p-4 min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>

      <div className="flex items-end gap-0.5 mb-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-xs text-gray-500 mb-0.5">{unit}</span>
      </div>

      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-[9px] text-gray-400 mt-1">Optimal: {optimal}</p>
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

function progress(value?: number, max = 240) {
  if (typeof value !== "number") return 0;
  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}

export default function ClinicalProfileContent() {
  const {
    data: userResponse,
    error: userError,
    isLoading: isUserLoading,
  } = useFetchData<ApiResponse<UserProfile>>("/users/me");

  const {
    data: healthResponse,
    error: healthError,
    isLoading: isHealthLoading,
  } = useFetchData<ApiResponse<HealthSummary>>("/health-summary");

  const {
    data: lipidHistoryResponse,
    error: lipidHistoryError,
    isLoading: isLipidHistoryLoading,
  } = useFetchData<ApiResponse<LipidPanel[]>>("/lipid-panels/me");

  const user = userResponse?.data;
  const healthSummary = healthResponse?.data;
  const biometrics = healthSummary?.biometrics;
  const recommendation = healthSummary?.recommendation;

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
  const email = user?.email ?? "-";
  const phone = user?.notelp ?? "-";
  const lastLipidDate = formatDate(lipidPanel?.date);
  const recommendationDate = formatDate(recommendation?.generatedAt);
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
              <Avatar name={patientName} />

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900">
                  {patientName}
                </h2>

                <p className="text-xs text-gray-400 mt-0.5">
                  Patient ID: {patientId}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail size={12} />
                    {email}
                  </span>

                  <span className="flex items-center gap-1">
                    <Phone size={12} />
                    {phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                label="Height"
                value={toDisplayNumber(biometrics?.height)}
                unit="cm"
                icon={<Ruler size={14} />}
              />

              <StatCard
                label="Weight"
                value={toDisplayNumber(biometrics?.weight)}
                unit="kg"
                icon={<Weight size={14} />}
              />

              <StatCard
                label="BMI"
                value={toDisplayNumber(biometrics?.bmi, 1)}
                unit=""
                icon={<Activity size={14} />}
                extra={
                  biometrics?.bmiCategory ? (
                    <span className="text-[10px] font-semibold text-green-500 bg-green-50 px-1.5 py-0.5 rounded ml-1 mb-0.5">
                      {biometrics.bmiCategory}
                    </span>
                  ) : null
                }
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <HeartPulse size={16} className="text-blue-500" />
                  Recent Lipid Panel
                </h3>

                <span className="text-xs text-gray-400">{lastLipidDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LipidCard
                  label="TOTAL"
                  value={toDisplayNumber(lipidPanel?.totalCholesterol)}
                  unit="mg/dL"
                  optimal="< 200"
                  progressPercent={progress(lipidPanel?.totalCholesterol, 240)}
                />

                <LipidCard
                  label="TRIGLYCERIDES"
                  value={toDisplayNumber(lipidPanel?.triglycerides)}
                  unit="mg/dL"
                  optimal="< 150"
                  progressPercent={progress(lipidPanel?.triglycerides, 200)}
                />

                <LipidCard
                  label="LDL (BAD)"
                  value={toDisplayNumber(lipidPanel?.ldl)}
                  unit="mg/dL"
                  optimal="< 100"
                  progressPercent={progress(lipidPanel?.ldl, 190)}
                />

                <LipidCard
                  label="HDL (GOOD)"
                  value={toDisplayNumber(lipidPanel?.hdl)}
                  unit="mg/dL"
                  optimal="> 60"
                  progressPercent={progress(lipidPanel?.hdl, 100)}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Rekomendasi Kesehatan
                </h3>

                <span className="text-xs text-gray-400">
                  {recommendationDate}
                </span>
              </div>

              {recommendation ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <Utensils
                        size={18}
                        className="text-blue-500 flex-shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Dietary Advice
                        </p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {recommendation.dietaryAdvice ||
                            "Belum ada saran pola makan."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                      <Dumbbell
                        size={18}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Activity Advice
                        </p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {recommendation.activityAdvice ||
                            "Belum ada saran aktivitas."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Belum ada rekomendasi kesehatan. Rekomendasi akan muncul
                  setelah data lipid panel tersedia.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
