export interface Transport {
  id: string;
  busNumber: string;
  route: string;
  pickupPoints: string[];
  timings: string[];
  returnTimings: string[];
  totalSeats: number;
  availableSeats: number;
  farePerMonth: number;
}
