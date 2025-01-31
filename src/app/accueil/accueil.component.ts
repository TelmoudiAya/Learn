import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  courses: any[] = []; // List of courses
  groupedCourses: { [category: string]: any[] } = {}; // Grouped by category
  isLoading: boolean = true;
  userLoggedIn: boolean = false; // Track if user is logged in

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkUserAuth();
    this.loadCourses();
  }

  checkUserAuth(): void {
    // Simulated login check (replace with real authentication logic)
    this.userLoggedIn = false; // Set to false to enforce login request
  }

  async loadCourses(): Promise<void> {
    const db = getFirestore();
    try {
      // Adjusting query to fetch all approved courses without filtering by category
      const coursesQuery = query(collection(db, 'courses'));
      const querySnapshot = await getDocs(coursesQuery);

      if (!querySnapshot.empty) {
        this.courses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          Titre: doc.data()['Titre'] || 'Untitled',
          Description: doc.data()['Description'] || 'No description',
          Duree: doc.data()['Duree'] || 'Unknown duration',
          Prix: doc.data()['Prix'] || 'Unknown price',
          Type: doc.data()['Type'] || 'Unknown type',
          Category: doc.data()['Category'] || 'Uncategorized',
          UploadDate: doc.data()['UploadDate']?.toDate() || new Date(),
          Url: doc.data()['Url'] || ''
        }));

        this.groupCoursesByCategory(this.courses);
      } else {
        console.warn('No courses found.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      this.isLoading = false;
    }
  }

  groupCoursesByCategory(courses: any[]): void {
    this.groupedCourses = courses.reduce((groups, course) => {
      const category = course.Category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(course);
      return groups;
    }, {} as { [key: string]: any[] });
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedCourses);
  }

  navigateToCourse(courseId: string): void {
    if (!this.userLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate([`/course/${courseId}`]);
    }
  }

  logout(): void {
    this.userLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
