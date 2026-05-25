import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LogLipidPanelFormSkeleton() {
  return (
    <div className="px-4 lg:px-6">
      {/* Page Header */}
      <div className="mb-4 md:mb-6">
        <Skeleton className="h-7 w-48 rounded-md sm:h-8" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl rounded-md" />
        <Skeleton className="mt-1 h-4 w-full max-w-md rounded-md" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="w-full lg:flex-1">
          <CardContent className="p-4 sm:p-5 lg:p-8">
            {/* Date skeleton */}
            <div className="mb-5 lg:mb-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start lg:gap-5">
                <div className="w-full space-y-1.5 sm:w-64 lg:w-72">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="flex w-full items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 sm:mt-7 sm:max-w-[200px] lg:hidden">
                  <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full bg-blue-100" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-3 w-full rounded-md bg-blue-100" />
                    <Skeleton className="h-3 w-4/5 rounded-md bg-blue-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid skeleton */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-8 lg:gap-x-6 lg:gap-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-1.5">
                  <Skeleton className="h-4 w-40 rounded-md" />

                  <div className="flex overflow-hidden rounded-md border border-input">
                    <Skeleton className="h-10 w-16 rounded-none" />
                    <Skeleton className="h-10 flex-1 rounded-none" />
                  </div>

                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>
              ))}
            </div>

            {/* Action buttons skeleton */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Skeleton className="h-10 w-full rounded-md sm:w-20" />
              <Skeleton className="h-10 w-full rounded-md sm:w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Side panel skeleton */}
        <div className="hidden w-72 flex-shrink-0 flex-col gap-4 lg:flex xl:w-80">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full bg-blue-100" />

            <div className="w-full space-y-2">
              <Skeleton className="h-3 w-full rounded-md bg-blue-100" />
              <Skeleton className="h-3 w-5/6 rounded-md bg-blue-100" />
              <Skeleton className="h-3 w-3/4 rounded-md bg-blue-100" />
            </div>
          </div>

          <Card className="border border-border">
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-5 w-40 rounded-md" />

              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}