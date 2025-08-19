export interface Booking {
  capacity: number;
  fromPincode: number;
  toPincode: number;
  startTime: string;
}

export interface BookingAPIResponse {
  success: string;
  data: Booking[];
}

export interface BookingVehicle {
  vehicleId: number;
  fromPincode: number;
  toPincode: number;
  startTime: number;
  customerId: number;
}
