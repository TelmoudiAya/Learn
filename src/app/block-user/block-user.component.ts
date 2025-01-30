import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-block-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './block-user.component.html',
  styleUrls: ['./block-user.component.css']
})
export class BlockUserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  selectedUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers(): Promise<void> {
    const db = getFirestore();
    const usersRef = collection(db, 'users');

    try {
      const querySnapshot = await getDocs(usersRef);
      this.users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      this.filteredUsers = this.users.filter((user) => !user.blocked); // Exclude blocked users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
    );
  }

  selectUser(user: any): void {
    this.selectedUser = user;
  }

  async blockUser(user: any): Promise<void> {
    const db = getFirestore();

    try {
      await updateDoc(doc(db, 'users', user.id), {
        blocked: true, // Mark user as blocked
        email: '' // Optionally clear the email to prevent re-registration
      });
      alert(`${user.name} has been blocked successfully.`);
      this.fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Error blocking user. Please try again.');
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
