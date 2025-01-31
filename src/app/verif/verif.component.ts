import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../layouts/admin-sidebar/admin-sidebar.component';

const db = getFirestore();

@Component({
  selector: 'app-verif',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,AdminSidebarComponent],
  templateUrl: './verif.component.html',
  styleUrls: ['./verif.component.css']
})
export class VerifComponent implements OnInit {
  courses: any[] = [];
  selectedCourse: any = null;
  reviewComment: string = '';

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.fetchCourses();
  }

  async fetchCourses() {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      this.courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(this.courses); 
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  viewCourseDetails(course: any) {
    this.selectedCourse = course;
  }

  async approveCourse(course: any) {
    try {
      await setDoc(doc(db, 'courses', course.id), {
        ...course,
        Etat: 'approved'
      });
      await deleteDoc(doc(db, 'courses', course.id));
      alert('Course approved and moved to the main course list.');
      this.closeModal();
      await this.fetchCourses();
    } catch (error) {
      console.error('Error approving course:', error);
    }
  }

  async rejectCourse(course: any) {
    try {
      await setDoc(doc(db, 'rejectedCourses', course.id), {
        ...course,
        Etat: 'rejected',
        adminComment: this.reviewComment
      });

      await deleteDoc(doc(db, 'pendingCourses', course.id));
      alert('Course rejected and the professor has been notified.');
      this.closeModal();
      await this.fetchCourses();
    } catch (error) {
      console.error('Error rejecting course:', error);
    }
  }

  closeModal() {
    this.selectedCourse = null;
    this.reviewComment = '';
  }

  logout(): void {
    const auth = getAuth();
    auth.signOut().then(() => {
      console.log('User logged out.');
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  }
}
