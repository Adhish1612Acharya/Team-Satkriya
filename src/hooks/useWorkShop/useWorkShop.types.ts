import WorkShop from "@/types/workShop.types";

interface workShopData {
  title: string;
  description: string;
  dateFrom: string;
  dateTo: string;
  mode: "online" | "offline";
  location: string | null;
  link: string | null;
  thumbnail: FileList;
}

export type createWorkShopType = (
  workshop: workShopData
) => Promise<string | null>;

export type fetchWorkshopByIdType = (id: string) => Promise<WorkShop | null>;

export type fetchAllWorkshopsType = () => Promise<WorkShop[] | null>;
