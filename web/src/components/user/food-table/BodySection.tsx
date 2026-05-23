"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  AlertTriangle,
  CheckCircle2,
  Minus,
  Search,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type FoodStatus = "OPTIMAL" | "NEUTRAL" | "LIMIT";

type Food = {
  id: number;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  status: FoodStatus;
  isRecommended: boolean;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

type FoodErrorState = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

const statusBadgeClass: Record<FoodStatus, string> = {
  OPTIMAL: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  NEUTRAL: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  LIMIT: "bg-red-50 text-red-700 hover:bg-red-50",
};

const statusLabel: Record<FoodStatus, string> = {
  OPTIMAL: "Optimal",
  NEUTRAL: "Neutral",
  LIMIT: "Limit",
};

const statusCards = [
  {
    status: "OPTIMAL",
    title: "Optimal",
    description: "Low LDL, High HDL",
    icon: CheckCircle2,
    activeBorderClass: "border-emerald-500",
    iconBoxClass: "bg-emerald-50",
    iconClass: "text-emerald-600",
  },
  {
    status: "NEUTRAL",
    title: "Netral",
    description: "Konsumsi Jumlah Sedang",
    icon: Minus,
    activeBorderClass: "border-amber-500",
    iconBoxClass: "bg-amber-50",
    iconClass: "text-amber-500",
  },
  {
    status: "LIMIT",
    title: "Limit",
    description: "Meningkatkan LDL",
    icon: TriangleAlert,
    activeBorderClass: "border-red-500",
    iconBoxClass: "bg-red-50",
    iconClass: "text-red-500",
  },
] as const;

const getFoodErrorState = (error: unknown): FoodErrorState => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status =
      error.response?.data?.metadata?.status ?? error.response?.status;

    const message = error.response?.data?.message ?? "";

    if (status === 400) {
      return {
        title: "Lipid panel belum terisi",
        description:
          "Silakan isi lipid panel terlebih dahulu agar sistem dapat menampilkan rekomendasi makanan berdasarkan data kolesterol terbaru Anda.",
        actionLabel: "Isi Lipid Panel",
        actionHref: "/user/metric/log-lipid-panel",
      };
    }

    if (status === 401) {
      return {
        title: "Sesi login tidak valid",
        description: "Silakan login kembali untuk mengakses data makanan.",
        actionLabel: "Login",
        actionHref: "/login",
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

function FoodTableState({
  title,
  description,
  actionLabel,
  actionHref,
}: FoodErrorState) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-50">
        <AlertTriangle className="size-6 text-amber-600" />
      </div>

      <h3 className="text-base font-semibold text-gray-950">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default function BodySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    FoodStatus | undefined
  >();

  const {
    data: foods = [],
    error,
    isLoading,
    page,
    setPage,
    totalPages,
  } = useFetchListFood<Food[]>({
    endpoint: "/foods",
    limit: 10,
    search: searchQuery,
    status: selectedStatus,
  });

  const foodErrorState = error ? getFoodErrorState(error) : null;
  const shouldShowPagination = !foodErrorState && foods.length > 0;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleStatusChange = (status: FoodStatus) => {
    setSelectedStatus((currentStatus) =>
      currentStatus === status ? undefined : status,
    );
    setPage(1);
  };

  return (
    <>
      <div className="mb-4 flex w-full justify-center">
        <div className="relative w-full max-w-[750px]">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search foods, impact..."
            className="h-10 w-full rounded-lg bg-white px-12 text-start placeholder:text-start"
          />
        </div>
      </div>

      <div className="mb-5 grid w-full gap-3 md:grid-cols-3">
        {statusCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedStatus === card.status;

          return (
            <button
              key={card.status}
              type="button"
              onClick={() => handleStatusChange(card.status)}
              className="text-left"
            >
              <Card
                className={
                  isSelected ? card.activeBorderClass : "border-border"
                }
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={`flex size-9 items-center justify-center rounded-full ${card.iconBoxClass}`}
                  >
                    <Icon className={`size-5 ${card.iconClass}`} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold leading-none">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <Card className="w-full overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto pb-2">
            <Table className="min-w-[760px] table-fixed">
              <TableHeader>
                <TableRow className="bg-[#f7f7fb] hover:bg-[#f7f7fb]">
                  <TableHead className="h-14 w-[40%] px-3 text-[10px] font-bold uppercase tracking-wide text-gray-950">
                    Makanan
                  </TableHead>

                  <TableHead className="h-14 w-[20%] px-3 text-[10px] font-bold uppercase tracking-wide text-gray-950">
                    Status
                  </TableHead>

                  <TableHead className="h-14 w-[15%] px-3 text-right text-[10px] font-bold uppercase tracking-wide text-gray-950">
                    Kalori (kcal)
                  </TableHead>

                  <TableHead className="h-14 w-[20%] px-3 text-right text-[10px] font-bold uppercase tracking-wide text-gray-950">
                    Protein (g)
                  </TableHead>

                  <TableHead className="h-14 w-[20%] px-3 text-right text-[10px] font-bold uppercase tracking-wide text-gray-950">
                    Fat (g)
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      Memuat...
                    </TableCell>
                  </TableRow>
                ) : foodErrorState ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48">
                      <FoodTableState {...foodErrorState} />
                    </TableCell>
                  </TableRow>
                ) : foods.length > 0 ? (
                  foods.map((food) => (
                    <TableRow key={food.id}>
                      <TableCell className="px-3 py-4">
                        <div>
                          <div className="font-medium text-gray-950">
                            {food.name}
                          </div>

                          {food.isRecommended && (
                            <div className="mt-1 text-xs text-emerald-600">
                              Recommended
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="px-3 py-4">
                        <Badge
                          variant="secondary"
                          className={statusBadgeClass[food.status]}
                        >
                          {statusLabel[food.status]}
                        </Badge>
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
                      colSpan={5}
                      className="h-24 text-center text-sm text-muted-foreground"
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
      )}
    </>
  );
}
