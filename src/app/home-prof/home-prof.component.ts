import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { doc } from 'firebase/firestore/lite';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



interface Course {
  Id_c: string;
  Titre: string;
  Description: string;
  Duree: string;
  Prix: string;
  Type: string;
  Etat: string;
  Contenu: string;
  Category: string;
  Professor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeProfComponent {
  private courseDoc!: AngularFirestoreDocument<Course>;
  public course$: Observable<Course> = new Observable();
  public rejectedCourses: Course[] = [];

  constructor(private firestore: AngularFirestore) {}

  getCourseDetails(id: string): Observable<Course> {
    this.courseDoc = this.firestore.doc<Course>(`courses/${id}`);
    this.course$ = this.courseDoc.valueChanges().pipe(
      map((course) => {
        if (!course) {
          throw new Error('Course not found');
        }
        return { ...course, Id_c: id };
      })
    );
    return this.course$;
  }

  async fetchRejectedCourses() {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) return;
  
    try {
      const querySnapshot = await this.firestore.collection('rejectedCourses').ref.get();
      this.rejectedCourses = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as Course }))
        .filter(course => course.Professor === user.email);
    } catch (error) {
      console.error('Error fetching rejected courses:', error);
    }
  }

  getCourses(): Observable<Course[]> {
    return this.firestore.collection<Course>('courses').valueChanges();
  }

  deleteCourse(courseId: string): Promise<void> {
    return this.firestore.collection('courses').doc(courseId).delete();
  }

  updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
    return this.firestore.collection('courses').doc(courseId).update(courseData);
  }

  getCategories(): Observable<any[]> {
    return this.firestore.collection('categories').valueChanges();
  }

  getProfessors(): Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('role', '==', 'professor')).valueChanges();
  }

}
