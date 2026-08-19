import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { StudentService } from '../../services/student.service';
import { StudentProfile } from '../../models/student.model';

@Component({
  selector: 'app-student',
  imports: [Hero, SectionTitle, FormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class StudentPage implements OnInit {
  studentProfile = signal<StudentProfile | null>(null);
  isEditing = signal(false);
  loginMode = signal<'existing' | 'new'>('existing');
  showQrModal = signal(false);

  // Login Form
  loginRrn = '';
  loginError = signal('');

  // Form Fields for New Registration / Edit
  formName = '';
  formRrn = '';
  formDob = '';
  formEmail = '';
  formPhone = '';
  formDegreeType: 'B.Sc' | 'B.Tech' = 'B.Sc';
  formDepartment = 'B.Sc Computer Science';
  formSemester = 3;
  formAddress = '';
  formEmergency = '';
  formBloodGroup = 'O+';

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

  constructor(public studentService: StudentService) {}

  ngOnInit() {
    this.studentService.student$.subscribe(p => {
      if (p) {
        this.studentProfile.set(p);
        this.populateForm(p);
      } else {
        this.studentProfile.set(null);
      }
    });
  }

  populateForm(p: StudentProfile) {
    this.formName = p.name;
    this.formRrn = p.rrn;
    this.formDob = p.dob;
    this.formEmail = p.email;
    this.formPhone = p.phone;
    this.formDegreeType = p.degreeType;
    this.formDepartment = p.department;
    this.formSemester = p.semester;
    this.formAddress = p.address || '';
    this.formEmergency = p.emergencyContact || '';
    this.formBloodGroup = p.bloodGroup || 'O+';
  }

  openQrModal() {
    this.showQrModal.set(true);
  }

  closeQrModal() {
    this.showQrModal.set(false);
  }

  setLoginMode(mode: 'existing' | 'new') {
    this.loginMode.set(mode);
    this.loginError.set('');
  }

  loginWithRrn() {
    if (!this.loginRrn.trim()) return;

    const loggedIn = this.studentService.loginWithRrn(this.loginRrn.trim());
    if (loggedIn) {
      this.loginError.set('');
      this.isEditing.set(false);
    } else {
      this.loginError.set(`No student found with RRN "${this.loginRrn.trim()}". You can register a new profile below.`);
    }
  }

  selectSampleStudent(sample: StudentProfile) {
    this.studentService.saveProfile(sample);
    this.isEditing.set(false);
    this.loginError.set('');
  }

  onDegreeChange() {
    if (this.formDegreeType === 'B.Sc') {
      this.formDepartment = this.bscDepartments[0];
    } else {
      this.formDepartment = this.btechDepartments[0];
    }
  }

  saveProfile() {
    if (!this.formName.trim() || !this.formRrn.trim() || !this.formEmail.trim()) return;

    const totalSemesters = this.formDegreeType === 'B.Sc' ? 6 : 8;

    const newProfile: StudentProfile = {
      id: 'STU-' + (this.formRrn.trim().toUpperCase() || '2024CS101'),
      name: this.formName.trim(),
      rrn: this.formRrn.trim().toUpperCase(),
      dob: this.formDob || '2003-08-15',
      email: this.formEmail.trim(),
      phone: this.formPhone.trim(),
      degreeType: this.formDegreeType,
      department: this.formDepartment,
      semester: Number(this.formSemester) || 1,
      totalSemesters,
      address: this.formAddress.trim(),
      emergencyContact: this.formEmergency.trim(),
      bloodGroup: this.formBloodGroup,
      academicStatus: 'Active / Registered'
    };

    this.studentService.saveProfile(newProfile);
    this.isEditing.set(false);
    this.loginError.set('');
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
  }

  logout() {
    if (confirm('Are you sure you want to log out of the Student Profile?')) {
      this.studentService.logout();
      this.isEditing.set(false);
      this.loginRrn = '';
      this.loginError.set('');
    }
  }
}
