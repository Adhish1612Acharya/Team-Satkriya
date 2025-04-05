import { z } from "zod";

const volunteerSignUpSchema = z.object({
  type: z.literal("volunteer"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().refine((value) => /^[0-9]{10}$/.test(value), {
    message: "Enter a valid 10-digit phone number",
  }),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  name: z.string().min(1, "Research Institute name is required"),
  education: z.string().min(1, "Education Is Required"),
});

export default volunteerSignUpSchema;
