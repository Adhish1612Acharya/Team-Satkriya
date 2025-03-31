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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
  const dateFrom = form.watch("dateFrom");
  const dateTo = form.watch("dateTo");
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

            {/* Date Range */}
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
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={()=>console.log("Clicked")}
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
                      {/* <Input 
                type="calendar" 
                value={selectedDate} 
                onChange={(e) =>  if (e.target.value) {
                  field.onChange(e.target.value);
                  if (dateTo < date) {
                    form.setValue("dateTo", date); // Correct way to set "dateTo"
                  }
                }} 
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} 
            /> */}
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
