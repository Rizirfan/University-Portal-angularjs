import { Injectable } from '@angular/core';
import { StudentResult, SemesterMarks, Subject } from '../models/marks.model';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class MarksService {
  private readonly STORAGE_KEY = 'university_student_results';

  getResult(
    rrn: string,
    name: string,
    dob: string,
    degreeType: 'B.Sc' | 'B.Tech',
    department: string,
    allCourses: Course[] = []
  ): StudentResult {
    const totalSemesters = degreeType === 'B.Sc' ? 6 : 8;
    
    // Find matching course from courses list
    const matchedCourse = allCourses.find(c =>
      c.name.toLowerCase().includes(department.toLowerCase()) ||
      department.toLowerCase().includes(c.name.toLowerCase()) ||
      c.department.toLowerCase().includes(department.toLowerCase())
    );

    const semesters = this.generateSemesters(degreeType, department, totalSemesters, matchedCourse);

    const overallCgpa = +(semesters.reduce((sum, s) => sum + s.sgpa, 0) / totalSemesters).toFixed(2);

    const result: StudentResult = {
      rrn: rrn.toUpperCase(),
      studentName: name,
      dob,
      degreeType,
      department,
      totalSemesters,
      overallCgpa,
      semesters
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(result));
    return result;
  }

  getSavedResult(): StudentResult | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearResultSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateSemesters(
    degreeType: 'B.Sc' | 'B.Tech',
    department: string,
    totalSemesters: number,
    matchedCourse?: Course
  ): SemesterMarks[] {
    const semList: SemesterMarks[] = [];

    // Prefix for course codes based on degree / department
    const codePrefix = department.toLowerCase().includes('bio') ? 'BIO' :
                       department.toLowerCase().includes('math') ? 'MAT' :
                       department.toLowerCase().includes('mech') ? 'MEC' :
                       department.toLowerCase().includes('electr') ? 'ECE' :
                       (degreeType === 'B.Sc' ? 'BSC' : 'CSE');

    let accumSgpa = 0;

    for (let semNum = 1; semNum <= totalSemesters; semNum++) {
      let subjectNames: string[] = [];

      // Extract exact course subject names from matchedCourse curriculum if available
      if (matchedCourse && matchedCourse.curriculum) {
        const semCurr = matchedCourse.curriculum.find(c => c.semester === semNum);
        if (semCurr && semCurr.subjects && semCurr.subjects.length > 0) {
          subjectNames = semCurr.subjects;
        }
      }

      // Fallback subject names if matched course curriculum is not present
      if (subjectNames.length === 0) {
        if (degreeType === 'B.Sc') {
          subjectNames = [
            `Core ${department} Subject I`,
            `Applied ${department} Theory`,
            `Mathematical & Analytical Methods`,
            `Practical Laboratory & Seminar`
          ];
        } else {
          subjectNames = [
            `Engineering ${department} Core I`,
            `Advanced ${department} Analysis`,
            `Design & Systems Laboratory`,
            `Elective & Professional Skills`
          ];
        }
      }

      const subjects: Subject[] = subjectNames.map((subTitle, idx) => {
        const code = `${codePrefix}${semNum}0${idx + 1}`;
        const credits = idx === 0 || idx === 1 ? 4 : (idx === subjectNames.length - 1 ? 2 : 3);
        const internal = Math.floor(32 + ((semNum + idx) % 8)); // max 40
        const external = Math.floor(48 + ((semNum * 3 + idx * 5) % 12)); // max 60
        const total = internal + external;

        let grade = 'O';
        if (total >= 90) grade = 'O';
        else if (total >= 80) grade = 'A+';
        else if (total >= 70) grade = 'A';
        else if (total >= 60) grade = 'B+';
        else if (total >= 50) grade = 'B';
        else grade = 'RA';

        return {
          code,
          name: subTitle,
          credits,
          internal,
          external,
          total,
          grade,
          status: total >= 50 ? 'PASS' : 'FAIL'
        };
      });

      const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
      const sgpa = +(8.2 + (semNum * 0.15) % 1.5).toFixed(2);
      accumSgpa += sgpa;
      const cgpa = +(accumSgpa / semNum).toFixed(2);

      semList.push({
        id: `SEM-${semNum}`,
        semester: semNum,
        academicYear: semNum <= 2 ? '2023-2024' : (semNum <= 4 ? '2024-2025' : (semNum <= 6 ? '2025-2026' : '2026-2027')),
        sgpa,
        cgpa,
        totalCredits,
        subjects
      });
    }

    return semList;
  }
}
