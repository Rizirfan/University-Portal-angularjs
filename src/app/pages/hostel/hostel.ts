import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { DataService } from '../../services/data.service';
import { HostelService } from '../../services/hostel.service';
import { Hostel, RoomType } from '../../models/hostel.model';
import { HostelBooking } from '../../models/booking.model';

@Component({
  selector: 'app-hostel',
  imports: [Hero, SectionTitle, DecimalPipe, FormsModule],
  templateUrl: './hostel.html',
  styleUrl: './hostel.css'
})
export class HostelPage implements OnInit {
  hostels = signal<Hostel[]>([]);
  bookings = signal<HostelBooking[]>([]);
  activeTab = signal<'browse' | 'bookings'>('browse');

  showModal = signal(false);
  showSuccess = signal(false);
  lastBookingId = signal('');
  selectedHostel = signal<Hostel | null>(null);
  selectedRoom = signal<RoomType | null>(null);

  formName = '';
  formRegNo = '';
  formEmail = '';
  formPhone = '';

  constructor(
    private data: DataService,
    private hostelService: HostelService
  ) {}

  ngOnInit() {
    this.data.getHostels().subscribe(h => this.hostels.set(h));
    this.loadBookings();
  }

  loadBookings() {
    this.bookings.set(this.hostelService.getBookings());
  }

  setTab(tab: 'browse' | 'bookings') {
    this.activeTab.set(tab);
  }

  getOccupancyPercent(hostel: Hostel): number {
    return Math.round(((hostel.totalRooms - hostel.availableRooms) / hostel.totalRooms) * 100);
  }

  getAvailabilityClass(available: number): string {
    if (available === 0) return 'text-red-600 bg-red-50';
    if (available <= 3) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  }

  getOccupancyBarClass(hostel: Hostel): string {
    const pct = this.getOccupancyPercent(hostel);
    if (pct > 90) return 'bg-red-500';
    if (pct > 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  openBooking(hostel: Hostel, room: RoomType) {
    this.selectedHostel.set(hostel);
    this.selectedRoom.set(room);
    this.formName = '';
    this.formRegNo = '';
    this.formEmail = '';
    this.formPhone = '';
    this.showModal.set(true);
    this.showSuccess.set(false);
  }

  closeModal() {
    this.showModal.set(false);
    this.showSuccess.set(false);
    this.selectedHostel.set(null);
    this.selectedRoom.set(null);
  }

  submitBooking() {
    const hostel = this.selectedHostel();
    const room = this.selectedRoom();
    if (!hostel || !room) return;
    if (!this.formName.trim() || !this.formRegNo.trim() || !this.formEmail.trim() || !this.formPhone.trim()) return;

    const booking = this.hostelService.createBooking({
      hostelId: hostel.id,
      hostelName: hostel.name,
      roomType: room.sharing,
      studentName: this.formName.trim(),
      registerNumber: this.formRegNo.trim(),
      email: this.formEmail.trim(),
      phone: this.formPhone.trim(),
    });

    this.lastBookingId.set(booking.id);
    this.showSuccess.set(true);
    this.loadBookings();
  }

  cancelBooking(id: string) {
    this.hostelService.cancelBooking(id);
    this.loadBookings();
  }

  isFormValid(): boolean {
    return this.formName.trim().length > 0
      && this.formRegNo.trim().length > 0
      && this.formEmail.trim().length > 0
      && this.formPhone.trim().length > 0;
  }
}
