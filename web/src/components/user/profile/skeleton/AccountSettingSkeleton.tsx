import { Skeleton } from "@/components/ui/skeleton";

export function AccountSettingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5">
          {/* Header */}
          <div>
            <Skeleton className="h-8 w-56 rounded-md lg:h-9" />
            <Skeleton className="mt-2 h-4 w-48 rounded-md" />
          </div>

          {/* Foto Profil */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Skeleton className="mb-5 h-5 w-28 rounded-md" />

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Skeleton className="h-16 w-16 shrink-0 rounded-full" />

              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Informasi Dasar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <Skeleton className="mb-1.5 h-3 w-16 rounded-md" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Skeleton className="mb-1.5 h-3 w-24 rounded-md" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>

                <div>
                  <Skeleton className="mb-1.5 h-3 w-24 rounded-md" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Password Akun */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Skeleton className="mb-5 h-5 w-32 rounded-md" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <div>
                <Skeleton className="mb-1.5 h-3 w-28 rounded-md" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <div>
                <Skeleton className="mb-1.5 h-3 w-36 rounded-md" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <Skeleton className="h-11 w-full rounded-lg md:w-40" />
            </div>
          </div>

          {/* Button bawah */}
          <div className="flex flex-col-reverse gap-3 pb-8 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Skeleton className="h-10 w-full rounded-md sm:w-20" />
            <Skeleton className="h-10 w-full rounded-xl sm:w-40" />
          </div>
        </div>
      </main>
    </div>
  );
}