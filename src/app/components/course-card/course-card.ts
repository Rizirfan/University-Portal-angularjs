import { Component, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-card',
  imports: [DecimalPipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css'
})
export class CourseCard {
  course = input.required<Course>();
  showCurriculumModal = signal(false);

  toggleModal() {
    this.showCurriculumModal.update(v => !v);
  }
}
