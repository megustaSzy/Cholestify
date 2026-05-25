"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

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
import { API } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { isAuthError, isNoDataError } from "@/lib/ApiErrorResponse";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginationItems } from "@/hooks/usePagination";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
    prev?: string | null;
    next?: string | null;
  };
  data: T;
};

const LIMIT = 10;

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

type ApiErrorLike = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      metadata?: {
        status?: number;
      };
    };
  };
  message?: string;
};

function getApiResponseMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;

  const apiError = error as ApiErrorLike;

  return (
    apiError.response?.data?.message ||
    apiError.response?.data?.error ||
    fallback
  );
}

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
}: {
  value?: number;
  previousValue?: number;
  goodWhenHigher?: boolean;
}) {
  return (
    <span className={`inline-flex items-center justify-center gap-1`}>
      {formatNumber(value)}
    </span>
  );
}

function EmptyState({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description: string;
  variant?: "default" | "error" | "info" | "warning";
}) {
  const colorClass =
    variant === "error"
      ? "text-red-600"
      : variant === "warning"
        ? "text-amber-600"
        : variant === "info"
          ? "text-blue-600"
          : "text-gray-950";

  const descriptionClass =
    variant === "error"
      ? "text-red-500"
      : variant === "warning"
        ? "text-amber-600"
        : variant === "info"
          ? "text-blue-600"
          : "text-muted-foreground";

  return (
    <div className="mx-auto flex min-h-40 max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <h3 className={`text-base font-semibold ${colorClass}`}>{title}</h3>

      <p className={`mt-2 text-sm leading-relaxed ${descriptionClass}`}>
        {description}
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: ReactNode;
  description: string;
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
          {/* <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </div> */}
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
  const [page, setPage] = useState(1);

  const {
    data: lipidResponse,
    isLoading,
    error,
  } = useFetchData<ApiResponse<LipidPanel[]>>(
    `/lipid-panels/me?page=${page}&limit=${LIMIT}`,
  );

  const lipidPanels = Array.isArray(lipidResponse?.data)
    ? lipidResponse.data
    : [];

  const metadata = lipidResponse?.metadata;

  const hasAuthError = isAuthError(error);
  const hasNoDataError = isNoDataError(error);

  const hasUnknownError = Boolean(error) && !hasAuthError && !hasNoDataError;

  const emptyLipidMessage = getApiResponseMessage(
    error,
    "Riwayat lipid panel belum ada.",
  );

  const totalItems = metadata?.totalItems ?? lipidPanels.length;
  const totalPages = Math.max(1, metadata?.totalPages ?? 1);
  const currentPage = metadata?.page ?? page;
  const currentLimit = metadata?.limit ?? LIMIT;

  const shouldShowPagination =
    totalItems > currentLimit && !hasAuthError && !hasUnknownError;

  const startRecord =
    totalItems === 0 ? 0 : (currentPage - 1) * currentLimit + 1;

  const endRecord = Math.min(currentPage * currentLimit, totalItems);

  const latestLipid = lipidPanels[0];
  const previousLipid = lipidPanels[1];
  const latestStatus = latestLipid ? getLipidStatus(latestLipid) : null;

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloadingPdf(true);

      const response = await API.get<Blob>("/lipid-panels/me/export/pdf", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `riwayat-lipid-panel-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF riwayat lipid panel berhasil diunduh.");
    } catch (error) {
      if (isNoDataError(error)) {
        toast.info("Riwayat lipid panel belum ada.", {
          description: getApiResponseMessage(
            error,
            "Belum ada data yang bisa diunduh.",
          ),
        });
        return;
      }

      if (isAuthError(error)) {
        toast.error("Sesi login berakhir.", {
          description: "Silakan login ulang lalu coba unduh PDF kembali.",
        });
        return;
      }

      if (axios.isAxiosError(error)) {
        toast.error("Gagal mengunduh PDF riwayat lipid panel.", {
          description:
            error.response?.data?.message ||
            "Terjadi kendala saat membuat file PDF.",
        });
        return;
      }

      toast.error("Gagal mengunduh PDF riwayat lipid panel.", {
        description: "Silakan coba lagi beberapa saat.",
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  return (
    <section className="w-full space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-blue-50/70 px-5 py-4 shadow-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Riwayat Lipid Panel
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
            // icon={<TrendingUp className="size-5" />}
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
            // icon={<HeartPulse className="size-5" />}
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
            // icon={<TrendingUp className="size-5" />}
          />

          <SummaryCard
            label="Last Checkup"
            value={formatDate(latestLipid.date)}
            description="Tanggal pemeriksaan lipid panel terakhir."
            // icon={<CalendarDays className="size-5" />}
          />
        </div>
      )}

      <Card className="overflow-hidden rounded-3xl border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
                Tabel Riwayat Data
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Data terbaru ditampilkan di bagian atas. Panah menunjukkan
                perubahan dibanding pemeriksaan sebelumnya.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={
                isDownloadingPdf ||
                isLoading ||
                hasAuthError ||
                hasUnknownError ||
                lipidPanels.length === 0
              }
              className="w-full gap-2 rounded-xl border-gray-100 bg-gray-200 text-gray-700 hover:bg-gray-100 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Mengunduh..." : "Unduh PDF"}
            </Button>
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
                ) : hasAuthError ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Sesi login berakhir"
                        description="Silakan login ulang untuk melihat riwayat lipid panel Anda."
                        variant="error"
                      />
                    </TableCell>
                  </TableRow>
                ) : hasNoDataError ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Riwayat lipid panel belum ada"
                        description={emptyLipidMessage}
                        variant="error"
                      />
                    </TableCell>
                  </TableRow>
                ) : lipidPanels.length > 0 ? (
                  lipidPanels.map((lipid, index) => {
                    const previousItem = lipidPanels[index + 1];
                    const status = getLipidStatus(lipid);

                    return (
                      <TableRow
                        key={lipid.id}
                        className="h-16 transition-colors hover:bg-blue-50/40"
                      >
                        <TableCell className="text-center text-xs font-extrabold uppercase tracking-wide text-gray-700">
                          {formatDate(lipid.date)}
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <TrendValue
                            value={lipid.ldl}
                            previousValue={previousItem?.ldl}
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <TrendValue
                            value={lipid.hdl}
                            previousValue={previousItem?.hdl}
                            goodWhenHigher
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <TrendValue
                            value={lipid.totalCholesterol}
                            previousValue={previousItem?.totalCholesterol}
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium text-gray-950">
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
                ) : hasUnknownError ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Riwayat lipid panel belum berhasil dimuat"
                        description="Terjadi kendala saat mengambil data. Silakan muat ulang halaman atau coba lagi beberapa saat."
                        variant="warning"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Riwayat lipid panel belum ada"
                        description="Silakan input lipid panel terlebih dahulu agar riwayat pemeriksaan dapat ditampilkan."
                        variant="error"
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
            ) : hasAuthError ? (
              <EmptyState
                title="Sesi login berakhir"
                description="Silakan login ulang untuk melihat riwayat lipid panel Anda."
                variant="error"
              />
            ) : hasNoDataError ? (
              <EmptyState
                title="Riwayat lipid panel belum ada"
                description={emptyLipidMessage}
                variant="error"
              />
            ) : lipidPanels.length > 0 ? (
              lipidPanels.map((lipid, index) => {
                const previousItem = lipidPanels[index + 1];

                return (
                  <MobileLipidCard
                    key={lipid.id}
                    lipid={lipid}
                    previousLipid={previousItem}
                  />
                );
              })
            ) : hasUnknownError ? (
              <EmptyState
                title="Riwayat lipid panel belum berhasil dimuat"
                description="Terjadi kendala saat mengambil data. Silakan muat ulang halaman atau coba lagi beberapa saat."
                variant="warning"
              />
            ) : (
              <EmptyState
                title="Riwayat lipid panel belum ada"
                description="Silakan input lipid panel terlebih dahulu agar riwayat pemeriksaan dapat ditampilkan."
                variant="error"
              />
            )}
          </div>

          {shouldShowPagination && (
            <div className="border-t bg-white px-5 py-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-700">
                    {startRecord}
                  </span>{" "}
                  Sampai{" "}
                  <span className="font-semibold text-gray-700">
                    {endRecord}
                  </span>{" "}
                  Dari{" "}
                  <span className="font-semibold text-gray-700">
                    {totalItems}
                  </span>{" "}
                  Data
                </p>

                <div className="flex justify-center">
                  <Pagination className="mx-auto w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePrev}
                          aria-disabled={currentPage === 1 || isLoading}
                          className={
                            currentPage === 1 || isLoading
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPaginationItems(currentPage, totalPages).map(
                        (pageItem, index) => (
                          <PaginationItem key={`${pageItem}-${index}`}>
                            {pageItem === "..." ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                href={`?page=${pageItem}`}
                                isActive={currentPage === pageItem}
                                onClick={(event) => {
                                  event.preventDefault();
                                  setPage(pageItem);
                                }}
                                className="cursor-pointer"
                              >
                                {pageItem}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ),
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNext}
                          aria-disabled={
                            currentPage === totalPages || isLoading
                          }
                          className={
                            currentPage === totalPages || isLoading
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>

                <div className="hidden md:block" aria-hidden="true" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
