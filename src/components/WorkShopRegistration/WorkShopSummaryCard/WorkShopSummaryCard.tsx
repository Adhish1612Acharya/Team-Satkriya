import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import WorkShopSummaryCardProps from "./WorkShopSummaryCard.types";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

const WorkShopSummaryCard: FC<WorkShopSummaryCardProps> = ({
  workshopData,
}) => {
  // Format dates
  const formattedStartDate = format(
    workshopData?.dateFrom instanceof Timestamp
      ? workshopData?.dateFrom.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workshopData?.dateFrom || ""),
    "MMM dd, yyyy"
  );
  const formattedEndDate = format(
    workshopData?.dateTo instanceof Timestamp
      ? workshopData?.dateTo.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workshopData?.dateTo || ""),
    "MMM dd, yyyy"
  );

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl md:text-3xl">
              {workshopData?.title}
            </CardTitle>
            <CardDescription className="mt-2">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {" "}
                    {formattedStartDate}
                    {workshopData?.dateFrom !== workshopData?.dateTo &&
                      ` - ${formattedEndDate}`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {workshopData?.timeFrom} to {workshopData?.timeTo}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{workshopData?.location}</span>
                </div>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <div className="max-h-[120px] mt-4 overflow-y-auto">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {workshopData?.description.replace(/\\n/g, "\n")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkShopSummaryCard;
