import WorkShop from "@/types/workShop.types";

interface workShopData {
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  mode: "online" | "offline";
  location: string;
  link: string;
  thumbnail: File;
  timeFrom:string;
  timeTo:string
}

export type createWorkShopType = (
  workshop: workShopData
) => Promise<string | null>;

export type fetchWorkshopByIdType = (id: string) => Promise<WorkShop | null>;

export type fetchAllWorkshopsType = () => Promise<WorkShop[] | null>;
