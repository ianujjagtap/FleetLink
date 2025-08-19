"use client";
import Layout from "@/app/page";
import BookingInputForm from "@/components/ui/dashboard/booking-management/input-form";
import { Card, CardContent } from "@/primitives/card";
import { Label } from "@/primitives/label";

const Page = () => {
  return (
    <div className="max-h-screen">
      <Layout>
        <div className="m-4 space-y-4">
          <Label className="text-2xl">Booking Management</Label>
          <div className="mt-4 lg:items-start">
            <div className="w-full">
              <Card className="w-full bg-secondary/10 p-4">
                <CardContent>
                  <BookingInputForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Page;
