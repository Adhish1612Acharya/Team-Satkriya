import { z } from "zod";

const volunteerSignUpSchema = z.object({
  type: z.literal("volunteer"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "password is required"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  name: z.string().min(1, "Research Institute name is required"),
  education: z.string().min(1, "Education Is Required"),
});

export default volunteerSignUpSchema;
