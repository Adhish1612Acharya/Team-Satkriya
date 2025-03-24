import { z } from "zod";


const workshopSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dateFrom: z.string().min(1, "Start date is required"),
    dateTo: z.string().min(1, "End date is required"),
    mode: z.enum(["online", "offline"], {
      required_error: "Mode is required",
    }),
    location: z.string(),
    link: z.string(),
    thumbnail: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, "Thumbnail is required"),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "online" && !data.link) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link is required for online events",
        path: ["link"],
      });
    }

    if (data.mode === "offline" && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required for offline events",
        path: ["location"],
      });
    }
  });

export default workshopSchema;
