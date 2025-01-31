import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
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

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  newCourse = {
    Titre: '',
    Description: '',
    Prix: '',
    Duree: '',
    Type: '',
    Etat: 'pending', // Default status
    Contenu: '',
    UploadDate: Timestamp.now(),
    Url: '',
    Category: '',
    Professor: ''
  };
  file: File | null = null;
  categories: { id: string; name: string }[] = []; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  async fetchCategories(): Promise<void> {
    const categoriesRef = collection(db, 'categories');
    try {
      const querySnapshot = await getDocs(categoriesRef);
      this.categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data()['nom'],
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async addCourse(): Promise<void> {
    this.newCourse.UploadDate = Timestamp.now();
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.email) {  
      this.newCourse.Professor = user.email; 
    } else {
      alert("You must be logged in to upload courses!");
      return;
    }
    

    if (this.file) {
      const fileRef = ref(storage, `courses/${this.file.name}`);
      await uploadBytes(fileRef, this.file);
      this.newCourse.Url = await getDownloadURL(fileRef);
    }

    try {
      await addDoc(collection(db, 'pendingCourses'), this.newCourse);
      alert('Course submitted for approval!');
      this.router.navigate(['/home-prof']); 
    } catch (error) {
      console.error('Error adding course:', error);
    }

    // Reset form
    this.newCourse = {
      Titre: '',
      Description: '',
      Prix: '',
      Duree: '',
      Type: '',
      Etat: 'pending',
      Contenu: '',
      UploadDate: Timestamp.now(),
      Url: '',
      Category: '',
      Professor: ''
    };
    this.file = null;
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
}
