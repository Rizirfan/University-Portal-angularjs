import { Injectable } from '@angular/core';
import { TransportBooking } from '../models/transport-booking.model';

@Injectable({ providedIn: 'root' })
export class TransportService {
  private readonly STORAGE_KEY = 'transport_bookings';

  getBookings(): TransportBooking[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getActiveBookings(): TransportBooking[] {
    return this.getBookings().filter(b => b.status === 'Active');
  }

  createBooking(bookingData: Omit<TransportBooking, 'id' | 'status' | 'bookingDate' | 'validUntil'>): TransportBooking {
    const bookings = this.getBookings();
    const now = new Date();
    
    // Calculate validUntil date based on passDuration
    const validDate = new Date(now);
    if (bookingData.passDuration === '1 Month') {
      validDate.setMonth(validDate.getMonth() + 1);
    } else if (bookingData.passDuration === '3 Months') {
      validDate.setMonth(validDate.getMonth() + 3);
    } else if (bookingData.passDuration === '6 Months') {
      validDate.setMonth(validDate.getMonth() + 6);
    }

    const newBooking: TransportBooking = {
      ...bookingData,
      id: 'TP' + Date.now().toString(36).toUpperCase(),
      status: 'Active',
      bookingDate: now.toISOString().split('T')[0],
      validUntil: validDate.toISOString().split('T')[0]
    };

    bookings.unshift(newBooking);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    return newBooking;
  }

  cancelBooking(id: string): void {
    const bookings = this.getBookings().filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
  }

  getBookedSeatCount(busId: string): number {
    return this.getActiveBookings().filter(b => b.busId === busId).length;
  }
}
