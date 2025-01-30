import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Router, RouterLink } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-msg',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.css']
})
export class MsgComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  messages: any[] = [];
  filteredMessages: any[] = [];
  searchTerm: string = '';
  newMessage: any = { recipient: '', text: '', date: '', status: 'Send' };
  selectedUser: any = null;
  currentUser: any = null;

  constructor(private router: Router) {}
  async updateLastOnline(): Promise<void> {
    const db = getFirestore();
    const userRef = doc(db, 'users', this.currentUser?.uid);
  
    try {
      await updateDoc(userRef, { lastOnline: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating last online time:', error);
    }
  }
  ngOnInit(): void {
    const auth = getAuth();
    this.currentUser = auth.currentUser; // Fetch the logged-in user
    if (this.currentUser) {
      this.fetchUsers();
      this.fetchMessages();
    } else {
      console.error('No user is logged in!');
      this.router.navigate(['/login']);
    }
  }
  hasUnreadMessages(userId: string): boolean {
    return this.messages.some(
      (message) =>
        message.sender === userId &&
        message.recipient === this.currentUser?.uid &&
        message.status !== 'Seen'
    );
  }
  
  countUnreadMessages(userId: string): number {
    return this.messages.filter(
      (message) =>
        message.sender === userId &&
        message.recipient === this.currentUser?.uid &&
        message.status !== 'Seen'
    ).length;
  }
  
  async fetchUsers(): Promise<void> {
    const db = getFirestore();
    const usersRef = collection(db, 'users');

    try {
      const querySnapshot = await getDocs(usersRef);
      this.users = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((user) => user.id !== this.currentUser?.uid); // Exclude the logged-in user
      this.filteredUsers = [...this.users];
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async fetchMessages(): Promise<void> {
    const db = getFirestore();
    const messagesRef = collection(db, 'messages');

    try {
      const querySnapshot = await getDocs(messagesRef);
      this.messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      this.filterMessages();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.newMessage.recipient = user.id;
    this.filterMessages();
    this.markMessagesAsSeen();
  }

  filterMessages(): void {
    if (this.selectedUser) {
      const currentUserId = this.currentUser?.uid;
      this.filteredMessages = this.messages.filter(
        (message) =>
          (message.sender === currentUserId && message.recipient === this.selectedUser.id) ||
          (message.recipient === currentUserId && message.sender === this.selectedUser.id)
      );
    }
  }

  async sendMessage(): Promise<void> {
    const db = getFirestore();
  
    try {
      await addDoc(collection(db, 'messages'), {
        sender: this.currentUser?.uid,
        recipient: this.newMessage.recipient,
        text: this.newMessage.text,
        date: new Date().toISOString(),
        status: 'Send',
      });
      this.newMessage.text = '';
      this.fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  
  async markMessagesAsSeen(): Promise<void> {
    const db = getFirestore();
  
    try {
      const updates = this.filteredMessages.map(async (message) => {
        if (message.status !== 'Seen' && message.recipient === this.currentUser?.uid) {
          await updateDoc(doc(db, 'messages', message.id), { status: 'Seen' });
        }
      });
  
      await Promise.all(updates);
      this.fetchMessages();
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  }
  

  navigate(destination: string): void {
    this.router.navigate([`/${destination}`]);
  }

  logout(): void {
    const auth = getAuth();
    this.updateLastOnline();
    signOut(auth)
      .then(() => this.router.navigate(['/login']))
      .catch((error) => console.error('Error logging out:', error));
  }
}
