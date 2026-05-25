"use client";

import { useFetchData } from "@/hooks/useFetchData";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Info,
  Ruler,
  Weight,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

// function getCholesterolProgress(value?: number) {
//   if (typeof value !== "number") return 0;
//   return Math.min(100, Math.max(0, Math.round((value / 240) * 100)));
// }

function getCholesterolDelta(totalCholesterol?: number) {
  if (typeof totalCholesterol !== "number") return "-";
  if (totalCholesterol < 200) return "Optimal";
  if (totalCholesterol < 240) return "Waspada";
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
      href: "/user/laporan",
    };
  }

  if (!lipidPanel) {
    return {
      title: "Data Lipid Belum Ada",
      description:
        "Tambahkan hasil lipid panel agar dashboard dapat menampilkan ringkasan kesehatan.",
      actionLabel: "Tambah Data",
      href: "/user/metric/data-lipid-panel",
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
      href: "/user/riwayat/lipid-panel",
    };
  }

  return {
    title: "Kondisi Stabil",
    description:
      "Data terbaru berada dalam rentang yang baik. Pertahankan pola makan dan aktivitas fisik.",
    actionLabel: "Lihat Detail",
    href: "/user/riwayat/lipid-panel",
  };
}

function MiniMetricCard({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string;
  unit: string;
  status?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </p>
      </div>

      <div className="flex items-end gap-1">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <span className="mb-1 text-xs text-gray-500">{unit}</span>

        {status && (
          <span className="mb-1 ml-2 rounded bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
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
  const router = useRouter();
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
  // const cholesterolProgress = getCholesterolProgress(
  //   lipidPanel?.totalCholesterol,
  // );

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
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full">
                  <div className="absolute h-28 w-28 rounded-full bg-white" />
                  <div className="relative text-center">
                    <p className="text-5xl font-bold text-gray-900">
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
                  label="Tinggi Badan"
                  value={toDisplayNumber(biometrics?.height)}
                  unit="cm"
                />

                <MiniMetricCard
                  label="Berat Badan"
                  value={toDisplayNumber(biometrics?.weight)}
                  unit="kg"
                />

                <MiniMetricCard
                  label="BMI"
                  value={toDisplayNumber(biometrics?.bmi, 1)}
                  unit=""
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
                  title="BMI Check"
                  description={`Tinggi Badan ${toDisplayNumber(
                    biometrics?.height,
                  )} cm, dan Berat Badan ${toDisplayNumber(biometrics?.weight)} kg`}
                  status={biometrics ? "Selesai" : "Kosong"}
                />

                <ActivityItem
                  title="Lipid Panel"
                  description={
                    isLipidHistoryLoading
                      ? "Memuat riwayat lipid panel..."
                      : `Terakhir: ${formatDate(
                          latestLipidHistory?.date ?? lipidPanel?.date,
                        )}`
                  }
                  status={
                    latestLipidHistory || lipidPanel ? "Ditinjau" : "Kosong"
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tindakan Diperlukan
                </h2>
              </div>

              <div className="rounded-xl border bg-gray-50/80 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold text-gray-900">
                      {actionMessage.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      {actionMessage.description}
                    </p>

                    <button
                      onClick={() => {
                        if (actionMessage.href) {
                          router.push(actionMessage.href);
                        }
                      }}
                      className="mt-3 rounded-md border border-gray-300 bg-gray-300 px-4 py-2 text-xs font-semibold shadow-sm hover:bg-gray-200 hover:shadow hover:text-gray-700"
                    >
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
