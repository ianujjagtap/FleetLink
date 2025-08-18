"use client";

import { Button } from "@/primitives/button";
import { Calendar } from "@/primitives/calender";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/primitives/form";
import { Input } from "@/primitives/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";

interface Booking {
  capacity: number;
  fromPincode: number;
  toPincode: number;
  startTime: string;
}

const bookingFormSchema = z.object({
  capacity: z.string().min(1, "Capacity must be at least 1"),
  fromPincode: z.string().min(1, "From Pincode is required"),
  toPincode: z.string().min(1, "To Pincode is required"),
  startTime: z
    .string()
    .min(1, "Start Time is required")
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});

export default function VehicleInputForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [availableVehiclsData, setAvailableVehiclesData] = useState<Booking[]>(
    []
  );

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      capacity: "",
      fromPincode: "",
      toPincode: "",
      startTime: "",
    },
  });

  const searchVehicleMutation = useMutation({
    mutationFn: async (data: Booking) => {
      const queryParams = new URLSearchParams({
        capacity: data.capacity.toString(),
        fromPincode: data.fromPincode.toString(),
        toPincode: data.toPincode.toString(),
        startTime: data.startTime,
      }).toString();

      const url = `/api/vehicles/available?${queryParams}`;
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Error status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAvailableVehiclesData(data);
      console.log("Available vehicles data:", data);
      setIsLoading(false);
      toast.success("Available vehicles fetched successfully!", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
      });
    },
    onError: (error: Error) => {
      setAvailableVehiclesData([]);
      toast.error("Failed to fetch vehicles", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
        descriptionClassName: "!text-foreground",
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    const postData: Booking = {
      capacity: Number(values.capacity),
      fromPincode: Number(values.fromPincode),
      toPincode: Number(values.toPincode),
      startTime: values.startTime,
    };
    console.log("Submitting booking data:", postData);
    searchVehicleMutation.mutate(postData);
    setIsLoading(true);
  }

  return (
    <>
      <div className="my-4 font-medium text-lg">Book new ride</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity ( In KG)</FormLabel>
                  <span className="m-1 text-red-600 text-xl">*</span>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter vehicle capacity"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the capacity of the vehicle in KG
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromPincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Pincode (Ride from)</FormLabel>
                  <span className="m-1 text-red-600 text-xl">*</span>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter pincode to ride from"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the pincode from which you want to start the ride
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toPincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Pincode (Ride to)</FormLabel>
                  <span className="m-1 text-red-600 text-xl">*</span>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter pincode to ride to"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the pincode to which you want to ride
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Start Date
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`pl-3 font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick an end date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date.toISOString());
                          }
                        }}
                        disabled={(date) => date < new Date()} // past dates disabled
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date and time when you want to start the ride
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching vehicles...
                </>
              ) : (
                "Search Vehicles"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
