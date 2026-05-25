import { Skeleton } from "@/components/ui/skeleton";

export function ClinicalProfileSkeleton() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gray-50">
      <div className="flex flex-1 gap-0">
        <main className="w-full flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5">
            {/* Header */}
            <div>
              <Skeleton className="h-8 w-44 rounded-md" />
              <Skeleton className="mt-2 h-4 w-72 max-w-full rounded-md" />
            </div>

            {/* Patient profile card */}
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
              <Skeleton className="h-16 w-16 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-7 w-44 rounded-md" />
                <Skeleton className="mt-2 h-3 w-32 rounded-md" />

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <Skeleton className="h-4 w-44 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
              </div>
            </div>

            {/* Biometrics stats */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>

                  <div className="mt-2 flex items-end gap-1">
                    <Skeleton className="h-8 w-14 rounded-md" />
                    <Skeleton className="mb-1 h-4 w-6 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            {/* Lipid card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-w-0 rounded-xl bg-blue-50/80 p-4"
                  >
                    <Skeleton className="mb-2 h-3 w-24 rounded-md bg-blue-100" />

                    <div className="mb-2 flex items-end gap-1">
                      <Skeleton className="h-8 w-14 rounded-md bg-blue-100" />
                      <Skeleton className="mb-1 h-3 w-12 rounded-md bg-blue-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
