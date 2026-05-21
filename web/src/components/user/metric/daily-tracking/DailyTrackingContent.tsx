"use client";

import { useState } from "react";
import TargetGoalsSidebar from "./TargetGoalsSidebar";
import DailyTrackingForm, { DailyTrackingActions } from "./DailyTrackingForm";
import { toast } from "sonner";
import axios from "axios";
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

const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? "Gagal menyimpan data";
  }

  return "Gagal menyimpan data";
};

export default function DailyTrackingContent() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [foodNotes, setFoodNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCalories("");
    setProtein("");
    setExerciseMinutes("");
    setFoodNotes("");
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleSave = async () => {
    if (
      isInvalidNumber(calories) ||
      isInvalidNumber(protein) ||
      isInvalidNumber(exerciseMinutes)
    ) {
      toast.error("Calories, protein, dan exercise minutes wajib diisi.");
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
      toast.success(response.message || "Data berhasil disimpan");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_260px] gap-4 lg:gap-6 items-start">
        <div className="w-full flex flex-col gap-4">
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

        <div className="w-full max-w-[760px] mx-auto lg:mx-0 lg:max-w-none">
          <TargetGoalsSidebar />
        </div>
      </div>
    </div>
  );
}
