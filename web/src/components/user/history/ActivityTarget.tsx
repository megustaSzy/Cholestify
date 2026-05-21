"use client";

import {
  Activity,
  AlertTriangle,
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
  icon: React.ReactNode;
};

type LogMetricCardProps = {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  progress?: number;
};

const formatNumber = (value?: number) => {
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

function SummaryCard({ title, value, description, icon }: SummaryCardProps) {
  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-950">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
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
    <div className="rounded-lg border bg-[#f7f7fb] px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-700">
          {icon}
          {label}
        </div>

        <p className="text-sm font-bold text-gray-950">{value}</p>
      </div>

      <p className="text-xs text-muted-foreground">{description}</p>

      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${progress}%` }}
          />
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

  return (
    <section className="w-full">
      <header className="mb-5">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          History Target Aktivitas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tinjau kembali hasil aktivitas harian historis Anda dibandingkan
          dengan tujuan klinis yang telah ditetapkan untuk melacak kepatuhan
          jangka panjang.
        </p>
      </header>

      {isLoading ? (
        <Card className="rounded-xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Memuat riwayat daily tracking...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="rounded-xl border-red-200 bg-red-50 shadow-sm">
          <CardContent className="flex items-start gap-3 p-6 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            Gagal mengambil riwayat daily tracking.
          </CardContent>
        </Card>
      ) : sortedLogs.length === 0 ? (
        <Card className="rounded-xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Belum ada riwayat daily tracking. Silakan isi daily tracking
            terlebih dahulu.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Average Calories"
              value={`${formatNumber(averageCalories)} kcal`}
              description={
                dailyCaloriesTarget
                  ? `${caloriesAdherence}% dari target harian ${formatNumber(
                      dailyCaloriesTarget,
                    )} kcal`
                  : "Target kalori belum tersedia"
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
                  : "Target olahraga belum tersedia"
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

          <Card className="overflow-hidden rounded-xl border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b bg-[#f7f7fb] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-950">
                  Daily Logs
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  History daily tracking
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {sortedLogs.map((log, index) => {
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
                  <div
                    key={log.id}
                    className={
                      index !== sortedLogs.length - 1
                        ? "border-b px-5 py-6"
                        : "px-5 py-6"
                    }
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-gray-950">
                        {formatDate(log.date)}
                      </h3>

                      <Badge
                        variant="secondary"
                        className={
                          isTargetMet
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                            : "bg-red-50 text-red-600 hover:bg-red-50"
                        }
                      >
                        {isTargetMet ? "Target Met" : "Missed Target"}
                      </Badge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                        icon={<Flame className="size-3.5" />}
                      />

                      <LogMetricCard
                        label="Protein"
                        value={`${formatNumber(log.protein)} g`}
                        description="Jumlah protein yang tercatat"
                        icon={<Utensils className="size-3.5" />}
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
                        icon={<Dumbbell className="size-3.5" />}
                      />

                      <LogMetricCard
                        label="Weekly Calories Target"
                        value={`${formatNumber(
                          log.healthGoal?.targetWeeklyCalories,
                        )} kcal`}
                        description="Target kalori mingguan"
                        icon={<Target className="size-3.5" />}
                      />

                      <LogMetricCard
                        label="Exercise Target"
                        value={`${formatNumber(
                          log.healthGoal?.targetExerciseMins,
                        )} min`}
                        description="Target exercise dari health goal"
                        icon={<Activity className="size-3.5" />}
                      />

                      <LogMetricCard
                        label="Food Notes"
                        value={log.foodNotes ? "Tersedia" : "-"}
                        description={
                          log.foodNotes || "Tidak ada catatan makanan."
                        }
                        icon={<NotebookText className="size-3.5" />}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
