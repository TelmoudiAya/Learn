import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  newComment: string = '';
  selectedRating: number = 0;
  comments: any[] = [];
  professors: any[] = [];
  adminEmail: string = 'admin@gmail.com';
  userLoggedIn: boolean = true; 
  constructor() {}

  ngOnInit(): void {
    this.loadComments();
    this.loadProfessors();
  }

  async loadComments(): Promise<void> {
    const db = getFirestore();
    const commentsCollection = collection(db, 'comments');
    try {
      const querySnapshot = await getDocs(commentsCollection);
      this.comments = querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  async loadProfessors(): Promise<void> {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    this.professors = querySnapshot.docs
      .map(doc => doc.data())
      .filter(user => user['role'] === 'professor'); 
  }

  async submitComment(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.newComment.trim()) return; 

    const db = getFirestore();
    try {
  
      const commentObj = {
        text: this.newComment,
        rating: this.selectedRating,
        timestamp: new Date(), 
      };

  
      await addDoc(collection(db, 'comments'), commentObj);
      this.comments.push(commentObj); 

      this.newComment = '';
      this.selectedRating = 0; 


      setTimeout(() => {
        const commentElements = document.querySelectorAll('.comment');
        commentElements[commentElements.length - 1].classList.add('fadeIn');
      }, 100);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }

  setRating(star: number): void {
    this.selectedRating = star;
  }
}
