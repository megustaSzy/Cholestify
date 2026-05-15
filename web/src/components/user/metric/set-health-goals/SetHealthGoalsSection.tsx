"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Utensils, Activity, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoalCategory } from "@/lib/types";

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
  {
    key: "anthropometric",
    title: "Anthropometric",
    icon: <Scale className="h-4 w-4" />,
    iconBg: "text-cyan-600",
    fields: [
      {
        id: "body_weight",
        label: "TARGET BODY WEIGHT",
        placeholder: "e.g. 75.5",
        unit: "kg",
        hint: "Aim for a steady 0.5-1 kg change per week.",
      },
    ],
  },
];

function GoalCard({
  category,
  values,
  onChange,
}: {
  category: GoalCategory;
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
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

      {/* Fields */}
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
              value={values[field.id] ?? ""}
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
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    setFieldValues({});
  };

  const handleSave = () => {
    // handle save logic
    console.log("Saved goals:", fieldValues);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form card */}
      <div className="flex-1 rounded-2xl border border-border bg-card shadow-sm p-5 md:p-7 flex flex-col gap-6">
        {/* Goal cards grid */}
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

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[90px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="min-w-[110px] bg-blue-600 hover:bg-blue-700"
          >
            Save Goals
          </Button>
        </div>
      </div>
    </div>
  );
}
