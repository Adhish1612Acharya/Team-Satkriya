import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";
import WorkshopCardSkeleton from "@/components/WorkShopCardSkeleton/WorkShopCardSkeleton";
import { motion } from "framer-motion";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import WorkShop from "@/types/workShop.types";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const YourWorkShopsPage = () => {
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
        <div className="max-w-2xl mx-auto">
          {/* Posts Feed */}
          <div>
            {loading ? (
              <>
                <WorkshopCardSkeleton />
                <WorkshopCardSkeleton />
                <WorkshopCardSkeleton />
              </>
            ) : !loading && workshops.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md"
              >
                <AlertCircle
                  size={48}
                  className="text-gray-500 dark:text-gray-400"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  No Posts Found
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
                  It looks like there are no posts available at the moment. Be
                  the first to share something useful!
                </p>
              </motion.div>
            ) : (
              workshops.map((workshop) => {
                return (
                  <WorkshopCard workshop={workshop} userType={"experts"} />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default YourWorkShopsPage;
