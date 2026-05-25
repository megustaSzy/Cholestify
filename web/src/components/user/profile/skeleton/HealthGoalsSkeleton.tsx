import { Skeleton } from "@/components/ui/skeleton";

export function HealthGoalsPageSkeleton() {
  return (
    <>
      {/* SiteHeader Skeleton */}
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-white">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <div className="flex items-center gap-1 lg:gap-2">
            <Skeleton className="size-8 rounded-md" />

            <Skeleton className="mx-2 h-4 w-px rounded-full" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="size-3 rounded-full" />
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="size-3 rounded-full" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
          </div>

          <Skeleton className="ml-auto mr-1 size-8 rounded-xl sm:size-9" />
        </div>
      </header>

      {/* Health Goals Content Skeleton */}
      <div className="flex min-h-screen flex-1 flex-col bg-gray-50">
        <div className="flex flex-1 gap-0">
          <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full flex-col gap-5 lg:max-w-[900px]">
              {/* Page Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Skeleton className="h-8 w-52 rounded-md" />
                  <Skeleton className="mt-2 h-4 w-72 max-w-full rounded-md" />
                </div>

                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>

              {/* Section Label */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="h-5 w-1 rounded-full" />
                  <Skeleton className="h-5 w-48 rounded-md" />
                </div>

                {/* Target Cards */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-5 w-36 rounded-md" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </div>

                      <Skeleton className="h-3 w-56 max-w-full rounded-md" />

                      <div className="flex items-end gap-2">
                        <Skeleton className="h-9 w-20 rounded-md" />
                        <Skeleton className="mb-1 h-4 w-28 rounded-md" />
                      </div>

                      <Skeleton className="h-2 w-full rounded-full" />

                      <Skeleton className="h-3 w-40 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>

              {/* History Section */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="h-5 w-1 rounded-full" />
                  <Skeleton className="h-5 w-52 rounded-md" />
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-5 w-56 rounded-md" />
                        <Skeleton className="mt-2 h-3 w-36 rounded-md" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 divide-y divide-gray-100 border-t border-gray-100 bg-gray-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="px-5 py-3 sm:px-6">
                        <Skeleton className="h-3 w-36 rounded-md" />
                        <Skeleton className="mt-2 h-5 w-24 rounded-md" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start justify-center gap-2 rounded-md bg-muted/50 px-3 py-2.5">
                    <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-64 max-w-full rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}