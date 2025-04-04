import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import farmerLoginSchema from "./FarmerLoginSchema";
import { Input } from "@/components/ui/input";
import Button from "@/components/Button/Button";
import { Loader2, LogIn } from "lucide-react";
import useAuth from "@/hooks/farmer/useAuth/useAuth";

const FarmerLoginForm = () => {
  const { phonePaswordLogin } = useAuth();

  const form = useForm<z.infer<typeof farmerLoginSchema>>({
    resolver: zodResolver(farmerLoginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof farmerLoginSchema>) => {
    // const newData = {
    //   email: data.phoneNumber + "@gmail.com",
    //   password: data.password,
    // };

    await phonePaswordLogin(data.phoneNumber + "@gmail.com", data.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="9987968756" type="number" {...field} />
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
            variant="outline"
            fullWidth
            icon={LogIn}
            className="bg-green-600 hover:bg-green-700"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FarmerLoginForm;
