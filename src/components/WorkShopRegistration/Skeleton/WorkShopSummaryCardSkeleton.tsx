import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WorkShopSummaryCardSkeleton = () => {
  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardHeader className="space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 w-full">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-[3fr_1fr] gap-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-24 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkShopSummaryCardSkeleton;
