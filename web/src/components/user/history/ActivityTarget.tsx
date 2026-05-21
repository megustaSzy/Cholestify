"use client";

import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Dumbbell,
  Flame,
  NotebookText,
  Target,
  Utensils,
} from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type HealthGoal = {
  targetWeeklyCalories: number;
  targetExerciseMins: number;
};

type DailyTrackingHistory = {
  id: number;
  date: string;
  calories: number;
  protein: number;
  exerciseMins: number;
  foodNotes: string;
  healthGoal: HealthGoal | null;
};

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
};

type LogMetricCardProps = {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  progress?: number;
};

const formatNumber = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toLocaleString("id-ID");
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getAverage = (values: number[]) => {
  if (values.length === 0) return 0;

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
};

const getProgress = (value: number, target?: number) => {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
};

const getProgressColor = (progress?: number) => {
  if (typeof progress !== "number") return "bg-gray-300";
  if (progress >= 100) return "bg-emerald-500";
  if (progress >= 70) return "bg-blue-600";
  return "bg-amber-500";
};

function PageState({
  variant = "default",
  title,
  description,
}: {
  variant?: "default" | "error";
  title: string;
  description: string;
}) {
  return (
    <Card
      className={`rounded-3xl shadow-sm ${
        variant === "error"
          ? "border-red-200 bg-red-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div
          className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${
            variant === "error"
              ? "bg-red-100 text-red-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          <AlertTriangle className="size-6" />
        </div>

        <h3 className="text-base font-semibold text-gray-950">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ title, value, description, icon }: SummaryCardProps) {
  return (
    <Card className="rounded-3xl border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>

            <p className="mt-2 truncate text-2xl font-bold tracking-tight text-gray-950">
              {value}
            </p>
          </div>

          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            {icon}
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function LogMetricCard({
  label,
  value,
  description,
  icon,
  progress,
}: LogMetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-600">
              {label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <p className="shrink-0 text-sm font-bold text-gray-950">{value}</p>
      </div>

      {typeof progress === "number" && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-gray-700">{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActivityTargetHistoryContent() {
  const {
    data: trackingResponse,
    error,
    isLoading,
  } = useFetchData<ApiResponse<DailyTrackingHistory[]>>(
    "/daily-trackings/history",
  );

  const logs = trackingResponse?.data ?? [];

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const latestLog = sortedLogs[0];
  const latestGoal = latestLog?.healthGoal ?? null;

  const dailyCaloriesTarget = latestGoal?.targetWeeklyCalories
    ? Math.round(latestGoal.targetWeeklyCalories / 7)
    : undefined;

  const dailyExerciseTarget = latestGoal?.targetExerciseMins
    ? Math.round(latestGoal.targetExerciseMins / 7)
    : undefined;

  const lastSevenLogs = sortedLogs.slice(0, 7);

  const averageCalories = getAverage(lastSevenLogs.map((log) => log.calories));
  const averageProtein = getAverage(lastSevenLogs.map((log) => log.protein));
  const averageExercise = getAverage(
    lastSevenLogs.map((log) => log.exerciseMins),
  );

  const caloriesAdherence = getProgress(averageCalories, dailyCaloriesTarget);
  const exerciseAdherence = getProgress(averageExercise, dailyExerciseTarget);

  const latestCaloriesProgress = latestLog
    ? getProgress(latestLog.calories, dailyCaloriesTarget)
    : 0;

  const latestExerciseProgress = latestLog
    ? getProgress(latestLog.exerciseMins, dailyExerciseTarget)
    : 0;

  const latestTargetMet =
    latestCaloriesProgress >= 90 && latestExerciseProgress >= 100;

  return (
    <section className="w-full space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-blue-50/70 px-5 py-4 shadow-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              History Target Aktivitas
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Tinjau kembali aktivitas harian Anda seperti kalori, protein,
              olahraga, dan catatan makanan untuk melihat konsistensi terhadap
              target kesehatan.
            </p>
          </div>

          {latestLog && (
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Log Terakhir
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    latestTargetMet
                      ? "rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700"
                      : "rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-amber-700"
                  }
                >
                  {latestTargetMet ? "Target Met" : "Need Attention"}
                </Badge>

                <span className="text-xs text-muted-foreground">
                  {formatDate(latestLog.date)}
                </span>
              </div>

              <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Status ini dihitung dari progres kalori dan olahraga harian
                dibandingkan target yang tersedia.
              </p>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <PageState
          title="Memuat riwayat daily tracking..."
          description="Mohon tunggu sebentar, data aktivitas Anda sedang dimuat."
        />
      ) : error ? (
        <PageState
          variant="error"
          title="Gagal mengambil riwayat daily tracking"
          description="Pastikan sesi login masih valid, lalu coba muat ulang halaman."
        />
      ) : sortedLogs.length === 0 ? (
        <PageState
          title="Belum ada riwayat daily tracking"
          description="Silakan isi daily tracking terlebih dahulu agar histori aktivitas dapat ditampilkan."
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Average Calories"
              value={`${formatNumber(averageCalories)} kcal`}
              description={
                dailyCaloriesTarget
                  ? `${caloriesAdherence}% dari target harian ${formatNumber(
                      dailyCaloriesTarget,
                    )} kcal`
                  : "Target kalori harian belum tersedia"
              }
              icon={<Flame className="size-5" />}
            />

            <SummaryCard
              title="Average Protein"
              value={`${formatNumber(averageProtein)} g`}
              description="Rata-rata protein dari 7 log terakhir"
              icon={<Utensils className="size-5" />}
            />

            <SummaryCard
              title="Average Exercise"
              value={`${formatNumber(averageExercise)} min`}
              description={
                dailyExerciseTarget
                  ? `${exerciseAdherence}% dari target harian ${formatNumber(
                      dailyExerciseTarget,
                    )} min`
                  : "Target olahraga harian belum tersedia"
              }
              icon={<Dumbbell className="size-5" />}
            />

            <SummaryCard
              title="Latest Food Notes"
              value={latestLog?.foodNotes ? "Tersedia" : "-"}
              description={latestLog?.foodNotes || "Belum ada catatan makanan"}
              icon={<NotebookText className="size-5" />}
            />

            <SummaryCard
              title="Weekly Calories Target"
              value={`${formatNumber(latestGoal?.targetWeeklyCalories)} kcal`}
              description="Target kalori mingguan dari health goal"
              icon={<Target className="size-5" />}
            />

            <SummaryCard
              title="Exercise Target"
              value={`${formatNumber(latestGoal?.targetExerciseMins)} min`}
              description="Target exercise dari health goal"
              icon={<Activity className="size-5" />}
            />
          </div>

          <Card className="overflow-hidden rounded-3xl border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b bg-gray-50/80 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-gray-950">
                    Daily Logs
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Riwayat daily tracking berdasarkan tanggal terbaru.
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="w-fit rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-blue-700"
                >
                  {sortedLogs.length} data
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="divide-y p-0">
              {sortedLogs.map((log) => {
                const logDailyCaloriesTarget = log.healthGoal
                  ? Math.round(log.healthGoal.targetWeeklyCalories / 7)
                  : dailyCaloriesTarget;

                const logDailyExerciseTarget = log.healthGoal
                  ? Math.round(log.healthGoal.targetExerciseMins / 7)
                  : dailyExerciseTarget;

                const caloriesProgress = getProgress(
                  log.calories,
                  logDailyCaloriesTarget,
                );

                const exerciseProgress = getProgress(
                  log.exerciseMins,
                  logDailyExerciseTarget,
                );

                const isTargetMet =
                  caloriesProgress >= 90 && exerciseProgress >= 100;

                return (
                  <article key={log.id} className="px-4 py-5 sm:px-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <CalendarDays className="size-5" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-gray-950 sm:text-base">
                            {formatDate(log.date)}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Kalori, protein, olahraga, target, dan catatan
                            makanan.
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          isTargetMet
                            ? "w-fit rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700"
                            : "w-fit rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-amber-700"
                        }
                      >
                        {isTargetMet ? "Target Met" : "Need Attention"}
                      </Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <LogMetricCard
                        label="Calories"
                        value={`${formatNumber(log.calories)} kcal`}
                        description={
                          logDailyCaloriesTarget
                            ? `Target harian ${formatNumber(
                                logDailyCaloriesTarget,
                              )} kcal`
                            : "Target kalori belum tersedia"
                        }
                        progress={caloriesProgress}
                        icon={<Flame className="size-4" />}
                      />

                      <LogMetricCard
                        label="Protein"
                        value={`${formatNumber(log.protein)} g`}
                        description="Jumlah protein yang tercatat"
                        icon={<Utensils className="size-4" />}
                      />

                      <LogMetricCard
                        label="Exercise"
                        value={`${formatNumber(log.exerciseMins)} min`}
                        description={
                          logDailyExerciseTarget
                            ? `Target harian ${formatNumber(
                                logDailyExerciseTarget,
                              )} min`
                            : "Target exercise belum tersedia"
                        }
                        progress={exerciseProgress}
                        icon={<Dumbbell className="size-4" />}
                      />

                      <LogMetricCard
                        label="Weekly Calories Target"
                        value={`${formatNumber(
                          log.healthGoal?.targetWeeklyCalories,
                        )} kcal`}
                        description="Target kalori mingguan"
                        icon={<Target className="size-4" />}
                      />

                      <LogMetricCard
                        label="Exercise Target"
                        value={`${formatNumber(
                          log.healthGoal?.targetExerciseMins,
                        )} min`}
                        description="Target exercise dari health goal"
                        icon={<Activity className="size-4" />}
                      />

                      <LogMetricCard
                        label="Food Notes"
                        value={log.foodNotes ? "Tersedia" : "-"}
                        description={
                          log.foodNotes || "Tidak ada catatan makanan."
                        }
                        icon={<NotebookText className="size-4" />}
                      />
                    </div>
                  </article>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
