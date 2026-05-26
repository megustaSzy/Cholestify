"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HealthGoal = {
  id?: number;
  userId?: number;
  targetWeeklyCalories?: number;
  targetExerciseMins?: number;
  targetDailyCalories?: number;
  targetProtein?: number;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    status?: number;
  };
};

const formatNumber = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toLocaleString("id-ID");
};

export default function TargetGoalsSidebar() {
  const {
    data: response,
    isLoading,
    error,
  } = useFetchData<ApiResponse<HealthGoal>>("/health-goals/me");

  const goal = response?.data;

  const targetCalories =
    goal?.targetDailyCalories ?? goal?.targetWeeklyCalories ?? null;

  const targetExercise = goal?.targetExerciseMins ?? null;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Target Goals Card */}
      <Card className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
        <CardHeader className="px-5 pb-2 pt-5">
          <CardTitle className="text-base font-semibold text-gray-950">
            Target Goals Saat ini
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 pb-5 pt-1">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat target...
            </div>
          ) : error ? (
            <p className="text-xs leading-relaxed text-amber-600">
              Target goals belum tersedia. Silakan atur target kesehatan
              terlebih dahulu.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm text-gray-600">Kalori</span>
                </div>

                <span className="text-sm font-semibold text-gray-950">
                  {formatNumber(targetCalories)} kcal
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm text-gray-600">Olahraga</span>
                </div>

                <span className="text-sm font-semibold text-gray-950">
                  {formatNumber(targetExercise)} menit
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivational Image Card */}
      <Card className="h-[130px] w-full overflow-hidden rounded-2xl border border-border p-0 shadow-sm sm:h-[150px] lg:h-[130px]">
        <div className="relative h-full w-full">
          <Image
            src="/healthy-food.png"
            alt="Healthy vegetables for clinical tracking"
            fill
            sizes="(max-width: 1024px) 100vw, 220px"
            priority
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <p className="absolute bottom-3 left-3 right-3 text-xs font-semibold leading-tight text-white">
            Konsisten dalam pencatatan akan memantau kesehatan Anda
          </p>
        </div>
      </Card>
    </div>
  );
}
