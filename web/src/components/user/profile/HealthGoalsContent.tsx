"use client";
import React from "react";
import {
  Plus,
  TrendingDown,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  CalendarDays,
} from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";
import { isAuthError, isNoDataError } from "@/lib/ApiErrorResponse";
import type { ReactNode } from "react";
import Link from "next/link";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type HealthGoal = {
  id: number;
  targetLdlHdlRatio: number;
  targetWeeklyCalories: number;
  targetExerciseMins: number;
  createdAt: string;
};

type RecommendationOverview = {
  lipidPanel?: {
    totalCholesterol?: number;
    ldl?: number;
    hdl?: number;
    triglycerides?: number;
    date?: string;
  } | null;
  recommendation?: {
    dietaryAdvice?: string;
    activityAdvice?: string;
    generatedAt?: string;
  } | null;
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-5 bg-blue-600 rounded-full" />
      <h2 className="text-base font-bold text-gray-900">{children}</h2>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDisplayNumber(value?: number, fractionDigits = 0) {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionDigits).replace(/\.0$/, "");
}

function calculateLdlHdlRatio(ldl?: number, hdl?: number) {
  if (typeof ldl !== "number" || typeof hdl !== "number" || hdl <= 0) {
    return undefined;
  }

  return ldl / hdl;
}

function getLowerIsBetterProgress(current?: number, target?: number) {
  if (
    typeof current !== "number" ||
    typeof target !== "number" ||
    current <= 0 ||
    target <= 0
  ) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((target / current) * 100)));
}

function getProgressBadge(progress: number) {
  if (progress >= 100) return "ACHIEVED";
  if (progress >= 75) return `${progress}% COMPLETE`;
  if (progress > 0) return `${progress}% PROGRESS`;
  return "TARGET SET";
}

function TargetCard({
  title,
  subtitle,
  current,
  target,
  unit,
  icon,
  iconBg,
  badgeColor,
  progressPercent,
  footer,
}: {
  title: string;
  subtitle: string;
  current: string | number;
  target: string | number;
  unit: string;
  icon: ReactNode;
  iconBg: string;
  badgeColor: string;
  progressPercent: number;
  footer?: ReactNode;
}) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
          >
            {icon}
          </div>
          <span className="text-sm font-semibold text-gray-800 truncate">
            {title}
          </span>
        </div>

        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap ${badgeColor}`}
        >
          {getProgressBadge(progressPercent)}
        </span>
      </div>

      <p className="text-[10px] text-gray-400">{subtitle}</p>

      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-gray-900">{current}</span>
        <span className="text-sm text-gray-400 mb-1">
          / {target} {unit}
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {footer && <div className="mt-1">{footer}</div>}
    </div>
  );
}

function HistoryItem({ goal }: { goal: HealthGoal }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={18} className="text-green-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          Health Goal #{goal.id}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          LDL/HDL {goal.targetLdlHdlRatio} • {goal.targetWeeklyCalories}{" "}
          kcal/week • {goal.targetExerciseMins} mins/week
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider block">
          SAVED
        </span>
        <span className="text-[10px] text-gray-400">
          {formatDate(goal.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default function HealthGoalsContent() {
  const {
    data: goalsResponse,
    error: goalsError,
    isLoading: isGoalsLoading,
  } = useFetchData<ApiResponse<HealthGoal[]>>("/health-goals/me");

  const {
    data: overviewResponse,
    error: overviewError,
    isLoading: isOverviewLoading,
  } = useFetchData<ApiResponse<RecommendationOverview>>(
    "/health-recommendations/overview",
  );

  const goals = goalsResponse?.data ?? [];
  const latestGoal = goals[0];
  const pastGoals = goals.slice(1);

  const overview = overviewResponse?.data;
  const lipidPanel = overview?.lipidPanel;
  const recommendation = overview?.recommendation;

  const currentRatio = calculateLdlHdlRatio(lipidPanel?.ldl, lipidPanel?.hdl);
  const ratioProgress = getLowerIsBetterProgress(
    currentRatio,
    latestGoal?.targetLdlHdlRatio,
  );

  const goalsAuthError = isAuthError(goalsError);
  const goalsNoDataError = isNoDataError(goalsError);

  const goalsUnknownError =
    Boolean(goalsError) && !goalsAuthError && !goalsNoDataError;

  const isGoalsDataEmpty =
    !isGoalsLoading &&
    !goalsAuthError &&
    !goalsUnknownError &&
    goals.length === 0;

  return (
    <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
      <div className="flex flex-1 gap-0">
        <main className="flex-1 px-4 py-6 flex flex-col gap-5 max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Target Kesehatan
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Pelacakan akurat untuk target kolesterol dan vitalitas Anda.
              </p>
            </div>

            <Link
              href="/user/metric/set-health-goals"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={15} />
              New Goal
            </Link>
          </div>

          {isGoalsLoading && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
              Loading health goals...
            </div>
          )}

          {goalsAuthError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">
              Sesi login berakhir. Silakan login ulang.
            </div>
          )}

          {goalsUnknownError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">
              Gagal mengambil data health goals. Silakan coba lagi.
            </div>
          )}

          {!goalsAuthError &&
            !goalsUnknownError &&
            (goalsNoDataError || isGoalsDataEmpty) && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-700">
                Buatlah terlebih dahulu metric data diri anda.
              </div>
            )}

          <div>
            <SectionLabel>Target Kesehatan Saat ini</SectionLabel>

            {latestGoal ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TargetCard
                  title="LDL/HDL Ratio"
                  subtitle="Clinical Priority: High"
                  current={
                    typeof currentRatio === "number"
                      ? toDisplayNumber(currentRatio, 2)
                      : "-"
                  }
                  target={toDisplayNumber(latestGoal.targetLdlHdlRatio, 2)}
                  unit="ratio"
                  icon={<TrendingDown size={18} className="text-blue-500" />}
                  iconBg="bg-blue-50"
                  badgeColor="bg-blue-500"
                  progressPercent={ratioProgress}
                  footer={
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>Latest lab: {formatDate(lipidPanel?.date)}</span>
                      <Link
                        href="/user/metric/log-lipid-panel"
                        className="text-blue-600 font-semibold flex items-center gap-0.5 hover:underline"
                      >
                        Update Labs <ArrowRight size={10} />
                      </Link>
                    </div>
                  }
                />

                <TargetCard
                  title="Weekly Calories"
                  subtitle="Target metabolic intake"
                  current={toDisplayNumber(latestGoal.targetWeeklyCalories)}
                  target={toDisplayNumber(latestGoal.targetWeeklyCalories)}
                  unit="kcal/week"
                  icon={<Flame size={18} className="text-orange-400" />}
                  iconBg="bg-orange-50"
                  badgeColor="bg-orange-400"
                  progressPercent={100}
                  footer={
                    <p className="text-[10px] text-gray-400">
                      Created: {formatDate(latestGoal.createdAt)}
                    </p>
                  }
                />

                <TargetCard
                  title="Weekly Exercise"
                  subtitle="Target physical activity"
                  current={toDisplayNumber(latestGoal.targetExerciseMins)}
                  target={toDisplayNumber(latestGoal.targetExerciseMins)}
                  unit="mins/week"
                  icon={<Dumbbell size={18} className="text-green-500" />}
                  iconBg="bg-green-50"
                  badgeColor="bg-green-500"
                  progressPercent={100}
                  footer={
                    <p className="text-[10px] text-gray-400">
                      Created: {formatDate(latestGoal.createdAt)}
                    </p>
                  }
                />
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
                Belum ada target kesehatan. Klik{" "}
                <Link
                  href="/user/metric/set-health-goals"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  New Goal
                </Link>{" "}
                untuk membuat target pertama.
              </div>
            )}
          </div>

          <div>
            <SectionLabel>Rekomendasi Kesehatan</SectionLabel>

            <div className="bg-[#8B2E0F] rounded-2xl p-5 flex gap-4 relative overflow-hidden w-full">
              <div className="flex-1 flex flex-col gap-3 z-10">
                <h3 className="text-lg font-bold text-white leading-snug">
                  Rekomendasi Kesehatan
                </h3>

                <p className="text-sm text-orange-100 leading-relaxed">
                  {recommendation?.dietaryAdvice ||
                    "Belum ada rekomendasi pola makan. Rekomendasi akan muncul setelah data lipid panel tersedia."}
                </p>

                {recommendation?.activityAdvice && (
                  <p className="text-sm text-orange-100 leading-relaxed">
                    {recommendation.activityAdvice}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[10px] text-orange-100">
                  <CalendarDays size={12} />
                  Generated: {formatDate(recommendation?.generatedAt)}
                </div>

                <Link
                  href="/user/metric/log-lipid-panel"
                  className="self-start mt-1 px-4 py-2 bg-white text-[#8B2E0F] text-sm font-bold rounded-xl hover:bg-orange-50 transition-colors"
                >
                  Update Labs
                </Link>
              </div>

              <div className="hidden sm:flex flex-shrink-0 w-28 items-center justify-center z-10">
                <div className="w-24 h-24 rounded-full bg-teal-400/80 flex items-center justify-center shadow-lg">
                  <div className="w-20 h-20 rounded-full bg-teal-300 flex items-center justify-center text-3xl">
                    🥗
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-orange-700/30 rounded-full blur-2xl" />
            </div>
          </div>

          <div>
            <SectionLabel>Riwayat Tujuan Kesehatan</SectionLabel>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {pastGoals.length > 0 ? (
                pastGoals.map((goal) => (
                  <HistoryItem key={goal.id} goal={goal} />
                ))
              ) : (
                <div className="px-5 py-4 text-sm text-gray-500">
                  Belum ada riwayat target sebelumnya.
                </div>
              )}
            </div>

            {goals.length > 0 && (
              <div className="flex justify-center mt-3">
                <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                  View Full History
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
