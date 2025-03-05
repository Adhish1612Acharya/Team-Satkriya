import { z } from "zod";

const doctorSignUpSchema = z.object({
  type: z.literal("doctor"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "password is required"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  name: z.string().min(1, "Name is required"),
  uniqueId: z.string().min(1, "Unique ID is required"),
  education: z.string().min(1, "Education is required"),
  yearsOfPractice: z.number().min(1, "Years of practice is required"),
  clinicLocation: z.string().min(1, "Clinic location is required"),
});

export default doctorSignUpSchema;
