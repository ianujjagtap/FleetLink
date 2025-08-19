"use client";

import { Button } from "@/primitives/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface Vehicle {
  name: string;
  capacityKg: number;
  tyres: number;
}
const vehicleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  capacity: z.string().min(1, "Capacity must be at least 1"),
  tyres: z.string().min(1, "Tyres must be at least 1"),
});

export default function VehicleInputForm() {
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: "",
      capacity: "",
      tyres: "",
    },
  });

  const addVehicleMutation = useMutation({
    mutationFn: async (data: Vehicle) => {
      const url = "/api/vehicles";
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
      setIsLoading(false);
      toast.success("Vehicle added successfully !", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast.error("Failed to add vehicle", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
        descriptionClassName: "!text-foreground",
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  function onSubmit(values: z.infer<typeof vehicleFormSchema>) {
    const postData: Vehicle = {
      name: values.name,
      capacityKg: Number.parseInt(values.capacity),
      tyres: Number.parseInt(values.tyres, 10),
    };
    addVehicleMutation.mutate(postData);
    setIsLoading(true);
  }

  return (
    <>
      <div className="my-4 font-medium text-lg">Add new vehicle</div>
      {/* add vehicle form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Name</FormLabel>
                <span className="m-1 text-red-600 text-xl">*</span>
                <FormControl>
                  <Input placeholder="Enter vehicle name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name of the vehicle you want to add
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="tyres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Tyres</FormLabel>
                <span className="m-1 text-red-600 text-xl">*</span>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tyres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 Tyres</SelectItem>
                      <SelectItem value="10">10 Tyres</SelectItem>
                      <SelectItem value="12">12 Tyres</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the number of tyres of the vehicle
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* form actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Vehicle...
                </>
              ) : (
                "Add Vehicle"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
