import { z } from "zod";

const ngoSignUpSchema = z.object({
  type: z.literal("ngo"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  name: z.string().min(1, "NGO name is required"),
  organization: z.string().min(1, "Organization is required"),
});

export default ngoSignUpSchema;
