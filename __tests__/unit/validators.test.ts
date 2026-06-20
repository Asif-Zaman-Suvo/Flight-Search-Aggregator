import { describe, it, expect } from "vitest";
import { searchSchema, bookingSchema } from "@/lib/utils/validators";

describe("searchSchema", () => {
  const validData = {
    origin: "JFK",
    destination: "LAX",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // tomorrow
    passengers: 1,
  };

  it("accepts valid search params", () => {
    const result = searchSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("transforms origin/destination to uppercase", () => {
    const result = searchSchema.safeParse({
      ...validData,
      origin: "jfk",
      destination: "lax",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.origin).toBe("JFK");
      expect(result.data.destination).toBe("LAX");
    }
  });

  it("rejects same origin and destination", () => {
    const result = searchSchema.safeParse({
      ...validData,
      destination: "JFK",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) =>
          i.message.includes("cannot be the same")
        )
      ).toBe(true);
    }
  });

  it("rejects past dates", () => {
    const result = searchSchema.safeParse({
      ...validData,
      date: "2020-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 9 passengers", () => {
    const result = searchSchema.safeParse({ ...validData, passengers: 10 });
    expect(result.success).toBe(false);
  });

  it("rejects 0 passengers", () => {
    const result = searchSchema.safeParse({ ...validData, passengers: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects missing origin", () => {
    const result = searchSchema.safeParse({ ...validData, origin: "" });
    expect(result.success).toBe(false);
  });
});

describe("bookingSchema", () => {
  const validPassenger = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    passportNumber: "A12345678",
    nationality: "American",
  };

  const validData = {
    passengers: [validPassenger],
    contact: {
      email: "john@example.com",
      phone: "+1 555-000-0000",
    },
  };

  it("accepts valid booking data", () => {
    const result = bookingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = bookingSchema.safeParse({
      ...validData,
      contact: { ...validData.contact, email: "not-an-email" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty first name", () => {
    const result = bookingSchema.safeParse({
      ...validData,
      passengers: [{ ...validPassenger, firstName: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects future date of birth", () => {
    const result = bookingSchema.safeParse({
      ...validData,
      passengers: [{ ...validPassenger, dateOfBirth: "2099-01-01" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects short passport number", () => {
    const result = bookingSchema.safeParse({
      ...validData,
      passengers: [{ ...validPassenger, passportNumber: "A12" }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts multiple passengers", () => {
    const result = bookingSchema.safeParse({
      ...validData,
      passengers: [validPassenger, { ...validPassenger, firstName: "Jane" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty passengers array", () => {
    const result = bookingSchema.safeParse({ ...validData, passengers: [] });
    expect(result.success).toBe(false);
  });

  it("accepts optional specialRequests", () => {
    const result = bookingSchema.safeParse({
      ...validData,
      specialRequests: "Vegan meal",
    });
    expect(result.success).toBe(true);
  });
});
