import { z } from "zod";

const postSchema = z.object({
    content: z.string().min(1, "Content is required"),
    media: z
      .union([
        z.object({
          url: z.string(),
          type: z.enum(["image", "video", "document"]),
        }),
        z.null(),
      ])
      .optional(),
  });

  export default postSchema;
