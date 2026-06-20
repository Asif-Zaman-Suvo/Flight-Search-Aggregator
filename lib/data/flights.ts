import type { Flight } from "@/lib/types";

function makeTime(date: string, hours: number, minutes: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function makeFlight(
  id: string,
  date: string,
  opts: {
    airlineCode: string;
    airlineName: string;
    flightNumber: string;
    origin: { code: string; city: string; name: string; country: string };
    destination: { code: string; city: string; name: string; country: string };
    depHour: number;
    depMin: number;
    durationMinutes: number;
    stops: 0 | 1 | 2;
    price: number;
    cabinClass: Flight["cabinClass"];
    baggageIncluded: boolean;
  }
): Flight {
  const arrivalMs =
    new Date(makeTime(date, opts.depHour, opts.depMin)).getTime() +
    opts.durationMinutes * 60 * 1000;

  return {
    id,
    segments: [
      {
        departureAirport: opts.origin,
        arrivalAirport: opts.destination,
        departureTime: makeTime(date, opts.depHour, opts.depMin),
        arrivalTime: new Date(arrivalMs).toISOString(),
        durationMinutes: opts.durationMinutes,
        flightNumber: opts.flightNumber,
        airline: { code: opts.airlineCode, name: opts.airlineName },
      },
    ],
    stops: opts.stops,
    totalDurationMinutes: opts.durationMinutes,
    price: opts.price,
    cabinClass: opts.cabinClass,
    baggageIncluded: opts.baggageIncluded,
  };
}

const JFK = { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "US" };
const LAX = { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "US" };

export function generateFlights(date: string): Flight[] {
  return [
    makeFlight("FL001", date, { airlineCode: "AA", airlineName: "American Airlines", flightNumber: "AA 101", origin: JFK, destination: LAX, depHour: 6,  depMin: 0,  durationMinutes: 330, stops: 0, price: 189, cabinClass: "economy",          baggageIncluded: false }),
    makeFlight("FL002", date, { airlineCode: "AA", airlineName: "American Airlines", flightNumber: "AA 103", origin: JFK, destination: LAX, depHour: 8,  depMin: 30, durationMinutes: 345, stops: 0, price: 225, cabinClass: "economy",          baggageIncluded: true  }),
    makeFlight("FL003", date, { airlineCode: "AA", airlineName: "American Airlines", flightNumber: "AA 201", origin: JFK, destination: LAX, depHour: 7,  depMin: 15, durationMinutes: 320, stops: 0, price: 340, cabinClass: "business",         baggageIncluded: true  }),
    makeFlight("FL004", date, { airlineCode: "DL", airlineName: "Delta Air Lines",   flightNumber: "DL 405", origin: JFK, destination: LAX, depHour: 5,  depMin: 45, durationMinutes: 315, stops: 0, price: 199, cabinClass: "economy",          baggageIncluded: false }),
    makeFlight("FL005", date, { airlineCode: "DL", airlineName: "Delta Air Lines",   flightNumber: "DL 407", origin: JFK, destination: LAX, depHour: 10, depMin: 0,  durationMinutes: 330, stops: 0, price: 215, cabinClass: "economy",          baggageIncluded: true  }),
    makeFlight("FL006", date, { airlineCode: "DL", airlineName: "Delta Air Lines",   flightNumber: "DL 501", origin: JFK, destination: LAX, depHour: 9,  depMin: 30, durationMinutes: 325, stops: 0, price: 480, cabinClass: "business",         baggageIncluded: true  }),
    makeFlight("FL007", date, { airlineCode: "UA", airlineName: "United Airlines",   flightNumber: "UA 601", origin: JFK, destination: LAX, depHour: 7,  depMin: 0,  durationMinutes: 335, stops: 0, price: 209, cabinClass: "economy",          baggageIncluded: false }),
    makeFlight("FL008", date, { airlineCode: "UA", airlineName: "United Airlines",   flightNumber: "UA 603", origin: JFK, destination: LAX, depHour: 12, depMin: 30, durationMinutes: 340, stops: 0, price: 237, cabinClass: "economy",          baggageIncluded: true  }),
    makeFlight("FL009", date, { airlineCode: "UA", airlineName: "United Airlines",   flightNumber: "UA 701", origin: JFK, destination: LAX, depHour: 11, depMin: 0,  durationMinutes: 320, stops: 0, price: 560, cabinClass: "first",            baggageIncluded: true  }),
    makeFlight("FL010", date, { airlineCode: "B6", airlineName: "JetBlue Airways",   flightNumber: "B6 315", origin: JFK, destination: LAX, depHour: 6,  depMin: 30, durationMinutes: 325, stops: 0, price: 179, cabinClass: "economy",          baggageIncluded: false }),
    makeFlight("FL011", date, { airlineCode: "B6", airlineName: "JetBlue Airways",   flightNumber: "B6 317", origin: JFK, destination: LAX, depHour: 14, depMin: 0,  durationMinutes: 330, stops: 0, price: 195, cabinClass: "economy",          baggageIncluded: true  }),
    makeFlight("FL012", date, { airlineCode: "B6", airlineName: "JetBlue Airways",   flightNumber: "B6 401", origin: JFK, destination: LAX, depHour: 13, depMin: 15, durationMinutes: 320, stops: 0, price: 310, cabinClass: "premium_economy",  baggageIncluded: true  }),
    makeFlight("FL013", date, { airlineCode: "WN", airlineName: "Southwest Airlines", flightNumber: "WN 1540", origin: JFK, destination: LAX, depHour: 8, depMin: 0,  durationMinutes: 480, stops: 1, price: 149, cabinClass: "economy",          baggageIncluded: true  }),
    makeFlight("FL014", date, { airlineCode: "WN", airlineName: "Southwest Airlines", flightNumber: "WN 2241", origin: JFK, destination: LAX, depHour: 11, depMin: 30, durationMinutes: 510, stops: 1, price: 159, cabinClass: "economy",         baggageIncluded: true  }),
    makeFlight("FL015", date, { airlineCode: "WN", airlineName: "Southwest Airlines", flightNumber: "WN 3312", origin: JFK, destination: LAX, depHour: 16, depMin: 0,  durationMinutes: 465, stops: 1, price: 155, cabinClass: "economy",         baggageIncluded: true  }),
    makeFlight("FL016", date, { airlineCode: "F9", airlineName: "Frontier Airlines",  flightNumber: "F9 804",  origin: JFK, destination: LAX, depHour: 7,  depMin: 45, durationMinutes: 500, stops: 1, price: 129, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL017", date, { airlineCode: "F9", airlineName: "Frontier Airlines",  flightNumber: "F9 806",  origin: JFK, destination: LAX, depHour: 15, depMin: 30, durationMinutes: 520, stops: 1, price: 139, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL018", date, { airlineCode: "NK", airlineName: "Spirit Airlines",    flightNumber: "NK 415",  origin: JFK, destination: LAX, depHour: 9,  depMin: 0,  durationMinutes: 540, stops: 1, price: 109, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL019", date, { airlineCode: "NK", airlineName: "Spirit Airlines",    flightNumber: "NK 417",  origin: JFK, destination: LAX, depHour: 18, depMin: 0,  durationMinutes: 555, stops: 2, price: 99,  cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL020", date, { airlineCode: "AA", airlineName: "American Airlines",  flightNumber: "AA 503",  origin: JFK, destination: LAX, depHour: 15, depMin: 0,  durationMinutes: 460, stops: 1, price: 245, cabinClass: "economy",         baggageIncluded: true  }),
    makeFlight("FL021", date, { airlineCode: "DL", airlineName: "Delta Air Lines",    flightNumber: "DL 607",  origin: JFK, destination: LAX, depHour: 17, depMin: 30, durationMinutes: 335, stops: 0, price: 279, cabinClass: "economy",         baggageIncluded: true  }),
    makeFlight("FL022", date, { airlineCode: "DL", airlineName: "Delta Air Lines",    flightNumber: "DL 609",  origin: JFK, destination: LAX, depHour: 20, depMin: 0,  durationMinutes: 325, stops: 0, price: 259, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL023", date, { airlineCode: "UA", airlineName: "United Airlines",    flightNumber: "UA 805",  origin: JFK, destination: LAX, depHour: 18, depMin: 45, durationMinutes: 330, stops: 0, price: 248, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL024", date, { airlineCode: "AA", airlineName: "American Airlines",  flightNumber: "AA 107",  origin: JFK, destination: LAX, depHour: 21, depMin: 0,  durationMinutes: 340, stops: 0, price: 219, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL025", date, { airlineCode: "B6", airlineName: "JetBlue Airways",    flightNumber: "B6 501",  origin: JFK, destination: LAX, depHour: 19, depMin: 15, durationMinutes: 335, stops: 0, price: 205, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL026", date, { airlineCode: "AA", airlineName: "American Airlines",  flightNumber: "AA 305",  origin: JFK, destination: LAX, depHour: 16, depMin: 30, durationMinutes: 315, stops: 0, price: 398, cabinClass: "business",        baggageIncluded: true  }),
    makeFlight("FL027", date, { airlineCode: "DL", airlineName: "Delta Air Lines",    flightNumber: "DL 701",  origin: JFK, destination: LAX, depHour: 22, depMin: 0,  durationMinutes: 320, stops: 0, price: 232, cabinClass: "economy",         baggageIncluded: true  }),
    makeFlight("FL028", date, { airlineCode: "UA", airlineName: "United Airlines",    flightNumber: "UA 901",  origin: JFK, destination: LAX, depHour: 14, depMin: 30, durationMinutes: 475, stops: 1, price: 187, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL029", date, { airlineCode: "AA", airlineName: "American Airlines",  flightNumber: "AA 601",  origin: JFK, destination: LAX, depHour: 6,  depMin: 45, durationMinutes: 330, stops: 0, price: 420, cabinClass: "premium_economy", baggageIncluded: true  }),
    makeFlight("FL030", date, { airlineCode: "DL", airlineName: "Delta Air Lines",    flightNumber: "DL 801",  origin: JFK, destination: LAX, depHour: 7,  depMin: 30, durationMinutes: 620, stops: 2, price: 175, cabinClass: "economy",         baggageIncluded: true  }),
    makeFlight("FL031", date, { airlineCode: "UA", airlineName: "United Airlines",    flightNumber: "UA 405",  origin: JFK, destination: LAX, depHour: 5,  depMin: 30, durationMinutes: 325, stops: 0, price: 198, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL032", date, { airlineCode: "B6", airlineName: "JetBlue Airways",    flightNumber: "B6 601",  origin: JFK, destination: LAX, depHour: 22, depMin: 30, durationMinutes: 330, stops: 0, price: 188, cabinClass: "economy",         baggageIncluded: false }),
    makeFlight("FL033", date, { airlineCode: "WN", airlineName: "Southwest Airlines", flightNumber: "WN 4401", origin: JFK, destination: LAX, depHour: 20, depMin: 30, durationMinutes: 490, stops: 1, price: 162, cabinClass: "economy",         baggageIncluded: true  }),
    makeFlight("FL034", date, { airlineCode: "F9", airlineName: "Frontier Airlines",  flightNumber: "F9 1002", origin: JFK, destination: LAX, depHour: 23, depMin: 0,  durationMinutes: 510, stops: 1, price: 134, cabinClass: "economy",         baggageIncluded: false }),
  ];
}

// In-memory booking store (server-side singleton for mock API)
export const bookingsDb = new Map<string, import("@/lib/types").Booking>();
