import { z } from "zod";

const researchInstSignUpSchema = z.object({
  type: z.literal("research"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "password is required"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  name: z.string().min(1, "Research Institute name is required"),
});

export default researchInstSignUpSchema;
