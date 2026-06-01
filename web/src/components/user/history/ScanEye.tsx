"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  ImageIcon,
} from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type EyeScanHistory = {
  id: number;
  userId?: number;
  imageUrl?: string;
  result: string;
  confidence?: number;
  description?: string;
  recommendation?: string;
  probabilities?: {
    normal?: number;
    beresiko?: number;
    kolesterol?: number;
  };
  createdAt: string;
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

const LIMIT = 10;

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

function normalizeResult(result?: string) {
  return result?.toLowerCase().replace(/_/g, " ").trim() ?? "";
}

function getStatusLabel(result?: string) {
  const normalized = normalizeResult(result);

  if (
    normalized.includes("normal") ||
    normalized.includes("tidak terdeteksi") ||
    normalized.includes("arcus tidak")
  ) {
    return "Normal";
  }

  if (
    normalized.includes("indikasi kuat") ||
    normalized.includes("kolesterol") ||
    normalized.includes("beresiko") ||
    normalized.includes("berisiko")
  ) {
    return "Beresiko";
  }

  if (
    normalized.includes("indikasi sedang") ||
    normalized.includes("indikasi ringan") ||
    normalized.includes("follow")
  ) {
    return "Perlu Dipantau";
  }

  return "Cek Ulang";
}
function getStatusClass(result?: string) {
  const status = getStatusLabel(result);

  if (status === "Normal") {
    return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
  }

  if (status === "Beresiko") {
    return "bg-red-50 text-red-700 hover:bg-red-100";
  }

  if (status === "Perlu Dipantau") {
    return "bg-amber-50 text-amber-700 hover:bg-amber-100";
  }

  return "bg-gray-100 text-gray-600 hover:bg-gray-100";
}

function getResultText(result?: string) {
  if (!result) return "-";

  const normalized = normalizeResult(result);

  if (
    normalized.includes("normal") ||
    normalized.includes("tidak terdeteksi") ||
    normalized.includes("arcus tidak")
  ) {
    return "Arcus tidak terdeteksi";
  }

  if (normalized.includes("indikasi kuat")) {
    return "Potensi tanda arcus kuat";
  }

  if (normalized.includes("indikasi sedang")) {
    return "Potensi tanda arcus sedang";
  }

  if (normalized.includes("indikasi ringan")) {
    return "Potensi tanda arcus ringan";
  }

  if (
    normalized.includes("kolesterol") ||
    normalized.includes("beresiko") ||
    normalized.includes("berisiko")
  ) {
    return "Potensi tanda arcus terdeteksi";
  }

  return "Hasil belum dapat dipastikan";
}

function formatPercentValue(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value.toFixed(1)}%`;
}

function getConfidenceMessage(confidence?: number) {
  if (typeof confidence !== "number") {
    return {
      label: "Belum tersedia",
      description: "Sistem belum menerima nilai keyakinan dari hasil analisis.",
    };
  }

  if (confidence >= 85) {
    return {
      label: "Sangat yakin",
      description:
        "Sistem memiliki tingkat keyakinan yang tinggi terhadap hasil analisis ini.",
    };
  }

  if (confidence >= 70) {
    return {
      label: "Cukup yakin",
      description:
        "Hasil analisis cukup meyakinkan, namun tetap disarankan untuk memantau kondisi secara berkala.",
    };
  }

  return {
    label: "Perlu diperhatikan",
    description:
      "Tingkat keyakinan sistem belum terlalu tinggi. Gunakan foto yang lebih jelas untuk hasil yang lebih optimal.",
  };
}

function getEyeScanCustomResponse(item: EyeScanHistory) {
  const normalized = normalizeResult(item.result);
  const confidence = getConfidenceMessage(item.confidence);

  if (
    normalized.includes("normal") ||
    normalized.includes("tidak terdeteksi") ||
    normalized.includes("arcus tidak")
  ) {
    return {
      title: "Tidak ditemukan tanda arcus",
      badge: "Kondisi terlihat normal",
      summary:
        "Berdasarkan hasil analisis gambar, sistem tidak menemukan tanda arcus yang menonjol pada area mata.",
      description:
        item.description ||
        "Tidak ada indikasi endapan lipid yang terlihat jelas pada gambar.",
      recommendation:
        item.recommendation ||
        "Tetap jaga pola hidup sehat dan lakukan pemantauan rutin secara berkala.",
      confidenceLabel: confidence.label,
      confidenceDescription: confidence.description,
    };
  }

  if (normalized.includes("indikasi kuat")) {
    return {
      title: "Ditemukan indikasi kuat tanda arcus",
      badge: "Perlu perhatian",
      summary:
        "Sistem mendeteksi pola visual yang cukup kuat menyerupai tanda arcus pada area mata.",
      description:
        item.description ||
        "Terdapat indikasi visual yang dapat berkaitan dengan kemungkinan endapan lipid pada area mata.",
      recommendation:
        item.recommendation ||
        "Disarankan melakukan pemeriksaan lipid panel atau berkonsultasi dengan tenaga medis untuk memastikan kondisi Anda.",
      confidenceLabel: confidence.label,
      confidenceDescription: confidence.description,
    };
  }

  if (
    normalized.includes("indikasi sedang") ||
    normalized.includes("indikasi ringan") ||
    normalized.includes("kolesterol") ||
    normalized.includes("beresiko") ||
    normalized.includes("berisiko")
  ) {
    return {
      title: "Ditemukan potensi tanda arcus",
      badge: "Perlu dipantau",
      summary:
        "Sistem mendeteksi adanya kemungkinan tanda arcus pada area mata. Hasil ini bukan diagnosis akhir.",
      description:
        item.description ||
        "Terdapat pola visual yang menyerupai potensi endapan lipid pada area mata.",
      recommendation:
        item.recommendation ||
        "Disarankan melakukan pemantauan berkala atau pemeriksaan lipid panel jika diperlukan.",
      confidenceLabel: confidence.label,
      confidenceDescription: confidence.description,
    };
  }

  return {
    title: "Hasil belum dapat dipastikan",
    badge: "Cek ulang",
    summary:
      "Sistem belum dapat mengklasifikasikan hasil scan dengan jelas dari gambar yang tersedia.",
    description:
      item.description ||
      "Kualitas gambar atau area mata mungkin belum cukup jelas untuk dianalisis secara optimal.",
    recommendation:
      item.recommendation ||
      "Gunakan foto mata yang lebih terang, fokus, dan tidak buram untuk hasil yang lebih optimal.",
    confidenceLabel: confidence.label,
    confidenceDescription: confidence.description,
  };
}

function getConfidenceLabel(confidence?: number) {
  if (typeof confidence !== "number" || Number.isNaN(confidence)) {
    return "Keyakinan belum tersedia";
  }

  if (confidence >= 85) return "Sistem sangat yakin";
  if (confidence >= 70) return "Sistem cukup yakin";
  if (confidence >= 50) return "Keyakinan sedang";

  return "Keyakinan rendah";
}

export default function HistoryScanEyeContent() {
  const [page, setPage] = useState(1);

  const {
    data: response,
    error,
    isLoading,
  } = useFetchData<ApiResponse<EyeScanHistory[]>>(
    `/screenings/me?page=${page}&limit=${LIMIT}`,
  );

  const histories = useMemo(() => {
    return Array.isArray(response?.data) ? response.data : [];
  }, [response]);

  const metadata = response?.metadata;

  const hasAuthError = isAuthError(error);
  const hasNoDataError = isNoDataError(error);

  const hasUnknownError = Boolean(error) && !hasAuthError && !hasNoDataError;

  const emptyHistoryMessage = getApiResponseMessage(
    error,
    "Belum ada riwayat scan mata.",
  );

  const totalItems = metadata?.totalItems ?? histories.length;
  const totalPages = Math.max(1, metadata?.totalPages ?? 1);
  const currentPage = metadata?.page ?? page;
  const currentLimit = metadata?.limit ?? LIMIT;
  const hasData = histories.length > 0;

  const shouldShowPagination =
    hasData &&
    totalItems > currentLimit &&
    !hasAuthError &&
    !hasNoDataError &&
    !hasUnknownError;

  const startRecord =
    totalItems === 0 ? 0 : (currentPage - 1) * currentLimit + 1;

  const endRecord = Math.min(currentPage * currentLimit, totalItems);

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

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloadingPdf(true);

      const response = await API.get<Blob>("/screenings/me/export/pdf", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `riwayat-scan-mata-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF riwayat Scan Mata berhasil diunduh.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Gagal mengunduh PDF riwayat Scan Mata.",
        );
        return;
      }

      toast.error("Gagal mengunduh PDF riwayat Scan Mata.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          Eye Scan History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your historical eye scan results and follow-up recommendations.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b bg-white px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-950">
                Tabel Riwayat Data
              </CardTitle>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
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
                histories.length === 0
              }
              className="w-full gap-2 rounded-xl border-gray-100 bg-gray-200 text-gray-700 hover:bg-gray-100 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Mengunduh..." : "Unduh PDF"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="bg-[#f7f7fb] hover:bg-[#f7f7fb]">
                  <TableHead className="h-14 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Date
                  </TableHead>
                  <TableHead className="h-14 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Hasil Scan
                  </TableHead>
                  <TableHead className="h-14 px-5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Image Preview
                  </TableHead>
                  <TableHead className="h-14 px-5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Status
                  </TableHead>
                  <TableHead className="h-14 px-5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Detail
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-36 text-center text-sm text-muted-foreground"
                    >
                      Memuat riwayat scan mata...
                    </TableCell>
                  </TableRow>
                ) : hasAuthError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 px-5">
                      <div className="mx-auto flex max-w-md items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="font-semibold">Sesi login berakhir</p>
                          <p className="mt-1 text-xs leading-relaxed">
                            Silakan login ulang untuk melihat riwayat scan mata
                            Anda.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : hasNoDataError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 px-5">
                      <div className="flex flex-col items-center justify-center text-center text-red-600">
                        <p className="font-semibold">
                          Riwayat scan mata belum ada
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-red-500">
                          {emptyHistoryMessage}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : histories.length > 0 ? (
                  histories.map((item) => {
                    const friendlyResult = getEyeScanCustomResponse(item);

                    return (
                      <TableRow key={item.id} className="bg-white">
                        <TableCell className="px-5 py-5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                          {formatDate(item.createdAt)}
                        </TableCell>

                        <TableCell className="px-5 py-5">
                          <div className="max-w-[180px]">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-700">
                              {getResultText(item.result)}
                            </p>

                            {typeof item.confidence === "number" && (
                              <p className="mt-1 text-xs text-muted-foreground font-semibold ">
                                {getConfidenceLabel(item.confidence)} ·{" "}
                                {item.confidence.toFixed(1)}%
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-5">
                          <div className="flex justify-center">
                            {item.imageUrl ? (
                              <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                <Image
                                  src={item.imageUrl}
                                  alt="Eye scan preview"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
                                <ImageIcon className="size-5" />
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-5 text-center">
                          <Badge
                            variant="secondary"
                            className={`rounded-full px-5 py-1 text-xs font-semibold ${getStatusClass(
                              item.result,
                            )}`}
                          >
                            {getStatusLabel(item.result)}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-5 py-5 text-center">
                          <Dialog>
                            <DialogTrigger
                              type="button"
                              className="inline-flex h-auto items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                              Detail
                            </DialogTrigger>

                            <DialogContent className="flex max-h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
                              <DialogHeader className="shrink-0 border-b px-4 py-4 text-left sm:px-6">
                                <DialogTitle className="text-lg font-bold text-gray-950">
                                  Detail Hasil Scan Mata
                                </DialogTitle>

                                <DialogDescription className="text-sm leading-relaxed">
                                  Ringkasan hasil analisis berdasarkan data
                                  riwayat scan mata.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-6 sm:px-6">
                                {item.imageUrl ? (
                                  <div className="relative h-36 w-full overflow-hidden rounded-2xl border bg-gray-50 sm:h-56">
                                    <Image
                                      src={item.imageUrl}
                                      alt="Eye scan detail"
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-36 w-full items-center justify-center rounded-2xl border bg-gray-50 text-gray-400">
                                    <ImageIcon className="size-8" />
                                  </div>
                                )}

                                <div className="rounded-2xl border bg-gray-50 p-4">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Ringkasan Hasil
                                      </p>

                                      <p className="mt-1 text-sm font-bold text-gray-950">
                                        {friendlyResult.title}
                                      </p>

                                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {friendlyResult.summary}
                                      </p>
                                    </div>

                                    <Badge
                                      variant="secondary"
                                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                        item.result,
                                      )}`}
                                    >
                                      {friendlyResult.badge}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <div className="rounded-2xl border bg-white p-4">
                                    <p className="text-xs font-medium text-muted-foreground">
                                      Tanggal Pemeriksaan
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                      {formatDate(item.createdAt)}
                                    </p>
                                  </div>

                                  <div className="rounded-2xl border bg-white p-4">
                                    <p className="text-xs font-medium text-muted-foreground">
                                      Tingkat Keyakinan Analisis
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                      {formatPercentValue(item.confidence)} —{" "}
                                      {friendlyResult.confidenceLabel}
                                    </p>

                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                      {friendlyResult.confidenceDescription}
                                    </p>
                                  </div>
                                </div>

                                <div className="rounded-2xl border bg-white p-4">
                                  <p className="text-sm font-semibold text-gray-900">
                                    Penjelasan Hasil
                                  </p>

                                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {friendlyResult.description}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                  <p className="text-sm font-semibold text-blue-900">
                                    Saran Untuk Anda
                                  </p>

                                  <p className="mt-2 text-sm leading-relaxed text-blue-800">
                                    {friendlyResult.recommendation}
                                  </p>
                                </div>

                                {item.probabilities && (
                                  <div className="rounded-2xl border bg-white p-4">
                                    <p className="text-sm font-semibold text-gray-900">
                                      Detail Kemungkinan Hasil
                                    </p>

                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                      Angka berikut menunjukkan seberapa besar
                                      kecenderungan sistem terhadap
                                      masing-masing kategori hasil.
                                    </p>

                                    <div className="mt-3 space-y-2">
                                      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">
                                            Kondisi normal
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Tidak terlihat tanda arcus yang
                                            menonjol.
                                          </p>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-900">
                                          {formatPercentValue(
                                            item.probabilities.normal,
                                          )}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">
                                            Perlu pemantauan
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Ada kemungkinan kecil pola visual
                                            yang perlu diperhatikan.
                                          </p>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-900">
                                          {formatPercentValue(
                                            item.probabilities.beresiko,
                                          )}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">
                                            Potensi kolesterol
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Ada kemungkinan tanda visual yang
                                            berkaitan dengan endapan lipid.
                                          </p>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-900">
                                          {formatPercentValue(
                                            item.probabilities.kolesterol,
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : hasUnknownError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 px-5">
                      <div className="mx-auto flex max-w-md items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-left text-sm text-amber-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="font-semibold">
                            Riwayat belum berhasil dimuat
                          </p>
                          <p className="mt-1 text-xs leading-relaxed">
                            Terjadi kendala saat mengambil data riwayat scan
                            mata. Silakan coba muat ulang halaman.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 px-5">
                      <div className="mx-auto flex max-w-md items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-left text-sm text-blue-700">
                        <div>
                          <p className="font-semibold">
                            Riwayat scan mata belum ada
                          </p>
                          <p className="mt-1 text-xs leading-relaxed">
                            Anda belum pernah melakukan scan mata. Silakan
                            lakukan scan terlebih dahulu untuk melihat riwayat
                            di halaman ini.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
    </div>
  );
}
