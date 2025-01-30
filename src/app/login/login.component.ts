import { Component } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Router, RouterModule } from '@angular/router';
import { getFirestore, collection,getDoc ,doc,addDoc } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app'; // Firebase App methods
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    const firebaseConfig = {
      apiKey: "AIzaSyCzF_bGBdQPF0aF7ERIWwux0x60KR7F8i0",
      authDomain: "learn-56bf4.firebaseapp.com",
      projectId: "learn-56bf4",
      storageBucket: "learn-56bf4.appspot.com",
      messagingSenderId: "455565926861",
      appId: "1:455565926861:web:f78a9f1ad60f2d7b6e6484",
      measurementId: "G-BTBZFGMDVQ"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    // Initialize Firebase only if no apps are initialized
    if (getApps().length === 0) {
      initializeApp(firebaseConfig);
    }
  }

  async login() {
    const auth = getAuth();
    const db = getFirestore();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
      const uid = userCredential.user.uid; // Get the user's UID
  
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData['role'];
  
        if (role === 'professor') {
          this.router.navigate(['/home-prof']);
        } else if (role === 'Student') {
          this.router.navigate(['/home-stud']);
        } else if (role === 'admin') {
          this.router.navigate(['/home']);
        } else {
          console.error('Unknown role:', role);
        }
      } else {
        console.error('No such user document!');
      }
    } catch (error) {
      this.errorMessage = 'Invalid email or password.';
    }
  }
  
  
}
