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

export default function LogBiometricsContent() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleSave = () => {
    // handle save logic
    console.log({ height, weight });
  };

  const handleCancel = () => {
    setHeight("");
    setWeight("");
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
              Physical Dimensions
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Standard Measurements
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 flex flex-col gap-5">
        {/* Height field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="height" className="text-sm font-medium">
            Height <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="height"
              type="number"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
              cm
            </span>
          </div>
        </div>

        {/* Weight field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weight" className="text-sm font-medium">
            Weight <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="weight"
              type="number"
              placeholder="e.g. 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
              kg
            </span>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2.5">
          <InfoIcon className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" />
          <span>
            Ensure measurements are taken without shoes and wearing light
            clothing for optimal accuracy.
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <SaveIcon className="w-4 h-4" />
            Save Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
