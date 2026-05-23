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
  // icon: ReactNode;
  // iconBg: string;
  fields: GoalField[];
};

type FieldValues = Record<GoalFieldId, string>;

type HealthGoalPayload = {
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
    key: "metabolic",
    title: "Metabolisme",
    // icon: <Utensils className="h-4 w-4" />,
    // iconBg: "text-amber-500",
    fields: [
      {
        id: "weekly_calories",
        label: "TARGET KALORI Mingguan",
        placeholder: "Contoh: 14000",
        unit: "kcal",
        hint: "Gunakan angka total kalori yang ingin dicapai dalam 1 minggu.",
      },
    ],
  },
  {
    key: "physical_activity",
    title: "Aktivitas Fisik",
    // icon: <Activity className="h-4 w-4" />,
    // iconBg: "text-blue-500",
    fields: [
      {
        id: "exercise_mins",
        label: "TARGET MENIT Aktifitas Fisik Mingguan",
        placeholder: "Contoh: 150",
        unit: "menit/minggu",
        hint: "Masukkan angka total waktu olahraga yang ingin dicapai dalam 1 minggu.",
      },
    ],
  },
];

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      "Gagal menyimpan tujuan kesehatan. Silakan coba lagi."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Gagal menyimpan tujuan kesehatan. Silakan coba lagi.";
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
  className,
}: {
  category: GoalCategory;
  values: FieldValues;
  onChange: (id: GoalFieldId, value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex w-full justify-center">
        {/* <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted",
            category.iconBg,
          )}
        >
          {category.icon}
        </span> */}

        <div className="text-center mb-5">
          <h3 className="font-semibold text-base text-foreground">
            {category.title}
          </h3>
          <p className="text-xs text-muted-foreground text-center">
            Atur target sesuai kebutuhan kesehatan Anda.
          </p>
        </div>
      </div>

      {category.fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <Label
            htmlFor={field.id}
            className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
          >
            {field.label}
          </Label>

          <div className="flex items-center rounded-xl border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
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
                if (e.key === "-") e.preventDefault();
              }}
              className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
            />

            <span className="h-11 px-3 text-xs text-muted-foreground whitespace-nowrap border-l border-input flex items-center bg-muted/40">
              {field.unit}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
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
      isInvalidNumber(fieldValues.weekly_calories) ||
      isInvalidNumber(fieldValues.exercise_mins)
    ) {
      setErrorMessage("Semua target kesehatan wajib diisi dengan angka valid.");
      return;
    }

    const payload: HealthGoalPayload = {
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
    isInvalidNumber(fieldValues.weekly_calories) ||
    isInvalidNumber(fieldValues.exercise_mins);

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border bg-card shadow-sm o  verflow-hidden">
        <div className="border-b border-border px-5 py-5 md:px-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Target Tujuan Kesehatan
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Masukkan target utama yang akan digunakan untuk pemantauan kesehatan
            harian Anda.
          </p>
        </div>

        <div className="p-5 md:p-6">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {goalCategories.map((cat, index) => (
              <GoalCard
                key={cat.key}
                category={cat}
                values={fieldValues}
                onChange={handleChange}
                className={cn(index === 2 && "md:col-span-2 xl:col-span-1")}
              />
            ))}
          </div>

          {errorMessage && (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="mt-5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
              {successMessage}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end md:px-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:min-w-[90px]"
          >
            Batal
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSubmitting || isFormInvalid}
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto sm:min-w-[110px]"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Target"}
          </Button>
        </div>
      </div>
    </div>
  );
}
