export interface Vehicle {
  _id: string | number;
  name: string;
  capacityKg: number;
  tyres: number;
  _v?: number;
}

export interface VehicleAPI {
  success: boolean;
  data: Vehicle[];
}
