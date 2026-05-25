import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LipidPanelHistorySkeleton() {
  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-blue-50/70 px-5 py-4 shadow-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full max-w-3xl">
            <Skeleton className="h-8 w-64 rounded-md sm:h-9" />
            <Skeleton className="mt-3 h-4 w-full rounded-md" />
            <Skeleton className="mt-2 h-4 w-3/4 rounded-md" />
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
            <Skeleton className="h-3 w-28 rounded-md" />
            <Skeleton className="mt-3 h-7 w-24 rounded-full" />
            <Skeleton className="mt-3 h-3 w-52 rounded-md" />
            <Skeleton className="mt-2 h-3 w-40 rounded-md" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="rounded-2xl border-gray-200 bg-white shadow-sm"
          >
            <CardContent className="p-4 sm:p-5">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="mt-3 h-8 w-20 rounded-md" />
              <Skeleton className="mt-4 h-3 w-full rounded-md" />
              <Skeleton className="mt-2 h-3 w-3/4 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden rounded-3xl border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="w-full max-w-xl">
              <Skeleton className="h-7 w-52 rounded-md sm:h-8" />
              <Skeleton className="mt-3 h-4 w-full rounded-md" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-md" />
            </div>

            <Skeleton className="h-10 w-full rounded-xl sm:w-32" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table Skeleton */}
          <div className="hidden w-full overflow-x-auto md:block">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-6 bg-gray-50 px-4 py-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex justify-center">
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                ))}
              </div>

              <div className="divide-y divide-gray-100">
                {Array.from({ length: 8 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-6 items-center px-4 py-5"
                  >
                    {Array.from({ length: 6 }).map((_, colIndex) => (
                      <div key={colIndex} className="flex justify-center">
                        {colIndex === 5 ? (
                          <Skeleton className="h-7 w-24 rounded-full" />
                        ) : (
                          <Skeleton className="h-4 w-16 rounded-md" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Card Skeleton */}
          <div className="grid gap-3 p-4 md:hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Skeleton className="h-3 w-32 rounded-md" />
                    <Skeleton className="mt-2 h-5 w-28 rounded-md" />
                  </div>

                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, metricIndex) => (
                    <div
                      key={metricIndex}
                      className="rounded-xl bg-gray-50 p-3"
                    >
                      <Skeleton className="h-3 w-20 rounded-md" />
                      <Skeleton className="mt-2 h-5 w-14 rounded-md" />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex flex-col gap-3 border-t bg-gray-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Skeleton className="mx-auto h-4 w-56 rounded-md sm:mx-0" />

            <div className="flex items-center justify-center gap-2">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}