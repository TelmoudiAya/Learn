import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {

  constructor(private router: Router){}


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
