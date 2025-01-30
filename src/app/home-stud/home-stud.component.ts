import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const firebaseConfig = {
  apiKey: 'AIzaSyCzF_bGBdQPF0aF7ERIWwux0x60KR7F8i0',
  authDomain: 'learn-56bf4.firebaseapp.com',
  projectId: 'learn-56bf4',
  storageBucket: 'learn-56bf4.appspot.com',
  messagingSenderId: '455565926861',
  appId: '1:455565926861:web:f78a9f1ad60f2d7b6e6484',
  measurementId: 'G-BTBZFGMDVQ',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  UploadDate?: any; // Timestamp
  Url?: string;
}

@Component({
  selector: 'app-home-stud',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './home-stud.component.html',
  styleUrls: ['./home-stud.component.css'],
})
export class HomeStudComponent implements OnInit {
  groupedCourses: { [category: string]: Course[] } = {};
  errorMessage: string = '';
  filteredApprovedCourses: Course[] = [];  // Array of courses for the student
  studentEnrollmentStatus: string = '';  // To hold the student's enrollment status
  
  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.loadCourses();
  
     
        const enrollmentsRef = collection(db, 'pendingEnrollments');
        onSnapshot(enrollmentsRef, (snapshot) => {
          this.loadCourses();  // Refresh courses list when changes occur
        });
  
        this.cdr.detectChanges();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  

  async enrollInCourse(courseId: string): Promise<void> {
    const enrollmentsRef = collection(db, 'pendingEnrollments');
    try {
      await addDoc(enrollmentsRef, {
        courseId: courseId,
        studentId: getAuth().currentUser?.uid,
        status: 'Pending', // Set initial status to 'Pending'
        requestedAt: new Date(),
      });
      alert('Enrollment request sent! Please wait for admin approval.');
    } catch (error) {
      console.error('Error sending enrollment request:', error);
      alert('Failed to send enrollment request. Please try again later.');
    }
  }
  async loadCourses(): Promise<void> {
    const coursesRef = collection(db, 'courses');
    const studentId = getAuth().currentUser?.uid;
  
    if (!studentId) {
      console.warn('User not authenticated.');
      return;
    }
  
    try {
      // ✅ Fetch courses from Firestore
      const snapshot = await getDocs(coursesRef);
      if (snapshot.empty) {
        console.warn('No courses found.');
        return;
      }
  
      const courses = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Course, 'Id_c'>;
        return { Id_c: doc.id, ...data };
      });
  
      this.groupCoursesByCategory(courses);

      const enrollmentsRef = collection(db, 'pendingEnrollments');
      const q = query(enrollmentsRef, 
                      where('studentId', '==', studentId), 
                      where('status', '==', 'Accepted'));

      onSnapshot(q, (snapshot) => {
        const acceptedCourseIds = snapshot.docs.map((doc) => doc.data()['courseId']);
  
 
        this.filteredApprovedCourses = courses.filter(course => 
          acceptedCourseIds.includes(course.Id_c)
        );
  
        console.log('Updated Enrolled Courses:', this.filteredApprovedCourses);
      });
  
    } catch (error) {
      console.error('Error loading courses:', error);
      this.errorMessage = 'Failed to load courses. Please try again later.';
    }
  }

  groupCoursesByCategory(courses: Course[]): void {
    this.groupedCourses = courses.reduce((groups, course) => {
      const category = course.Category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(course);
      return groups;
    }, {} as { [key: string]: Course[] });
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedCourses);
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth)
      .then(() => this.router.navigate(['/login']))
      .catch((error) => console.error('Error logging out:', error));
  }

  viewMore(category: string): void {
    this.filteredApprovedCourses = this.groupedCourses[category];  // Show full list for this category
  }

  // Handle enrollment status updates here if needed
}
