import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  z from "zod";
import { AuthLayoutFarmer } from "../components/AuthLayoutFarmer";
import { Button } from "../components/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const farmerSchema = z.object({
  phoneNumber: z.string().min(10, "Invalid phone number"),
  language: z.string().min(1, "Language is required"),
  name: z.string().min(1, "Name is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  experience: z.string().min(1, "Experience is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function RegisterFarmer() {
  const form = useForm({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      phoneNumber: "",
      language: "",
      name: "",
      state: "",
      city: "",
      experience: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof farmerSchema>) {
    const newFramer = {
      ...data,
      email: data,
    };
    console.log(data);
  }

  return (
    <AuthLayoutFarmer
      title="Create an Account, Farmer"
      subtitle="Join our community and make a difference."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input placeholder="English" {...field} />
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="California" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Los Angeles" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Input placeholder="5 years" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <Button
              type="submit"
              fullWidth
              className="bg-green-600 hover:bg-green-700"
            >
              Create Account
            </Button>
            <Button type="button" variant="outline" fullWidth>
              Sign up with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/farmer/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in
            </a>
          </p>
        </form>
      </Form>
    </AuthLayoutFarmer>
  );
}

export default RegisterFarmer;
