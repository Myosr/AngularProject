import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from '../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private auth: Auth;
  private firestore: Firestore;

  constructor() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.firestore = getFirestore(app);

    // Enable persistence
    setPersistence(this.auth, browserLocalPersistence).catch(err => {
      console.error('Error setting persistence:', err);
    });
  }

  getAuth(): Auth {
    return this.auth;
  }

  getFirestore(): Firestore {
    return this.firestore;
  }
}
