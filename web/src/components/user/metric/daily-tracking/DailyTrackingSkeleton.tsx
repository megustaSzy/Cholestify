import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DailyTrackingPageSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="text-start">
        <Skeleton className="h-7 w-56 rounded-md sm:h-8" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl rounded-md" />
        <Skeleton className="mt-1 h-4 w-full max-w-md rounded-md" />
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="flex w-full flex-col gap-4">
          <Card className="w-full border border-border shadow-sm">
            <CardHeader className="pb-4">
              <div className="space-y-2 text-center">
                <Skeleton className="mx-auto h-6 w-40 rounded-md" />
                <Skeleton className="mx-auto h-4 w-full max-w-md rounded-md" />
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="flex flex-col gap-5 pt-6">
              {/* Kalori */}
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Protein */}
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Menit olahraga */}
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Catatan makanan */}
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-28 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end">
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </div>

        {/* TargetGoalsSidebar Skeleton */}
        <div className="mx-auto w-full max-w-[760px] lg:mx-0 lg:max-w-none">
          <Card className="h-[130px] w-full overflow-hidden border border-border p-0 shadow-sm sm:h-[150px] lg:h-[130px]">
            <div className="relative h-full w-full">
              <Skeleton className="h-full w-full rounded-none" />

              <div className="absolute bottom-3 left-3 right-3 space-y-2">
                <Skeleton className="h-3 w-full rounded-md bg-gray-300/70" />
                <Skeleton className="h-3 w-4/5 rounded-md bg-gray-300/70" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}