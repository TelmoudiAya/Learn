import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  titre!: string; // Course title

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth, // Inject Firebase Auth
    private firestore: AngularFirestore // Inject Firestore
  ) {}

  navigate(destination: string): void {
    this.router.navigate([`/${destination}`]);
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error during logout. Please try again.');
    }
  }

  async loadCourses(): Promise<void> {
    try {
      const snapshot = await this.firestore.collection('courses').get().toPromise();
      console.log('Courses:', snapshot?.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  async addCourse(): Promise<void> {
    try {
      await this.firestore.collection('courses').add({
        title: this.titre, 
        createdAt: new Date()
      });
      console.log('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  }
}
