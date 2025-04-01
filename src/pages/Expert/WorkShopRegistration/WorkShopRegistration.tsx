import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import WorkShop from "@/types/workShop.types";
import WorkShopSummaryCard from "@/components/WorkShopRegistration/WorkShopSummaryCard/WorkShopSummaryCard";
import RegistrationDetailTable from "@/components/WorkShopRegistration/RegistrationDetailTable/RegistrationDetailTable";
import AccordionItem from "@/components/WorkShopRegistration/AccordionItem/AccordionItem";
import { useParams } from "react-router-dom";

export default function WorkshopRegistrationPage() {
  const { id } = useParams();
  const { getWorkshopRegistrationDetails } = useWorkShop();
  const [loading, setLoading] = useState(true);
  const [workShop, setWorkShop] = useState<WorkShop | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    async function getRegistrationDetails() {
      const response = await getWorkshopRegistrationDetails(id);

      if (response) {
        setWorkShop(response);
      }
      setLoading(false);
    }
    getRegistrationDetails();
  }, []);

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
            {workShop?.registrations.map((participant) => (
              <AccordionItem registrantDetail={participant || null} />
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
