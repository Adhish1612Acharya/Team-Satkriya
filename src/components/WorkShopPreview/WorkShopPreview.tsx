import { ArrowRight, Calendar, CheckCircle, Clock, Hourglass, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WorkShopPreviewProps from "./WorkShopPreview.types";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

const WorkShopPreview: FC<WorkShopPreviewProps> = ({ workshop }) => {
  const navigate = useNavigate();

  // Format dates
  const formattedStartDate = format(
    workshop.dateFrom instanceof Timestamp
      ? workshop.dateFrom.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workshop.dateFrom),
    "MMM dd, yyyy"
  );
  const formattedEndDate = format(
    workshop.dateTo instanceof Timestamp
      ? workshop.dateTo.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workshop.dateTo),
    "MMM dd, yyyy"
  );

  // Calculate duration
  const startDate = new Date(
    workshop.dateFrom instanceof Timestamp
      ? workshop.dateFrom.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workshop.dateFrom)
  );
  const endDate = new Date(
    workshop.dateTo instanceof Timestamp
      ? workshop.dateTo.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workshop.dateTo)
  );

  // Ensure startDate and endDate are valid Date objects
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  // Calculate the difference in days
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg group border border-muted/50 hover:border-primary/20">
      {/* Card Header with subtle gradient background */}
      <CardHeader className="pb-3 bg-gradient-to-br from-muted/10 to-background">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl line-clamp-2 font-semibold group-hover:text-primary transition-colors">
            {workshop.title}
          </CardTitle>
          </div>
      </CardHeader>

      {/* Card Content with improved spacing and visual hierarchy */}
      <CardContent className="pb-4 flex-grow space-y-3">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
          <Calendar className="h-4 w-4 text-primary" />
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-medium">
              {formattedStartDate}
              {workshop.dateFrom !== workshop.dateTo &&
                ` - ${formattedEndDate}`}
            </span>
            {daysDiff > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ml-2">
                <Hourglass className="mr-1 h-3 w-3" />
                {daysDiff} {daysDiff === 1 ? "day" : "days"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-medium">
            {workshop.timeFrom} - {workshop.timeTo}
          </span>
        </div>
      </CardContent>

      {/* Card Footer with enhanced button */}
      <CardFooter className="pt-3 border-t flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-2">
         
            <Badge  className="py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Registered
            </Badge>

        </div>
        <Button
          variant="ghost"
          onClick={() => navigate(`/workshops/${workshop.id}`)}
          size="sm"
          className="gap-1 font-medium group-hover:bg-primary/10 group-hover:text-primary"
        >
          View Details
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkShopPreview;
