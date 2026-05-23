"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Flame,
  Info,
  InfoIcon,
  Plus,
  ReceiptCent,
  Target,
} from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import { isAuthError, isNoDataError } from "@/lib/ApiErrorResponse";

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
  targetWeeklyCalories: number;
  targetExerciseMins: number;
  createdAt: string;
};

type DailyTracking = {
  id: number;
  date: string;
  calories: number;
  protein: number;
  exerciseMins: number;
  foodNotes?: string;
  healthGoal?: {
    targetWeeklyCalories: number;
    targetExerciseMins: number;
  } | null;
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="h-5 w-1 rounded-full bg-blue-600" />
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

function toDisplayNumber(value?: number | string | null, fractionDigits = 0) {
  if (value === null || value === undefined || value === "") return "-";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "-";

  return numberValue.toLocaleString("id-ID", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function getHigherIsBetterProgress(current?: number, target?: number) {
  if (
    typeof current !== "number" ||
    typeof target !== "number" ||
    current < 0 ||
    target <= 0
  ) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
}

function getProgressBadge(progress: number) {
  if (progress >= 100) return "ACHIEVED";

  return `${progress}% COMPLETE`;
}

function getBadgeClass(progress: number) {
  if (progress >= 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 40) return "bg-amber-500";

  return "bg-gray-400";
}

function TargetCard({
  title,
  subtitle,
  current,
  target,
  unit,
  progressPercent,
  footer,
}: {
  title: string;
  subtitle: string;
  current: string | number;
  target: string | number;
  unit: string;
  progressPercent: number;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-gray-800">
            {title}
          </span>
        </div>

        <span
          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold text-white ${getBadgeClass(
            progressPercent,
          )}`}
        >
          {getProgressBadge(progressPercent)}
        </span>
      </div>

      <p className="text-[10px] text-gray-400">{subtitle}</p>

      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-gray-900">{current}</span>
        <span className="mb-1 text-sm text-gray-400">
          / {target} {unit}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${
            progressPercent >= 100 ? "bg-green-500" : "bg-blue-600"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {footer && <div className="mt-1">{footer}</div>}
    </div>
  );
}

function HistoryMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="px-5 py-3 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

function HistoryItem({
  goal,
}: {
  goal: HealthGoal;
  isActive: boolean;
  sequenceNumber: number;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <CalendarDays size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Data Tujuan Kesehatan Terakhir
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
              Dibuat pada {formatDate(goal.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 border-t border-gray-100 bg-gray-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <HistoryMetric
          label="Kalori per Minggu"
          value={`${toDisplayNumber(goal.targetWeeklyCalories)} kcal`}
        />

        <HistoryMetric
          label="Durasi Olahraga per Minggu"
          value={`${toDisplayNumber(goal.targetExerciseMins)} min`}
        />
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

  const { data: trackingResponse } = useFetchData<ApiResponse<DailyTracking[]>>(
    "/daily-trackings/history",
  );

  const goals = useMemo(() => {
    const data = Array.isArray(goalsResponse?.data) ? goalsResponse.data : [];

    return [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [goalsResponse]);

  const goalSequenceMap = useMemo(() => {
    const data = Array.isArray(goalsResponse?.data) ? goalsResponse.data : [];

    return new Map<number, number>(
      [...data]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map((goal, index) => [goal.id, index + 1]),
    );
  }, [goalsResponse]);

  const dailyTrackings = useMemo(() => {
    const data = Array.isArray(trackingResponse?.data)
      ? trackingResponse.data
      : [];

    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [trackingResponse]);

  const latestGoal = goals[0];
  const latestSevenTrackings = dailyTrackings.slice(0, 7);

  const currentWeeklyCalories = latestSevenTrackings.reduce(
    (total, item) => total + item.calories,
    0,
  );

  const currentWeeklyExercise = latestSevenTrackings.reduce(
    (total, item) => total + item.exerciseMins,
    0,
  );

  const caloriesProgress = getHigherIsBetterProgress(
    currentWeeklyCalories,
    latestGoal?.targetWeeklyCalories,
  );

  const exerciseProgress = getHigherIsBetterProgress(
    currentWeeklyExercise,
    latestGoal?.targetExerciseMins,
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

  const latestHistoryGoal = goals[0];

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gray-50">
      <div className="flex flex-1 gap-0">
        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full flex-col gap-5 lg:max-w-[900px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Target Kesehatan
                </h1>

                <p className="mt-0.5 text-sm text-gray-500">
                  Pelacakan akurat untuk target kalori dan aktivitas Anda.
                </p>
              </div>

              <Link
                href="/user/metric/tujuan-kesehatan"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
              >
                <Plus size={15} />
                Buat Target
              </Link>
            </div>

            {isGoalsLoading && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
                Loading...
              </div>
            )}

            {goalsAuthError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                Sesi login berakhir. Silakan login ulang.
              </div>
            )}

            {goalsUnknownError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                Gagal mengambil data target kesehatan. Silakan coba lagi.
              </div>
            )}

            {!goalsAuthError &&
              !goalsUnknownError &&
              (goalsNoDataError || isGoalsDataEmpty) && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-700">
                  Belum ada target kesehatan. Buat target pertama agar progress
                  kalori dan aktivitas dapat dipantau.
                </div>
              )}

            <div>
              <SectionLabel>Target Kesehatan Saat Ini</SectionLabel>

              {latestGoal ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <TargetCard
                    title="Weekly Calories"
                    subtitle="Progress dari 7 daily tracking terbaru"
                    current={toDisplayNumber(currentWeeklyCalories)}
                    target={toDisplayNumber(latestGoal.targetWeeklyCalories)}
                    unit="kcal/week"
                    progressPercent={caloriesProgress}
                    footer={
                      <p className="text-[10px] text-gray-400">
                        {latestSevenTrackings.length > 0
                          ? `${latestSevenTrackings.length} daily tracking tercatat`
                          : "Belum ada daily tracking"}
                      </p>
                    }
                  />

                  <TargetCard
                    title="Weekly Exercise"
                    subtitle="Progress olahraga dari 7 daily tracking terbaru"
                    current={toDisplayNumber(currentWeeklyExercise)}
                    target={toDisplayNumber(latestGoal.targetExerciseMins)}
                    unit="mins/week"
                    progressPercent={exerciseProgress}
                    footer={
                      <p className="text-[10px] text-gray-400">
                        Target dibuat: {formatDate(latestGoal.createdAt)}
                      </p>
                    }
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
                  Belum ada target kesehatan. Klik{" "}
                  <Link
                    href="/user/metric/tujuan-kesehatan"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    disini
                  </Link>{" "}
                  untuk membuat target pertama.
                </div>
              )}
            </div>

            <div>
              <SectionLabel>Riwayat Tujuan Kesehatan</SectionLabel>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {latestHistoryGoal ? (
                  <HistoryItem
                    key={latestHistoryGoal.id}
                    goal={latestHistoryGoal}
                    isActive
                    sequenceNumber={
                      goalSequenceMap.get(latestHistoryGoal.id) ?? goals.length
                    }
                  />
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-500">
                    Belum ada riwayat target kesehatan.
                  </div>
                )}
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2.5 justify-center">
                  <InfoIcon className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" />
                  <span>
                    Data tujuan kesehatan terakhir akan ditampilkan di atas.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
