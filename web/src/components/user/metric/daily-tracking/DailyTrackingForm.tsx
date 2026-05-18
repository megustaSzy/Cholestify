"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FlameIcon,
  DumbbellIcon,
  SaveIcon,
  UtensilsIcon,
  LayoutDashboardIcon,
} from "lucide-react";

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
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <LayoutDashboardIcon className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg font-semibold">Metrik Harian</CardTitle>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 flex flex-col gap-5">
        {/* Daily Calories */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="daily-calories"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Kalori Harian (kcal)
          </Label>
          <div className="relative">
            <FlameIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="daily-calories"
              type="number"
              placeholder="e.g. 2000"
              value={calories}
              min={0}
              onChange={(e) => onCaloriesChange(e.target.value)}
              className="pl-9"
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
            <FlameIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="daily-protein"
              type="number"
              placeholder="e.g. 2000"
              value={protein}
              min={0}
              onChange={(e) => onProteinChange(e.target.value)}
              className="pl-9"
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
            <DumbbellIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="exercise-minutes"
              type="number"
              placeholder="e.g. 45"
              value={exerciseMinutes}
              min={0}
              onChange={(e) => onExerciseMinutesChange(e.target.value)}
              className="pl-9"
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
            <UtensilsIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <textarea
              id="food-notes"
              placeholder="Tuliskan asupan makanan Anda disini..."
              value={foodNotes}
              onChange={(e) => onFoodNotesChange(e.target.value)}
              rows={4}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
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
        Cancel
      </Button>

      <Button
        onClick={onSave}
        disabled={isSubmitting}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <SaveIcon className="w-4 h-4" />
        {isSubmitting ? "Saving..." : "Save Entry"}
      </Button>
    </div>
  );
}
