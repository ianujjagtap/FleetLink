import connectDB from "@/config/db";
import { Vehicle, type IVehicle, Booking } from "@/models";
import { NextResponse } from "next/server";

connectDB();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const capacity = searchParams.get("capacity");
    const fromPincode = searchParams.get("fromPincode");
    const toPincode = searchParams.get("toPincode");
    const startTime = searchParams.get("startTime");

    console.log("Hey", capacity, fromPincode, toPincode, startTime);

    const startDate = new Date(startTime as string);
    const capacityNum = Number.parseInt(capacity as string, 10);

    // parameter validation
    if (!capacity || !fromPincode || !toPincode || !startTime) {
      return NextResponse.json(
        {
          success: false,
          message: "missing required parameters",
        },
        { status: 400 }
      );
    }

    // validating capicity of vehicle
    if (Number.isNaN(capacityNum) || capacityNum <= 0) {
      return NextResponse.json(
        { success: false, message: "invalid capacity" },
        { status: 400 }
      );
    }

    if (Number.isNaN(startDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "invalid start time" },
        { status: 400 }
      );
    }

    // calculating end time based on ride duration
    const rideDurationHours =
      Math.abs(
        Number.parseInt(toPincode as string) -
          Number.parseInt(fromPincode as string)
      ) % 24; // placeholder formula
    const endTime = new Date(startDate.getTime() + rideDurationHours * 3600000);

    // finding vehicles with the specified capaty
    const vehicles: IVehicle[] = await Vehicle.find({
      capacityKg: { $gte: capacityNum },
    });

    // overlapping booking condition
    const availableVehicles = await Promise.all(
      vehicles.map(async (vehicle) => {
        const conflictingBookings = await Booking.find({
          vehicleId: vehicle._id,
          $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startDate } }],
        });
        if (conflictingBookings.length === 0) {
          return {
            _id: vehicle._id,
            name: vehicle.name,
            capacityKg: vehicle.capacityKg,
            tyres: vehicle.tyres,
          };
        }
        return null;
      })
    );

    const filteredVehicles = availableVehicles.filter(
      (vehicle) => vehicle !== null
    ) as IVehicle[];

    return NextResponse.json(
      { success: true, data: filteredVehicles },
      { status: 200 }
    );
  } catch (error) {
    console.error("error fetching available vehicles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "failed to fetch available vehicles",
      },
      { status: 500 }
    );
  }
}
