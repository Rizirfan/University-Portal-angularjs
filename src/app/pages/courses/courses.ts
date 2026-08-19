import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { DataService } from '../../services/data.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, Hero, SectionTitle],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  courses = signal<Course[]>([]);
  activeFilter = signal<string>('ALL');
  filters = ['ALL', 'B.Sc', 'B.Tech'];
  selectedCourse = signal<Course | null>(null);

  filteredCourses = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'ALL') return this.courses();
    return this.courses().filter(c => c.degreeType === filter);
  });

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getCourses().subscribe(c => this.courses.set(c));
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  openSyllabus(course: Course) {
    this.selectedCourse.set(course);
  }

  closeSyllabus() {
    this.selectedCourse.set(null);
  }
}
