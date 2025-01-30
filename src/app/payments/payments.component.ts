import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  status: string;
  enrollmentDate: Date;
  studentName: string;
  studentEmail: string;
  prix: string;
  category: string;
  duree: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  filteredEnrollments: Enrollment[] = [];
  searchTerm: string = '';
  loading: boolean = true; // Add loading state

  constructor(private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadPendingEnrollments();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  async approveEnrollment(enrollmentId: string): Promise<void> {
    const enrollmentRef = doc(db, 'pendingEnrollments', enrollmentId);
    try {
      await updateDoc(enrollmentRef, { status: 'Accepted' });
      alert('Enrollment Approved!');
    } catch (error) {
      console.error('Error approving enrollment:', error);
      alert('Failed to approve enrollment.');
    }
  }
  
  async loadPendingEnrollments(): Promise<void> {
    const enrollmentsRef = collection(db, 'pendingEnrollments'); // Use pendingEnrollments here
    const coursesRef = collection(db, 'courses');
    
    try {
      const enrollmentSnapshot = await getDocs(enrollmentsRef); // Get enrollments from pendingEnrollments
      const enrollmentDocs = enrollmentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const courseSnapshot = await getDocs(coursesRef);
      const courses = courseSnapshot.docs.reduce((acc, doc) => {
        const courseData = doc.data();
        acc[doc.id] = {
          title: courseData['Titre'] || 'Untitled',
          category: courseData['Category'] || 'Uncategorized',
          duration: courseData['Duree'] || 'Unknown',
          price: courseData['Prix'] || 'Free',
          uploadDate: courseData['UploadDate']?.toDate() || new Date(),
        };
        return acc;
      }, {} as Record<string, any>);
  
      this.enrollments = await Promise.all(
        enrollmentDocs.map(async (enrollment: any) => {
          const studentData = await this.getStudentData(enrollment.studentId);
          const courseDetails = courses[enrollment.courseId] || {};
  
          return {
            id: enrollment.id,
            studentId: enrollment.studentId,
            courseId: enrollment.courseId,
            courseTitle: courseDetails.title,
            category: courseDetails.category,
            duree: courseDetails.duree,
            prix: courseDetails.Prix,
            uploadDate: courseDetails.uploadDate,
            status: enrollment.status || 'pending',
            enrollmentDate: enrollment.requestedAt?.toDate() || new Date(), // Make sure to use 'requestedAt'
            studentName: studentData.name,
            studentEmail: studentData.email,
          };
        })
      );
  
      this.filteredEnrollments = [...this.enrollments];
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  }
  
  
  async getStudentData(studentId: string): Promise<any> {
    try {
      const userRef = doc(db, 'users', studentId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? userDoc.data() : { name: 'Unknown', email: 'Unknown' };
    } catch (error) {
      console.error(`Error fetching student data for ID: ${studentId}`, error);
      return { name: 'Unknown', email: 'Unknown' };
    }
  }

  filterEnrollments(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEnrollments = this.enrollments.filter((enrollment) => {
      return (
        enrollment.studentName.toLowerCase().includes(term) ||
        enrollment.studentEmail.toLowerCase().includes(term) ||
        enrollment.courseTitle.toLowerCase().includes(term)
      );
    });
  }

  async updateEnrollmentStatus(enrollmentId: string, status: string): Promise<void> {
    try {
      const enrollmentRef = doc(db, 'pendingEnrollments', enrollmentId);
      await updateDoc(enrollmentRef, { status });
  
      if (status === 'Accepted') {
        // Add the course to the 'courses' collection for the student
        const enrollmentSnapshot = await getDoc(enrollmentRef);
        const enrollmentData = enrollmentSnapshot.data();
        if (enrollmentData) {
          await addDoc(collection(db, 'courses'), {
            ...enrollmentData,
            studentId: enrollmentData['studentId'],
          });
          alert('Enrollment request accepted and course added to your list.');
        }
      }
  
      alert(`Enrollment request has been ${status}.`);
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      alert('Failed to update status.');
    }
  }
  
  
  
  navigate(destination: string): void {
    this.router.navigate([`/${destination}`]);
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error during logout:', error);
        alert('Error during logout. Please try again.');
      });
  }
}
