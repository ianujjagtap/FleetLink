"use client";
import Layout from "@/app/page";
import VehicleInputForm from "@/components/ui/dashboard/vehicle-management/input-form";
import { Card, CardContent } from "@/primitives/card";
import { Label } from "@/primitives/label";

const Page = () => {
  return (
    <div className="max-h-screen">
      <Layout>
        <div className="m-4 space-y-4">
          <Label className="text-2xl">Vehicle Management</Label>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="w-full lg:w-1/3">
              <Card className="w-full bg-secondary/10 p-4">
                <CardContent>
                  <VehicleInputForm />
                </CardContent>
              </Card>
            </div>
            <div className="w-full lg:w-2/3"></div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Page;
