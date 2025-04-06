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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Step, StepLabel, Stepper } from "@mui/material";
import getMediaType from "@/utils/getFileMediaType";
import { verifyUploadedMedia } from "@/utils/verifyMedia";

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
  const [activeStep, setActiveStep] = useState(0);

  // Use local state to prevent focus loss
  const [locationValue, setLocationValue] = useState("");

  const [linkValue, setLinkValue] = useState("");

  const [preview, setPreview] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof workshopSchema>>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: "",
      description: "",
      dateFrom: new Date(),
      dateTo: new Date(),
      mode: "offline",
      location: "",
      link: "",
      thumbnail: undefined,
      timeFrom: "",
      timeTo: "",
    },
  });

  const mode = form.watch("mode");

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

  const steps = ["Basic Information", "Date & Time", "Thumbnail"];

  /**
   * Handles navigation to the next step in a multi-step form
   * - Validates fields based on the current active step
   * - Includes custom logic for online/offline mode validations
   * - Advances step only if current inputs are valid
   */
  const handleNext = async () => {
    let isValid = false;

    // Step 0: Validate basic details
    if (activeStep === 0) {
      isValid = await form.trigger(["title", "description"]);
    }

    // Step 1: Validate schedule + conditional fields
    else if (activeStep === 1) {
      // Validate common fields first
      isValid = await form.trigger([
        "dateFrom",
        "dateTo",
        "timeFrom",
        "timeTo",
        "mode",
      ]);

      if (isValid) {
        const mode = form.getValues("mode");
        const { link, location } = form.getValues();

        // Mode-specific validation
        if (mode === "online" && (!link || link.trim() === "")) {
          form.setError("link", {
            type: "manual",
            message: "Meeting link is required for online events",
          });
          isValid = false;
        } else if (
          mode === "offline" &&
          (!location || location.trim() === "")
        ) {
          form.setError("location", {
            type: "manual",
            message: "Location is required for offline events",
          });
          isValid = false;
        }
      }
    }

    // Step 2: No validation required
    else if (activeStep === 2) {
      isValid = true;
    }

    // If valid, move to next step
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  /**
   * Handles submission of the workshop creation form
   * - Converts time fields to 12-hour format
   * - Validates uploaded thumbnail (if any)
   * - Uses AI to validate and filter webinar content
   * - Stores validated workshop with generated filters
   * - Navigates to the newly created workshop page
   */
  const onSubmit = async (data: z.infer<typeof workshopSchema>) => {
    try {
      // 1. Convert time fields to 12-hour format for consistency
      data.timeFrom = formatTime12Hour(data.timeFrom);
      data.timeTo = formatTime12Hour(data.timeTo);

      // 2. Thumbnail media validation (if present)
      const file = data.thumbnail;
      if (file && file instanceof File) {
        const fileType = getMediaType(file);
        const base64File = await convertToBase64(file);

        const response = await verifyUploadedMedia(file, fileType, base64File);

        if (!response.valid) {
          // Early return if file validation fails
          return;
        }
      }

      // 3. AI-assisted validation of workshop content (title & description)
      const validateWebinar = await validateAndFilterWebinar(
        { title: data.title, description: data.description },
        webinarFilters
      );

      if (!validateWebinar.valid) {
        // Content rejected by AI validator
        return;
      }

      const filters = validateWebinar.filters;

      // 4. Create the workshop with validated filters
      const createdWorkshopId = await createWorkshop(data, filters);
      if (!createdWorkshopId) {
        return;
      }

      // 5. Redirect user to the new workshop detail page
      navigate(`/workshops/${createdWorkshopId}`);
    } catch (error) {
      console.error("Error adding workshop:", error);
    }
  };

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {activeStep === 0 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workshop Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter workshop title"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e); // Update field value
                          form.trigger("title"); // Trigger validation immediately
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your workshop"
                        className="min-h-32"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e); // Update field value
                          form.trigger("description"); // Trigger validation immediately
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              {/* Date Pickers - Responsive Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Start Date */}
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Start Date"
                    value={dateFrom}
                    onChange={(newValue: Dayjs | null) => {
                      setDateFrom(newValue);
                      if (newValue && dateTo && newValue.isAfter(dateTo)) {
                        setDateTo(newValue);
                        form.setValue(
                          "dateTo",
                          newValue?.toDate() || new Date()
                        );
                      }
                      form.setValue(
                        "dateFrom",
                        newValue?.toDate() || new Date()
                      );
                      form.trigger(["dateFrom", "dateTo"]);
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
                      form.trigger(["dateFrom", "dateTo"]);
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
                          form.trigger("timeFrom");
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
                        <SelectContent className="max-h-[var(--radix-select-content-available-height)]">
                          <div className="max-h-[200px] overflow-y-auto">
                            {" "}
                            {/* Fixed height container */}
                            {timeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="h-[40px]" // Fixed item height
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </div>
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
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.trigger("timeTo"); // Validate on change
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select end time">
                              {formatTime12Hour(field.value)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[var(--radix-select-content-available-height)]">
                          <div className="max-h-[200px] overflow-y-auto">
                            {" "}
                            {/* Fixed height container */}
                            {timeOptions
                              .filter((option) => {
                                return option.value > timeFrom;
                              })
                              .map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                          </div>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Event Mode</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value); // Update the mode value
                          form.trigger("mode");
                          // Clear the opposite field when mode changes
                          if (value === "offline") {
                            form.setValue("location", ""); // Clear location
                            form.clearErrors("location"); // Clear any location errors
                            setLocationValue("");
                          } else {
                            form.setValue("link", ""); // Clear link
                            form.clearErrors("link"); // Clear any link errors
                            setLinkValue("");
                          }
                        }}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="online" />
                          </FormControl>
                          <FormLabel className="font-normal">Online</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="offline" />
                          </FormControl>
                          <FormLabel className="font-normal">Offline</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "offline" ? (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter physical location"
                            value={locationValue}
                            onChange={(e) => {
                              const value = e.target.value;
                              setLocationValue(value); // Update local state immediately
                              field.onChange(value); // Update form state
                              form.trigger("location");
                            }}
                            onBlur={() => {
                              field.onBlur(); // Handle blur event
                              form.trigger("location"); // Validate on blur
                            }}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Meeting Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://zoom.us/j/example"
                            value={linkValue}
                            onChange={(e) => {
                              const value = e.target.value;
                              setLinkValue(value); // Update local state immediately
                              field.onChange(value); // Update form state
                              form.trigger("link");
                            }}
                            onBlur={() => {
                              field.onBlur(); // Handle blur event
                              form.trigger("link"); // Validate on blur
                            }}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
            </div>
          )}

          {activeStep === 2 && (
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                const handleFileChange = (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                    const imageUrl = URL.createObjectURL(file);
                    setPreview(imageUrl);
                    form.trigger("thumbnail");
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
          )}

          <div className="flex justify-end gap-4">
            {activeStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                type="button" // Explicitly set to button
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  handleNext();
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Creating..."
                  : "Create Workshop"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

export default WorkshopForm;
