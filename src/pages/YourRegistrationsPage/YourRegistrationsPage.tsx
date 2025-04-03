import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WorkShopPreview from "@/components/WorkShopPreview/WorkShopPreview";
import { useAuthContext } from "@/context/AuthContext";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import WorkShop from "@/types/workShop.types";

import { CalendarCheck, CalendarX, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const YourRegistrationsPage = () => {
  const { userType } = useAuthContext();
  const navigate = useNavigate();

  const { getUserRegistrations } = useWorkShop();
  const [registeredWorkshops, setRegisteredWorkshops] = useState<WorkShop[]>(
    []
  );

  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    async function getPosts() {
      if (!userType) {
        return;
      }
      const registrationData = await getUserRegistrations(
        userType as "farmers" | "experts"
      );
      if (registrationData) {
        setRegisteredWorkshops(registrationData);
      } else {
        setRegisteredWorkshops([]);
      }

      setLoading(false);
    }

    getPosts();
  }, [userType]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-full flex flex-col overflow-hidden border rounded-lg"
          >
            <div className="p-6 pb-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="px-6 pb-4 flex-grow space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20 ml-2" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center mt-4 ml-4 sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <CalendarCheck className="text-primary h-6 w-6" />
            Your Registered Workshops
          </h1>
          <p className="text-muted-foreground mt-1">
            {registeredWorkshops.length > 0
              ? `Showing ${registeredWorkshops.length} workshop${
                  registeredWorkshops.length !== 1 ? "s" : ""
                } you've registered for`
              : "Your workshop registrations will appear here"}
          </p>
        </div>
        <Button onClick={() => navigate("/workshops")} className="gap-2 mr-4">
          <Plus className="h-4 w-4" />
          Explore Workshops
        </Button>
      </div>

      {/* Content Area */}
      {registeredWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 mb-6 ml-4 lg:grid-cols-3 gap-6">
          {registeredWorkshops.map((workshop) => (
            <WorkShopPreview key={workshop.id} workshop={workshop} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-dashed bg-muted/50">
          <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No Workshop Registrations
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            You haven't registered for any workshops yet. Discover upcoming
            sessions to enhance your farming knowledge.
          </p>
          <Button onClick={() => navigate("/workshops")} className="gap-2">
            <Plus className="h-4 w-4" />
            Browse Workshops
          </Button>
        </div>
      )}
    </div>
  );
};

export default YourRegistrationsPage;
