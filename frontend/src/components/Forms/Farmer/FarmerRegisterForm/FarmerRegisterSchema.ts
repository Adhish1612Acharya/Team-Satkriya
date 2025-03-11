import { z } from "zod";

const farmerRegisterSchema = z.object({
  phoneNumber: z .number()
  .int()
  .positive()
  .refine((num) => num.toString().length === 10, {
    message: "Phone number must be exactly 10 digits",
  }),
  language: z.string().min(1, "Language is required"),
  name: z.string().min(1, "Name is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  experience: z.string().min(1, "Experience is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default farmerRegisterSchema;
