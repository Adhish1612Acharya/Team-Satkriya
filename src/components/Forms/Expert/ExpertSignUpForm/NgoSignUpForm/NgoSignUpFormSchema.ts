import { z } from "zod";

const ngoSignUpSchema = z.object({
  type: z.literal("ngo"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber:  z.string().refine((value) => /^[0-9]{10}$/.test(value), {
    message: "Enter a valid 10-digit phone number",
  }),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  name: z.string().min(1, "NGO name is required"),
  organization: z.string().min(1, "Organization is required"),
});

export default ngoSignUpSchema;
