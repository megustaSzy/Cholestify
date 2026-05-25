import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HistoryScanEyeSkeleton() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl rounded-md" />
      </div>

      <Card className="overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b bg-white px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="w-full max-w-2xl">
              <Skeleton className="h-8 w-52 rounded-md" />
              <Skeleton className="mt-3 h-4 w-full rounded-md" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-md" />
            </div>

            <Skeleton className="h-10 w-full rounded-xl sm:w-32" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[760px]">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_1.4fr_1fr_1fr_0.8fr] bg-[#f7f7fb] px-5 py-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className={index >= 2 ? "flex justify-center" : ""}
                  >
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-100 bg-white">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-[1fr_1.4fr_1fr_1fr_0.8fr] items-center px-5 py-5"
                  >
                    {/* Date */}
                    <Skeleton className="h-4 w-28 rounded-md" />

                    {/* Result */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36 rounded-md" />
                      <Skeleton className="h-3 w-28 rounded-md" />
                    </div>

                    {/* Image Preview */}
                    <div className="flex justify-center">
                      <Skeleton className="h-12 w-20 rounded-lg" />
                    </div>

                    {/* Status */}
                    <div className="flex justify-center">
                      <Skeleton className="h-7 w-28 rounded-full" />
                    </div>

                    {/* Detail */}
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-5 py-4">
            <Skeleton className="h-4 w-64 rounded-md" />

            <div className="flex items-center gap-2">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="size-9 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}