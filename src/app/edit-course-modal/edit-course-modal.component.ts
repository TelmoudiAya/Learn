import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-course-modal',
  standalone: true,
  imports:[FormsModule,CommonModule],
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.css'],
})
export class EditCourseModalComponent {
  @Input() course: any = null; 
  @Output() courseUpdated = new EventEmitter<any>();

  saveChanges() {
    this.courseUpdated.emit(this.course);
  }

  close() {
    this.course = null; 
  }
}
