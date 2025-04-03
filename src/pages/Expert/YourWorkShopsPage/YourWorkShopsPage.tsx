import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";
import WorkshopCardSkeleton from "@/components/WorkShopCardSkeleton/WorkShopCardSkeleton";
import { motion } from "framer-motion";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import WorkShop from "@/types/workShop.types";
import { useEffect, useState } from "react";
import { AlertCircle, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const YourWorkShopsPage = () => {
  const navigate=useNavigate();
  const { getAllYourWorkshops } = useWorkShop();

  const [loading, setLoading] = useState<boolean>(true);
  const [workshops, setWorkshops] = useState<WorkShop[]>([]);

  useEffect(() => {
    async function getWorkshops() {
      const workShopData = await getAllYourWorkshops();
      if (workShopData) {
        setWorkshops(workShopData);
      }

      setLoading(false);
    }

    getWorkshops();
  }, []);

  return (
    <>
       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ml-4 mt-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <CalendarPlus className="text-primary h-6 w-6" />
            Your Hosted Workshops
          </h1>
          <p className="text-muted-foreground mt-1">
            {workshops.length > 0
              ? `You've hosted ${workshops.length} workshop${workshops.length !== 1 ? 's' : ''}`
              : "Your hosted workshops will appear here"}
          </p>
        </div>
        <Button
          onClick={() => navigate("/workshops/create")}
          className="gap-2 mr-4"
        >
          <CalendarPlus className="h-4 w-4" />
          Create New Workshop
        </Button>
      </div>

      {/* Workshops List */}
      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <WorkshopCardSkeleton />
            <WorkshopCardSkeleton />
            <WorkshopCardSkeleton />
          </div>
        ) : workshops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-xl border border-dashed"
          >
            <AlertCircle
              size={48}
              className="text-gray-500 dark:text-gray-400 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              No Workshops Hosted Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4 max-w-md">
              You haven't hosted any workshops yet. Share your expertise by creating your first workshop!
            </p>
            <Button 
              onClick={() => navigate("/workshops/create")}
              className="gap-2"
            >
              <CalendarPlus className="h-4 w-4" />
              Create Your First Workshop
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <WorkshopCard 
                key={workshop.id} 
                workshop={workshop} 
                userType={"experts"} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default YourWorkShopsPage;
