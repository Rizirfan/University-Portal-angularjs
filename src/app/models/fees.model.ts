export interface FeeBreakdown {
  id: string;
  item: string;
  amount: number;
  paid: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
}

export interface SemesterFee {
  semester: number;
  title: string;
  academicYear: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  breakdown: FeeBreakdown[];
}

export interface PaymentRecord {
  receipt: string;
  semester?: string;
  item?: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

export interface Fees {
  studentId: string;
  studentName?: string;
  rrn?: string;
  department?: string;
  degreeType?: 'B.Sc' | 'B.Tech';
  totalSemesters?: number;
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  semesters: SemesterFee[];
  paymentHistory: PaymentRecord[];
}
