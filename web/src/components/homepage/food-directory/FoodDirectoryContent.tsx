"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  CheckCircle2,
  Minus,
  Search,
  TriangleAlert,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchListFood } from "@/hooks/useFetchListFood";
import { getPaginationItems } from "@/hooks/usePagination";

type Food = {
  id: number;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  status: "OPTIMAL" | "NEUTRAL" | "LIMIT";
  isRecommended: boolean;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

type FoodTableStateProps = {
  title: string;
  description: string;
};

const getFoodErrorState = (error: unknown): FoodTableStateProps => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status =
      error.response?.data?.metadata?.status ?? error.response?.status;

    const message = error.response?.data?.message ?? "";

    if (status === 404) {
      return {
        title: "Data makanan tidak ditemukan",
        description: "Belum ada data makanan yang cocok dengan pencarian Anda.",
      };
    }

    return {
      title: "Data makanan gagal dimuat",
      description: message || "Terjadi kesalahan saat mengambil data makanan.",
    };
  }

  return {
    title: "Data makanan gagal dimuat",
    description: "Terjadi kesalahan saat mengambil data makanan.",
  };
};

function FoodTableState({ title, description }: FoodTableStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-50">
        <AlertTriangle className="size-6 text-amber-600" />
      </div>

      <h3 className="text-base font-semibold text-gray-950">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

const nutritionGuideItems = [
  {
    title: "Kalori",
    description: "Menunjukkan jumlah energi dari makanan.",
    className: "border-blue-100 bg-blue-50 text-slate-800 font-medium",
  },
  {
    title: "Protein",
    description: "Membantu menjaga massa otot dan pemulihan tubuh.",
    className: "border-blue-100 bg-blue-50 text-slate-800 font-medium",
  },
  {
    title: "Lemak",
    description: "Perlu diperhatikan agar asupan tetap seimbang.",
    className: "border-blue-100 bg-blue-50 text-slate-800 font-medium",
  },
];

export default function FoodDirectoryContent() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
    search: searchQuery,
  });

  useEffect(() => {
    const nextSearch = searchInput.trim();

    const timer = window.setTimeout(() => {
      setPage(1);
      setSearchQuery(nextSearch);
    }, 800);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const foodErrorState = useMemo(() => {
    return error ? getFoodErrorState(error) : null;
  }, [error]);

  const shouldShowPagination =
    !foodErrorState && foods.length > 0 && totalPages > 1;

  const paginationItems = useMemo(() => {
    return getPaginationItems(page, totalPages);
  }, [page, totalPages]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="w-full py-10">
      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
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
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              placeholder="Cari Makanan..."
              className="h-12 w-full rounded-xl border-gray-200 bg-white px-14 text-sm shadow-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* <div className="mb-6 grid w-full gap-3 md:grid-cols-3">
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
        </div> */}

        <div className="mx-auto mb-6 w-full max-w-[1120px] rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 px-5 py-6 shadow-sm sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-lg font-bold leading-snug text-gray-950">
                Pahami kandungan makanan
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Gunakan tabel ini sebagai referensi awal untuk melihat kandungan
                kalori, protein, dan lemak pada setiap makanan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              {nutritionGuideItems.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border px-4 py-4 ${item.className}`}
                >
                  <p className="text-sm font-bold">{item.title}</p>

                  <p className="mt-2 text-xs leading-relaxed opacity-90">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="mx-auto w-full overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto pb-2">
              <Table className="min-w-[680px] table-fixed">
                <TableHeader>
                  <TableRow className="bg-[#f7f7fb] hover:bg-[#f7f7fb]">
                    <TableHead className="h-14 w-[40%] px-10 text-left text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Makanan
                    </TableHead>

                    <TableHead className="h-14 w-[20%] px-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Kalori (kcal)
                    </TableHead>

                    <TableHead className="h-14 w-[20%] px-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Protein (g)
                    </TableHead>

                    <TableHead className="h-14 w-[20%] px-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-950">
                      Lemak (g)
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
                  ) : foodErrorState ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-56">
                        <FoodTableState {...foodErrorState} />
                      </TableCell>
                    </TableRow>
                  ) : foods.length > 0 ? (
                    foods.map((food) => (
                      <TableRow key={food.id} className="bg-white">
                        <TableCell className="px-10 py-4">
                          <div className="font-medium text-gray-950">
                            {food.name}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-4 text-center font-medium text-gray-950">
                          {food.calories}
                        </TableCell>
                        <TableCell className="px-3 py-4 text-center font-medium text-gray-950">
                          {food.proteins.toFixed(1)}
                        </TableCell>
                        <TableCell className="px-3 py-4 text-center font-medium text-gray-950">
                          {food.fat.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-56">
                        <FoodTableState
                          title="Data makanan tidak ditemukan"
                          description="Belum ada data makanan yang sesuai dengan pencarian Anda."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {shouldShowPagination && (
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

                {paginationItems.map((pageItem, index) => (
                  <PaginationItem key={`${pageItem}-${index}`}>
                    {pageItem === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={`?page=${pageItem}`}
                        isActive={page === pageItem}
                        aria-disabled={page === pageItem}
                        onClick={(event) => {
                          event.preventDefault();

                          if (page === pageItem) return;

                          setPage(pageItem);
                        }}
                        className={
                          page === pageItem
                            ? "pointer-events-none cursor-default opacity-50"
                            : "cursor-pointer"
                        }
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
        )}
      </div>
    </div>
  );
}
