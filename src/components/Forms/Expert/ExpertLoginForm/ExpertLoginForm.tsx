import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/expert/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleIcon from "@mui/icons-material/Google";
import { FC } from "react";
import loginSchema from "./ExpertLoginFormSchema";
import Button from "@/components/Button/Button";

const ExpertLoginForm: FC = () => {
  const { googleLogin, signInWithEmailPassword, gooleLoginLoad } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    console.log(data);
    // signInWithEmailPassword(data);
  }

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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button type="submit" variant="outline" fullWidth icon={LogIn}>
            {form.formState.isSubmitting ? <CircularProgress /> : "Sign in"}
          </Button>

          <Button
            type="button"
            onClick={() => googleLogin("expert")}
            variant="outline"
            fullWidth
            icon={GoogleIcon}
          >
            {gooleLoginLoad}?<CircularProgress />: Sign In with Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Dont have an account?{" "}
          <a
            href="/expert/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </a>
        </p>
      </form>
    </Form>
  );
};

export default ExpertLoginForm;
