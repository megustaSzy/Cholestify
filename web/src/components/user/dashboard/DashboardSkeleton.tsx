import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <main className="w-full px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <section className="rounded-2xl border border-gray-200 bg-[#fbfbff] p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-72 rounded-lg" />
              <Skeleton className="h-4 w-56 rounded-md" />
            </div>

            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Skeleton className="mb-6 h-6 w-40 rounded-md" />

              <div className="flex flex-col items-center justify-center py-2">
                <Skeleton className="h-36 w-36 rounded-full" />

                <div className="mt-3 flex w-full items-center justify-between">
                  <Skeleton className="h-7 w-20 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Skeleton className="mb-5 h-6 w-24 rounded-md" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
                  >
                    <Skeleton className="mb-3 h-3 w-24 rounded-md" />
                    <div className="flex items-end gap-2">
                      <Skeleton className="h-8 w-14 rounded-md" />
                      <Skeleton className="mb-1 h-3 w-7 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Skeleton className="mb-4 h-6 w-40 rounded-md" />

              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-3 w-48 rounded-md" />
                    </div>

                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Skeleton className="mb-4 h-6 w-44 rounded-md" />

              <div className="rounded-xl border bg-gray-50/80 p-4">
                <div className="space-y-3 text-center">
                  <Skeleton className="mx-auto h-4 w-32 rounded-md" />
                  <Skeleton className="mx-auto h-3 w-full max-w-sm rounded-md" />
                  <Skeleton className="mx-auto h-3 w-3/4 rounded-md" />
                  <Skeleton className="mx-auto mt-3 h-9 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}