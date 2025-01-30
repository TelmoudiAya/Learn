import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  editingUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }
  async fetchUsers(): Promise<void> {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
  
    try {
      const querySnapshot = await getDocs(usersRef);
  
      this.users = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Fetched user:", data); // Debugging log
  
        return {
          id: doc.id,
          ...data,
          role: data['role'] ? data['role'].toLowerCase() : 'unknown' // Correct bracket notation
        };
      });
  
      // Filter only students and professors
      this.filteredUsers = this.users.filter(
        (user) => user.role === 'student' || user.role === 'professor'
      );
  
      console.log("Filtered users:", this.filteredUsers); // Debugging log
  
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }
  editUser(user: any): void {
    this.editingUser = { ...user }; // Copy all user data
    console.log("Editing user:", this.editingUser); // Debugging log
  }
  

  cancelEdit(): void {
    this.editingUser = null;
  }

  async confirmEdit(): Promise<void> {
    if (!this.editingUser) return; // Ensure a user is being edited
  
    const db = getFirestore();
    const userId = this.editingUser.id;
  
    try {
      await updateDoc(doc(db, 'users', userId), {
        lastname: this.editingUser.lastname || '',  // Ensure fields are never undefined
        name: this.editingUser.name || '',
        email: this.editingUser.email || '',
        telephone: this.editingUser.telephone || '',
        adresse: this.editingUser.adresse || '',
        role: this.editingUser.role || '',
      });
  
      alert('User updated successfully!');
      this.fetchUsers();  // Refresh the user list
      this.editingUser = null;  // Close the edit form
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
  
  async deleteUser(userId: string): Promise<void> {
    const db = getFirestore();

    try {
      await deleteDoc(doc(db, 'users', userId));
      alert('User deleted successfully!');
      this.fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
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
