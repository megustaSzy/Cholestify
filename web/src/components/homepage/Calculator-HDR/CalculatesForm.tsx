"use client";

import React from "react";
import { API } from "@/lib/utils";
import { useState } from "react";

type CalculatePayload = {
  dob: string;
  gender: "MALE" | "FEMALE";
  restingHeartRate: number;
  activityLevel: "INACTIVE" | "LIGHTLY_ACTIVE" | "ACTIVE" | "ATHLETE";
};

type CalculateResult = {
  minHeartRate?: number;
  maxHeartRate?: number;
  zone?: string;
  recommendation?: string;
};

type CalculateResponse = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data?: CalculateResult;
};

export default function CalculatesForm() {
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [rhr, setRhr] = useState("");
  const [aktivitas, setAktivitas] = useState("");
  const [hasil, setHasil] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHitung = async () => {
    if (!tanggalLahir || !jenisKelamin || !rhr || !aktivitas) {
      setHasil("Harap lengkapi semua field terlebih dahulu.");
      return;
    }

    const rhrNum = Number(rhr);

    if (Number.isNaN(rhrNum) || rhrNum < 30 || rhrNum > 220) {
      setHasil("Nilai RHR tidak valid. Masukkan antara 30-220 bpm.");
      return;
    }

    const payload: CalculatePayload = {
      dob: tanggalLahir,
      gender: jenisKelamin as CalculatePayload["gender"],
      restingHeartRate: rhrNum,
      activityLevel: aktivitas as CalculatePayload["activityLevel"],
    };

    try {
      setLoading(true);
      setHasil("");

      const response = await API.post<CalculateResponse>(
        "/calculates",
        payload,
      );

      const result = response.data.data;

      if (!result) {
        setHasil(response.data.message || "Perhitungan berhasil.");
        return;
      }

      setHasil(
        [
          response.data.message,
          typeof result.minHeartRate === "number" &&
          typeof result.maxHeartRate === "number"
            ? `Target detak jantung: ${result.minHeartRate} - ${result.maxHeartRate} bpm`
            : null,
          result.zone ? `Zona: ${result.zone}` : null,
          result.recommendation
            ? `Rekomendasi: ${result.recommendation}`
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
      );
    } catch (error) {
      console.error(error);
      setHasil("Terjadi kesalahan saat mengambil hasil dari backend.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Calculator Card */}
      <div className="lg:w-[420px] flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Kalkulator Detak Jantung Istirahat (RHR)
          </h2>

          <div className="space-y-4">
            {/* Tanggal Lahir */}
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#1E90FF] transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-[#1E90FF] flex-shrink-0"
              >
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M6 2v4M14 2v4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-500 bg-transparent"
                placeholder="dd/mm/yyyy"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#1E90FF] transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-[#1E90FF] flex-shrink-0"
              >
                <circle
                  cx="8"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 8V4M8 4H11M8 4L11 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="13"
                  cy="7"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-500 bg-transparent appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Pilih Jenis Kelamin
                </option>
                <option value="MALE">Pria</option>
                <option value="FEMALE">Wanita</option>
              </select>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-gray-400 flex-shrink-0"
              >
                <path
                  d="M3 5l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* RHR Input */}
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#1E90FF] transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-[#1E90FF] flex-shrink-0"
              >
                <path
                  d="M2 10h3l2-4 3 8 2-5 1.5 1H18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="number"
                value={rhr}
                onChange={(e) => setRhr(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-500 bg-transparent"
                placeholder="Detak Jantung Istirahat (bpm)"
                min={20}
                max={220}
              />
            </div>

            {/* Aktivitas Harian */}
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[#1E90FF] transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-[#1E90FF] flex-shrink-0"
              >
                <circle
                  cx="10"
                  cy="5"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 9l-2 6M13 9l2 6M7 9h6M8 12l4 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <select
                value={aktivitas}
                onChange={(e) => setAktivitas(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-500 bg-transparent appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Aktivitas Harian
                </option>
                <option value="INACTIVE">Sedentary (Tidak aktif)</option>
                <option value="LIGHTLY_ACTIVE">Ringan (1-3 hari/minggu)</option>
                <option value="ACTIVE">Sedang (3-5 hari/minggu)</option>
                <option value="ATHLETE">Aktif (6-7 hari/minggu)</option>
                <option value="INTENSE_ACTIVITY">Sangat Aktif (Atlet)</option>
              </select>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-gray-400 flex-shrink-0"
              >
                <path
                  d="M3 5l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Hitung Button */}
            <button
              onClick={handleHitung}
              disabled={loading}
              className="w-full bg-[#1E90FF] hover:bg-[#1478e0] text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? "Menghitung..." : "Hitung"}
            </button>

            {/* Result */}
            <div className="whitespace-pre-line border border-gray-200 rounded-lg px-4 py-3 min-h-[44px] text-sm text-gray-600 bg-gray-50">
              {hasil}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
