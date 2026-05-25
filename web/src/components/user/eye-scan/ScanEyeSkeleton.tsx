import { Skeleton } from "@/components/ui/skeleton";

export function EyeScanPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-72 rounded-md" />
        <Skeleton className="mt-2 h-4 w-full max-w-2xl rounded-md" />
        <Skeleton className="mt-1 h-4 w-full max-w-xl rounded-md" />
      </div>

      {/* Disclaimer Alert */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full bg-amber-100" />

        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-full max-w-3xl rounded-md bg-amber-100" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md bg-amber-100" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* Eye Scan Form Skeleton */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-3">
          {/* Upload Area */}
          <div className="m-4 flex min-h-64 flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
            <Skeleton className="mb-4 size-14 rounded-full" />
            <Skeleton className="h-4 w-56 rounded-md" />
            <Skeleton className="mt-2 h-3 w-72 rounded-md" />
          </div>

          {/* Progress / Result Area */}
          <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-48 rounded-md bg-blue-100" />
              <Skeleton className="h-4 w-10 rounded-md bg-blue-100" />
            </div>

            <Skeleton className="h-2 w-full rounded-full bg-blue-100" />

            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="size-2 rounded-full bg-blue-100" />
              <Skeleton className="h-3 w-64 max-w-full rounded-md bg-blue-100" />
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-52 rounded-md" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
          </div>
        </div>

        {/* How To Use Skeleton */}
        <div className="flex flex-col gap-5 xl:col-span-2">
          {/* Cara Penggunaan */}
          <div>
            <Skeleton className="mb-3 h-5 w-36 rounded-md" />

            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <Skeleton className="size-9 shrink-0 rounded-lg" />

                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-36 rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-4/5 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hal Yang Harus Diperhatikan */}
          <div>
            <Skeleton className="mb-3 h-5 w-52 rounded-md" />

            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <Skeleton className="size-9 shrink-0 rounded-lg" />

                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-4/5 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}