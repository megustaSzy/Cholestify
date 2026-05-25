import { Skeleton } from "@/components/ui/skeleton";

export function SetHealthGoalsPageSkeleton() {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="mb-4 md:mb-6">
        <Skeleton className="h-7 w-56 rounded-md sm:h-8" />
        <Skeleton className="mt-2 h-4 w-full max-w-md rounded-md" />
      </div>

      {/* Form skeleton */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-5 text-center md:px-6">
          <Skeleton className="mx-auto h-7 w-60 rounded-md" />
          <Skeleton className="mx-auto mt-2 h-4 w-full max-w-lg rounded-md" />
        </div>

        <div className="p-5 md:p-6">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-5 flex w-full justify-center text-center">
                  <div className="space-y-2">
                    <Skeleton className="mx-auto h-5 w-32 rounded-md" />
                    <Skeleton className="mx-auto h-4 w-56 rounded-md" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-48 rounded-md" />

                  <div className="flex overflow-hidden rounded-xl border border-input bg-background">
                    <Skeleton className="h-11 flex-1 rounded-none" />
                    <Skeleton className="h-11 w-24 rounded-none border-l border-input" />
                  </div>

                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-3/4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end md:px-6">
          <Skeleton className="h-10 w-full rounded-md sm:w-[90px]" />
          <Skeleton className="h-10 w-full rounded-md sm:w-[110px]" />
        </div>
      </div>
    </div>
  );
}