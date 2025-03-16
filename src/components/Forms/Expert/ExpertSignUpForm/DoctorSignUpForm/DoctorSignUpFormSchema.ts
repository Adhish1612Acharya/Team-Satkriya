import { z } from "zod";

const doctorSignUpSchema = z.object({
  type: z.literal("doctor"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "password is required"),
  phoneNumber: z.string().refine((value) => /^[0-9]{10}$/.test(value), {
    message: "Enter a valid 10-digit phone number",
  }),
  address: z.string().min(1, "clinic location is required is required"),
  name: z.string().min(1, "Name is required"),
  uniqueId: z.string().min(1, "Unique ID is required"),
  education: z.string().min(1, "Education is required"),
  yearsOfPractice: z.string().refine((value) => /^[1-9]\d*$/.test(value), {
    message: "Enter a valid number greater than 0",
  }),
});

export default doctorSignUpSchema;
