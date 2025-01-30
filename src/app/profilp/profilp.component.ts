import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './profilp.component.html',
  styleUrls: ['./profilp.component.css']
})
export class ProfilpComponent implements OnInit {
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
      this.users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      
      this.filteredUsers = this.users.filter(user => user.role?.toLowerCase().trim() === 'student');
      console.log('Fetched students:', this.filteredUsers); 

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
    this.editingUser = { ...user };
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  async confirmEdit(): Promise<void> {
    const db = getFirestore();
    const userId = this.editingUser.id;

    try {
      await updateDoc(doc(db, 'users', userId), {
        lastname: this.editingUser.lastname,
        name: this.editingUser.name,
        email: this.editingUser.email,
        telephone: this.editingUser.telephone,
        adresse: this.editingUser.adresse,
        role: this.editingUser.role,
      });
      alert('User updated successfully!');
      this.fetchUsers();
      this.editingUser = null;
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
