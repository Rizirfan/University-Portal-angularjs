import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Fees, SemesterFee, PaymentRecord, FeeBreakdown } from '../models/fees.model';

@Injectable({ providedIn: 'root' })
export class FeeService {
  private readonly STORAGE_KEY = 'university_fees_data';
  private feesSubject = new BehaviorSubject<Fees | null>(null);
  fees$ = this.feesSubject.asObservable();

  initializeFees(initialData: Fees): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.feesSubject.next(JSON.parse(stored));
    } else {
      const defaultFees: Fees = {
        studentId: initialData.studentId || 'STU001',
        studentName: initialData.studentName || 'Alex Johnson',
        rrn: initialData.rrn || '2024CS101',
        department: initialData.department || 'B.Tech Computer Science',
        degreeType: initialData.degreeType || 'B.Tech',
        totalSemesters: 8,
        totalFees: 720000,
        paidAmount: 240000,
        pendingAmount: 480000,
        semesters: this.generateSemestersForDegree('B.Tech'),
        paymentHistory: initialData.paymentHistory || []
      };
      this.saveFees(defaultFees);
    }
  }

  getFeesData(): Fees | null {
    return this.feesSubject.value;
  }

  saveFees(data: Fees): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.feesSubject.next(data);
  }

  updateStudentProfile(name: string, rrn: string, department: string, degreeType: 'B.Sc' | 'B.Tech'): void {
    const current = this.getFeesData();
    if (!current) return;

    const degreeChanged = current.degreeType !== degreeType;

    current.studentName = name;
    current.rrn = rrn;
    current.department = department;
    current.degreeType = degreeType;
    current.totalSemesters = degreeType === 'B.Sc' ? 6 : 8;

    if (degreeChanged || !current.semesters || current.semesters.length === 0) {
      current.semesters = this.generateSemestersForDegree(degreeType);
      current.totalFees = current.semesters.reduce((sum, s) => sum + s.totalAmount, 0);
      current.paidAmount = current.semesters.reduce((sum, s) => sum + s.paidAmount, 0);
      current.pendingAmount = Math.max(0, current.totalFees - current.paidAmount);
    }

    this.saveFees(current);
  }

  generateSemestersForDegree(degreeType: 'B.Sc' | 'B.Tech'): SemesterFee[] {
    const totalSems = degreeType === 'B.Sc' ? 6 : 8;
    const semList: SemesterFee[] = [];

    const tuition = degreeType === 'B.Sc' ? 45000 : 60000;
    const hostel = degreeType === 'B.Sc' ? 15000 : 20000;
    const lab = degreeType === 'B.Sc' ? 5000 : 7500;
    const exam = 2500;
    const semTotal = tuition + hostel + lab + exam;

    for (let i = 1; i <= totalSems; i++) {
      let isPaid = i <= 2;
      let isPartial = i === 3;
      let paidTuition = isPaid ? tuition : (isPartial ? Math.round(tuition * 0.8) : 0);
      let paidHostel = isPaid ? hostel : 0;
      let paidLab = isPaid ? lab : 0;
      let paidExam = isPaid ? exam : 0;

      const breakdown: FeeBreakdown[] = [
        {
          id: `S${i}-F1`,
          item: 'Tuition Fee',
          amount: tuition,
          paid: paidTuition,
          status: paidTuition >= tuition ? 'Paid' : (paidTuition > 0 ? 'Partial' : 'Unpaid')
        },
        {
          id: `S${i}-F2`,
          item: 'Hostel & Dining Fee',
          amount: hostel,
          paid: paidHostel,
          status: paidHostel >= hostel ? 'Paid' : (paidHostel > 0 ? 'Partial' : 'Unpaid')
        },
        {
          id: `S${i}-F3`,
          item: 'Lab & Computer Fee',
          amount: lab,
          paid: paidLab,
          status: paidLab >= lab ? 'Paid' : (paidLab > 0 ? 'Partial' : 'Unpaid')
        },
        {
          id: `S${i}-F4`,
          item: 'Examination & Library Fee',
          amount: exam,
          paid: paidExam,
          status: paidExam >= exam ? 'Paid' : (paidExam > 0 ? 'Partial' : 'Unpaid')
        }
      ];

      const semPaid = breakdown.reduce((sum, b) => sum + b.paid, 0);
      const semPending = semTotal - semPaid;

      semList.push({
        semester: i,
        title: `Semester ${i}`,
        academicYear: i <= 2 ? '2023-2024' : (i <= 4 ? '2024-2025' : '2025-2026'),
        dueDate: `202${Math.floor((i + 1) / 2)}-0${((i % 2) * 6) + 1}-30`,
        totalAmount: semTotal,
        paidAmount: semPaid,
        pendingAmount: semPending,
        status: semPaid >= semTotal ? 'Paid' : (semPaid > 0 ? 'Partial' : 'Unpaid'),
        breakdown
      });
    }

    return semList;
  }

  payFeeItem(
    semesterNumber: number,
    itemId: string,
    payAmount: number,
    paymentMethod: string
  ): PaymentRecord | null {
    const currentFees = this.getFeesData();
    if (!currentFees) return null;

    const semIndex = currentFees.semesters.findIndex(s => s.semester === semesterNumber);
    if (semIndex === -1) return null;

    const sem = currentFees.semesters[semIndex];
    const itemIndex = sem.breakdown.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return null;

    const item = sem.breakdown[itemIndex];
    const remainingForItem = item.amount - item.paid;
    const actualPay = Math.min(payAmount, remainingForItem);

    if (actualPay <= 0) return null;

    item.paid += actualPay;
    if (item.paid >= item.amount) {
      item.status = 'Paid';
    } else {
      item.status = 'Partial';
    }

    sem.paidAmount = sem.breakdown.reduce((sum, i) => sum + i.paid, 0);
    sem.pendingAmount = Math.max(0, sem.totalAmount - sem.paidAmount);
    if (sem.paidAmount >= sem.totalAmount) {
      sem.status = 'Paid';
    } else if (sem.paidAmount > 0) {
      sem.status = 'Partial';
    } else {
      sem.status = 'Unpaid';
    }

    currentFees.paidAmount = currentFees.semesters.reduce((sum, s) => sum + s.paidAmount, 0);
    currentFees.pendingAmount = Math.max(0, currentFees.totalFees - currentFees.paidAmount);

    const receipt: PaymentRecord = {
      receipt: 'RCP' + Math.floor(100000 + Math.random() * 900000),
      semester: sem.title,
      item: item.item,
      date: new Date().toISOString().split('T')[0],
      amount: actualPay,
      method: paymentMethod,
      status: 'Paid'
    };

    currentFees.paymentHistory.unshift(receipt);
    this.saveFees(currentFees);

    return receipt;
  }
}
