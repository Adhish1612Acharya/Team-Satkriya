import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { toast } from "react-toastify";
import {  Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import workshopSchema from "./WorkShopFormSchema";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";
import { validateAndFilterWebinar } from "@/utils/geminiApiCalls";
import convertToBase64 from "@/utils/covertToBase64";
import webinarFilters from "@/constants/webinarFilters";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { format } from "date-fns";

// Generate time options in 12-hour format
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date();
      time.setHours(hour, minute, 0);

      const value = format(time, "HH:mm");
      const label = format(time, "h:mm a");

      options.push({ value, label });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

const WorkshopForm = () => {
  const navigate = useNavigate();
  const { createWorkshop } = useWorkShop();

  // Inside your component
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs());
  const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs());

  // Initialize form
  const form = useForm<z.infer<typeof workshopSchema>>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: "",
      description: "",
      dateFrom: new Date(),
      dateTo: new Date(),
      mode: "online",
      location: "",
      link: "",
      thumbnail: undefined,
      timeFrom: "",
      timeTo: "",
    },
  });

  const mode = form.watch("mode");
  // const dateFrom = form.watch("dateFrom");
  // const dateTo = form.watch("dateTo");
  const timeFrom = form.watch("timeFrom");

  const formatTime12Hour = (time24: string) => {
    if (!time24) return "";
    try {
      const [hours, minutes] = time24.split(":");
      const date = new Date();
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0);
      return format(date, "h:mm a");
    } catch (e) {
      return time24;
    }
  };

  const onSubmit = async (data: z.infer<typeof workshopSchema>) => {
    try {
      data.timeFrom = formatTime12Hour(data.timeFrom);
      data.timeTo = formatTime12Hour(data.timeTo);
      const thumnailBase64 = await convertToBase64(data.thumbnail);
      const validateWebinar = await validateAndFilterWebinar(
        { title: data.title, description: data.description },
        thumnailBase64,
        webinarFilters
      );

      if (!validateWebinar?.replace(/```json|```/g, "")) {
        toast.error("Some error occured");
        return;
      }

      const cleanResponse = validateWebinar?.replace(/```json|```/g, "");
      const jsonData: { valid: boolean; filters: string[]; error?: string } =
        JSON.parse(cleanResponse);

      if (!jsonData.valid && jsonData.error) {
        toast.error("Some error occured");
        return;
      } else if (!jsonData.valid) {
        toast.error("Webinar not  valid/relevant");
        return;
      }

      const filters = jsonData.filters;

      const createdWorkshopId = await createWorkshop(data, filters);
      if (!createdWorkshopId) {
        return;
      }
      toast.success("Workshop Created");
      // Redirect to the workshop details page
      navigate(`/workshops/${createdWorkshopId}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Workshop
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Workshop Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter workshop title"
                      {...field}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your workshop"
                      className="min-h-32 focus:ring-2 focus:ring-primary resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Date Range
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 font-medium">
                      Start Date
                    </FormLabel>
                    <Popover>
                       <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}

                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                     </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              if (dateTo < date) {
                                form.setValue("dateTo", date); // Correct way to set "dateTo"
                              }
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Start date of your workshop
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateTo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 font-medium">
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < dateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>End date of your workshop</FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Start Date"
                  value={dateFrom}
                  onChange={(newValue: Dayjs | null) => {
                    setDateFrom(newValue);
                    if (newValue && dateTo && newValue.isAfter(dateTo)) {
                      setDateTo(newValue);
                      form.setValue("dateTo", newValue?.toDate() || new Date());
                    }
                    form.setValue("dateFrom", newValue?.toDate() || new Date());
                  }}
                  minDate={dayjs()}
                  format="MMM DD, YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                    },
                  }}
                />
              </DemoContainer>

              {/* End Date */}
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="End Date"
                  value={dateTo}
                  onChange={(newValue: Dayjs | null) => {
                    setDateTo(newValue);
                    form.setValue("dateTo", newValue?.toDate() || new Date());
                  }}
                  minDate={dateFrom || dayjs()}
                  format="MMM DD, YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                    },
                  }}
                />
              </DemoContainer>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="timeFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Start Time
                    </FormLabel>
                    <Select
                      onValueChange={(time: string) => {
                        field.onChange(time);
                        form.setValue("timeTo", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select start time">
                            {formatTime12Hour(field.value)}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      End Time
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select end time">
                            {formatTime12Hour(field.value)}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions
                          .filter((option) => {
                            return option.value > timeFrom;
                          })
                          .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Mode (Online/Offline) */}
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-gray-700 font-medium">
                    Event Mode
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                        <FormControl>
                          <RadioGroupItem value="online" />
                        </FormControl>
                        <FormLabel className="font-normal text-gray-700 cursor-pointer">
                          Online
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                        <FormControl>
                          <RadioGroupItem value="offline" />
                        </FormControl>
                        <FormLabel className="font-normal text-gray-700 cursor-pointer">
                          Offline
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Conditional Fields based on Mode */}
            {mode === "offline" ? (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter physical location"
                        {...field}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Meeting Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://zoom.us/j/example"
                        {...field}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                const [preview, setPreview] = useState<string | null>(null);

                const handleFileChange = (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                    const imageUrl = URL.createObjectURL(file);
                    setPreview(imageUrl);
                  }
                };

                return (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Thumbnail
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("thumbnail-upload")?.click()
                          }
                          className="relative"
                        >
                          Choose Image
                          <Input
                            id="thumbnail-upload"
                            type="file"
                            onChange={handleFileChange}
                            {...fieldProps}
                            className="hidden"
                            accept="image/*"
                          />
                        </Button>
                        <span className="text-sm text-gray-500">
                          {value ? value.name : "No file chosen"}
                        </span>
                      </div>
                    </FormControl>
                    {/* Image Preview */}
                    {preview && (
                      <div className="mt-4">
                        <img
                          src={preview}
                          alt="Thumbnail Preview"
                          className="w-40 h-24 object-cover rounded-md shadow"
                        />
                      </div>
                    )}
                    <FormDescription className="text-gray-500">
                      Upload an image for your workshop thumbnail (recommended
                      size: 1200×630px)
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                );
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-md transition-all"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workshop/Webinar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WorkshopForm;

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { cn } from "@/lib/utils";
// // import { toast } from "@/components/hooks/use-toast"
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useState } from "react";

// const FormSchema = z.object({
//   dob: z.date({
//     required_error: "A date of birth is required.",
//   }),
// });

// const WorkShopForm = () => {
//   const [open, setOpen] = useState(false); // Add this at the top of your component
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     // toast({
//     //   title: "You submitted the following values:",
//     //   description: (
//     //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//     //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//     //     </pre>
//     //   ),
//     // })
//   }

//   console.log("Open : ", open);

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="dob"
//           render={({ field }) => (
//             <FormItem className="flex flex-col">
//               <FormLabel>Date of birth</FormLabel>
//               <Popover open={true} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       type="button" // Crucial addition
//                       variant={"outline"}
//                       className={cn(
//                         "w-[240px] pl-3 text-left font-normal",
//                         !field.value && "text-muted-foreground"
//                       )}
//                     >
//                       {/* ... existing button content ... */}
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>
//                 <PopoverContent   onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus loss
//         onCloseAutoFocus={(e) => e.preventDefault()}    className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={field.value}
//                     onSelect={(date) => {
//                       field.onChange(date);
//                       setOpen(false); // Close after selection
//                     }}
//                     disabled={(date) =>
//                       date > new Date() || date < new Date("1900-01-01")
//                     }
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//               Key Fixes:
//               <FormDescription>
//                 Your date of birth is used to calculate your age.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// };

// export default WorkShopForm;
