import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth, signOut } from 'firebase/auth';
import { Router, RouterLink } from '@angular/router';

const firebaseConfig = {
  apiKey: "AIzaSyCzF_bGBdQPF0aF7ERIWwux0x60KR7F8i0",
  authDomain: "learn-56bf4.firebaseapp.com",
  projectId: "learn-56bf4",
  storageBucket: "learn-56bf4.appspot.com",
  messagingSenderId: "455565926861",
  appId: "1:455565926861:web:f78a9f1ad60f2d7b6e6484",
  measurementId: "G-BTBZFGMDVQ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

@Component({
  selector: 'app-verif',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
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
      const querySnapshot = await getDocs(collection(db, 'pendingCourses'));
      this.courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }
  
  async fetchApprovedCourses() {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses')); 
      this.courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching approved courses:', error);
    }
  }
  
  viewCourseDetails(course: any) {
    this.selectedCourse = course;
  }

  async approveCourse(course: any) {
    try {
      await updateDoc(doc(db, 'pendingCourses', course.id), {
        status: 'approved',
        adminComment: this.reviewComment
      });
      alert('Course approved!');
      this.closeModal();
      await this.fetchCourses();
    } catch (error) {
      console.error('Error approving course:', error);
    }
  }

  async rejectCourse(course: any) {
    try {
      await deleteDoc(doc(db, 'pendingCourses', course.id));
      alert('Course rejected and removed.');
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
    signOut(auth)
      .then(() => {
        console.log('User logged out.');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
}
