import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { StudentProfile } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly STORAGE_KEY = 'active_student_profile';
  private studentSubject = new BehaviorSubject<StudentProfile | null>(null);
  student$ = this.studentSubject.asObservable();

  sampleStudents: StudentProfile[] = [
    {
      id: 'STU-2024CS101',
      name: 'Alex Johnson',
      rrn: '2024CS101',
      dob: '2003-08-15',
      email: 'alex.johnson@student.edu',
      phone: '+91 98765 43210',
      degreeType: 'B.Sc',
      department: 'B.Sc Computer Science',
      semester: 3,
      totalSemesters: 6,
      address: '742 Evergreen Terrace, Campus Colony',
      emergencyContact: '+91 98765 00000',
      bloodGroup: 'O+',
      academicStatus: 'Active / Regular'
    },
    {
      id: 'STU-2024BIO101',
      name: 'Priya Sharma',
      rrn: '2024BIO101',
      dob: '2003-05-20',
      email: 'priya.sharma@student.edu',
      phone: '+91 98765 43211',
      degreeType: 'B.Sc',
      department: 'B.Sc Biotechnology',
      semester: 4,
      totalSemesters: 6,
      address: '12 Rosewood Apartments, University North',
      emergencyContact: '+91 98765 11111',
      bloodGroup: 'A+',
      academicStatus: 'Active / Regular'
    },
    {
      id: 'STU-2024MAT101',
      name: 'Rahul Verma',
      rrn: '2024MAT101',
      dob: '2004-01-10',
      email: 'rahul.verma@student.edu',
      phone: '+91 98765 43212',
      degreeType: 'B.Sc',
      department: 'B.Sc Mathematics',
      semester: 2,
      totalSemesters: 6,
      address: '45 Lakeview Avenue, West Campus',
      emergencyContact: '+91 98765 22222',
      bloodGroup: 'B+',
      academicStatus: 'Active / Regular'
    },
    {
      id: 'STU-2024CSE101',
      name: 'Arun Kumar',
      rrn: '2024CSE101',
      dob: '2002-11-25',
      email: 'arun.kumar@student.edu',
      phone: '+91 98765 43213',
      degreeType: 'B.Tech',
      department: 'B.Tech Computer Science & Engineering',
      semester: 3,
      totalSemesters: 8,
      address: 'Block B, Room 204, Campus Hostel',
      emergencyContact: '+91 98765 33333',
      bloodGroup: 'O+',
      academicStatus: 'Active / Regular'
    },
    {
      id: 'STU-2024ECE101',
      name: 'Ananya Das',
      rrn: '2024ECE101',
      dob: '2002-04-14',
      email: 'ananya.das@student.edu',
      phone: '+91 98765 43214',
      degreeType: 'B.Tech',
      department: 'B.Tech Electronics & Communication Engineering',
      semester: 5,
      totalSemesters: 8,
      address: 'Girls Hostel Block A, Room 108',
      emergencyContact: '+91 98765 44444',
      bloodGroup: 'AB+',
      academicStatus: 'Active / Regular'
    },
    {
      id: 'STU-2024MEC101',
      name: 'Vikram Singh',
      rrn: '2024MEC101',
      dob: '2003-09-05',
      email: 'vikram.singh@student.edu',
      phone: '+91 98765 43215',
      degreeType: 'B.Tech',
      department: 'B.Tech Mechanical Engineering',
      semester: 4,
      totalSemesters: 8,
      address: 'Boys Hostel Block C, Room 312',
      emergencyContact: '+91 98765 55555',
      bloodGroup: 'A-',
      academicStatus: 'Active / Regular'
    }
  ];

  constructor(private http: HttpClient) {
    this.loadProfile();
    this.fetchJsonStudents();
  }

  fetchJsonStudents(): void {
    this.http.get<any[]>('assets/data/students.json').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const mapped: StudentProfile[] = data.map(d => ({
            id: d.id || `STU-${d.rrn || d.registerNumber}`,
            name: d.name,
            rrn: d.rrn || d.registerNumber,
            dob: d.dob || '2003-08-15',
            email: d.email,
            phone: d.phone,
            degreeType: d.degreeType || (d.course.includes('B.Sc') ? 'B.Sc' : 'B.Tech'),
            department: d.department || d.course,
            semester: d.semester || 1,
            totalSemesters: d.totalSemesters || (d.degreeType === 'B.Sc' ? 6 : 8),
            address: d.address || 'University Campus',
            emergencyContact: d.emergencyContact || d.phone,
            bloodGroup: d.bloodGroup || 'O+',
            academicStatus: d.academicStatus || 'Active'
          }));
          this.sampleStudents = mapped;
        }
      },
      error: () => {}
    });
  }

  loadProfile(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.studentSubject.next(JSON.parse(stored));
    } else {
      // Default initial profile
      this.saveProfile(this.sampleStudents[0]);
    }
  }

  getProfile(): StudentProfile | null {
    return this.studentSubject.value;
  }

  findStudentByRrn(rrn: string): StudentProfile | undefined {
    const search = rrn.trim().toUpperCase();
    return this.sampleStudents.find(s => s.rrn.toUpperCase() === search);
  }

  loginWithRrn(rrn: string): StudentProfile | null {
    const found = this.findStudentByRrn(rrn);
    if (found) {
      this.saveProfile(found);
      return found;
    }
    return null;
  }

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    this.studentSubject.next(profile);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.studentSubject.next(null);
  }
}
