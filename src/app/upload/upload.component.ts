import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

interface Course {
  Titre: string;
  Description: string;
  Prix: string;
  Duree: string;
  Type: string;
  Etat: string;
  Contenu?: string;
  UploadDate: Timestamp;
  Url?: string;
  Category: string;
}

@Component({
  selector: 'app-upload',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterLink],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  newCourse: Course = {
    Titre: '',
    Description: '',
    Prix: '',
    Duree: '',
    Type: '',
    Etat: '',
    Contenu: '',
    UploadDate: Timestamp.now(),
    Url: '',
    Category: ''
  };
  editingCourse: Course | null = null; // Stores the course being edited
  file: File | null = null;
  categories: { id: string; name: string }[] = []; 
  courses: Course[] = []; // List of all courses
  filteredCategories: string[] = []; // Stores filtered categories for search
  searchTerm: string = ''; // User search term
  categoryColors: { [key: string]: string } = {}; // Dynamic colors for categories

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchCourses();
  }

  async fetchCategories(): Promise<void> {
    const categoriesRef = collection(db, 'categories');
    try {
      const querySnapshot = await getDocs(categoriesRef);
      this.categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data()['nom'],
      }));
      this.assignCategoryColors(); // Assign colors after fetching categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async fetchCourses(): Promise<void> {
    const coursesRef = collection(db, 'courses');
    try {
      const querySnapshot = await getDocs(coursesRef);
      this.courses = querySnapshot.docs.map((doc) => doc.data() as Course);
      this.filterCourses(); // Initialize filtered categories
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  assignCategoryColors(): void {
    const colors = ['#FFD700', '#ADFF2F', '#40E0D0', '#FF69B4', '#87CEEB', '#FFA07A'];
    this.categories.forEach((category, index) => {
      this.categoryColors[category.name] = colors[index % colors.length];
    });
  }

  filterCourses(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories
      .map((category) => category.name)
      .filter((categoryName) => {
        const categoryCourses = this.getCoursesByCategory(categoryName);
        return (
          categoryName.toLowerCase().includes(searchTermLower) ||
          categoryCourses.some((course) => course.Titre.toLowerCase().includes(searchTermLower))
        );
      });
  }

  getCoursesByCategory(categoryName: string): Course[] {
    return this.courses.filter((course) => course.Category === categoryName);
  }

  async addCourse(): Promise<void> {
    this.newCourse.UploadDate = Timestamp.now();
    if (this.file) {
      const fileRef = ref(storage, `courses/${this.file.name}`);
      await uploadBytes(fileRef, this.file);
      this.newCourse.Url = await getDownloadURL(fileRef);
    }

    try {
      await addDoc(collection(db, 'courses'), this.newCourse);
      alert('Course uploaded successfully!');
      this.fetchCourses(); // Refresh courses after adding
    } catch (error) {
      console.error('Error adding course:', error);
    }

    this.newCourse = {
      Titre: '',
      Description: '',
      Prix: '',
      Duree: '',
      Type: '',
      Etat: '',
      Contenu: '',
      UploadDate: Timestamp.now(),
      Url: '',
      Category: ''
    };
    this.file = null;
  }

  editCourse(course: Course): void {
    this.editingCourse = { ...course }; // Clone the course to avoid direct mutation
  }

  async updateCourse(courseData :any): Promise<void> {
    if (this.editingCourse) {
      try {
        await addDoc(collection(db, 'pendingCourses'), courseData);
        const courseRef = collection(db, 'courses');
        const docToUpdate = this.courses.find((course) => course.Titre === this.editingCourse?.Titre);
        if (docToUpdate) {
          await addDoc(courseRef, { ...this.editingCourse }); // Save changes
          alert('Course updated successfully!');
          this.fetchCourses(); // Refresh courses
          this.editingCourse = null; // Reset editing state
        }
      } catch (error) {
        console.error('Error updating course:', error);
      }
    }
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
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

  getCategoryColor(categoryName: string): string {
    return this.categoryColors[categoryName] || '#ddd'; // Default color if not assigned
  }

  showAllCourses(categoryName: string): void {
    // Logic to expand and show all courses for a category
    console.log(`Show all courses for category: ${categoryName}`);
  }
}
