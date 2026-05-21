"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  TrendingUp,
} from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type LipidPanel = {
  id: number;
  date: string;
  totalCholesterol: number;
  ldl: number;
  hdl: number;
  triglycerides?: number;
  createdAt?: string;
  updatedAt?: string;
};

type LipidStatus = "Normal" | "High" | "Beresiko";

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatNumber = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toLocaleString("id-ID");
};

const getLipidStatus = (lipid: LipidPanel): LipidStatus => {
  const triglycerides = lipid.triglycerides ?? 0;

  if (
    lipid.ldl >= 130 ||
    lipid.totalCholesterol >= 240 ||
    triglycerides >= 200
  ) {
    return "Beresiko";
  }

  if (
    lipid.ldl >= 100 ||
    lipid.totalCholesterol >= 200 ||
    triglycerides >= 150 ||
    lipid.hdl < 40
  ) {
    return "High";
  }

  return "Normal";
};

const statusClass: Record<LipidStatus, string> = {
  Normal:
    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  High: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
  Beresiko: "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
};

const statusDescription: Record<LipidStatus, string> = {
  Normal: "Kondisi lipid terakhir terlihat stabil.",
  High: "Ada beberapa nilai yang perlu diperhatikan.",
  Beresiko: "Nilai lipid terakhir masuk kategori berisiko.",
};

function TrendValue({
  value,
  previousValue,
  goodWhenHigher = false,
}: {
  value?: number;
  previousValue?: number;
  goodWhenHigher?: boolean;
}) {
  const hasValue = typeof value === "number";
  const hasTrend = hasValue && typeof previousValue === "number";

  if (!hasValue) return <span>-</span>;

  const isUp = hasTrend ? value > previousValue : false;
  const isDown = hasTrend ? value < previousValue : false;

  const isGood =
    hasTrend && ((goodWhenHigher && isUp) || (!goodWhenHigher && isDown));

  const colorClass =
    !hasTrend || value === previousValue
      ? "text-gray-950"
      : isGood
        ? "text-emerald-600"
        : "text-red-600";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 ${colorClass}`}
    >
      {formatNumber(value)}
      {isUp && <ArrowUp className="size-3.5" />}
      {isDown && <ArrowDown className="size-3.5" />}
    </span>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-50">
        <AlertTriangle className="size-6 text-amber-600" />
      </div>

      <h3 className="text-base font-semibold text-gray-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: ReactNode;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <div className="mt-2 text-2xl font-bold text-gray-950">{value}</div>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function MobileLipidCard({
  lipid,
  previousLipid,
}: {
  lipid: LipidPanel;
  previousLipid?: LipidPanel;
}) {
  const status = getLipidStatus(lipid);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tanggal Pemeriksaan
          </p>
          <h3 className="mt-1 text-base font-semibold text-gray-950">
            {formatDate(lipid.date)}
          </h3>
        </div>

        <Badge
          variant="outline"
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[status]}`}
        >
          {status}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-muted-foreground">LDL</p>
          <p className="mt-1 text-sm font-semibold">
            <TrendValue value={lipid.ldl} previousValue={previousLipid?.ldl} />
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-muted-foreground">HDL</p>
          <p className="mt-1 text-sm font-semibold">
            <TrendValue
              value={lipid.hdl}
              previousValue={previousLipid?.hdl}
              goodWhenHigher
            />
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 text-sm font-semibold">
            <TrendValue
              value={lipid.totalCholesterol}
              previousValue={previousLipid?.totalCholesterol}
            />
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-muted-foreground">Triglycerides</p>
          <p className="mt-1 text-sm font-semibold text-gray-950">
            {formatNumber(lipid.triglycerides)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function LipidPanelHistoryContent() {
  const {
    data: lipidResponse,
    isLoading,
    error,
  } = useFetchData<ApiResponse<LipidPanel[]>>("/lipid-panels/me");

  const lipidPanels = useMemo(() => {
    const data = lipidResponse?.data ?? [];

    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [lipidResponse?.data]);

  const [page, setPage] = useState(1);
  const limit = 10;

  const totalItems = lipidPanels.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const currentPage = Math.min(page, totalPages);

  const shouldShowPagination = totalItems > limit;

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const startRecord = totalItems === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(endIndex, totalItems);

  const paginatedLipids = lipidPanels.slice(startIndex, endIndex);

  const latestLipid = lipidPanels[0];
  const previousLipid = lipidPanels[1];
  const latestStatus = latestLipid ? getLipidStatus(latestLipid) : null;

  const handlePrev = () => {
    setPage(Math.max(currentPage - 1, 1));
  };

  const handleNext = () => {
    setPage(Math.min(currentPage + 1, totalPages));
  };

  return (
    <section className="w-full space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-blue-50/70 px-5 py-4 shadow-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Lipid Panel History
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Tinjau kembali hasil pemeriksaan lipid panel Anda untuk memantau
              perubahan LDL, HDL, kolesterol total, dan triglycerides dari waktu
              ke waktu.
            </p>
          </div>

          {latestLipid && latestStatus && (
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status Terakhir
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 ${statusClass[latestStatus]}`}
                >
                  {latestStatus}
                </Badge>
              </div>

              <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                {statusDescription[latestStatus]}
              </p>
            </div>
          )}
        </div>
      </div>

      {latestLipid && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Latest LDL"
            value={
              <TrendValue
                value={latestLipid.ldl}
                previousValue={previousLipid?.ldl}
              />
            }
            description="LDL lebih rendah umumnya lebih baik."
            icon={<TrendingUp className="size-5" />}
          />

          <SummaryCard
            label="Latest HDL"
            value={
              <TrendValue
                value={latestLipid.hdl}
                previousValue={previousLipid?.hdl}
                goodWhenHigher
              />
            }
            description="HDL lebih tinggi umumnya lebih baik."
            icon={<HeartPulse className="size-5" />}
          />

          <SummaryCard
            label="Total Cholesterol"
            value={
              <TrendValue
                value={latestLipid.totalCholesterol}
                previousValue={previousLipid?.totalCholesterol}
              />
            }
            description="Perbandingan dengan pemeriksaan sebelumnya."
            icon={<TrendingUp className="size-5" />}
          />

          <SummaryCard
            label="Last Checkup"
            value={formatDate(latestLipid.date)}
            description="Tanggal pemeriksaan lipid panel terakhir."
            icon={<CalendarDays className="size-5" />}
          />
        </div>
      )}

      <Card className="overflow-hidden rounded-3xl border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b bg-white px-5 py-6 sm:px-6">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <TrendingUp className="size-5" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
              Histori Data Lipid
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Data terbaru ditampilkan di bagian atas. Panah menunjukkan
              perubahan dibanding pemeriksaan sebelumnya.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="hidden w-full overflow-x-auto md:block">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    LDL
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    HDL
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Total
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Triglycerides
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-40 text-center text-sm text-muted-foreground"
                    >
                      Memuat riwayat lipid panel...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Riwayat lipid panel gagal dimuat"
                        description="Pastikan sesi login masih valid, lalu coba muat ulang halaman."
                      />
                    </TableCell>
                  </TableRow>
                ) : lipidPanels.length > 0 ? (
                  paginatedLipids.map((lipid, index) => {
                    const globalIndex = (currentPage - 1) * limit + index;
                    const previousItem = lipidPanels[globalIndex + 1];
                    const status = getLipidStatus(lipid);

                    return (
                      <TableRow
                        key={lipid.id}
                        className="h-16 transition-colors hover:bg-blue-50/40"
                      >
                        <TableCell className="text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                          {formatDate(lipid.date)}
                        </TableCell>

                        <TableCell className="text-center text-sm font-semibold">
                          <TrendValue
                            value={lipid.ldl}
                            previousValue={previousItem?.ldl}
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-semibold">
                          <TrendValue
                            value={lipid.hdl}
                            previousValue={previousItem?.hdl}
                            goodWhenHigher
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-semibold">
                          <TrendValue
                            value={lipid.totalCholesterol}
                            previousValue={previousItem?.totalCholesterol}
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-semibold text-gray-950">
                          {formatNumber(lipid.triglycerides)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`min-w-24 justify-center rounded-full px-3 py-1 ${statusClass[status]}`}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Belum ada riwayat lipid panel"
                        description="Silakan input lipid panel terlebih dahulu agar riwayat pemeriksaan dapat ditampilkan."
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {isLoading ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-muted-foreground">
                Memuat riwayat lipid panel...
              </div>
            ) : error ? (
              <EmptyState
                title="Riwayat lipid panel gagal dimuat"
                description="Pastikan sesi login masih valid, lalu coba muat ulang halaman."
              />
            ) : lipidPanels.length > 0 ? (
              paginatedLipids.map((lipid, index) => {
                const globalIndex = (currentPage - 1) * limit + index;
                const previousItem = lipidPanels[globalIndex + 1];

                return (
                  <MobileLipidCard
                    key={lipid.id}
                    lipid={lipid}
                    previousLipid={previousItem}
                  />
                );
              })
            ) : (
              <EmptyState
                title="Belum ada riwayat lipid panel"
                description="Silakan input lipid panel terlebih dahulu agar riwayat pemeriksaan dapat ditampilkan."
              />
            )}
          </div>

          {shouldShowPagination && (
            <div className="flex flex-col gap-3 border-t bg-gray-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-center text-sm text-muted-foreground sm:text-left">
                Menampilkan{" "}
                <span className="font-semibold text-gray-950">
                  {startRecord}
                </span>{" "}
                sampai{" "}
                <span className="font-semibold text-gray-950">{endRecord}</span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-950">
                  {totalItems}
                </span>{" "}
                data
              </p>

              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="size-9 rounded-full"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <span className="min-w-20 text-center text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="size-9 rounded-full"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
