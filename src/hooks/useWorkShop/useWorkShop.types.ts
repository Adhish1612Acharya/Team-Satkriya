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

// Type for registerWorkShop function
export type RegisterWorkshopType = (
  workshopId: string,
  userType: "farmers" | "experts"
) => Promise<void>;

// Type for getWorkshopRegistrationDetails function
export type GetWorkshopRegistrationDetailsType = (
  workshopId: string,
) => Promise<WorkShop | void>;

export type GetUserRegistrationsDetailsType=(userType:"farmers" | "experts")=> Promise<WorkShop[] | void>