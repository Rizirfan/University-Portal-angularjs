import { Component, OnInit, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { DataService } from '../../services/data.service';
import { FeeService } from '../../services/fee.service';
import { Fees, SemesterFee, FeeBreakdown, PaymentRecord } from '../../models/fees.model';

@Component({
  selector: 'app-fees',
  imports: [Hero, SectionTitle, DecimalPipe, FormsModule],
  templateUrl: './fees.html',
  styleUrl: './fees.css'
})
export class FeesPage implements OnInit {
  fees = signal<Fees | null>(null);
  selectedSemesterNum = signal<number>(1);

  // Student Profile Form Controls
  profileName = 'Alex Johnson';
  profileRrn = '2024CS101';
  selectedDegreeType: 'B.Sc' | 'B.Tech' = 'B.Tech';
  selectedDepartment = 'B.Tech Computer Science';

  bscDepartments = [
    'B.Sc Computer Science',
    'B.Sc Information Technology',
    'B.Sc Mathematics',
    'B.Sc Physics',
    'B.Sc Biotechnology'
  ];

  btechDepartments = [
    'B.Tech Computer Science',
    'B.Tech Information Technology',
    'B.Tech Electronics & Communication',
    'B.Tech Mechanical Engineering',
    'B.Tech Artificial Intelligence & Data Science'
  ];

  // Modal controls
  showPaymentModal = signal(false);
  showSuccessModal = signal(false);
  selectedItem = signal<{ semNum: number; item: FeeBreakdown } | null>(null);
  lastReceipt = signal<PaymentRecord | null>(null);

  // Form
  paymentMethod = 'UPI / GPay';
  customPayAmount = 0;

  constructor(
    private data: DataService,
    private feeService: FeeService
  ) {}

  ngOnInit() {
    this.data.getFees().subscribe(f => {
      this.feeService.initializeFees(f);
    });

    this.feeService.fees$.subscribe(f => {
      if (f) {
        this.fees.set(f);
        this.profileName = f.studentName || 'Alex Johnson';
        this.profileRrn = f.rrn || '2024CS101';
        this.selectedDegreeType = f.degreeType || 'B.Tech';
        this.selectedDepartment = f.department || 'B.Tech Computer Science';
      }
    });
  }

  selectedSemester = computed(() => {
    const f = this.fees();
    if (!f || !f.semesters || f.semesters.length === 0) return null;
    return f.semesters.find(s => s.semester === this.selectedSemesterNum()) || f.semesters[0];
  });

  selectSemester(semNum: number) {
    this.selectedSemesterNum.set(semNum);
  }

  onDegreeChange() {
    if (this.selectedDegreeType === 'B.Sc') {
      this.selectedDepartment = this.bscDepartments[0];
    } else {
      this.selectedDepartment = this.btechDepartments[0];
    }
    this.saveProfile();
  }

  saveProfile() {
    this.feeService.updateStudentProfile(
      this.profileName.trim(),
      this.profileRrn.trim(),
      this.selectedDepartment,
      this.selectedDegreeType
    );
    this.selectedSemesterNum.set(1);
  }

  getPaidPercent(): number {
    const f = this.fees();
    if (!f || f.totalFees === 0) return 0;
    return Math.round((f.paidAmount / f.totalFees) * 100);
  }

  openPaymentModal(semNum: number, item: FeeBreakdown) {
    const pendingForItem = item.amount - item.paid;
    if (pendingForItem <= 0) return;

    this.selectedItem.set({ semNum, item });
    this.customPayAmount = pendingForItem;
    this.paymentMethod = 'UPI / GPay';
    this.showPaymentModal.set(true);
    this.showSuccessModal.set(false);
  }

  closePaymentModal() {
    this.showPaymentModal.set(false);
    this.showSuccessModal.set(false);
    this.selectedItem.set(null);
    this.lastReceipt.set(null);
  }

  submitPayment() {
    const sel = this.selectedItem();
    if (!sel || this.customPayAmount <= 0) return;

    const receipt = this.feeService.payFeeItem(
      sel.semNum,
      sel.item.id,
      this.customPayAmount,
      this.paymentMethod
    );

    if (receipt) {
      this.lastReceipt.set(receipt);
      this.showSuccessModal.set(true);
    }
  }

  downloadPaymentHistory() {
    const f = this.fees();
    if (!f || !f.paymentHistory || f.paymentHistory.length === 0) return;

    const headers = ['Receipt No', 'Semester', 'Fee Item', 'Date', 'Amount (INR)', 'Payment Method', 'Status'];
    const rows = f.paymentHistory.map(p => [
      p.receipt,
      `"${p.semester || 'Academic Fee'}"`,
      `"${p.item || 'Tuition Fee'}"`,
      p.date,
      p.amount,
      `"${p.method}"`,
      p.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.triggerDownload(csvContent, `Fee_Payment_History_${f.rrn || f.studentId}.csv`);
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
