import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  BarChart,
  Badge,
  MapPin,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@mui/material";
import WorkShop from "@/types/workShop.types";
import { Card, CardContent } from "@/components/ui/card";
import WorkshopCard from "@/components/WorkshopCard/WorkshopCard";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { Timestamp } from "firebase/firestore";
import WorkshopCardSkeleton from "@/components/WorkShopCardSkeleton/WorkShopCardSkeleton";

const WorkShopDetail = () => {
  const { id } = useParams();
  const { fetchWorkshopById } = useWorkShop();

  const [workshop, setWorkshop] = useState<WorkShop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      if (!id) {
        setError("Workshop ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchWorkshopById(id);
        setWorkshop(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load workshop details. Please try again later.");
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {!loading && workshop ? (
        <WorkshopCard workshop={workshop} />
      ) : (
        <WorkshopCardSkeleton />
      )}
    </div>
  );
};

export default WorkShopDetail;
