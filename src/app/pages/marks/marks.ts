import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { DataService } from '../../services/data.service';
import { MarksService } from '../../services/marks.service';
import { StudentResult, SemesterMarks } from '../../models/marks.model';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-marks',
  imports: [Hero, SectionTitle, FormsModule],
  templateUrl: './marks.html',
  styleUrl: './marks.css'
})
export class Marks implements OnInit {
  studentResult = signal<StudentResult | null>(null);
  allCourses = signal<Course[]>([]);
  activeSemesterNum = signal<number>(1);

  // Form Fields
  formRrn = '2024CS101';
  formName = 'Alex Johnson';
  formDob = '2003-08-15';
  formDegreeType: 'B.Sc' | 'B.Tech' = 'B.Sc';
  formDepartment = 'B.Sc Computer Science';

  bscDepartments = [
    'B.Sc Computer Science',
    'B.Sc Biotechnology',
    'B.Sc Mathematics',
    'B.Sc Information Technology',
    'B.Sc Physics'
  ];

  btechDepartments = [
    'B.Tech Computer Science & Engineering',
    'B.Tech Electronics & Communication Engineering',
    'B.Tech Mechanical Engineering',
    'B.Tech Information Technology',
    'B.Tech Artificial Intelligence & Data Science'
  ];

  gradeColors: Record<string, string> = {
    'O': 'bg-purple-100 text-purple-800 border border-purple-300',
    'A+': 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    'A': 'bg-blue-100 text-blue-800 border border-blue-300',
    'B+': 'bg-amber-100 text-amber-800 border border-amber-300',
    'B': 'bg-orange-100 text-orange-800 border border-orange-300',
    'RA': 'bg-red-100 text-red-800 border border-red-300',
  };

  constructor(
    private data: DataService,
    private marksService: MarksService
  ) {}

  ngOnInit() {
    this.data.getCourses().subscribe(c => this.allCourses.set(c));

    const saved = this.marksService.getSavedResult();
    if (saved) {
      this.studentResult.set(saved);
      this.formRrn = saved.rrn;
      this.formName = saved.studentName;
      this.formDob = saved.dob;
      this.formDegreeType = saved.degreeType;
      this.formDepartment = saved.department;
    }
  }

  currentSemester = computed(() => {
    const res = this.studentResult();
    if (!res || !res.semesters) return null;
    return res.semesters.find(s => s.semester === this.activeSemesterNum()) || res.semesters[0];
  });

  onDegreeChange() {
    if (this.formDegreeType === 'B.Sc') {
      this.formDepartment = this.bscDepartments[0];
    } else {
      this.formDepartment = this.btechDepartments[0];
    }
  }

  checkResult() {
    if (!this.formRrn.trim() || !this.formName.trim() || !this.formDob.trim()) return;

    const res = this.marksService.getResult(
      this.formRrn.trim(),
      this.formName.trim(),
      this.formDob.trim(),
      this.formDegreeType,
      this.formDepartment,
      this.allCourses()
    );

    this.studentResult.set(res);
    this.activeSemesterNum.set(1);
  }

  resetResultSearch() {
    this.marksService.clearResultSession();
    this.studentResult.set(null);
  }

  setSemester(semNum: number) {
    this.activeSemesterNum.set(semNum);
  }

  getGradeClass(grade: string): string {
    return this.gradeColors[grade] || 'bg-gray-100 text-gray-700';
  }

  downloadSemesterMarksheet(sem: SemesterMarks) {
    const res = this.studentResult();
    if (!res) return;

    const lines: string[] = [];
    lines.push(`UNIVERSITY ACADEMIC MARKSTATEMENT`);
    lines.push(`Student Name: ${res.studentName}`);
    lines.push(`Register Number (RRN): ${res.rrn}`);
    lines.push(`Date of Birth: ${res.dob}`);
    lines.push(`Program: ${res.degreeType} - ${res.department}`);
    lines.push(`Semester: ${sem.semester}`);
    lines.push(`Semester SGPA: ${sem.sgpa}`);
    lines.push(`Cumulative CGPA: ${sem.cgpa}`);
    lines.push(``);
    lines.push(`Course Code,Course Title,Credits,Internal (40),External (60),Total (100),Grade,Status`);

    sem.subjects.forEach(s => {
      lines.push(`${s.code},"${s.name}",${s.credits},${s.internal},${s.external},${s.total},${s.grade},${s.status}`);
    });

    const csvContent = lines.join('\n');
    this.triggerDownload(csvContent, `Markstatement_Sem${sem.semester}_${res.rrn}.csv`);
  }

  downloadFullTranscript() {
    const res = this.studentResult();
    if (!res) return;

    const lines: string[] = [];
    lines.push(`CUMULATIVE ACADEMIC TRANSCRIPT`);
    lines.push(`Student Name: ${res.studentName}`);
    lines.push(`Register Number (RRN): ${res.rrn}`);
    lines.push(`Date of Birth: ${res.dob}`);
    lines.push(`Program: ${res.degreeType} - ${res.department}`);
    lines.push(`Total Semesters: ${res.totalSemesters}`);
    lines.push(`Overall CGPA: ${res.overallCgpa}`);
    lines.push(``);

    res.semesters.forEach(sem => {
      lines.push(`--- SEMESTER ${sem.semester} (SGPA: ${sem.sgpa} | CGPA: ${sem.cgpa}) ---`);
      lines.push(`Course Code,Course Title,Credits,Internal,External,Total,Grade,Status`);
      sem.subjects.forEach(s => {
        lines.push(`${s.code},"${s.name}",${s.credits},${s.internal},${s.external},${s.total},${s.grade},${s.status}`);
      });
      lines.push(``);
    });

    const csvContent = lines.join('\n');
    this.triggerDownload(csvContent, `Academic_Transcript_${res.rrn}.csv`);
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
