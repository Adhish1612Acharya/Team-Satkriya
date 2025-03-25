import WorkShop from "@/types/workShop.types";

export interface WorkShopData {
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  mode: "online" | "offline";
  location: string;
  link: string;
  thumbnail: File;
  timeFrom: string;
  timeTo: string;
}

export type createWorkShopType = (
  workshop: WorkShopData,
  filters: string[]
) => Promise<string | null>;

export type fetchWorkshopByIdType = (id: string) => Promise<WorkShop | null>;

export type fetchAllWorkshopsType = () => Promise<WorkShop[] | null>;

export type GetFilteredWorkshopType = (
  filters: string[],
  userType:string | null
) => Promise<WorkShop[] | null>;
