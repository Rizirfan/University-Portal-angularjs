export interface StudentProfile {
  id: string;
  name: string;
  rrn: string;
  dob: string;
  email: string;
  phone: string;
  degreeType: 'B.Sc' | 'B.Tech';
  department: string;
  semester: number;
  totalSemesters: number;
  address?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  academicStatus?: string;
}

export interface Student extends StudentProfile {
  registerNumber: string;
  course: string;
  batch: string;
  avatar: string;
}
