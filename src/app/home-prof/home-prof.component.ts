import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Course {
  Id_c: string;
  Titre: string;
  Description: string;
  Duree: string;
  Prix: string;
  Type: string;
  Etat: string;
  Contenu: string;
  Category: string;
}


@Injectable({
  providedIn: 'root',
})
export class HomeProfComponent {
  private courseDoc!: AngularFirestoreDocument<Course>;
  public course$: Observable<Course> = new Observable();

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
}
