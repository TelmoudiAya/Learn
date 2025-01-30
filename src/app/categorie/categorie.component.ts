import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Router, RouterEvent, RouterLink } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})

export class CategorieComponent implements OnInit {
  categories: any[] = [];
  newCategory: any = { nom: '' };
  editingCategory: any = null;
  test:boolean=true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  async fetchCategories(): Promise<void> {
    const db = getFirestore();
    const categoriesRef = collection(db, 'categories');

    try {
      const querySnapshot = await getDocs(categoriesRef);
      this.categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async addCategory(): Promise<void> 
  { this.test=true;
    const db = getFirestore();

    try {
      await addDoc(collection(db, 'categories'), {
        nom: this.newCategory.nom
      });
      alert('Category added successfully!');
      this.newCategory.nom = '';
      this.fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  }

  editCategory(category: any): void {
    this.test=false;
    this.editingCategory = { ...category };
  }

  cancelEdit(): void {
    this.test=true;
    this.editingCategory = null;
  }

  async confirmEdit(): Promise<void> {
    this.test=true;
    const db = getFirestore();
    const categoryId = this.editingCategory.id;

    try {
      await updateDoc(doc(db, 'categories', categoryId), {
        nom: this.editingCategory.nom
      });
      alert('Category updated successfully!');
      this.fetchCategories();
      this.editingCategory = null;
    } catch (error) {
      console.error('Error updating category:', error);
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const db = getFirestore();

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      alert('Category deleted successfully!');
      this.fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
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
        console.error('Error during logout', error);
        alert('Error . Please try again.');
      });
  }
}
