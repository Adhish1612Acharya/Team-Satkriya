import React, { FC } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Globe, User, Clock } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import WorkShopCardProps from "./WorkShopCard.types";
import { Timestamp } from "firebase/firestore";

// Workshop Card Component
const WorkshopCard: FC<WorkShopCardProps> = ({ workshop }) => {
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

  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
      {/* Workshop Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {workshop.thumbnail ? (
          <img
            src={workshop.thumbnail}
            alt={workshop.title}
            className="h-full w-full object-cover"
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
          <div className="text-sm font-medium">{workshop.profileData.name}</div>
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
              <Clock className="mr-1 h-4 w-4" />
              {daysDiff} {daysDiff === 1 ? "day" : "days"}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 mb-4 text-sm text-gray-600">
          {workshop.description}
        </p>

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

      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <User className="mr-1 h-4 w-4" />
          <span>12 attendees</span>
        </div>
        <Button>Register Now</Button>
      </CardFooter>
    </Card>
  );
};



export { WorkshopCard };
