import { z } from "zod";

const workshopSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
     dateFrom: z.date(),
     dateTo: z.date(),
    timeFrom:z.string().min(1),
    timeTo:z.string().min(1),
    mode: z.enum(["online", "offline"], {
      required_error: "Mode is required",
    }),
    location: z.string(),
    link: z.string(),
    thumbnail: z
      .instanceof(File)
      .refine((file) => file.size > 0, "Thumbnail is required"),
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

    if(data.dateTo< data.dateFrom){
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid date greater than from date",
        path: ["dateTo"],
      });
    }

    if (data.timeTo < data.timeFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid Time greater than start time",
        path: ["timeTo"],
      });
    }
  });

export default workshopSchema;
