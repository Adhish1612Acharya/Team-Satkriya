import { FC, useState } from "react";
import { format } from "date-fns";
import {
  MapPin,
  Calendar,
  Globe,
  Clock,
  Hourglass,
  Loader2,
  CheckCircle,
  PenSquare,
  Users,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import WorkShopCardProps from "./WorkShopCard.types";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import { auth } from "@/firebase";

// Workshop Card Component
const WorkshopCard: FC<WorkShopCardProps> = ({ workshop, userType }) => {
  const { registerWorkShop } = useWorkShop();

  const navigate = useNavigate();

  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [registered, setRegistered] = useState<boolean>(
    workshop.currUserRegistered
  );

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

  const register = async () => {
    setRegisterLoading(true);
    if (!workshop.currUserRegistered) {
      await registerWorkShop(workshop.id, userType);
    }
    setRegistered(true);
    setRegisterLoading(false);
  };

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
      {/* Workshop Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {workshop.thumbnail ? (
          <img
            src={workshop.thumbnail}
            alt={workshop.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <p className="text-gray-500">No thumbnail available</p>
          </div>
        )}

        {/* Mode Badge */}
        <Badge
          className={`absolute top-2 right-2 ${
            workshop.mode === "online" ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {workshop.mode === "online" ? "Online" : "In-Person"}
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={workshop.profileData.profilePic}
              alt={workshop.profileData.name}
            />
            <AvatarFallback>
              {workshop.profileData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">
              {workshop.profileData.name}
            </div>
            <div className="text-xs text-muted-foreground">{workshop.role}</div>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-xl">{workshop.title}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Calendar className="mr-1 h-4 w-4" />
          <span>
            {formattedStartDate}
            {workshop.dateFrom !== workshop.dateTo && ` - ${formattedEndDate}`}
          </span>
          {daysDiff > 0 && (
            <span className="ml-2 flex items-center">
              <Hourglass className="mr-1 h-4 w-4" />
              {daysDiff} {daysDiff === 1 ? "day" : "days"}
            </span>
          )}
        </CardDescription>
        {/* Time Range */}
        <CardDescription className="flex items-center text-sm mt-1">
          <Clock className="mr-1 h-4 w-4" />
          <span>
            {workshop.timeFrom} to {workshop.timeTo}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Filters Section - Add this */}
        {workshop.filters && workshop.filters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {workshop.filters.map((filter, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs font-normal text-gray-600"
              >
                {filter}
              </Badge>
            ))}
          </div>
        )}
        <div className="max-h-[120px] mt-4 overflow-y-auto">
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {workshop.description.replace(/\\n/g, "\n")}
          </p>
        </div>

        {/* Location or Link */}
        <div className="mt-4 flex items-start space-x-2 text-sm">
          {workshop.mode === "offline" ? (
            <>
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
              <span className="text-gray-600">{workshop.location}</span>
            </>
          ) : (
            <>
              <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
              <span className="break-all text-blue-600 hover:underline">
                {workshop.link}
              </span>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-2 mt-4">
        {/* View Details Button (only on workshops list page) */}
        {window.location.pathname.endsWith("/workshops") && (
          <Button
            variant="outline"
            className="min-w-[100px] hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => navigate(`/workshops/${workshop.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )}

        {/* Registration Button */}
        <Button
          className="min-w-[120px] transition-colors"
          disabled={workshop.currUserRegistered || registerLoading}
          onClick={() => register()}
        >
          {registerLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : registered ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Registered
            </>
          ) : (
            <>
              <PenSquare className="w-4 h-4 mr-2" />
              Register Now
            </>
          )}
        </Button>

        {/* View Registrations Button (only for owner) */}
        {workshop.owner === auth?.currentUser?.uid && (
          <Button
            variant="outline"
            className="min-w-[150px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate(`/workshops/${workshop.id}/registration`)}
          >
            <Users className="w-4 h-4 mr-2" />
            View Registrants
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkshopCard;
