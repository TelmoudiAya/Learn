import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Router, RouterLink } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-com',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './com.component.html',
  styleUrls: ['./com.component.css']
})
export class ComComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  messages: any[] = [];
  filteredMessages: any[] = [];
  searchTerm: string = '';
  newMessage: any = { recipient: '', text: '', date: '', status: 'Send' };
  selectedUser: any = null;
  currentUser: any = null;

  constructor(private router: Router) {}

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
        status: 'Send'
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
          await updateDoc(doc(db, 'messages', message.id), {
            status: 'Seen'
          });
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
