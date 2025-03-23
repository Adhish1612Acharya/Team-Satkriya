import React from "react";
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

// Workshop Card Component
const WorkshopCard = ({ workshop, creator, isLoading }) => {


  const {
    title,
    description,
    dateFrom,
    dateTo,
    mode,
    location,
    link,
    thumbnail,
  } = workshop;

  // Format dates
  const formattedStartDate = format(new Date(dateFrom), "MMM dd, yyyy");
  const formattedEndDate = format(new Date(dateTo), "MMM dd, yyyy");

  // Calculate duration
  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
      {/* Workshop Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
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
            mode === "online" ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {mode === "online" ? "Online" : "In-Person"}
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={creator.profilePic} alt={creator.name} />
            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{creator.name}</div>
        </div>
        <CardTitle className="line-clamp-2 text-xl">{title}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Calendar className="mr-1 h-4 w-4" />
          <span>
            {formattedStartDate}
            {dateFrom !== dateTo && ` - ${formattedEndDate}`}
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
        <p className="line-clamp-3 mb-4 text-sm text-gray-600">{description}</p>

        {/* Location or Link */}
        <div className="mt-4 flex items-start space-x-2 text-sm">
          {mode === "offline" ? (
            <>
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
              <span className="text-gray-600">{location}</span>
            </>
          ) : (
            <>
              <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
              <span className="break-all text-blue-600 hover:underline">
                {link}
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

// Loading Skeleton Component

// Example Usage Component with Grid Layout for multiple cards
const WorkshopGrid = ({ workshops, creators, isLoading }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? // Show multiple skeletons while loading
          Array(6)
            .fill()
            .map((_, index) => <WorkshopCardSkeleton key={index} />)
        : // Show actual workshop cards
          workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              creator={creators.find((c) => c.id === workshop.creatorId)}
              isLoading={false}
            />
          ))}
    </div>
  );
};

export { WorkshopCard, WorkshopCardSkeleton, WorkshopGrid };
