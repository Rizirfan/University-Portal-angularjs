export interface HostelBooking {
  id: string;
  hostelId: string;
  hostelName: string;
  roomType: string;
  studentName: string;
  registerNumber: string;
  email: string;
  phone: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  bookingDate: string;
}
