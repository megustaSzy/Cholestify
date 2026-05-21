"use client";

import { useMemo } from "react";
import {
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data: T;
};

type LipidPanel = {
  id: number;
  date: string;
  totalCholesterol: number;
  ldl: number;
  hdl: number;
  triglycerides?: number;
  createdAt?: string;
  updatedAt?: string;
};

type LipidStatus = "Normal" | "High" | "At Risk";

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatNumber = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";

  return value.toLocaleString("id-ID");
};

const getLipidStatus = (lipid: LipidPanel): LipidStatus => {
  const triglycerides = lipid.triglycerides ?? 0;

  if (
    lipid.ldl >= 130 ||
    lipid.totalCholesterol >= 240 ||
    triglycerides >= 200
  ) {
    return "At Risk";
  }

  if (
    lipid.ldl >= 100 ||
    lipid.totalCholesterol >= 200 ||
    triglycerides >= 150 ||
    lipid.hdl < 40
  ) {
    return "High";
  }

  return "Normal";
};

const statusClass: Record<LipidStatus, string> = {
  Normal: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  High: "bg-orange-50 text-orange-700 hover:bg-orange-50",
  "At Risk": "bg-red-50 text-red-700 hover:bg-red-50",
};

function TrendValue({
  value,
  previousValue,
  goodWhenHigher = false,
  className = "",
}: {
  value: number;
  previousValue?: number;
  goodWhenHigher?: boolean;
  className?: string;
}) {
  const hasTrend = typeof previousValue === "number";
  const isUp = hasTrend ? value > previousValue : false;
  const isDown = hasTrend ? value < previousValue : false;

  const isGood =
    hasTrend && ((goodWhenHigher && isUp) || (!goodWhenHigher && isDown));

  const colorClass = !hasTrend
    ? "text-gray-950"
    : isGood
      ? "text-emerald-600"
      : "text-red-600";

  return (
    <span
      className={`inline-flex items-center gap-1 ${colorClass} ${className}`}
    >
      {formatNumber(value)}
      {isUp && <ArrowUp className="size-3" />}
      {isDown && <ArrowDown className="size-3" />}
    </span>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-12 text-center">
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

export default function LipidPanelHistoryContent() {
  const {
    data: lipidResponse,
    isLoading,
    error,
  } = useFetchData<ApiResponse<LipidPanel[]>>("/lipid-panels/me");

  const lipidPanels = useMemo(() => {
    const data = lipidResponse?.data ?? [];

    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [lipidResponse?.data]);

  return (
    <section className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          Lipid Panel History
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tinjau kembali hasil pemeriksaan lipid panel Anda sebelumnya untuk
          memantau tren kolesterol dari waktu ke waktu.
        </p>
      </header>

      <Card className="overflow-hidden rounded-xl border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
            Historical Data
          </h2>

          {/* <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>

            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="size-4" />
              Export
            </Button>
          </div> */}
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-[#f7f7fb] hover:bg-[#f7f7fb]">
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    LDL
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    HDL
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Total
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Triglycerides
                  </TableHead>
                  <TableHead className="h-14 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-40 text-center text-sm text-muted-foreground"
                    >
                      Memuat riwayat lipid panel...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Riwayat lipid panel gagal dimuat"
                        description="Pastikan sesi login masih valid, lalu coba muat ulang halaman."
                      />
                    </TableCell>
                  </TableRow>
                ) : lipidPanels.length > 0 ? (
                  lipidPanels.map((lipid, index) => {
                    const previous = lipidPanels[index + 1];
                    const status = getLipidStatus(lipid);

                    return (
                      <TableRow key={lipid.id} className="h-16">
                        <TableCell className="text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                          {formatDate(lipid.date)}
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <TrendValue
                            value={lipid.ldl}
                            previousValue={previous?.ldl}
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <TrendValue
                            value={lipid.hdl}
                            previousValue={previous?.hdl}
                            goodWhenHigher
                            className="text-blue-600"
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <TrendValue
                            value={lipid.totalCholesterol}
                            previousValue={previous?.totalCholesterol}
                          />
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium text-gray-950">
                          {formatNumber(lipid.triglycerides)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className={`min-w-24 justify-center rounded-full ${statusClass[status]}`}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="Belum ada riwayat lipid panel"
                        description="Silakan input lipid panel terlebih dahulu agar riwayat pemeriksaan dapat ditampilkan."
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t px-5 py-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {Math.min(lipidPanels.length, 4)} of{" "}
              {lipidPanels.length} records
            </p>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
