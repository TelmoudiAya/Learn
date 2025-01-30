import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string = '';
  lastname: string = '';
  totalStudents: number = 0;
  totalProfessors: number = 0;
  totalAdmins: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Logged in as:', user.uid);
        await this.getUserData(user.uid);
        await this.fetchDashboardData();
      } else {
        console.error('User not logged in!');
        this.router.navigate(['/login']);
      }
    });
  }

  async getUserData(uid: string): Promise<void> {
    const db = getFirestore();
    const docRef = doc(db, 'users', uid);

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        this.name = userData['name'];
        this.lastname = userData['lastname'];
      } else {
        console.error('No such user document!');
      }
    } catch (e) {
      console.error('Error fetching user data:', e);
    }
  }

  async fetchDashboardData(): Promise<void> {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
  
    try {
      const querySnapshot = await getDocs(usersRef);
  
      // Reset counters
      this.totalStudents = 0;
      this.totalProfessors = 0;
      this.totalAdmins = 0;
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
  
        if (userData['role']?.toLowerCase() === 'student') {
          this.totalStudents++;
        } else if (userData['role']?.toLowerCase() === 'professor') {
          this.totalProfessors++;
        } else if (userData['role']?.toLowerCase() === 'admin') {
          this.totalAdmins++;
        }
      });
  
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }
  

  navigate(destination: string): void {
    this.router.navigate([`/${destination}`]);
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
