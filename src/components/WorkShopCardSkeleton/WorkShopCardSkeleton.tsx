import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "@/components/ui/card";
import { Skeleton } from "@mui/material";

const WorkshopCardSkeleton = () => {
    return (
      <Card className="w-full overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="mt-2 h-6 w-full" />
          <Skeleton className="mt-1 h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          
          <div className="mt-4">
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  };

  export default WorkshopCardSkeleton