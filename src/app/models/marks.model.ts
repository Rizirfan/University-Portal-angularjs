export interface Subject {
  code: string;
  name: string;
  credits: number;
  internal: number;
  external: number;
  total: number;
  grade: string;
  status: 'PASS' | 'FAIL';
}

export interface SemesterMarks {
  id: string;
  semester: number;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  subjects: Subject[];
}

export interface StudentResult {
  rrn: string;
  studentName: string;
  dob: string;
  degreeType: 'B.Sc' | 'B.Tech';
  department: string;
  totalSemesters: number;
  overallCgpa: number;
  semesters: SemesterMarks[];
}
