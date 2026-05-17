"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Minus, Search, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFetchData } from "@/hooks/useFetchData";

export const foods = [
  {
    name: "Telur (Whole)",
    category: "Protein",
    impact: "Neutral",
    satFat: 1.6,
    fiber: 0.0,
  },
  {
    name: "Oats (Steel-cut)",
    category: "Grains",
    impact: "Optimal",
    satFat: 0.3,
    fiber: 4.0,
  },
  {
    name: "Salmon (Wild)",
    category: "Seafood",
    impact: "Optimal",
    satFat: 1.0,
    fiber: 0.0,
  },
  {
    name: "Mentega (Commercial)",
    category: "Dairy",
    impact: "Limit",
    satFat: 7.3,
    fiber: 0.0,
  },
  {
    name: "Apel",
    category: "Fruit",
    impact: "Optimal",
    satFat: 0.1,
    fiber: 2.4,
  },
];

type FoodImpact = "Optimal" | "Neutral" | "Limit";

type Food = {
  id: number;
  name: string;
  category: string;
  impact: FoodImpact;
  satFat: number;
  fiber: number;
};

type FoodResponse = {
  data: Food[];
};

const impactBadgeClass: Record<FoodImpact, string> = {
  Optimal: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  Neutral: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  Limit: "bg-red-50 text-red-700 hover:bg-red-50",
};

export default function BodySection() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: foods = [], error, isLoading } = useFetchData<Food[]>("/foods");

  // const food = foods as Food[];

  // const foods = data?.data ?? [];

  const filteredFoods = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return foods;

    return foods.filter((food) => {
      return (
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query) ||
        food.impact.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, foods]);
  return (
    <>
      {/* search section */}
      <div className="mb-4 flex w-full justify-center">
        <div className="relative w-full max-w-[750px]">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search foods, categories..."
            className="h-10 w-full rounded-lg bg-white px-12 text-start placeholder:text-start"
          />
        </div>
      </div>

      {/* card section */}
      <div className="mb-5 grid w-full gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-none">Optimal</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Low LDL, High HDL
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-600">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-amber-50">
              <Minus className="size-5 text-amber-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-none">Neutral</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Konsumsi Jumlah Sedang
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-red-50">
              <TriangleAlert className="size-5 text-red-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-none">Limit</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Meningkatkan LDL
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* table section */}
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-[#f7f7fb]">
                <TableHead className="w-[42%] text-[10px] uppercase tracking-wide">
                  Food Item
                </TableHead>
                <TableHead className="w-[22%] text-[10px] uppercase tracking-wide">
                  Impact
                </TableHead>
                <TableHead className="w-[18%] text-right text-[10px] uppercase tracking-wide">
                  Sat. Fat (g)
                </TableHead>
                <TableHead className="w-[18%] text-right text-[10px] uppercase tracking-wide">
                  Fiber (g)
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-sm text-red-500"
                  >
                    Data Makanan Gagal Dimuat.
                  </TableCell>
                </TableRow>
              ) : filteredFoods.length > 0 ? (
                filteredFoods.map((food) => {
                  return (
                    <TableRow key={food.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {food.category}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={impactBadgeClass[food.impact]}
                        >
                          {food.impact}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {food.satFat.toFixed(1)}
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {food.fiber.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    Data makanan tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
