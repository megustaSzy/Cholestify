import { Skeleton } from "@/components/ui/skeleton";

export function FoodDirectorySkeleton() {
  return (
    <div className="py-10">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl rounded" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-11 w-full rounded-xl sm:max-w-md" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="mt-3 h-4 w-1/2 rounded" />

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}