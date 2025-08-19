import { Booking, resetMocks } from "@/tests/__mocks__/models";
import * as bookingsRoute from "@/app/api/booking/route";

describe("Bookings API", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("POST /api/bookings", () => {
    it("should create a booking successfully", async () => {
      const mockBooking = { _id: "1", vehicleId: "123" };
      Booking.create.mockResolvedValue(mockBooking);

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        body: JSON.stringify({ vehicleId: "123" }),
      });
      const response = await bookingsRoute.POST(req);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should handle booking conflict", async () => {
      Booking.find.mockResolvedValue([
        {
          vehicleId: "123",
          startTime: new Date("2025-08-20T09:00:00Z"),
          endTime: new Date("2025-08-20T11:00:00Z"),
        },
      ]);

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: "123",
          fromPincode: "110001",
          toPincode: "560001",
          startTime: "2025-08-20T10:00:00Z",
          customerId: "dummy",
        }),
      });
      const response = await bookingsRoute.POST(req);

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe("Booking conflict");
    });

    it("should handle invalid input", async () => {
      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        body: JSON.stringify({ vehicleId: "" }),
      });
      const response = await bookingsRoute.POST(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("Missing or invalid parameters");
    });

    it("should handle errors", async () => {
      Booking.create.mockRejectedValue(new Error("Database error"));

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: "123",
          fromPincode: "110001",
          toPincode: "560001",
          startTime: "2025-08-20T10:00:00Z",
          customerId: "dummy",
        }),
      });
      const response = await bookingsRoute.POST(req);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Failed to create booking");
    });
  });
});
