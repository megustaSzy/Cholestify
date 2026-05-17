"use client";

import { useState, type ReactNode } from "react";
import axios from "axios";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Utensils, Activity } from "lucide-react";
import { cn, API } from "@/lib/utils";

type GoalFieldId = "ldl_hdl_ratio" | "weekly_calories" | "exercise_mins";

type GoalField = {
  id: GoalFieldId;
  label: string;
  placeholder: string;
  unit: string;
  hint: string;
};

type GoalCategory = {
  key: string;
  title: string;
  icon: ReactNode;
  iconBg: string;
  fields: GoalField[];
};

type FieldValues = Record<GoalFieldId, string>;

type HealthGoalPayload = {
  targetLdlHdlRatio: number;
  targetWeeklyCalories: number;
  targetExerciseMins: number;
};

type HealthGoalData = {
  id: number;
  userId?: number;
  targetLdlHdlRatio: number;
  targetWeeklyCalories: number;
  targetExerciseMins: number;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

const initialFieldValues: FieldValues = {
  ldl_hdl_ratio: "",
  weekly_calories: "",
  exercise_mins: "",
};

const goalCategories: GoalCategory[] = [
  {
    key: "cardiovascular",
    title: "Cardiovascular",
    icon: <Heart className="h-4 w-4" />,
    iconBg: "text-rose-500",
    fields: [
      {
        id: "ldl_hdl_ratio",
        label: "TARGET LDL/HDL RATIO",
        placeholder: "e.g. 2.5",
        unit: "Ratio",
        hint: "Optimal clinical range is typically below 2.5.",
      },
    ],
  },
  {
    key: "metabolic",
    title: "Metabolic",
    icon: <Utensils className="h-4 w-4" />,
    iconBg: "text-amber-500",
    fields: [
      {
        id: "weekly_calories",
        label: "TARGET WEEKLY CALORIES",
        placeholder: "e.g. 14000",
        unit: "kcal",
        hint: "Based on standard BMR calculations.",
      },
    ],
  },
  {
    key: "physical_activity",
    title: "Physical Activity",
    icon: <Activity className="h-4 w-4" />,
    iconBg: "text-blue-500",
    fields: [
      {
        id: "exercise_mins",
        label: "TARGET EXERCISE",
        placeholder: "e.g. 150",
        unit: "mins/week",
        hint: "AHA recommends 150 mins moderate activity.",
      },
    ],
  },
];

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      "Gagal menyimpan health goals. Silakan coba lagi."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Gagal menyimpan health goals. Silakan coba lagi.";
}

function isInvalidNumber(value: string): boolean {
  return (
    value.trim() === "" || Number.isNaN(Number(value)) || Number(value) <= 0
  );
}

function GoalCard({
  category,
  values,
  onChange,
}: {
  category: GoalCategory;
  values: FieldValues;
  onChange: (id: GoalFieldId, value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        <span
          className={cn("flex items-center justify-center", category.iconBg)}
        >
          {category.icon}
        </span>
        <h3 className="font-semibold text-base text-foreground">
          {category.title}
        </h3>
      </div>

      {category.fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <Label
            htmlFor={field.id}
            className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
          >
            {field.label}
          </Label>

          <div className="flex items-center rounded-lg border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
            <Input
              id={field.id}
              type="number"
              min="0"
              placeholder={field.placeholder}
              value={values[field.id]}
              onChange={(e) => {
                if (Number(e.target.value) < 0) return;
                onChange(field.id, e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "-") {
                  e.preventDefault();
                }
              }}
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm flex-1 min-w-0"
            />

            <span className="px-3 text-xs text-muted-foreground whitespace-nowrap border-l border-input h-full flex items-center bg-muted/40">
              {field.unit}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-snug">
            {field.hint}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function SetHealthGoalsSection() {
  const { mutate } = useSWRConfig();

  const [fieldValues, setFieldValues] =
    useState<FieldValues>(initialFieldValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (id: GoalFieldId, value: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setFieldValues(initialFieldValues);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (
      isInvalidNumber(fieldValues.ldl_hdl_ratio) ||
      isInvalidNumber(fieldValues.weekly_calories) ||
      isInvalidNumber(fieldValues.exercise_mins)
    ) {
      setErrorMessage("Semua target kesehatan wajib diisi dengan angka valid.");
      return;
    }

    const payload: HealthGoalPayload = {
      targetLdlHdlRatio: Number(fieldValues.ldl_hdl_ratio),
      targetWeeklyCalories: Number(fieldValues.weekly_calories),
      targetExerciseMins: Number(fieldValues.exercise_mins),
    };

    try {
      setIsSubmitting(true);

      await API.post<ApiResponse<HealthGoalData>>("/health-goals", payload);

      setSuccessMessage("Health goals berhasil disimpan.");
      setFieldValues(initialFieldValues);

      mutate("/health-goals/me");
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormInvalid =
    isInvalidNumber(fieldValues.ldl_hdl_ratio) ||
    isInvalidNumber(fieldValues.weekly_calories) ||
    isInvalidNumber(fieldValues.exercise_mins);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1 rounded-2xl border border-border bg-card shadow-sm p-5 md:p-7 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goalCategories.map((cat) => (
            <GoalCard
              key={cat.key}
              category={cat}
              values={fieldValues}
              onChange={handleChange}
            />
          ))}
        </div>

        {errorMessage && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
            {successMessage}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="min-w-[90px]"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSubmitting || isFormInvalid}
            className="min-w-[110px] bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save Goals"}
          </Button>
        </div>
      </div>
    </div>
  );
}
