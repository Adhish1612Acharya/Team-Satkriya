import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Button/Button";
import farmerRegisterSchema from "./FarmerRegisterSchema";
import useAuth from "@/hooks/farmer/useAuth/useAuth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { State, City } from "country-state-city";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const FarmerRegisterForm = () => {
  const { farmerSignUp } = useAuth();
  const [selectedState, setSelectedState] = useState("");

  const form = useForm({
    resolver: zodResolver(farmerRegisterSchema),
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

  // Get Indian states
  const indianStates = State.getStatesOfCountry("IN");

  // Get cities for selected state
  const stateCities = selectedState
    ? City.getCitiesOfState("IN", selectedState)
    : [];

  const onSubmit = async (data: z.infer<typeof farmerRegisterSchema>) => {
    const newData = {
      phoneNumber: Number(data.phoneNumber),
      language: data.language,
      name: data.name,
      state: data.state,
      city: data.city,
      experience: data.experience,
      password: data.password,
    };
    await farmerSignUp(newData);
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
                  form.setValue("city", ""); // Reset city when state changes
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select state" />
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
                        selectedState ? "Select city" : "Select state first"
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
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="5" type="number" {...field} />
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
              <FormLabel>Create Password</FormLabel>
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

        <div className="space-y-4">
          <Button
            variant="outline"
            type="submit"
            fullWidth
            disabled={form.formState.isSubmitting}
               className="cursor-pointer"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Account"
            )}
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
  );
};
