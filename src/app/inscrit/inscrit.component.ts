import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getFirestore, getDoc, setDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth} from 'firebase/auth';
import { Router, RouterModule } from '@angular/router';


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

@Component({
  selector: 'app-inscrit',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './inscrit.component.html',
  styleUrls: ['./inscrit.component.css']
})

export class InscritComponent {
  id!:string;
  lastname!: string;
  name!: string;
  email!: string;
  password!: string;
  telephone!: number;
  adresse!: string;
  role!: string;
  errorMessage: string = '';
  valid: boolean = false;

  create(){
    const auth = getAuth();
    createUserWithEmailAndPassword(auth,this.email,this.password)
    .then((userCredential) => {
      console.log('User added in:', userCredential.user.uid);
      this.aff(userCredential.user.uid)
      .then(() => this.redirectUser(userCredential.user.uid))
      this.errorMessage = '';
    })
    .catch((error) => {
      console.error(' error:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    });
  }

  constructor(private router : Router) {}
  async redirectUser(uid: string) {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData['role']; // Access role property using bracket notation
        if (role === 'professor') {
          this.router.navigate(['/home-prof']);
        } else if (role === 'Student') {
          this.router.navigate(['/home-stud']);
        } else if (role === 'admin') {
          this.router.navigate(['/home']);
        } 
      } else {
        console.error('No user data found!');
      }
    } catch (e) {
      console.error('Error fetching user role:', e);
    }
  }
  
  
  async aff(uid: string) {
    try {
      // const userRef=doc(db,`users`, uid) ;
      // Adding form data to Firestore
      const docRef = doc(db,"users",uid);
      await setDoc(docRef, {
        id:uid,
        lastname: this.lastname,
        name: this.name,
        email: this.email,
        telephone: this.telephone,
        adresse: this.adresse,
        role: this.role
      });
      this.valid = true; 
    } catch (e) {
      console.error('Error ', e);
      this.valid = false; 
    }
  }

  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email format.';
      default:
        return 'user exist';
    }
  }












  // Reset method
  res() {
    this.id = '';
    this.lastname = '';
    this.name = '';
    this.email = '';
    this.password = '';
    this.telephone = 0;
    this.adresse = '';
    this.role = '';
  }

}
