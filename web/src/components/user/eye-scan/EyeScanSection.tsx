"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { io, type Socket } from "socket.io-client";
import {
  AlertCircle,
  CloudUpload,
  HelpCircle,
  Loader2,
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

export default function EyeScanForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);

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

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketId(socket.id ?? null);
      setIsSocketConnected(true);
    });

    socket.on("connect_error", () => {
      setSocketId(null);
      setIsSocketConnected(false);

      // Jangan pakai console.error di sini,
      // karena Next.js dev overlay akan muncul sebagai error merah.
    });

    socket.on("disconnect", () => {
      setSocketId(null);
      setIsSocketConnected(false);
    });

    socket.on("scan_progress", (data: ScanProgressPayload) => {
      const safeProgress = Math.min(
        95,
        Math.max(0, Number(data.progress) || 0),
      );

      setProgress(safeProgress);
      setLoadingText(data.message || "Memproses gambar...");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("scan_progress");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

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
    if (!selectedFile) {
      toast.error("Pilih gambar mata terlebih dahulu.");
      return;
    }

    const activeSocketId = socketRef.current?.id ?? socketId;

    const formData = new FormData();
    formData.append("image", selectedFile, selectedFile.name);

    if (activeSocketId) {
      formData.append("socketId", activeSocketId);
    }

    try {
      setIsSubmitting(true);
      setScreeningResult(null);
      setScanError(false);
      setProgress(5);
      setLoadingText(
        activeSocketId
          ? "Mengunggah gambar..."
          : "Mengunggah gambar tanpa realtime progress...",
      );

      const response = await API.post<ScreeningResponse>(
        "/screenings",
        formData,
      );

      setScreeningResult(response.data.data);
      setProgress(100);
      setLoadingText("Selesai. Hasil siap ditampilkan.");
      toast.success(response.data.message || "Analisis foto berhasil.");
    } catch (error) {
      setScanError(true);
      setProgress(0);
      setLoadingText("Analisis gagal.");

      const friendlyError = getApiErrorMessage(error);

      toast.error(friendlyError.title, {
        description: friendlyError.description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                : "Socket belum terhubung, progress tetap diproses setelah submit"}
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

      {screeningResult && (
        <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Hasil Analisis: {screeningResult.result}
                </h3>

                <span className="w-fit rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">
                  {formatPercent(screeningResult.confidence)}
                </span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {screeningResult.description}
              </p>

              <div className="mt-3 rounded-lg bg-white p-3 text-xs text-gray-600">
                <p className="font-semibold text-gray-900">Rekomendasi</p>
                <p className="mt-1 leading-relaxed">
                  {screeningResult.recommendation}
                </p>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase text-gray-400">
                    Normal
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPercent(screeningResult.probabilities.normal)}
                  </p>
                </div>

                <div className="rounded-lg bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase text-gray-400">
                    Beresiko
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPercent(screeningResult.probabilities.beresiko)}
                  </p>
                </div>

                <div className="rounded-lg bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase text-gray-400">
                    Kolesterol
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPercent(screeningResult.probabilities.kolesterol)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <HelpCircle className="h-4 w-4" />
          <span>
            {selectedFile
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
