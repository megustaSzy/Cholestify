"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { io, type Socket } from "socket.io-client";
import {
  AlertCircle,
  CloudUpload,
  HelpCircle,
  Loader2,
  RefreshCw,
  ScanEye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { API } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ScreeningResponse = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: {
    id: number;
    userId: number;
    imageUrl: string;
    result: string;
    confidence: number;
    description: string;
    recommendation: string;
    probabilities: {
      normal: number;
      beresiko: number;
      kolesterol: number;
    };
    createdAt: string;
  };
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  recommendation?: string;
  error?: string;
  metadata?: {
    status?: number;
  };
};

type ScanProgressPayload = {
  progress?: number;
  message?: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

const allowedExtensions = ["jpg", "jpeg", "png"] as const;
const allowedMimeTypes = ["image/jpeg", "image/png"] as const;

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(2)}MB`;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function isAllowedFile(file: File) {
  const extension = getFileExtension(file.name);

  const hasAllowedExtension = allowedExtensions.some(
    (item) => item === extension,
  );

  const hasAllowedMimeType =
    !file.type || allowedMimeTypes.some((item) => item === file.type);

  return hasAllowedExtension && hasAllowedMimeType;
}

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status =
      error.response?.status ?? error.response?.data?.metadata?.status;

    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.recommendation ||
      error.response?.data?.error;

    if (!error.response) {
      return {
        title: "Tidak dapat terhubung ke server.",
        description:
          "Periksa koneksi internet Anda atau coba lagi beberapa saat.",
      };
    }

    if (status === 400) {
      return {
        title: apiMessage || "Foto belum sesuai.",
        description:
          "Pastikan foto menampilkan area mata dengan jelas, tidak buram, dan pencahayaan cukup.",
      };
    }

    if (status === 401) {
      return {
        title: "Sesi login berakhir.",
        description: "Silakan login ulang lalu coba analisis foto kembali.",
      };
    }

    if (status === 413) {
      return {
        title: "Ukuran file terlalu besar.",
        description: "Gunakan gambar dengan ukuran maksimal 10MB.",
      };
    }

    if (status === 415) {
      return {
        title: "Format file tidak didukung.",
        description: "Gunakan gambar dengan format JPG, JPEG, atau PNG.",
      };
    }

    if (status && status >= 500) {
      return {
        title: "Server gagal memproses foto.",
        description:
          "Layanan analisis sedang bermasalah. Silakan coba lagi nanti.",
      };
    }

    return {
      title: apiMessage || "Gagal melakukan analisis foto.",
      description: "Silakan coba lagi dengan gambar yang berbeda.",
    };
  }

  if (error instanceof Error) {
    return {
      title: error.message,
      description: "Silakan coba lagi.",
    };
  }

  return {
    title: "Gagal melakukan analisis foto.",
    description: "Silakan coba lagi beberapa saat.",
  };
}

function formatPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.00%";

  return `${value.toFixed(2)}%`;
}

function getConfidenceMessage(confidence?: number) {
  if (typeof confidence !== "number" || Number.isNaN(confidence)) {
    return {
      label: "Belum tersedia",
      description: "Nilai keyakinan analisis belum tersedia.",
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
        "Hasil analisis cukup meyakinkan, namun tetap gunakan hasil ini sebagai pemantauan awal.",
    };
  }

  if (confidence >= 50) {
    return {
      label: "Keyakinan sedang",
      description:
        "Hasil masih dapat digunakan sebagai gambaran awal, namun tingkat keyakinannya belum terlalu kuat.",
    };
  }

  return {
    label: "Keyakinan rendah",
    description:
      "Sistem belum cukup yakin terhadap hasil analisis ini. Untuk hasil yang lebih optimal, gunakan foto mata yang terang, fokus, dan tidak buram.",
  };
}

function getScreeningCustomResponse(result: ScreeningResponse["data"]) {
  const normalized = result.result?.toLowerCase() ?? "";
  const confidence = getConfidenceMessage(result.confidence);

  if (normalized.includes("normal")) {
    return {
      title: "Hasil terlihat aman",
      label: "Tidak ditemukan tanda arcus",
      badge: "Normal",
      badgeClass: "bg-emerald-100 text-emerald-700",
      cardClass: "border-emerald-100 bg-emerald-50",
      textClass: "text-emerald-800",
      summary:
        "Berdasarkan foto yang dianalisis, sistem tidak menemukan tanda arcus yang menonjol pada area mata.",
      description:
        result.description ||
        "Tidak ada indikasi endapan lipid yang terlihat jelas pada gambar.",
      recommendation:
        result.recommendation ||
        "Tetap jaga pola hidup sehat dan lakukan pemantauan secara berkala.",
      confidenceLabel: confidence.label,
      confidenceDescription: confidence.description,
    };
  }

  if (
    normalized.includes("kolesterol") ||
    normalized.includes("beresiko") ||
    normalized.includes("berisiko") ||
    normalized.includes("follow")
  ) {
    return {
      title: "Perlu pemantauan lebih lanjut",
      label: "Ditemukan potensi tanda arcus",
      badge: "Follow Up",
      badgeClass: "bg-orange-100 text-orange-700",
      cardClass: "border-orange-100 bg-orange-50",
      textClass: "text-orange-800",
      summary:
        "Sistem mendeteksi kemungkinan pola visual yang menyerupai tanda arcus pada area mata.",
      description:
        result.description ||
        "Terdapat pola visual yang perlu diperhatikan, namun hasil ini bukan diagnosis medis akhir.",
      recommendation:
        result.recommendation ||
        "Disarankan melakukan pemeriksaan kolesterol atau berkonsultasi dengan tenaga medis untuk memastikan kondisi Anda.",
      confidenceLabel: confidence.label,
      confidenceDescription: confidence.description,
    };
  }

  return {
    title: "Hasil belum dapat dipastikan",
    label: "Perlu cek ulang gambar",
    badge: "Cek Ulang",
    badgeClass: "bg-gray-100 text-gray-700",
    cardClass: "border-gray-100 bg-gray-50",
    textClass: "text-gray-800",
    summary:
      "Sistem belum dapat memastikan hasil analisis dari foto yang digunakan.",
    description:
      result.description ||
      "Area mata pada gambar mungkin belum cukup jelas untuk dianalisis secara optimal.",
    recommendation:
      result.recommendation ||
      "Coba upload ulang foto mata dengan pencahayaan yang lebih baik dan posisi yang lebih fokus.",
    confidenceLabel: confidence.label,
    confidenceDescription: confidence.description,
  };
}

function UploadInfoMessage() {
  return (
    <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
      <div className="flex items-start gap-2">
        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

        <div className="space-y-2">
          <div>
            <p className="font-semibold text-blue-800">Ketentuan upload foto</p>

            <p className="mt-1 leading-relaxed">
              Gunakan foto mata dengan format{" "}
              <span className="font-semibold">JPG, JPEG, atau PNG</span>. Ukuran
              maksimal file adalah <span className="font-semibold">10MB</span>.
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-white/70 px-3 py-2 text-blue-700">
            <p className="leading-relaxed">
              Jika tombol <span className="font-semibold">Analisis Foto</span>{" "}
              tidak dapat digunakan setelah proses gagal atau halaman terlalu
              lama terbuka, silakan refresh halaman lalu upload ulang gambar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EyeScanForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const connectPromiseRef = useRef<Promise<string | null> | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [socketId, setSocketId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  const [scanError, setScanError] = useState(false);

  const [screeningResult, setScreeningResult] = useState<
    ScreeningResponse["data"] | null
  >(null);

  const resetSocketState = useCallback(() => {
    if (!isMountedRef.current) return;

    setSocketId(null);
    setIsSocketConnected(false);
  }, []);

  const abortActiveRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const disconnectSocket = useCallback(() => {
    const socket = socketRef.current;

    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    }

    connectPromiseRef.current = null;
    resetSocketState();
  }, [resetSocketState]);

  const connectSocket = useCallback(() => {
    const activeSocket = socketRef.current;

    if (activeSocket?.connected) {
      return Promise.resolve(activeSocket.id ?? null);
    }

    if (connectPromiseRef.current) {
      return connectPromiseRef.current;
    }

    disconnectSocket();

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: false,
      timeout: 8000,
      autoConnect: false,
    });

    socketRef.current = socket;

    connectPromiseRef.current = new Promise<string | null>((resolve) => {
      const finishConnection = (id: string | null) => {
        connectPromiseRef.current = null;
        resolve(id);
      };

      socket.once("connect", () => {
        if (!isMountedRef.current) {
          socket.disconnect();
          finishConnection(null);
          return;
        }

        const id = socket.id ?? null;

        setSocketId(id);
        setIsSocketConnected(true);
        finishConnection(id);
      });

      socket.once("connect_error", () => {
        socket.removeAllListeners();
        socket.disconnect();

        if (socketRef.current === socket) {
          socketRef.current = null;
        }

        resetSocketState();
        finishConnection(null);
      });

      socket.on("disconnect", () => {
        resetSocketState();
      });

      socket.on("scan_progress", (data: ScanProgressPayload) => {
        if (!isMountedRef.current) return;

        const safeProgress = Math.min(
          95,
          Math.max(0, Number(data.progress) || 0),
        );

        setProgress(safeProgress);
        setLoadingText(data.message || "Memproses gambar...");
      });

      socket.connect();
    });

    return connectPromiseRef.current;
  }, [disconnectSocket, resetSocketState]);

  useEffect(() => {
    isMountedRef.current = true;

    const handlePageHide = () => {
      abortActiveRequest();
      disconnectSocket();
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      isMountedRef.current = false;

      window.removeEventListener("pagehide", handlePageHide);

      abortActiveRequest();
      disconnectSocket();
    };
  }, [abortActiveRequest, disconnectSocket]);

  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    abortActiveRequest();
    disconnectSocket();

    setSelectedFile(null);
    setPreviewUrl(null);
    setScreeningResult(null);
    setScanError(false);
    setProgress(0);
    setLoadingText("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectedFile = (file: File) => {
    setScreeningResult(null);
    setScanError(false);
    setProgress(0);
    setLoadingText("");

    if (!isAllowedFile(file)) {
      clearSelectedFile();

      toast.error("Format file tidak didukung.", {
        description: "Gunakan gambar dengan format JPG, JPEG, atau PNG.",
      });

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      clearSelectedFile();

      toast.error("Ukuran file terlalu besar.", {
        description: `Ukuran file Anda ${formatFileSize(
          file.size,
        )}. Maksimal ukuran file adalah 10MB.`,
      });

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    toast.success("Gambar berhasil dipilih.", {
      description: "Klik Analisis Foto untuk mulai memproses gambar.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleAnalyze = async () => {
    if (isSubmittingRef.current) {
      return;
    }

    if (!selectedFile) {
      toast.error("Pilih gambar mata terlebih dahulu.");
      return;
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;
    isSubmittingRef.current = true;

    try {
      setIsSubmitting(true);
      setScreeningResult(null);
      setScanError(false);
      setProgress(3);
      setLoadingText("Menyiapkan koneksi realtime...");

      const activeSocketId = await connectSocket();

      const formData = new FormData();
      formData.append("image", selectedFile, selectedFile.name);

      if (activeSocketId) {
        formData.append("socketId", activeSocketId);
      }

      setProgress(5);
      setLoadingText(
        activeSocketId
          ? "Mengunggah gambar..."
          : "Mengunggah gambar tanpa realtime progress...",
      );

      const response = await API.post<ScreeningResponse>(
        "/screenings",
        formData,
        {
          signal: controller.signal,
        },
      );

      if (!isMountedRef.current) return;

      setScreeningResult(response.data.data);
      setProgress(100);
      setLoadingText("Selesai. Hasil siap ditampilkan.");
      toast.success(response.data.message || "Analisis foto berhasil.");
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
        return;
      }

      if (!isMountedRef.current) return;

      setScanError(true);
      setProgress(0);
      setLoadingText("Analisis gagal.");

      const friendlyError = getApiErrorMessage(error);

      toast.error(friendlyError.title, {
        description: friendlyError.description,
      });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }

      isSubmittingRef.current = false;

      disconnectSocket();

      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const customResponseScreeningResult = screeningResult
    ? getScreeningCustomResponse(screeningResult)
    : null;

  return (
    <div className="xl:col-span-3 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`m-4 flex min-h-64 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
        }`}
        onClick={() => !isSubmitting && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Input
          ref={fileInputRef}
          type="file"
          name="image"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
          disabled={isSubmitting}
        />

        {previewUrl && selectedFile ? (
          <div className="flex w-full flex-col items-center gap-3 px-4">
            <Image
              src={previewUrl}
              alt="Eye preview"
              className="max-h-56 rounded-lg object-contain"
              width={400}
              height={400}
              unoptimized
              style={{
                width: "auto",
                height: "auto",
              }}
            />

            <div className="max-w-full rounded-full bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">
              {selectedFile.name}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <CloudUpload className="h-7 w-7 text-blue-500" />
            </div>

            <p className="text-sm font-medium text-gray-700">
              Drag & drop atau klik untuk upload
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Mendukung JPG, JPEG, PNG. Maksimal 10MB.
            </p>
          </>
        )}
      </div>

      <UploadInfoMessage />

      {(isSubmitting || progress > 0) && (
        <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <span>{loadingText || "Menunggu progress..."}</span>
            </div>

            <span className="text-xs font-bold text-blue-700">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center gap-2 text-[11px] text-blue-600">
            <span
              className={`h-2 w-2 rounded-full ${
                isSocketConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span>
              {isSocketConnected
                ? "Realtime progress aktif"
                : "Sistem AI saat ini belum terhubung, progress tetap diproses setelah submit"}
            </span>
          </div>
        </div>
      )}

      {scanError && (
        <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="font-semibold">Analisis foto gagal.</p>
            <p className="mt-1 text-xs leading-relaxed">
              Silakan pastikan foto mata terlihat jelas, format file JPG/PNG,
              dan ukuran file maksimal 10MB.
            </p>
          </div>
        </div>
      )}

      {screeningResult && customResponseScreeningResult && (
        <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p
                  className={`text-xs font-semibold ${customResponseScreeningResult.textClass}`}
                >
                  Hasil Analisis Selesai
                </p>

                <h3 className="mt-1 text-base font-bold text-gray-950">
                  {customResponseScreeningResult.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {customResponseScreeningResult.label}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${customResponseScreeningResult.badgeClass}`}
              >
                {customResponseScreeningResult.badge}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-700">
              {customResponseScreeningResult.summary}
            </p>

            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-sm font-semibold text-gray-900">
                Detail Kemungkinan Hasil
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-semibold">
                Angka berikut menunjukkan kecenderungan sistem terhadap
                masing-masing kategori hasil.
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide">
                    Kondisi Normal
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {formatPercent(screeningResult.probabilities.normal)}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide">
                    Indikasi Awal
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {formatPercent(screeningResult.probabilities.beresiko)}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide">
                    Potensi Kolesterol
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {formatPercent(screeningResult.probabilities.kolesterol)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-3">
                <p className="text-xs font-semibold">
                  Tingkat Keyakinan Analisis
                </p>

                <p className="mt-1 text-sm font-bold text-gray-950">
                  {formatPercent(screeningResult.confidence)} —{" "}
                  {customResponseScreeningResult.confidenceLabel}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-semibold">
                  {customResponseScreeningResult.confidenceDescription}
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Catatan Penting
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-amber-800 font-medium">
                      Hasil ini digunakan sebagai pemantauan awal dan bukan
                      pengganti diagnosis langsung dari tenaga medis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-sm font-semibold text-gray-900">
                Penjelasan Hasil
              </p>

              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {customResponseScreeningResult.description}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-3">
              <p className="text-sm font-semibold">Saran Untuk Anda</p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground font-semibold">
                {customResponseScreeningResult.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <HelpCircle className="h-4 w-4" />
          <span>
            {isSubmitting
              ? "Foto sedang dianalisis, mohon tunggu."
              : selectedFile
                ? "Gambar siap dianalisis."
                : "Upload gambar mata terlebih dahulu."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedFile && (
            <Button
              type="button"
              variant="outline"
              onClick={clearSelectedFile}
              disabled={isSubmitting}
              className="gap-2 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          )}

          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <ScanEye className="h-4 w-4" />
                Analisis Foto
              </>
            )}
          </Button>
        </div>
      </div>

      {/* <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Pastikan gambar menampilkan mata dengan jelas. Jika sistem memberi
          pesan struktur mata tidak terdeteksi, ambil ulang foto sesuai panduan.
        </p>
      </div> */}
    </div>
  );
}
