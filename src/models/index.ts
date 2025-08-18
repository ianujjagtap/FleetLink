import mongoose, { type Document, Schema, type Model } from "mongoose";

interface IVehicle extends Document {
  name: string;
  capacityKg: number;
  tyres: number;
}

interface IBooking extends Document {
  vehicleId: mongoose.Types.ObjectId;
  fromPincode: string;
  toPincode: string;
  startTime: Date;
  endTime: Date;
  customerId: string;
}

const vehicleSchema: Schema<IVehicle> = new Schema(
  {
    name: { type: String, required: true },
    capacityKg: { type: Number, required: true },
    tyres: { type: Number, required: true },
  },
  {
    collection: "vehicles",
  }
);

const bookingSchema: Schema<IBooking> = new Schema(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "vehicles", required: true },
    fromPincode: { type: String, required: true },
    toPincode: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    customerId: { type: String, required: true },
  },
  {
    collection: "bookings",
  }
);

const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>(
  "vehicles",
  vehicleSchema
);
const Booking: Model<IBooking> = mongoose.model<IBooking>(
  "bookings",
  bookingSchema
);

export { Vehicle, Booking, type IVehicle, type IBooking };
