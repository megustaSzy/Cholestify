"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Minus, Search, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginationItems } from "@/hooks/usePagination";
import { useFetchListFood } from "@/hooks/useFetchListFood";

type Food = {
  id: number;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  status: "OPTIMAL" | "NEUTRAL" | "LIMIT";
  isRecommended: boolean;
};

export default function FoodDirectoryContent() {
  const [search, setSearch] = useState("");

  const {
    data: foods = [],
    isLoading,
    error,
    page,
    setPage,
    totalPages,
  } = useFetchListFood<Food[]>({
    endpoint: "/foods/public",
    limit: 10,
    search,
  });

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="w-full py-10">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            List Makanan
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Berikut tabel makanan yang dikategorikan berdasarkan dampaknya
            terhadap kolesterol, kandungan lemak, dan serat.
          </p>
        </div>

        <div className="mb-5 flex w-full justify-center">
          <div className="relative w-full max-w-[940px]">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search foods..."
              className="h-12 w-full rounded-xl border-gray-200 bg-white px-14 text-sm shadow-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mb-6 grid w-full gap-3 md:grid-cols-3">
          <Card className="rounded-2xl border-gray-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-11 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold leading-none text-gray-950">
                  Optimal
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Low LDL, High HDL
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-11 items-center justify-center rounded-full bg-amber-50">
                <Minus className="size-5 text-amber-500" />
              </div>

              <div>
                <h3 className="text-xl font-bold leading-none text-gray-950">
                  Neutral
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Konsumsi Jumlah Sedang
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-11 items-center justify-center rounded-full bg-red-50">
                <TriangleAlert className="size-5 text-red-500" />
              </div>

              <div>
                <h3 className="text-xl font-bold leading-none text-gray-950">
                  Limit
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Meningkatkan LDL
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto pb-2">
              <Table className="min-w-[560px] table-fixed">
                <TableHeader>
                  <TableRow className="bg-[#f7f7fb] hover:bg-[#f7f7fb]">
                    <TableHead className="h-14 w-[50%] px-3 text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Food Item
                    </TableHead>

                    <TableHead className="h-14 w-[20%] px-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Calories
                    </TableHead>

                    <TableHead className="h-14 w-[25%] px-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Protein (g)
                    </TableHead>

                    <TableHead className="h-14 w-[25%] px-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Fat (g)
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-32 text-center text-sm text-muted-foreground"
                      >
                        Memuat data makanan...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-32 text-center text-sm text-red-500"
                      >
                        Data Makanan Gagal Dimuat.
                      </TableCell>
                    </TableRow>
                  ) : foods.length > 0 ? (
                    foods.map((food) => (
                      <TableRow key={food.id} className="bg-white">
                        <TableCell className="px-3 py-4">
                          <div className="font-medium text-gray-950">
                            {food.name}
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-4 text-right font-medium text-gray-950">
                          {food.calories}
                        </TableCell>

                        <TableCell className="px-3 py-4 text-right font-medium text-gray-950">
                          {food.proteins.toFixed(1)}
                        </TableCell>

                        <TableCell className="px-3 py-4 text-right font-medium text-gray-950">
                          {food.fat.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-32 text-center text-sm text-muted-foreground"
                      >
                        Data makanan tidak ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-3 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrev}
                  aria-disabled={page === 1}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPaginationItems(page, totalPages).map((pageItem, index) => (
                <PaginationItem key={`${pageItem}-${index}`}>
                  {pageItem === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={`?page=${pageItem}`}
                      isActive={page === pageItem}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(pageItem);
                      }}
                      className="cursor-pointer"
                    >
                      {pageItem}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
