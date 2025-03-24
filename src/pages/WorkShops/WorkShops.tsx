import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Firebase configuration
import { Skeleton } from "@mui/material";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import { toast } from "react-toastify";
import WorkShop from "@/types/workShop.types";
import WorkshopCardSkeleton from "@/components/WorkShopCardSkeleton/WorkShopCardSkeleton";
import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";

const WorkshopsPage= () => {
  const { fetchAllWorkshops } = useWorkShop();

  const [workshops, setWorkshops] = useState<WorkShop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const getWorkshops = async () => {
      try {
        setLoading(true);
        const data = await fetchAllWorkshops();
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
               <WorkshopCardSkeleton/>
               <WorkshopCardSkeleton/>
               <WorkshopCardSkeleton/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkshopsPage;
