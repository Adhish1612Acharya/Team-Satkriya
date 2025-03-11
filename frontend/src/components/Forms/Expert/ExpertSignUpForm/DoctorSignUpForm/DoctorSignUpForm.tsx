import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import doctorSignUpSchema from "./DoctorSignUpFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lock } from "lucide-react";
import Button from "@/components/Button/Button";
import useAuth from "@/hooks/expert/useAuth/useAuth";
import { SignUpArguTypes } from "@/hooks/expert/useAuth/useAuth.types";

const DoctorSignUpForm = () => {
const {expertSignUp}=useAuth();

  const form = useForm<z.infer<typeof doctorSignUpSchema>>({
    resolver: zodResolver(doctorSignUpSchema),
    defaultValues: {
      type: "doctor",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      name: "",
      uniqueId: "",
      education: "",
      yearsOfPractice: "1", 
      clinicLocation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof doctorSignUpSchema>) => {
    console.log(data);
    const dataToPass:SignUpArguTypes={
       name:data.name,
       email:data.email,
       password:data.password,
       address:data.address,
       contactNo:Number(data.phoneNumber),
       role:data.type,
       profileData :{
        uniqueId: Number(data.uniqueId),
        education: data.education,
        yearsOfPractice: Number(data.yearsOfPractice),
        clinicLocation: data.clinicLocation
       },


    }
    await expertSignUp(dataToPass);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="*******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="uniqueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unique ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsOfPractice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Practice</FormLabel>
              <FormControl>
                <Input type="number"    {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clinicLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button variant="outline" icon={Lock} type="submit" fullWidth>
            Create Account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DoctorSignUpForm;
