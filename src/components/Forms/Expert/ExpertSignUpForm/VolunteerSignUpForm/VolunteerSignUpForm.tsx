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
import volunteerSignUpSchema from "./VolunteerSignUpSchema";
import Button from "@/components/Button/Button";
import { SignUpArguTypes } from "@/hooks/expert/useAuth/useAuth.types";
import useAuth from "@/hooks/expert/useAuth/useAuth";
import { toast } from "react-toastify";
import { City, State } from "country-state-city";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const VolunteerSignUpForm = () => {
  const { expertSignUp, googleSignUp } = useAuth();
  const [selectedState, setSelectedState] = useState("");

  const form = useForm<z.infer<typeof volunteerSignUpSchema>>({
    resolver: zodResolver(volunteerSignUpSchema),
    defaultValues: {
      type: "volunteer",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      state: "",
      city: "",
      name: "",
      education: "",
    },
  });

  // Get Indian states
  const indianStates = State.getStatesOfCountry("IN");

  // Get cities for selected state
  const stateCities = selectedState
    ? City.getCitiesOfState("IN", selectedState)
    : [];

  const onSubmit = async (data: z.infer<typeof volunteerSignUpSchema>) => {
    const dataToPass: SignUpArguTypes = {
      name: data.name,
      email: data.email,
      password: data.password,
      address: data.address,
      contactNo: Number(data.phoneNumber),
      role: data.type,
      profileData: {
        education: data.education,
        state: data.state,
        city: data.city,
      },
    };
    await expertSignUp(dataToPass);
  };

  const signUpWithGoogle = async () => {
    const profileFields: (keyof z.infer<typeof volunteerSignUpSchema>)[] = [
      "phoneNumber",
      "address",
      "education",
      "state",
      "city",
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
        education: form.getValues("education"),
        state: form.getValues("state"),
        city: form.getValues("city"),
      };
      await googleSignUp("volunteer", profileData, address, phoneNumber);
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
                <Input
                  type="number"
                  placeholder="Enter 10-digit mobile number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State Field */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedState(value);
                  form.setValue("city", "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {indianStates.map((state) => (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City Field */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedState}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedState
                          ? "Select your city"
                          : "Please select state first"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {stateCities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office/working Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your complete Office/working  address"
                  {...field}
                />
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
                <Input
                  placeholder="Enter your highest qualification (e.g., B.Sc Agriculture)"
                  {...field}
                />
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
                <Input
                  placeholder="Enter your active email address"
                  {...field}
                />
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
                <Input
                  type="password"
                  placeholder="Create a strong password (min 8 characters)"
                  {...field}
                />
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
                <Input
                  placeholder="Enter your full name as per ID proof"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            icon={Lock}
            disabled={form.formState.isSubmitting}
            type="submit"
            fullWidth
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Account"
            )}
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

export default VolunteerSignUpForm;
