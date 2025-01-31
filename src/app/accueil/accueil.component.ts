import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  courses: any[] = [];
  groupedCourses: { [category: string]: any[] } = {};
  isLoading: boolean = true;
  userLoggedIn: boolean = false;
  showMore: { [category: string]: boolean } = {}; // Track visibility of "Voir Plus" / "Voir Moins"

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkUserAuth();
    this.loadCourses();
  }

  checkUserAuth(): void {
    this.userLoggedIn = false; // Replace with real authentication check
  }

  async loadCourses(): Promise<void> {
    const db = getFirestore();
    try {
      const coursesQuery = collection(db, 'courses');
      const querySnapshot = await getDocs(coursesQuery);
      if (!querySnapshot.empty) {
        this.courses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          Titre: doc.data()['Titre'] || 'Untitled',
          Description: doc.data()['Description'] || 'No description',
          Duree: doc.data()['Duree'] || 'Unknown duration',
          Prix: doc.data()['Prix'] || 'Unknown price',
          Category: doc.data()['Category'] || 'Uncategorized',
          Url: doc.data()['Url'] || ''
        }));
        this.groupCoursesByCategory(this.courses);
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
    
    // Initialize the "showMore" state for each category
    Object.keys(this.groupedCourses).forEach(category => {
      this.showMore[category] = false;
    });
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedCourses);
  }

  getVisibleCourses(category: string): any[] {
    const courses = this.groupedCourses[category];
    return this.showMore[category] ? courses : courses.slice(0, 3); // Show first 3 courses initially
  }

  toggleViewMore(category: string): void {
    this.showMore[category] = !this.showMore[category]; // Toggle the visibility
  }

  navigateToCourse(courseId: string): void {
    if (!this.userLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate([`/course/${courseId}`]);
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.userLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
