import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import ngoSignUpSchema from "./NgoSignUpFormSchema";
import Button from "@/components/Button/Button";
import { toast } from "react-toastify";
import useAuth from "@/hooks/expert/useAuth/useAuth";
import { SignUpArguTypes } from "@/hooks/expert/useAuth/useAuth.types";

const NgoSignUpForm = () => {
  const { expertSignUp, googleSignUp } = useAuth();

  const form = useForm<z.infer<typeof ngoSignUpSchema>>({
    resolver: zodResolver(ngoSignUpSchema),
    defaultValues: {
      type: "ngo",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      name: "",
      organization: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ngoSignUpSchema>) => {
    const dataToPass: SignUpArguTypes = {
      name: data.name,
      email: data.email,
      password: data.password,
      address: data.address,
      contactNo: Number(data.phoneNumber),
      role: data.type,
      profileData: {
        organization: data.organization,
      },
    };
    await expertSignUp(dataToPass);
  };

  const signUpWithGoogle = async () => {

    const profileFields: (keyof z.infer<typeof ngoSignUpSchema>)[] = [
      "phoneNumber",
      "address",
      "organization",
    ];

    let isValid = true;

    for (const field of profileFields) {
      const fieldValid = await form.trigger(field);
      if (!fieldValid) isValid = false;
    }

    if (!isValid) {
      toast.error(
        "Please fill all required fields correctly before signing up with Google."
      );
      return;
    } else {
      const phoneNumber = Number(form.getValues("phoneNumber"));
      const address = form.getValues("address");
      const profileData = {
        organization: form.getValues("organization"),
      };
      await googleSignUp("ngo", profileData, address, phoneNumber);
    }
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
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NGO Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
        <Button variant="outline" className="cursor-pointer" icon={Lock} disabled={form.formState.isSubmitting} type="submit" fullWidth>
          {form.formState.isSubmitting ? <Loader2/> : "Create Account"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={signUpWithGoogle}
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Sign Up with Google
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NgoSignUpForm;
