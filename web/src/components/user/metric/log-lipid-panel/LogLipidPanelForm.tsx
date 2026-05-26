"use client";

import { useState } from "react";
import { CalendarIcon, SaveIcon, InfoIcon } from "lucide-react";
import { Card, CardContent } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useSWRConfig } from "swr";
import { API } from "@/lib/utils";
import axios from "axios";

const initialForm: FormState = {
  date: "",
  totalCholesterol: "",
  triglycerides: "",
  ldl: "",
  hdl: "",
};

type FormState = {
  date: string;
  totalCholesterol: string;
  triglycerides: string;
  ldl: string;
  hdl: string;
};

type MetricKey = Exclude<keyof FormState, "date">;
type LipidPayload = {
  totalCholesterol: number;
  triglycerides: number;
  ldl: number;
  hdl: number;
  date?: string;
};

type MetricField = {
  key: MetricKey;
  label: string;
  sublabel?: string;
  target: string;
};

const metrics: MetricField[] = [
  {
    key: "totalCholesterol",
    label: "Total Cholesterol",
    target: "< 200 mg/dL",
  },
  {
    key: "triglycerides",
    label: "Triglycerides",
    target: "< 150 mg/dL",
  },
  {
    key: "ldl",
    label: "LDL",
    sublabel: "(Kolesterol buruk)",
    target: "< 100 mg/dL",
  },
  {
    key: "hdl",
    label: "HDL",
    sublabel: "(Kolesterol baik)",
    target: "> 40 mg/dL (Pria) dan > 50 mg/dL (Wanita)",
  },
];

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      "Gagal menyimpan data lipid panel. Silakan coba lagi."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Gagal menyimpan data lipid panel. Silakan coba lagi.";
}

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

export function LogLipidPanelForm() {
  const { mutate } = useSWRConfig();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (isFormInvalid) {
      setErrorMessage(
        "Semua nilai lipid panel wajib diisi dengan angka valid.",
      );
      return;
    }

    const payload: LipidPayload = {
      totalCholesterol: getNumberValue("totalCholesterol"),
      triglycerides: getNumberValue("triglycerides"),
      ldl: getNumberValue("ldl"),
      hdl: getNumberValue("hdl"),
      ...(form.date ? { date: form.date } : {}),
    };

    try {
      setIsSubmitting(true);

      await API.post("/lipid-panels", payload);

      setSuccessMessage("Data lipid panel berhasil disimpan.");
      setForm(initialForm);

      mutate("/health-summary");
      mutate("/lipid-panels/me");
      mutate("/health-recommendations/overview");
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNumberValue = (key: MetricKey) => Number(form[key]);

  const isFormInvalid = metrics.some(({ key }) => {
    const value = form[key];
    return value === "" || Number.isNaN(Number(value)) || Number(value) < 0;
  });

  return (
    <div className="px-4 lg:px-6">
      {/* Page Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Data Lipid Panel
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Masukkan hasil pemeriksaan darah terbaru Anda untuk memantau kesehatan
          kardiovaskular Anda.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <Card className="w-full lg:flex-1">
          <CardContent className="p-4 sm:p-5 lg:p-8">
            {/* Date of Examination */}
            <div className="mb-5 lg:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-5 items-start">
                {/* Date input */}
                <div className="w-full sm:w-64 lg:w-72 space-y-1.5">
                  <Label
                    htmlFor="date"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Tanggal Pemeriksaan
                  </Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      max={maxDate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;

                        if (selectedDate > maxDate) return;

                        handleChange("date", selectedDate);
                      }}
                      className="pl-9 w-full"
                    />
                  </div>
                </div>

                {/* Info box */}
                <div className="flex lg:hidden items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-muted-foreground w-full sm:max-w-[200px] sm:mt-7">
                  <InfoIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Masukkan tanggal saat tes dilakukan, bukan tanggal saat Anda
                    menerima hasilnya.
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-x-6 lg:gap-y-5 mb-6 lg:mb-8">
              {metrics.map(({ key, label, sublabel, target }) => (
                <div key={key} className="space-y-1.5">
                  <Label
                    htmlFor={key}
                    className="text-sm font-medium leading-none"
                  >
                    {label}{" "}
                    {sublabel && (
                      <span className="text-muted-foreground font-normal">
                        {sublabel}
                      </span>
                    )}
                  </Label>
                  <div className="flex items-center rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:border-ring">
                    <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input whitespace-nowrap select-none">
                      mg/dL
                    </span>
                    <Input
                      id={key}
                      type="number"
                      min={0}
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder="0"
                      className="flex-1 border-0 rounded-none shadow-none focus-visible:ring-0 text-left"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ideal: {target}
                  </p>
                </div>
              ))}
            </div>

            {errorMessage && (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
                {successMessage}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting || isFormInvalid}
                className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <SaveIcon className="w-4 h-4" />
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SIDE PANEL */}
        <div className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 flex-shrink-0">
          {/* Info: date reminder */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-muted-foreground">
            <InfoIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Masukkan tanggal saat tes dilakukan, bukan tanggal saat Anda
              menerima hasilnya.
            </span>
          </div>

          {/* Reference ranges card */}
          <Card className="border border-border">
            <CardContent className="p-5 space-y-4">
              <p className="text-sm font-semibold text-foreground">
                Referensi Lipid Normal
              </p>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex justify-between gap-2">
                  <span className="font-medium text-foreground">
                    Total Cholesterol
                  </span>
                  <span className="text-right">&lt; 200 mg/dL</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="font-medium text-foreground">
                    Triglycerides
                  </span>
                  <span className="text-right">&lt; 150 mg/dL</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="font-medium text-foreground">LDL</span>
                  <span className="text-right">&lt; 100 mg/dL</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="font-medium text-foreground">
                    HDL (Pria)
                  </span>
                  <span className="text-right">&gt; 40 mg/dL</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="font-medium text-foreground">
                    HDL (Wanita)
                  </span>
                  <span className="text-right">&gt; 50 mg/dL</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
