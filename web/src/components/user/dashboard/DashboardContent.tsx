"use client";

import { useFetchData } from "@/hooks/useFetchData";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  FlaskConical,
  Info,
  Ruler,
  ScanSearch,
  Weight,
} from "lucide-react";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type Biometrics = {
  height?: number;
  weight?: number;
  bmi?: number;
  bmiCategory?: string;
};

type LipidPanel = {
  id?: number;
  date?: string;
  totalCholesterol?: number;
  ldl?: number;
  hdl?: number;
  createdAt?: string;
  updatedAt?: string;
};

type HealthSummary = {
  biometrics?: Biometrics | null;
  lipidPanel?: LipidPanel | null;
};

type HealthGoal = {
  id: number;
  targetLdlHdlRatio: number;
  targetWeeklyCalories: number;
  targetExerciseMins: number;
  dietaryAdvice: string;
  activityAdvice: string;
  createdAt: string;
};

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

function formatTodayBadge() {
  return new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

function toDisplayNumber(value?: number, fractionDigits = 0) {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionDigits).replace(/\.0$/, "");
}

function getCholesterolProgress(value?: number) {
  if (typeof value !== "number") return 0;
  return Math.min(100, Math.max(0, Math.round((value / 240) * 100)));
}

function getCholesterolDelta(totalCholesterol?: number) {
  if (typeof totalCholesterol !== "number") return "-";
  if (totalCholesterol < 200) return "Optimal";
  if (totalCholesterol < 240) return "Borderline";
  return "High";
}

function getActionMessage(
  lipidPanel?: LipidPanel | null,
  latestGoal?: HealthGoal,
) {
  if (latestGoal?.dietaryAdvice) {
    return {
      title: "Saran Kesehatan",
      description: latestGoal.dietaryAdvice,
      actionLabel: "Lihat Saran",
    };
  }

  if (!lipidPanel) {
    return {
      title: "Data Lipid Belum Ada",
      description:
        "Tambahkan hasil lipid panel agar dashboard dapat menampilkan ringkasan kesehatan.",
      actionLabel: "Tambah Data",
    };
  }

  if (
    (typeof lipidPanel.totalCholesterol === "number" &&
      lipidPanel.totalCholesterol >= 200) ||
    (typeof lipidPanel.ldl === "number" && lipidPanel.ldl >= 100)
  ) {
    return {
      title: "Perhatian",
      description:
        "Nilai kolesterol atau LDL berada di atas rentang optimal. Pertimbangkan konsultasi dengan tenaga medis.",
      actionLabel: "Tinjau Data",
    };
  }

  return {
    title: "Kondisi Stabil",
    description:
      "Data terbaru berada dalam rentang yang baik. Pertahankan pola makan dan aktivitas fisik.",
    actionLabel: "Lihat Detail",
  };
}

function MiniMetricCard({
  label,
  value,
  unit,
  icon,
  status,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  status?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </p>
        <span className="text-gray-400">{icon}</span>
      </div>

      <div className="flex items-end gap-1">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <span className="mb-1 text-xs text-gray-500">{unit}</span>

        {status && (
          <span className="mb-1 ml-2 rounded bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-500">{description}</p>
      </div>

      <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
        {status}
      </span>
    </div>
  );
}

export default function DashboardContent() {
  const {
    data: healthResponse,
    error: healthError,
    isLoading: isHealthLoading,
  } = useFetchData<ApiResponse<HealthSummary>>("/health-summary");

  const { data: lipidHistoryResponse, isLoading: isLipidHistoryLoading } =
    useFetchData<ApiResponse<LipidPanel[]>>("/lipid-panels/me");

  const { data: healthGoalsResponse } =
    useFetchData<ApiResponse<HealthGoal[]>>("/health-goals/me");

  const healthSummary = healthResponse?.data;
  const biometrics = healthSummary?.biometrics;
  const lipidPanel = healthSummary?.lipidPanel;

  const latestLipidHistory = lipidHistoryResponse?.data?.[0];
  const latestGoal = healthGoalsResponse?.data?.[0];

  const actionMessage = getActionMessage(lipidPanel, latestGoal);
  const cholesterolProgress = getCholesterolProgress(
    lipidPanel?.totalCholesterol,
  );

  return (
    <main className="w-full px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <section className="rounded-2xl border border-gray-200 bg-[#fbfbff] p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-950">
                Ringkasan Kesehatan Harian
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Data vital dan riwayat terbaru Anda.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              Hari ini, {formatTodayBadge()}
            </div>
          </div>

          {isHealthLoading && (
            <div className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
              Memuat data dashboard...
            </div>
          )}

          {healthError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              Gagal mengambil data dashboard. Pastikan cookie login masih valid.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  Total Cholesterol
                </h2>
                <Info className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <div
                  className="relative flex h-36 w-36 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#2563eb ${cholesterolProgress}%, #e5e7eb 0)`,
                  }}
                >
                  <div className="absolute h-28 w-28 rounded-full bg-white" />
                  <div className="relative text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {toDisplayNumber(lipidPanel?.totalCholesterol)}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-gray-500">
                      mg/dL
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex w-full items-center justify-between text-xs">
                  <span className="rounded bg-blue-50 px-2 py-1 font-bold uppercase text-blue-700">
                    {getCholesterolDelta(lipidPanel?.totalCholesterol)}
                  </span>
                  <span className="font-semibold text-blue-700">
                    {lipidPanel?.date ? formatDate(lipidPanel.date) : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                BMI Info
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniMetricCard
                  label="Height"
                  value={toDisplayNumber(biometrics?.height)}
                  unit="cm"
                  icon={<Ruler className="h-4 w-4" />}
                />

                <MiniMetricCard
                  label="Weight"
                  value={toDisplayNumber(biometrics?.weight)}
                  unit="kg"
                  icon={<Weight className="h-4 w-4" />}
                />

                <MiniMetricCard
                  label="BMI"
                  value={toDisplayNumber(biometrics?.bmi, 1)}
                  unit=""
                  icon={<Activity className="h-4 w-4" />}
                  status={biometrics?.bmiCategory}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Aktivitas Terbaru
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                <ActivityItem
                  icon={<ScanSearch className="h-4 w-4" />}
                  title="BMI Check"
                  description={`Height ${toDisplayNumber(
                    biometrics?.height,
                  )} cm • Weight ${toDisplayNumber(biometrics?.weight)} kg`}
                  status={biometrics ? "Clear" : "Empty"}
                />

                <ActivityItem
                  icon={<FlaskConical className="h-4 w-4" />}
                  title="Lipid Panel Lab"
                  description={
                    isLipidHistoryLoading
                      ? "Memuat riwayat lipid panel..."
                      : `Terakhir: ${formatDate(
                          latestLipidHistory?.date ?? lipidPanel?.date,
                        )}`
                  }
                  status={
                    latestLipidHistory || lipidPanel ? "Reviewed" : "Empty"
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tindakan Diperlukan
                </h2>
                <button className="text-gray-400">•••</button>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                    {actionMessage.title === "Kondisi Stabil" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {actionMessage.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      {actionMessage.description}
                    </p>

                    <button className="mt-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                      {actionMessage.actionLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
