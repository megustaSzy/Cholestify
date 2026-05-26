"use client";

import { useState } from "react";
import axios from "axios";
import { CalendarDays, HeartPulse, UserRound, Activity } from "lucide-react";

import { API } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type Gender = "MALE" | "FEMALE";
type ActivityLevel = "INACTIVE" | "LIGHTLY_ACTIVE" | "ACTIVE" | "ATHLETE";

const genderLabel: Record<Gender, string> = {
  MALE: "Pria",
  FEMALE: "Wanita",
};

const activityLabel: Record<ActivityLevel, string> = {
  INACTIVE: "Tidak aktif",
  LIGHTLY_ACTIVE: "Ringan",
  ACTIVE: "Aktif",
  ATHLETE: "Atlet",
};

type CalculatePayload = {
  dob: string;
  gender: Gender;
  restingHeartRate: number;
  activityLevel: ActivityLevel;
};

// type CalculateResult = {
//   minHeartRate?: number;
//   maxHeartRate?: number;
//   zone?: string;
//   recommendation?: string;
// };

type CalculateResult = Record<string, unknown>;

type CalculateResponse = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data?: CalculateResult;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

const parseDate = (value: string) => {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00`);
};

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (value: string) => {
  if (!value) return "Pilih tanggal lahir";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ?? "Terjadi kesalahan saat menghitung."
    );
  }

  return "Terjadi kesalahan saat menghitung.";
};

const formatResultLabel = (key: string) => {
  const labels: Record<string, string> = {
    minHeartRate: "Minimum Heart Rate",
    maxHeartRate: "Maximum Heart Rate",
    zone: "Zona",
    recommendation: "Rekomendasi",
    restingHeartRate: "Resting Heart Rate",
    activityLevel: "Aktivitas",
    gender: "Jenis Kelamin",
    age: "Usia",
  };

  return (
    labels[key] ??
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (char) => char.toUpperCase())
  );
};

const formatResultValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Ya" : "Tidak";
  }

  return JSON.stringify(value);
};

export default function CalculatesForm() {
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState<Gender | "">("");
  const [rhr, setRhr] = useState("");
  const [aktivitas, setAktivitas] = useState<ActivityLevel | "">("");
  const [loading, setLoading] = useState(false);
  // const [hasil, setHasil] = useState("");
  const [message, setMessage] = useState("");
  const [calculationResult, setCalculationResult] =
    useState<CalculateResult | null>(null);

  const handleGenderChange = (value: Gender | "" | null) => {
    if (value === "MALE" || value === "FEMALE") {
      setJenisKelamin(value);
    }
  };

  const handleActivityChange = (value: ActivityLevel | "" | null) => {
    if (
      value === "INACTIVE" ||
      value === "LIGHTLY_ACTIVE" ||
      value === "ACTIVE" ||
      value === "ATHLETE"
    ) {
      setAktivitas(value);
    }
  };

  const handleHitung = async () => {
    setMessage("");
    setCalculationResult(null);

    if (!tanggalLahir || !jenisKelamin || !rhr || !aktivitas) {
      setMessage("Harap lengkapi semua field terlebih dahulu.");
      return;
    }

    const rhrNum = Number(rhr);

    if (Number.isNaN(rhrNum) || rhrNum < 30 || rhrNum > 220) {
      setMessage("Nilai RHR tidak valid. Masukkan antara 30-220 bpm.");
      return;
    }

    const payload: CalculatePayload = {
      dob: tanggalLahir,
      gender: jenisKelamin,
      restingHeartRate: rhrNum,
      activityLevel: aktivitas,
    };

    try {
      setLoading(true);

      const response = await API.post<CalculateResponse>(
        "/calculates",
        payload,
      );

      setMessage(response.data.message || "Perhitungan berhasil.");
      setCalculationResult(response.data.data ?? null);
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat mengambil hasil dari backend.");
      setCalculationResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full lg:w-[420px] flex-shrink-0 rounded-2xl border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Kalkulator Detak Jantung Istirahat (RHR)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* <div className="space-y-2">
          <Label htmlFor="dob">Tanggal Lahir</Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
            <Input
              id="dob"
              type="date"
              value={tanggalLahir}
              onChange={(event) => setTanggalLahir(event.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="dob">Tanggal Lahir</Label>

          <Popover>
            <PopoverTrigger
              id="dob"
              type="button"
              className={`flex h-11 w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-sm font-normal shadow-sm transition-colors hover:bg-gray-50 ${
                tanggalLahir ? "text-gray-950" : "text-muted-foreground"
              }`}
            >
              <CalendarDays className="size-4 shrink-0 text-blue-500" />
              <span>{formatDateForDisplay(tanggalLahir)}</span>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseDate(tanggalLahir)}
                onSelect={(date) => {
                  if (date) {
                    setTanggalLahir(formatDateForApi(date));
                  }
                }}
                disabled={(date) => date > new Date()}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Jenis Kelamin</Label>

          <div className="relative w-full">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-blue-500" />

            <Select value={jenisKelamin} onValueChange={handleGenderChange}>
              <SelectTrigger className="h-11 w-full pl-10">
                <span
                  className={
                    jenisKelamin ? "text-gray-950" : "text-muted-foreground"
                  }
                >
                  {jenisKelamin
                    ? genderLabel[jenisKelamin]
                    : "Pilih Jenis Kelamin"}
                </span>
              </SelectTrigger>

              <SelectContent className="w-[calc(100vw-5rem)] sm:w-[372px]">
                <SelectItem value="MALE">Pria</SelectItem>
                <SelectItem value="FEMALE">Wanita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rhr">Detak Jantung Istirahat</Label>
          <div className="relative">
            <HeartPulse className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
            <Input
              id="rhr"
              type="number"
              value={rhr}
              onChange={(event) => setRhr(event.target.value)}
              placeholder="Detak Jantung Istirahat (bpm)"
              min={30}
              max={220}
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Aktivitas Harian</Label>

          <div className="relative w-full">
            <Activity className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-blue-500" />

            <Select value={aktivitas} onValueChange={handleActivityChange}>
              <SelectTrigger className="h-11 w-full pl-10">
                <span
                  className={
                    aktivitas ? "text-gray-950" : "text-muted-foreground"
                  }
                >
                  {aktivitas ? activityLabel[aktivitas] : "Aktivitas Harian"}
                </span>
              </SelectTrigger>

              <SelectContent className="w-[calc(100vw-5rem)] sm:w-[372px]">
                <SelectItem value="INACTIVE">
                  <div className="flex flex-col">
                    <span>Tidak aktif</span>
                    <span className="text-xs text-muted-foreground">
                      Jarang olahraga atau lebih banyak duduk
                    </span>
                  </div>
                </SelectItem>

                <SelectItem value="LIGHTLY_ACTIVE">
                  <div className="flex flex-col">
                    <span>Cukup aktif</span>
                    <span className="text-xs text-muted-foreground">
                      Olahraga ringan 1-3x per minggu
                    </span>
                  </div>
                </SelectItem>

                <SelectItem value="ACTIVE">
                  <div className="flex flex-col">
                    <span>Aktif</span>
                    <span className="text-xs text-muted-foreground">
                      Olahraga sedang 3-5x per minggu
                    </span>
                  </div>
                </SelectItem>

                <SelectItem value="ATHLETE">
                  <div className="flex flex-col">
                    <span>Atlet</span>
                    <span className="text-xs text-muted-foreground">
                      Latihan intens 6-7x per minggu
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleHitung}
          disabled={loading}
          className="h-11 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
        >
          {loading ? "Menghitung..." : "Hitung"}
        </Button>

        {/* <div className="min-h-[72px] whitespace-pre-line rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-600">
          {hasil || "Hasil perhitungan akan muncul di sini."}
        </div> */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700">
          {message || calculationResult ? (
            <div className="space-y-4">
              {message && (
                <p className="font-medium text-gray-900">{message}</p>
              )}

              {calculationResult &&
              Object.keys(calculationResult).length > 0 ? (
                <div className="grid gap-3">
                  {Object.entries(calculationResult).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-md border border-gray-200 bg-white px-3 py-2"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        {formatResultLabel(key)}
                      </p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatResultValue(value)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Detail hasil belum dikirim dari backend.
                </p>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">
              Hasil perhitungan akan muncul di sini.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
