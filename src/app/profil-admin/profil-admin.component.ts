import { Component , OnInit } from '@angular/core';
import { getAuth, signOut } from 'firebase/auth';  
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';  
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profil-admin.component.html',
  styleUrl: './profil-admin.component.css'
})
export class ProfilAdminComponent implements OnInit {
  name: string | null = null;
  lastname: string | null = null;
  email: string | null = null;
  telephone: string | null = null;
  adresse: string | null = null;
  role: string | null = null;
  userId: string | null = null;
  password: string = '';
  valid: boolean = false;  

  private db = getFirestore();  

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = getAuth().currentUser;
    if (user) {
      this.userId = user.uid;
      this.loadStudentData();
    }
  }

  loadStudentData() {
    if (this.userId) {
      const userDocRef = doc(this.db, 'users', this.userId);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            this.name = data?.['name'] || null;
            this.lastname = data?.['lastname'] || null;
            this.email = data?.['email'] || null;
            this.telephone = data?.['telephone'] || null;
            this.adresse = data?.['adresse'] || null;
            this.role = data?.['role'] || null;
          }
        })
        .catch((error) => {
          console.error('Error fetching student data:', error);
        });
    }
  }

  create() {
    if (!this.name || !this.lastname || !this.email || !this.telephone || !this.role) return;

    const updatedData = {
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      telephone: this.telephone,
      adresse: this.adresse,
      role: this.role,
    };

    if (this.userId) {
     
      const userDocRef = doc(this.db, 'users', this.userId);
      updateDoc(userDocRef, updatedData)
        .then(() => {
          this.valid = true; 
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    }
  }

  resetForm() {
    
    this.name = '';
    this.lastname = '';
    this.email = '';
    this.telephone = '';
    this.adresse = '';
    this.role = 'student';
    this.password = '';
    this.valid = false; 
  }

  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        this.router.navigate(['/login']); 
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
}


