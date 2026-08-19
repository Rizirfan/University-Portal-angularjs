import { Injectable } from '@angular/core';
import { HostelBooking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class HostelService {
  private readonly STORAGE_KEY = 'hostel_bookings';

  getBookings(): HostelBooking[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getActiveBookings(): HostelBooking[] {
    return this.getBookings().filter(b => b.status !== 'Cancelled');
  }

  createBooking(booking: Omit<HostelBooking, 'id' | 'status' | 'bookingDate'>): HostelBooking {
    const bookings = this.getBookings();
    const newBooking: HostelBooking = {
      ...booking,
      id: 'BK' + Date.now().toString(36).toUpperCase(),
      status: 'Confirmed',
      bookingDate: new Date().toISOString().split('T')[0],
    };
    bookings.push(newBooking);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    return newBooking;
  }

  cancelBooking(id: string): void {
    const bookings = this.getBookings().filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
  }

  hasActiveBooking(hostelId: string): boolean {
    return this.getActiveBookings().some(b => b.hostelId === hostelId);
  }
}
