import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Student } from '../models/student.model';
import { Course } from '../models/course.model';
import { SemesterMarks } from '../models/marks.model';
import { Hostel } from '../models/hostel.model';
import { Transport } from '../models/transport.model';
import { Fees } from '../models/fees.model';
import { CanteenCategory } from '../models/canteen.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private baseUrl = 'assets/data';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students.json`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses.json`);
  }

  getMarks(): Observable<SemesterMarks[]> {
    return this.http.get<SemesterMarks[]>(`${this.baseUrl}/marks.json`);
  }

  getHostels(): Observable<Hostel[]> {
    return this.http.get<Hostel[]>(`${this.baseUrl}/hostel.json`);
  }

  getTransport(): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.baseUrl}/transport.json`);
  }

  getFees(): Observable<Fees> {
    return this.http.get<Fees>(`${this.baseUrl}/fees.json`);
  }

  getCanteen(): Observable<CanteenCategory[]> {
    return this.http.get<CanteenCategory[]>(`${this.baseUrl}/canteen.json`);
  }
}
