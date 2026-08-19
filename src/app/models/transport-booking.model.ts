export interface TransportBooking {
  id: string;
  busId: string;
  busNumber: string;
  route: string;
  pickupPoint: string;
  timing: string;
  passDuration: '1 Month' | '3 Months' | '6 Months';
  totalFare: number;
  studentName: string;
  registerNumber: string;
  email: string;
  phone: string;
  bookingDate: string;
  validUntil: string;
  status: 'Active' | 'Cancelled';
}
