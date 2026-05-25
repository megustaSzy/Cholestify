import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReportSkeleton() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gray-50">
      <main className="flex w-full flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-5xl lg:px-0">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <Card className="flex-1 border-gray-200 bg-white py-5">
            <CardHeader className="px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>

                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="px-5">
              <Skeleton className="mx-auto h-28 w-52 rounded-full" />

              <div className="mt-5 grid grid-cols-3 gap-3 px-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <Skeleton className="h-7 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mx-auto w-full max-w-[340px] border-blue-700 bg-blue-700 py-5 sm:max-w-[380px] lg:mx-0 lg:w-56 lg:max-w-none lg:flex-shrink-0">
            <CardHeader className="px-5">
              <Skeleton className="h-5 w-36 rounded-md bg-blue-500/50" />
            </CardHeader>

            <CardContent className="flex flex-col gap-5 px-5">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded-md bg-blue-500/50" />
                  <Skeleton className="h-3 w-full rounded-md bg-blue-500/50" />
                  <Skeleton className="h-3 w-4/5 rounded-md bg-blue-500/50" />
                  <Skeleton className="h-3 w-3/5 rounded-md bg-blue-500/50" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <Card className="w-full border-gray-200 bg-white py-5 lg:flex-1">
            <CardHeader className="px-5">
              <div className="space-y-2">
                <Skeleton className="h-6 w-44 rounded-md" />
                <Skeleton className="h-3 w-72 max-w-full rounded-md" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-5 pb-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <Skeleton className="mb-2 h-3 w-24 rounded-md" />
                    <Skeleton className="h-7 w-16 rounded-md" />
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <Skeleton className="h-4 w-full rounded-md bg-blue-100" />
                <Skeleton className="mt-2 h-4 w-3/4 rounded-md bg-blue-100" />
              </div>

              <Skeleton className="h-11 w-full rounded-xl" />
            </CardContent>
          </Card>

          <Card className="flex-1 border-gray-200 bg-white py-5">
            <CardHeader className="px-5">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 rounded-md" />
                <Skeleton className="h-3 w-72 max-w-full rounded-md" />
              </div>
            </CardHeader>

            <CardContent className="grid gap-3 px-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-100/80 p-3"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                  </div>

                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}