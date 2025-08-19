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
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/primitives/card";
import { Badge } from "@/primitives/badge";
import type {
  Booking,
  BookingAPIResponse,
  BookingVehicle,
} from "@/interfaces/booking-management/booking";

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

export default function BookingInputForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [availableVehiclesData, setAvailableVehiclesData] =
    useState<BookingAPIResponse>();

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
      setIsLoading(false);
      toast.success("Vehicles available !", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
      });
    },
    onError: (error: Error) => {
      setAvailableVehiclesData(undefined);
      console.error("Error:", error);
      setIsLoading(false);
    },
  });

  const BookingMutation = useMutation({
    mutationFn: async (data: BookingVehicle) => {
      const url = "/api/booking";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      setIsBookingLoading(false);
      setAvailableVehiclesData(undefined);
      form.reset();
      toast.success("Booking created succesfully !", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
      });
    },
    onError: (error: Error) => {
      setIsBookingLoading(false);
      toast.error("Failed to create booking", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
        descriptionClassName: "!text-foreground",
        description: error.message,
      });
    },
  });

  // biome-ignore lint/suspicious/noExplicitAny: <>
  const handleBooking = (vehicle: any) => {
    setIsBookingLoading(true);

    const postData = {
      vehicleId: vehicle._id,
      fromPincode: Number.parseInt(form.getValues("fromPincode")),
      toPincode: Number.parseInt(form.getValues("toPincode")),
      startTime: Number.parseInt(form.getValues("startTime")),
      customerId: Math.floor(Math.random() * 1000),
    };
    BookingMutation.mutate(postData);
  };

  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    const postData: Booking = {
      capacity: Number(values.capacity),
      fromPincode: Number(values.fromPincode),
      toPincode: Number(values.toPincode),
      startTime: values.startTime,
    };
    searchVehicleMutation.mutate(postData);
    setIsLoading(true);
  }
  return (
    <>
      <div className="my-4 font-medium text-lg">Book new ride</div>
      {/* search form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

          {/* form action */}
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

      {/* available vehicles */}
      {availableVehiclesData?.data && (
        <Card className="mt-8 h-auto w-full">
          <CardHeader>Available Vehicles</CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center">Loading available vehicles...</p>
            ) : availableVehiclesData.data.length > 0 ? (
              <div className="space-y-4">
                {/** biome-ignore lint/suspicious/noExplicitAny: <> */}
                {availableVehiclesData.data.map((vehicle: any, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border bg-background p-4 "
                  >
                    <div className="flex gap-8 overflow-x-auto">
                      <span className="flex gap-2">
                        <Badge>Name</Badge>:
                        <Badge variant={"secondary"} className="font-medium">
                          {vehicle.name}
                        </Badge>
                      </span>
                      <span className="flex gap-2">
                        <Badge>Capacity</Badge>:
                        <Badge variant={"secondary"} className="font-medium">
                          {vehicle.capacityKg} kg
                        </Badge>
                      </span>
                      <span className="flex gap-2">
                        <Badge>Tyres</Badge>:
                        <Badge variant={"secondary"} className="font-medium">
                          {vehicle.tyres}
                        </Badge>
                      </span>
                    </div>
                    <Button
                      variant={"success"}
                      onClick={() => handleBooking(vehicle)}
                      className="ml-4 text-secondary-foreground"
                    >
                      {isBookingLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirming booking...
                        </>
                      ) : (
                        "Book Now"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No vehicles available</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
