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
import { SaveIcon } from "lucide-react";

interface DailyTrackingFormProps {
  calories: string;
  protein: string;
  exerciseMinutes: string;
  foodNotes: string;
  onCaloriesChange: (v: string) => void;
  onProteinChange: (v: string) => void;
  onExerciseMinutesChange: (v: string) => void;
  onFoodNotesChange: (v: string) => void;
}

export default function DailyTrackingForm({
  calories,
  protein,
  exerciseMinutes,
  foodNotes,
  onCaloriesChange,
  onProteinChange,
  onExerciseMinutesChange,
  onFoodNotesChange,
}: DailyTrackingFormProps) {
  return (
    <Card className="shadow-sm border border-border w-full">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-xl font-semibold pt-3 text-center">
            Metrik Harian
          </CardTitle>
          <CardDescription className="text-center">
            Input metrik harian Anda Seperti Kalori, Protein, dan Aktivitas
          </CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-5">
        {/* Daily Calories */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="daily-calories"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Kalori Harian (kcal)
          </Label>
          <div className="relative">
            <Input
              id="daily-calories"
              type="number"
              placeholder="2000"
              value={calories}
              min={0}
              onChange={(e) => onCaloriesChange(e.target.value)}
              className="pl-3"
            />
          </div>
        </div>

        {/* Daily Protein */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="daily-protein"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Protein Harian (g)
          </Label>
          <div className="relative">
            <Input
              id="daily-protein"
              type="number"
              placeholder="2000"
              value={protein}
              min={0}
              onChange={(e) => onProteinChange(e.target.value)}
              className="pl-3"
            />
          </div>
        </div>

        {/* Exercise Minutes */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="exercise-minutes"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Menit Olahraga
          </Label>
          <div className="relative">
            <Input
              id="exercise-minutes"
              type="number"
              placeholder="45"
              value={exerciseMinutes}
              min={0}
              onChange={(e) => onExerciseMinutesChange(e.target.value)}
              className="pl-3"
            />
          </div>
        </div>

        {/* Food Consumption Notes */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="food-notes"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Catatan Konsumsi Makanan
          </Label>
          <div className="relative">
            <textarea
              id="food-notes"
              placeholder="Tuliskan asupan makanan Anda disini..."
              value={foodNotes}
              onChange={(e) => onFoodNotesChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyTrackingActions({
  onCancel,
  onSave,
  isSubmitting = false,
}: {
  onCancel?: () => void;
  onSave?: () => void | Promise<void>;
  isSubmitting?: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        Batal
      </Button>

      <Button
        onClick={onSave}
        disabled={isSubmitting}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <SaveIcon className="w-4 h-4" />
        {isSubmitting ? "Menyimpan..." : "Simpan"}
      </Button>
    </div>
  );
}
