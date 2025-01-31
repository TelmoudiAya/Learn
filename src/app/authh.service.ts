import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, authState, User } from'@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class AuthService {

user$: Observable<User | null>;
constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
this.user$ = authState(this.auth);
}
async login(email: string, password: string) {
const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
return userCredential.user;
}
async logout() {
await signOut(this.auth);
this.router.navigate(['/login']);
}
getUserRole(uid: string): Observable<string | null> {
return of(uid).pipe(
switchMap(async (uid) => {
const userDocRef = doc(this.firestore, `users/${uid}`);
const userSnap = await getDoc(userDocRef);
return userSnap.exists() ? userSnap.data()?['role'] : null;
})
);
}
}