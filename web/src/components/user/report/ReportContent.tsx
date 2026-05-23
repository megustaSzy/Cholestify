"use client";

import type { CSSProperties } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  AlertTriangle,
  Download,
  FileText,
  Footprints,
  Info,
  Ruler,
  Sparkles,
  TrendingUp,
  Utensils,
  Weight,
  Activity,
  ClipboardList,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";
import { isAuthError, isNoDataError } from "@/lib/ApiErrorResponse";
import Link from "next/link";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
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

type RecommendationOverview = {
  lipidPanel?: LipidPanel | null;
  recommendation?: Recommendation | null;
};

type Biometrics = {
  height?: number;
  weight?: number;
  bmi?: number;
  bmiCategory?: string;
};

type HealthSummary = {
  biometrics?: Biometrics | null;
  lipidPanel?: LipidPanel | null;
  recommendation?: Recommendation | null;
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

function toDisplayNumber(value?: number, fractionDigits = 0) {
  if (typeof value !== "number") return "-";
  return value.toFixed(fractionDigits).replace(/\.0$/, "");
}

function getLipidStatus(totalCholesterol?: number) {
  if (typeof totalCholesterol !== "number") {
    return {
      label: "Data Belum Ada",
      className: "border-gray-100 bg-gray-50 text-gray-500",
      isWarning: false,
    };
  }

  if (totalCholesterol >= 200) {
    return {
      label: "Tindakan Diperlukan",
      className: "border-red-100 bg-red-50 text-red-500",
      isWarning: true,
    };
  }

  return {
    label: "Dalam Rentang Baik",
    className: "border-green-100 bg-green-50 text-green-600",
    isWarning: false,
  };
}

function CholesterolGauge({ value }: { value?: number }) {
  const safeValue = typeof value === "number" ? value : 0;
  const pct = Math.min(safeValue / 300, 1);
  const r = 80;
  const cx = 110;
  const cy = 105;
  const startAngle = Math.PI;
  const endAngle = 0;
  const totalAngle = Math.PI;

  const toXY = (angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  const start = toXY(startAngle);
  const trackEnd = toXY(endAngle);
  const fillEnd = toXY(startAngle + pct * totalAngle);

  const trackD = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`;
  const fillD = `M ${start.x} ${start.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${fillEnd.x} ${fillEnd.y}`;

  return (
    <svg viewBox="0 0 220 120" className="mx-auto h-28 w-52">
      <path
        d={trackD}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d={fillD}
        fill="none"
        stroke={safeValue >= 200 ? "#ef4444" : "#2563eb"}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize="28"
        fill="#111827"
        fontWeight="700"
      >
        {typeof value === "number" ? value : "-"}
      </text>
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fontSize="9"
        fill="#9ca3af"
        letterSpacing="1"
      >
        TOTAL CHOLESTEROL mg/dL
      </text>
    </svg>
  );
}

function HealthAdviceCard({
  dietaryAdvice,
  activityAdvice,
}: {
  dietaryAdvice?: string;
  activityAdvice?: string;
}) {
  return (
    <Card className="w-56 flex-shrink-0 border-blue-700 bg-blue-700 py-5 text-white">
      <CardHeader className="px-5">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-white">
          <Sparkles size={15} className="text-blue-300" />
          Saran Kesehatan
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Utensils size={14} className="text-blue-200" />
            <Badge
              variant="ghost"
              className="h-auto px-0 text-[9px] font-bold tracking-widest text-blue-200 uppercase hover:bg-transparent"
            >
              POLA MAKAN
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-blue-100">
            {dietaryAdvice ||
              "Belum ada saran pola makan. Input lipid panel terlebih dahulu untuk mendapatkan rekomendasi."}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Footprints size={14} className="text-blue-200" />
            <Badge
              variant="ghost"
              className="h-auto px-0 text-[9px] font-bold tracking-widest text-blue-200 uppercase hover:bg-transparent"
            >
              AKTIVITAS
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-blue-100">
            {activityAdvice ||
              "Belum ada saran aktivitas. Rekomendasi akan muncul setelah data lab tersedia."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function BiometricsItem({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">
        {value}{" "}
        {unit && (
          <span className="text-xs font-normal text-gray-400">{unit}</span>
        )}
      </p>
    </div>
  );
}

export default function ReportsContent() {
  const {
    data: overviewResponse,
    error: overviewError,
    isLoading: isOverviewLoading,
  } = useFetchData<ApiResponse<RecommendationOverview>>(
    "/health-recommendations/overview",
  );

  const {
    data: healthSummaryResponse,
    error: healthSummaryError,
    isLoading: isHealthSummaryLoading,
  } = useFetchData<ApiResponse<HealthSummary>>("/health-summary");

  const {
    data: lipidHistoryResponse,
    error: lipidHistoryError,
    isLoading: isLipidHistoryLoading,
  } = useFetchData<ApiResponse<LipidPanel[]>>("/lipid-panels/me");

  const overview = overviewResponse?.data;
  const overviewLipidPanel = overview?.lipidPanel;
  const summaryLipidPanel = healthSummaryResponse?.data?.lipidPanel;
  const lipidHistory = lipidHistoryResponse?.data ?? [];
  const latestHistoryLipidPanel = lipidHistory[0];

  const lipidPanel: LipidPanel | null =
    overviewLipidPanel || summaryLipidPanel || latestHistoryLipidPanel
      ? {
          id:
            overviewLipidPanel?.id ??
            summaryLipidPanel?.id ??
            latestHistoryLipidPanel?.id,
          totalCholesterol:
            overviewLipidPanel?.totalCholesterol ??
            summaryLipidPanel?.totalCholesterol ??
            latestHistoryLipidPanel?.totalCholesterol,
          triglycerides:
            overviewLipidPanel?.triglycerides ??
            summaryLipidPanel?.triglycerides ??
            latestHistoryLipidPanel?.triglycerides,
          ldl:
            overviewLipidPanel?.ldl ??
            summaryLipidPanel?.ldl ??
            latestHistoryLipidPanel?.ldl,
          hdl:
            overviewLipidPanel?.hdl ??
            summaryLipidPanel?.hdl ??
            latestHistoryLipidPanel?.hdl,
          date:
            overviewLipidPanel?.date ??
            summaryLipidPanel?.date ??
            latestHistoryLipidPanel?.date,
          createdAt:
            overviewLipidPanel?.createdAt ??
            summaryLipidPanel?.createdAt ??
            latestHistoryLipidPanel?.createdAt,
          updatedAt:
            overviewLipidPanel?.updatedAt ??
            summaryLipidPanel?.updatedAt ??
            latestHistoryLipidPanel?.updatedAt,
        }
      : null;

  const recommendation =
    overview?.recommendation ?? healthSummaryResponse?.data?.recommendation;

  const biometrics = healthSummaryResponse?.data?.biometrics;

  const lipidStatus = getLipidStatus(lipidPanel?.totalCholesterol);
  const isLoading =
    isOverviewLoading || isHealthSummaryLoading || isLipidHistoryLoading;
  const reportErrors = [overviewError, healthSummaryError, lipidHistoryError];

  const hasAuthError = reportErrors.some(isAuthError);
  const hasNoDataError = reportErrors.some(isNoDataError);

  const hasUnknownError = reportErrors.some((error) => {
    return Boolean(error) && !isAuthError(error) && !isNoDataError(error);
  });

  const isReportDataEmpty =
    !isOverviewLoading &&
    !isHealthSummaryLoading &&
    !isLipidHistoryLoading &&
    !hasAuthError &&
    !hasUnknownError &&
    !lipidPanel &&
    !biometrics &&
    lipidHistory.length === 0;

  const clinicalReports = [
    {
      title: "Riwayat Target Harian",
      description:
        "Lihat riwayat kalori, protein, olahraga, dan catatan makanan harian.",
      href: "/user/history/activity-target",
    },
    {
      title: "Riwayat Screening Mata",
      description:
        "Lihat riwayat hasul dari screening yang telah anda lakukan.",
      href: "/user/history/eye-scan",
    },
    {
      title: "Riwayaat Data Lipid Panel",
      description: "Lihat riwayat lipid panel.",
      href: "/user/history/lipid-panel",
    },
  ];

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gray-50">
      <main className="flex w-full flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-5xl lg:px-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Laporan Kesehatan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Laporan dan jalur perawatan personal Anda
          </p>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
            Memuat laporan kesehatan...
          </div>
        )}

        {hasAuthError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            Sesi login berakhir. Silakan login ulang.
          </div>
        )}

        {!hasAuthError && hasUnknownError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            Gagal mengambil data laporan. Silakan coba lagi.
          </div>
        )}

        {!hasAuthError &&
          !hasUnknownError &&
          (hasNoDataError || isReportDataEmpty) && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-700">
              Buatlah terlebih dahulu metric data diri anda.
            </div>
          )}

        <div className="flex flex-col gap-4 lg:flex-row">
          <Card className="flex-1 border-gray-200 bg-white py-5">
            <CardHeader className="px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Ringkasan Lipid Panel</CardTitle>
                  <CardDescription className="text-xs">
                    Berdasarkan catatan {formatDate(lipidPanel?.date)}
                  </CardDescription>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] ${lipidStatus.className}`}
                >
                  {lipidStatus.isWarning && <AlertTriangle size={10} />}
                  {lipidStatus.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-5">
              <CholesterolGauge value={lipidPanel?.totalCholesterol} />

              <div className="mt-2 grid grid-cols-3 gap-3 px-2">
                <div>
                  <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                    LDL (Kolesterol Buruk)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {toDisplayNumber(lipidPanel?.ldl)}{" "}
                    <span className="text-sm font-normal text-gray-400">
                      mg/dL
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                    HDL ( Kolesterol Baik)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {toDisplayNumber(lipidPanel?.hdl)}{" "}
                    <span className="text-sm font-normal text-gray-400">
                      mg/dL
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                    TRIGLYCERIDES
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {toDisplayNumber(lipidPanel?.triglycerides)}{" "}
                    <span className="text-sm font-normal text-gray-400">
                      mg/dL
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <HealthAdviceCard
            dietaryAdvice={recommendation?.dietaryAdvice}
            activityAdvice={recommendation?.activityAdvice}
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <Card className="flex-1 border-gray-200 bg-white py-5">
            <CardHeader className="px-5">
              <div className="flex items-center justify-between">
                <CardTitle>Laporan Clinical</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3 px-5">
              {clinicalReports.map((report) => (
                <Link
                  key={report.title}
                  href={report.href}
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-200 p-3 transition-all hover:-translate-y-0.5 hover:border-gray-100 hover:bg-gray-100 hover:shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {report.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-gray-500">
                      {report.description}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition group-hover:bg-white group-hover:text-blue-600">
                    <ChevronRight size={16} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="flex-1 border-gray-200 bg-white py-5">
            <CardHeader className="px-5">
              <CardTitle>Biometrics Terkini</CardTitle>
            </CardHeader>

            <CardContent className="px-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <BiometricsItem
                  icon={<Ruler size={15} />}
                  label="Height"
                  value={toDisplayNumber(biometrics?.height)}
                  unit="cm"
                />

                <BiometricsItem
                  icon={<Weight size={15} />}
                  label="Weight"
                  value={toDisplayNumber(biometrics?.weight)}
                  unit="kg"
                />

                <BiometricsItem
                  icon={<Activity size={15} />}
                  label="BMI"
                  value={toDisplayNumber(biometrics?.bmi, 1)}
                  unit=""
                />
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-gray-600">
                <Info
                  size={15}
                  className="mt-0.5 flex-shrink-0 text-blue-500"
                />
                <span>
                  Status BMI:{" "}
                  <span className="font-semibold text-blue-700">
                    {biometrics?.bmiCategory ?? "Belum tersedia"}
                  </span>
                  . Data ini diambil dari ringkasan kesehatan terbaru.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
