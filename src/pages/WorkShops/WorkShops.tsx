import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import { toast } from "react-toastify";
import WorkShop from "@/types/workShop.types";
import WorkshopCardSkeleton from "@/components/WorkShopCardSkeleton/WorkShopCardSkeleton";
import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";
import Filter from "@/components/Filter/Filter/Filter";
import webinarFilters from "@/constants/webinarFilters";
import Post from "@/types/posts.types";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const WorkshopsPage = () => {
  const { fetchAllWorkshops } = useWorkShop();

  const [workshops, setWorkshops] = useState<WorkShop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getWorkshops = async () => {
      try {
        setLoading(true);
        const data = await fetchAllWorkshops();
        console.log(data);
        if (data === null) {
          setWorkshops([]);
        } else {
          setWorkshops(data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching workshops");
        console.error(error);
      }
    };

    getWorkshops();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Filter Component for better UI/UX */}
      <div className="mb-4">
        <Filter
          setData={
            setWorkshops as unknown as (data: Post[] | WorkShop[]) => void
          }
          isPost={false}
          filters={webinarFilters}
          setLoading={setLoading}
        />
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Workshops & Webinars
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <Skeleton variant="rectangular" width="100%" height={200} />
                <div className="p-4">
                  <WorkshopCardSkeleton />
                  <WorkshopCardSkeleton />
                  <WorkshopCardSkeleton />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {workshops.length === 0 ? (
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
                  No Workshops/webinars Found
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
                  It looks like there are no Workshops/webinars available at the moment
                </p>
              </motion.div>
            ) : (
              workshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopsPage;
