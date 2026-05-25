import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export  function LogBiometricsSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-3xl border border-border shadow-sm">
      <CardHeader>
        <div className="flex w-full justify-center text-center">
          <div className="space-y-2">
            <Skeleton className="mx-auto h-6 w-32 rounded-md" />
            <Skeleton className="mx-auto h-4 w-52 rounded-md" />
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-5 pt-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2.5">
          <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />

          <div className="w-full space-y-2">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-3/4 rounded-md" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}