import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ResetPasswordSkeleton() {
  return (
    <div className="items-center px-4">
      <Card className="w-full">
        <CardHeader className="space-y-3 text-center">
          <Skeleton className="mx-auto h-8 w-48 rounded-lg" />
          <Skeleton className="mx-auto h-4 w-64 rounded-md" />
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}