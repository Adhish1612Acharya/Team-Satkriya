import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn } from "lucide-react";
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
import { CircularProgress } from "@mui/material";
import useAuth from "@/hooks/farmer/useAuth";

const loginSchema = z.object({
  phoneNumber: z.string().min(10, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginFarmer() {
  const { phonePaswordLogin } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const newData = {
      email: data.phoneNumber + "@gmail.com",
      password: data.password,
    };
    console.log(newData);

    await phonePaswordLogin(newData);
  };

  return (
    <AuthLayoutFarmer
      title="Welcome Back, Farmer!"
      subtitle="Sign in to your account to continue your journey with us."
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
              icon={LogIn}
              className="bg-green-600 hover:bg-green-700"
            >
              Sign in
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              {form.formState.isSubmitting ? (
                <CircularProgress />
              ) : (
                "Sign up with Google"
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Dont have an account?{" "}
            <a
              href="/farmer/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Register here
            </a>
          </p>
        </form>
      </Form>
    </AuthLayoutFarmer>
  );
}

export default LoginFarmer;
