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
import { Users } from "lucide-react";

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

  if (!loading && workShop && workShop.registrations.length === 0) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <WorkShopSummaryCard workshopData={workShop} />

      {/* Registrations - Conditional Rendering based on screen size */}
      {isMobile ? (
        <div className="container mx-auto py-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Registrations</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Total: {workShop?.registrations.length}
              </span>
            </div>
          </div>

          {/* Mobile Accordion View */}
          <div className="md:hidden">
            {workShop?.registrations.map((participant, index) => (
              <AccordionItem
                index={index}
                registrantDetail={participant || null}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Registrations</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Total: {workShop?.registrations.length}
              </span>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <RegistrationDetailTable
              registrationsData={workShop?.registrations || []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
