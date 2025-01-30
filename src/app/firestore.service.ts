import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, getDocs, query, where } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs'
const firebaseConfig = {
  apiKey: "AIzaSyCzF_bGBdQPF0aF7ERIWwux0x60KR7F8i0",
  authDomain: "learn-56bf4.firebaseapp.com",
  projectId: "learn-56bf4",
  storageBucket: "learn-56bf4.firebasestorage.app",
  messagingSenderId: "455565926861",
  appId: "1:455565926861:web:f78a9f1ad60f2d7b6e6484",
  measurementId: "G-BTBZFGMDVQ"
};

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private app: FirebaseApp;
  private db: Firestore;

  constructor(private firestore: AngularFirestore) {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);  
  }
 
  async getStudents(): Promise<any[]> {
    try {
      const colRef = collection(this.db, 'users');
      const q = query(colRef, where('role', '==', 'student'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Could not fetch students');
    }
  }

  getCourses(): Observable<any[]> {
    return this.firestore.collection('courses').valueChanges();
  }

  deleteCourse(courseId: string): Promise<void> {
    return this.firestore.collection('courses').doc(courseId).delete();
  }

  updateCourse(courseId: string, courseData: any): Promise<void> {
    return this.firestore.collection('courses').doc(courseId).update(courseData);
  }
  getCategories(): Observable<any[]> {
    return this.firestore.collection('categories').valueChanges();  // Ensure the collection name is correct
  }
  getPendingCourses(): Observable<any[]> {
    return this.firestore.collection('pendingCourses').valueChanges({ idField: 'id' });
  }


  approveCourse(courseId: string, comment: string): Promise<void> {
    return this.firestore.collection('approvedCourses').doc(courseId).set({
      approved: true,
      comment: comment
    }).then(() => {
      return this.firestore.collection('pendingCourses').doc(courseId).delete();
    });
  }

  rejectCourse(courseId: string, comment: string): Promise<void> {
    return this.firestore.collection('rejectedCourses').doc(courseId).set({
      rejected: true,
      comment: comment
    }).then(() => {
      return this.firestore.collection('pendingCourses').doc(courseId).delete();
    });

}

}


