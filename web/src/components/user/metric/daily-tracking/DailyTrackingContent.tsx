"use client";

import { useState } from "react";
import TargetGoalsSidebar from "./TargetGoalsSidebar";
import DailyTrackingForm, { DailyTrackingActions } from "./DailyTrackingForm";
import { toast } from "sonner";
import { API } from "@/lib/utils";

export default function DailyTrackingContent() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [foodNotes, setFoodNotes] = useState("");

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
    try {
      const payload = {
        calories,
        protein,
        exerciseMinutes,
        foodNotes,
      };

      await createDailyTracking(payload);

      console.log(payload);

      resetForm();
      toast.success("Data berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan data");
    }
  };

  const createDailyTracking = async (Payload: {
    calories: string;
    protein: string;
    exerciseMinutes: string;
    foodNotes: string;
  }) => {
    const res = await API.post("/daily-tracking", Payload);
    return res.data;
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 px-4 sm:px-6 lg:px-0">
      {/* Main content: form + sidebar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center lg:items-start">
        {/* Form card */}
        <div className="w-full max-w-[760px] lg:max-w-none lg:flex-1">
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
        </div>

        {/* Sidebar */}
        <div className="w-full max-w-[760px] lg:w-[220px] lg:max-w-[220px]">
          <TargetGoalsSidebar />
        </div>
      </div>

      {/* Action buttons below */}
      <div className="w-full max-w-[760px] lg:max-w-none mx-auto lg:mx-0">
        <DailyTrackingActions onCancel={handleCancel} onSave={handleSave} />
      </div>
    </div>
  );
}
