import { Component, OnInit, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { DataService } from '../../services/data.service';
import { TransportService } from '../../services/transport.service';
import { Transport } from '../../models/transport.model';
import { TransportBooking } from '../../models/transport-booking.model';

@Component({
  selector: 'app-transport',
  imports: [Hero, SectionTitle, DecimalPipe, FormsModule],
  templateUrl: './transport.html',
  styleUrl: './transport.css'
})
export class TransportPage implements OnInit {
  routes = signal<Transport[]>([]);
  filteredBuses = computed(() => this.routes());
  myBookings = signal<TransportBooking[]>([]);
  activeTab = signal<'browse' | 'passes'>('browse');

  showBookingModal = signal(false);
  showSuccessModal = signal(false);
  showQrModal = signal(false);
  selectedBus = signal<Transport | null>(null);
  lastBooking = signal<TransportBooking | null>(null);
  selectedPass = signal<TransportBooking | null>(null);

  // Form fields
  formName = '';
  formRegNo = '';
  formEmail = '';
  formPhone = '';
  selectedPickupPoint = '';
  selectedTiming = '';
  passDuration: '1 Month' | '3 Months' | '6 Months' = '1 Month';

  constructor(
    private data: DataService,
    private transportService: TransportService
  ) {}

  ngOnInit() {
    this.data.getTransport().subscribe(t => this.routes.set(t));
    this.loadBookings();
  }

  loadBookings() {
    this.myBookings.set(this.transportService.getBookings());
  }

  setTab(tab: 'browse' | 'passes') {
    this.activeTab.set(tab);
  }

  getAvailableSeats(bus: Transport): number {
    const booked = this.transportService.getBookedSeatCount(bus.id);
    return Math.max(0, bus.availableSeats - booked);
  }

  calculateFare(baseFare: number, duration: string): number {
    if (duration === '3 Months') {
      return Math.round(baseFare * 3 * 0.9); // 10% discount
    }
    if (duration === '6 Months') {
      return Math.round(baseFare * 6 * 0.8); // 20% discount
    }
    return baseFare;
  }

  openBookingModal(bus: Transport) {
    this.selectedBus.set(bus);
    this.selectedPickupPoint = bus.pickupPoints[0] || '';
    this.selectedTiming = bus.timings[0] || '';
    this.passDuration = '1 Month';
    this.formName = '';
    this.formRegNo = '';
    this.formEmail = '';
    this.formPhone = '';
    this.showBookingModal.set(true);
    this.showSuccessModal.set(false);
  }

  closeBookingModal() {
    this.showBookingModal.set(false);
    this.showSuccessModal.set(false);
    this.selectedBus.set(null);
    this.lastBooking.set(null);
  }

  openQrModal(pass: TransportBooking) {
    this.selectedPass.set(pass);
    this.showQrModal.set(true);
  }

  closeQrModal() {
    this.showQrModal.set(false);
    this.selectedPass.set(null);
  }

  isFormValid(): boolean {
    return this.formName.trim().length > 0 &&
           this.formRegNo.trim().length > 0 &&
           this.formEmail.trim().length > 0 &&
           this.formPhone.trim().length > 0 &&
           this.selectedPickupPoint.length > 0 &&
           this.selectedTiming.length > 0;
  }

  submitBooking() {
    const bus = this.selectedBus();
    if (!bus || !this.isFormValid()) return;

    const totalFare = this.calculateFare(bus.farePerMonth, this.passDuration);

    const booking = this.transportService.createBooking({
      busId: bus.id,
      busNumber: bus.busNumber,
      route: bus.route,
      pickupPoint: this.selectedPickupPoint,
      timing: this.selectedTiming,
      passDuration: this.passDuration,
      totalFare,
      studentName: this.formName.trim(),
      registerNumber: this.formRegNo.trim(),
      email: this.formEmail.trim(),
      phone: this.formPhone.trim(),
    });

    this.lastBooking.set(booking);
    this.showSuccessModal.set(true);
    this.loadBookings();
  }

  cancelBooking(id: string) {
    if (confirm('Are you sure you want to cancel this transport pass?')) {
      this.transportService.cancelBooking(id);
      this.loadBookings();
    }
  }

  downloadPassHistory() {
    const passes = this.myBookings();
    if (passes.length === 0) return;

    const headers = ['Pass ID', 'Student Name', 'Reg No', 'Bus No', 'Route', 'Pickup Point', 'Timing', 'Pass Duration', 'Valid Until', 'Total Fare (INR)', 'Status'];
    const rows = passes.map(p => [
      p.id,
      `"${p.studentName}"`,
      `"${p.registerNumber}"`,
      `"${p.busNumber}"`,
      `"${p.route}"`,
      `"${p.pickupPoint}"`,
      `"${p.timing}"`,
      `"${p.passDuration}"`,
      p.validUntil,
      p.totalFare,
      p.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.triggerDownload(csvContent, 'Transport_Passes_History.csv');
  }

  private triggerDownload(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
