import connectDB from "@/config/db";
import { Vehicle, Booking } from "@/models";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
  try {
    const bookings = await Booking.find();

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch bookings: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = data;

    // validating input
    if (
      !mongoose.Types.ObjectId.isValid(vehicleId) ||
      !fromPincode ||
      !toPincode ||
      !startTime ||
      !customerId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid parameters" },
        { status: 400 }
      );
    }
    const startDate = new Date(startTime);
    if (Number.isNaN(startDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid start time" },
        { status: 400 }
      );
    }

    // calculating ride duration
    const rideDurationHours =
      Math.abs(Number.parseInt(toPincode) - Number.parseInt(fromPincode)) % 24;
    const endTime = new Date(startDate.getTime() + rideDurationHours * 3600000);

    // verifying vehicle existance
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    // overlapping booking check
    const conflictingBookings = await Booking.find({
      vehicleId,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startDate } }],
    });
    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { success: false, message: "Booking overlapping with another" },
        { status: 409 }
      );
    }

    // creating booking
    await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: startDate,
      endTime,
      customerId,
    });
    return NextResponse.json(
      { success: true, message: "Booking created successfully " },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Failed to create booking ${error}` },
      { status: 500 }
    );
  }
}
