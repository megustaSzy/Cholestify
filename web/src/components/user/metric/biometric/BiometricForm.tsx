"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, RulerIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { API } from "@/lib/utils";
import { useSWRConfig } from "swr";
import { useFetchData } from "@/hooks/useFetchData";

type BiometricsPayload = {
  height: number;
  weight: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type BiometricsData = {
  id?: number;
  height: number;
  weight: number;
  bmi?: number;
  bmiCategory?: string;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      "Gagal menyimpan data biometrics. Silakan coba lagi."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Gagal menyimpan data biometrics. Silakan coba lagi.";
}

function isInvalidNumber(value: string): boolean {
  return (
    value.trim() === "" || Number.isNaN(Number(value)) || Number(value) <= 0
  );
}

export default function LogBiometricsContent() {
  // const [height, setHeight] = useState("");
  // const [weight, setWeight] = useState("");
  const [heightDraft, setHeightDraft] = useState<string | null>(null);
  const [weightDraft, setWeightDraft] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { mutate } = useSWRConfig();

  const {
    data: biometricsResponse,
    isLoading: isLoadingBiometrics,
    mutate: mutateBiometrics,
  } = useFetchData<ApiResponse<BiometricsData>>("/biometrics/me");

  const existingBiometrics = biometricsResponse?.data;
  const isUpdateMode = Boolean(existingBiometrics);

  const heightValue =
    heightDraft ??
    (existingBiometrics ? String(existingBiometrics.height) : "");

  const weightValue =
    weightDraft ??
    (existingBiometrics ? String(existingBiometrics.weight) : "");

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (isInvalidNumber(heightValue) || isInvalidNumber(weightValue)) {
      setErrorMessage("Height dan weight wajib diisi dengan angka valid.");
      return;
    }

    const payload: BiometricsPayload = {
      height: Number(heightValue),
      weight: Number(weightValue),
    };

    try {
      setIsSubmitting(true);

      if (isUpdateMode) {
        await API.patch("/biometrics/", payload);
        setSuccessMessage("Data biometrics berhasil diperbarui.");
      } else {
        await API.post("/biometrics", payload);
        setSuccessMessage("Data biometrics berhasil disimpan.");
      }

      await mutateBiometrics();

      setHeightDraft(null);
      setWeightDraft(null);

      void mutate("/biometrics/me");
      void mutate("/health-summary");
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setHeightDraft(null);
    setWeightDraft(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <Card className="shadow-sm border border-border w-full mx-auto max-w-3xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <RulerIcon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Ukuran Fisik
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Masukkan tinggi dan berat badan Anda
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="height" className="text-sm font-medium">
            Height <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="height"
              type="number"
              min="0"
              placeholder="e.g. 175"
              value={heightValue}
              onChange={(e) => {
                setHeightDraft(e.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "-") e.preventDefault();
              }}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
              cm
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weight" className="text-sm font-medium">
            Weight <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="weight"
              type="number"
              min="0"
              placeholder="e.g. 70.5"
              value={weightValue}
              onChange={(e) => {
                setWeightDraft(e.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "-") e.preventDefault();
              }}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
              kg
            </span>
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-600">
            {successMessage}
          </p>
        )}

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2.5">
          <InfoIcon className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" />
          <span>
            Pastikan pengukuran dilakukan tanpa sepatu dan mengenakan pakaian
            tipis untuk akurasi optimal.
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSubmitting || isLoadingBiometrics}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <SaveIcon className="w-4 h-4" />
            {isSubmitting
              ? isUpdateMode
                ? "Updating..."
                : "Saving..."
              : isUpdateMode
                ? "Update Data"
                : "Save Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
