import connectDB from "@/config/db";
import { type IVehicle, Vehicle } from "@/models/index";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
  try {
    const vehicles: IVehicle[] = await Vehicle.find();
    return NextResponse.json(
      { success: true, data: vehicles },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, capacityKg, tyres } = data;

    if (!name || typeof capacityKg !== "number" || typeof tyres !== "number") {
      return NextResponse.json(
        { error: "Invalid input types" },
        {
          status: 400,
        }
      );
    }

    try {
      const query = await Vehicle.create({
        name,
        capacityKg,
        tyres,
      });
      if (!query) {
        return NextResponse.json(
          { error: "Failed to create vehicle" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: "Vehicle created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to create vehicle ${error}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
