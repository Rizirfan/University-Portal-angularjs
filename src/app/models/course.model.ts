export interface SemesterCurriculum {
  semester: number;
  subjects: string[];
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  title?: string;
  type: 'UG' | 'PG';
  degreeType: 'B.Sc' | 'B.Tech' | 'M.Sc' | 'M.Tech' | 'MBA';
  totalSemesters: number;
  semester?: number;
  credits?: number;
  duration: string;
  department: string;
  eligibility: string;
  fees: number;
  seats: number;
  description: string;
  curriculum?: SemesterCurriculum[];
  syllabus?: string[];
}
