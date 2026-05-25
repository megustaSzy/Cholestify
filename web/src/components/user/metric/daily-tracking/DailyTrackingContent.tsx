"use client";

import { useState } from "react";
import TargetGoalsSidebar from "./TargetGoalsSidebar";
import DailyTrackingForm, { DailyTrackingActions } from "./DailyTrackingForm";
import { toast } from "sonner";
import axios from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { API } from "@/lib/utils";

type DailyTrackingPayload = {
  calories: number;
  protein: number;
  exerciseMins: number;
  foodNotes: string;
};

type DailyTrackingData = {
  id: number;
  date: string;
  calories: number;
  protein: number;
  exerciseMins: number;
  foodNotes: string;
  createdAt: string;
};

type DailyTrackingResponse = {
  success: boolean;
  message: string;
  data?: DailyTrackingData;
  metadata?: {
    status?: number;
  };
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

type FormMessage = {
  type: "success" | "error" | "warning";
  title: string;
  description: string;
};

const createDailyTracking = async (payload: DailyTrackingPayload) => {
  const response = await API.post<DailyTrackingResponse>(
    "/daily-trackings",
    payload,
  );

  return response.data;
};

const isInvalidNumber = (value: string) => {
  return (
    value.trim() === "" || Number.isNaN(Number(value)) || Number(value) < 0
  );
};

const isTargetExceededMessage = (message: string) => {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("melebihi") ||
    normalizedMessage.includes("target") ||
    normalizedMessage.includes("goal") ||
    normalizedMessage.includes("goals")
  );
};

const getDailyTrackingErrorMessage = (error: unknown): FormMessage => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status =
      error.response?.data?.metadata?.status ?? error.response?.status;
    const message = error.response?.data?.message ?? "";

    if (status === 401) {
      return {
        type: "error",
        title: "Sesi login berakhir",
        description:
          "Silakan login ulang agar data pengukuran harian dapat disimpan.",
      };
    }

    if (message && isTargetExceededMessage(message)) {
      return {
        type: "warning",
        title: "Target harian sudah melebihi batas",
        description: message,
      };
    }

    if (status === 400 || status === 409) {
      return {
        type: "warning",
        title: "Data belum bisa disimpan",
        description:
          message ||
          "Pastikan data kalori, protein, dan durasi olahraga tidak melebihi target kesehatan yang sudah Anda tetapkan.",
      };
    }

    if (status && status >= 500) {
      return {
        type: "error",
        title: "Server sedang bermasalah",
        description:
          "Data pengukuran harian belum berhasil disimpan. Silakan coba lagi beberapa saat.",
      };
    }

    return {
      type: "error",
      title: "Gagal menyimpan data",
      description: message || "Terjadi kesalahan saat menyimpan data.",
    };
  }

  return {
    type: "error",
    title: "Gagal menyimpan data",
    description: "Terjadi kesalahan saat menyimpan data.",
  };
};

function DailyTrackingMessage({ message }: { message: FormMessage }) {
  const isSuccess = message.type === "success";
  const isWarning = message.type === "warning";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        isSuccess
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : isWarning
            ? "border-amber-100 bg-amber-50 text-amber-700"
            : "border-red-100 bg-red-50 text-red-700"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}

      <div>
        <p className="font-semibold">{message.title}</p>
        <p className="mt-1 text-xs leading-relaxed">{message.description}</p>
      </div>
    </div>
  );
}

export default function DailyTrackingContent() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [foodNotes, setFoodNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);

  const resetForm = () => {
    setCalories("");
    setProtein("");
    setExerciseMinutes("");
    setFoodNotes("");
  };

  const handleCancel = () => {
    resetForm();
    setFormMessage(null);
  };

  const handleSave = async () => {
    setFormMessage(null);

    if (
      isInvalidNumber(calories) ||
      isInvalidNumber(protein) ||
      isInvalidNumber(exerciseMinutes)
    ) {
      setFormMessage({
        type: "warning",
        title: "Data belum lengkap",
        description:
          "Kalori, protein, dan durasi olahraga wajib diisi dengan angka yang valid.",
      });

      toast.error("Data belum lengkap.");
      return;
    }

    const payload: DailyTrackingPayload = {
      calories: Number(calories),
      protein: Number(protein),
      exerciseMins: Number(exerciseMinutes),
      foodNotes,
    };

    try {
      setIsSubmitting(true);

      const response = await createDailyTracking(payload);

      resetForm();

      setFormMessage({
        type: "success",
        title: "Data berhasil disimpan",
        description:
          response.message || "Pengukuran harian berhasil ditambahkan.",
      });

      toast.success(response.message || "Data berhasil disimpan");
    } catch (error: unknown) {
      const friendlyError = getDailyTrackingErrorMessage(error);

      setFormMessage(friendlyError);

      toast.error(friendlyError.title, {
        description: friendlyError.description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {formMessage && <DailyTrackingMessage message={formMessage} />}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="flex w-full flex-col gap-4">
          <DailyTrackingForm
            calories={calories}
            protein={protein}
            exerciseMinutes={exerciseMinutes}
            foodNotes={foodNotes}
            onCaloriesChange={setCalories}
            onProteinChange={setProtein}
            onExerciseMinutesChange={setExerciseMinutes}
            onFoodNotesChange={setFoodNotes}
          />

          <div className="flex justify-end">
            <DailyTrackingActions
              onCancel={handleCancel}
              onSave={handleSave}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[760px] lg:mx-0 lg:max-w-none">
          <TargetGoalsSidebar />
        </div>
      </div>
    </div>
  );
}
