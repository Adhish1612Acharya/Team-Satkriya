import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WorkShop from "@/types/workShop.types";
import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";
import WorkshopCardSkeleton from "@/components/WorkShopCardSkeleton/WorkShopCardSkeleton";
import { toast } from "react-toastify";
import { useAuthContext } from "@/context/AuthContext";

const WorkShopDetail = () => {
  const { userType } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchWorkshopById } = useWorkShop();

  const [workshop, setWorkshop] = useState<WorkShop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      if (!id) {
        toast.error("Some error occured");
        setLoading(false);
        navigate("/posts");
        return;
      }

      try {
        setLoading(true);
        const data = await fetchWorkshopById(id);
        setWorkshop(data);
        setLoading(false);
      } catch (err) {
        navigate("/posts");
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {!loading && workshop ? (
        <WorkshopCard
          userType={userType as "farmers" | "experts"}
          workshop={workshop}
        />
      ) : (
        <WorkshopCardSkeleton />
      )}
    </div>
  );
};

export default WorkShopDetail;
