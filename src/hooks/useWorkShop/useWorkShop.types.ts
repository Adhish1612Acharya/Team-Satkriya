interface workShopData {
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  mode: "online" | "offline";
  location: string;
  link: string;
  thumbnail: link;
}

export type createWorkShopType = (workshop: workShopData) => Promise<void>;
