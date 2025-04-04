import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import WorkShop from "@/types/workShop.types";
import WorkShopSummaryCard from "@/components/WorkShopRegistration/WorkShopSummaryCard/WorkShopSummaryCard";
import RegistrationDetailTable from "@/components/WorkShopRegistration/RegistrationDetailTable/RegistrationDetailTable";
import AccordionItem from "@/components/WorkShopRegistration/AccordionItem/AccordionItem";
import { useParams } from "react-router-dom";
import RegistrationAccordionSkeleton from "@/components/WorkShopRegistration/Skeleton/RegistrationAccordianSkeleton";
import RegistrationTableSkeleton from "@/components/WorkShopRegistration/Skeleton/RegistrationTableSkeleton";
import WorkShopSummaryCardSkeleton from "@/components/WorkShopRegistration/Skeleton/WorkShopSummaryCardSkeleton";
import { Badge, Calendar, ClipboardList, Users, UserX } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

export default function WorkshopRegistrationPage() {
  const { id } = useParams();
  const { getWorkshopRegistrationDetails } = useWorkShop();
  const [loading, setLoading] = useState(true);
  const [workShop, setWorkShop] = useState<WorkShop | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    async function getRegistrationDetails() {
      if (!id) {
        throw new Error("No workshop ID provided");
      }
      const response = await getWorkshopRegistrationDetails(id);

      if (response) {
        setWorkShop(response);
      }
      setLoading(false);
    }
    getRegistrationDetails();
  }, [id]);

  if (loading && !workShop) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <WorkShopSummaryCardSkeleton />

        {isMobile ? (
          <RegistrationAccordionSkeleton />
        ) : (
          <RegistrationTableSkeleton />
        )}
      </div>
    );
  }

  const formattedStartDate = format(
    workShop?.dateFrom instanceof Timestamp
      ? workShop?.dateFrom.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workShop?.dateFrom || ""),
    "MMM dd, yyyy"
  );
  const formattedEndDate = format(
    workShop?.dateTo instanceof Timestamp
      ? workShop?.dateTo.toDate() // Convert Firestore Timestamp to JS Date
      : new Date(workShop?.dateTo || ""),
    "MMM dd, yyyy"
  );

  if (!loading && workShop && workShop.registrations.length === 0) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <WorkShopSummaryCard workshopData={workShop} />
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            No Registrations Yet
          </h3>
          {/* <p className="text-sm text-gray-400 text-center max-w-md px-4">
          Be the first to register for this workshop! Share it with others to
          increase participation.
        </p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-6 space-y-8">
      {/* Workshop Summary Section */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3">
          <Users className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          <span>Workshop Participants</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Viewing registrations for:{" "}
          <span className="font-medium">{workShop?.title}</span>
        </p>
      </div>

      <WorkShopSummaryCard workshopData={workShop} />

      {/* Registrations Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-lg">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span>Participant Registrations</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {workShop?.registrations.length}{" "}
              {workShop?.registrations.length === 1 ? "person" : "people"}{" "}
              registered
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {formattedStartDate}
              {workShop?.dateFrom !== workShop?.dateTo &&
                ` - ${formattedEndDate}`}
            </Badge>
          </div>
        </div>

        {/* Responsive Registrations View */}
        {isMobile ? (
          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 pr-1">
            {workShop?.registrations.map((participant, index) => (
              <AccordionItem
                key={participant.id || index}
                index={index}
                registrantDetail={participant}
              />
            ))}
          </div>
        ) : (
          <RegistrationDetailTable
            registrationsData={workShop?.registrations || []}
          />
        )}

        {/* Empty State - Just in case */}
        {workShop?.registrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-dashed">
            <UserX className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              No Registrations Yet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md px-4">
              Participants will appear here once they register for your
              workshop.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
