import { Vehicle, Booking, resetMocks } from "@/tests/__mocks__/models";
import * as vehiclesRoute from "@/app/api/vehicles/route";
import * as vehiclesAvailableRoute from "@/app/api/vehicles/available/route";

describe("Vehicles API", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("POST /api/vehicles", () => {
    it("should create a vehicle successfully", async () => {
      const mockVehicle = { _id: "123", name: "Truck A" };
      Vehicle.create.mockResolvedValue(mockVehicle);

      const req = new Request("http://localhost/api/vehicles", {
        method: "POST",
        body: JSON.stringify({ name: "Truck A" }),
      });
      const response = await vehiclesRoute.POST(req);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should handle invalid input", async () => {
      const req = new Request("http://localhost/api/vehicles", {
        method: "POST",
        body: JSON.stringify({ name: "" }), // Invalid input
      });
      const response = await vehiclesRoute.POST(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("Missing or invalid parameters");
    });

    it("should handle errors", async () => {
      Vehicle.create = jest.fn().mockRejectedValue(new Error("Database error"));

      const req = new Request("http://localhost/api/vehicles", {
        method: "POST",
        body: JSON.stringify({ name: "Truck A", capacityKg: 1000, tyres: 6 }),
      });
      const response = await vehiclesRoute.POST(req);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Failed to create vehicle");
    });
  });

  describe("GET /api/vehicles/available", () => {
    it("should return available vehicles with no overlaps", async () => {
      const mockVehicles = [
        { _id: "123", name: "Truck A", capacityKg: 1000, tyres: 6 },
      ];
      Vehicle.find = jest.fn().mockResolvedValue(mockVehicles);
      Booking.find = jest.fn().mockResolvedValue([]); // No conflicting bookings

      const req = new Request(
        "http://localhost/api/vehicles/available?capacity=500&fromPincode=110001&toPincode=560001&startTime=2025-08-20T10:00:00Z",
        {
          method: "GET",
        }
      );
      const response = await vehiclesAvailableRoute.GET(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.vehicles).toEqual(mockVehicles);
    });

    it("should exclude vehicles with booking overlaps", async () => {
      const mockVehicle = {
        _id: "123",
        name: "Truck A",
        capacityKg: 1000,
        tyres: 6,
      };
      Vehicle.find = jest.fn().mockResolvedValue([mockVehicle]);
      Booking.find.mockResolvedValue([
        {
          vehicleId: "123",
          startTime: new Date("2025-08-20T09:00:00Z"),
          endTime: new Date("2025-08-20T11:00:00Z"),
        },
      ]); // Overlap with 10:00-12:00

      const req = new Request(
        "http://localhost/api/vehicles/available?capacity=500&fromPincode=110001&toPincode=560001&startTime=2025-08-20T10:00:00Z",
        {
          method: "GET",
        }
      );
      const response = await vehiclesAvailableRoute.GET(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.vehicles).toHaveLength(0); // Vehicle excluded due to overlap
    });

    it("should handle errors", async () => {
      Vehicle.find.mockRejectedValue(new Error("Database error"));

      const req = new Request(
        "http://localhost/api/vehicles/available?capacity=500&fromPincode=110001&toPincode=560001&startTime=2025-08-20T10:00:00Z",
        {
          method: "GET",
        }
      );
      const response = await vehiclesAvailableRoute.GET(req);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Failed to fetch available vehicles");
    });
  });
});
