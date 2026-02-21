import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdToken,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { User, LoginResponse } from '../models/user.model';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private firestore: Firestore;
  private readonly TOKEN_KEY = 'salesdw_token';
  private readonly ROLE_KEY = 'salesdw_role';
  private readonly USER_KEY = 'salesdw_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.auth = firebaseService.getAuth();
    this.firestore = firebaseService.getFirestore();
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state listener
   */
  private initializeAuthState(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(this.firestore, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            this.currentUserSubject.next(userData);
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
            localStorage.setItem(this.ROLE_KEY, userData.role);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
      }
    });
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (userCredential) => {
        const firebaseUser = userCredential.user;
        const token = await getIdToken(firebaseUser);

        // Get user document from Firestore
        const userDoc = await getDoc(doc(this.firestore, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
          console.error('User document not found in Firestore for UID:', firebaseUser.uid);
          throw new Error('User profile not found in database. Please contact admin.');
        }

        const userData = userDoc.data() as User;

        // Update last login
        await updateDoc(doc(this.firestore, 'users', firebaseUser.uid), {
          lastLogin: serverTimestamp()
        });

        const response: LoginResponse = {
          token,
          role: userData.role,
          user: userData
        };

        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.ROLE_KEY, userData.role);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));

        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);

        return response;
      }),
      catchError((error) => {
        let errorMessage = 'Email or password is incorrect. Please try again.';
        console.error('Login error:', error);

        // Return generic message to prevent account enumeration
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Register new user with role
   */
  registerUser(email: string, password: string, displayName: string = '', role: 'Admin' | 'User' = 'User'): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (userCredential) => {
        const firebaseUser = userCredential.user;

        // Create user document in Firestore
        const userData: User = {
          uid: firebaseUser.uid,
          email,
          displayName: displayName || email.split('@')[0],
          role,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        await setDoc(doc(this.firestore, 'users', firebaseUser.uid), {
          ...userData,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });

        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);

        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        localStorage.setItem(this.ROLE_KEY, role);

        return userData;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password must be at least 8 characters long.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Logout
   */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      })
    );
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get user role
   */
  getRole(): 'Admin' | 'User' | null {
    return (localStorage.getItem(this.ROLE_KEY) as 'Admin' | 'User') ?? null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  /**
   * Google Sign-In
   */
  signInWithGoogle(): Observable<LoginResponse> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(async (result) => {
        const firebaseUser = result.user;
        const token = await getIdToken(firebaseUser);

        // Check if user document exists in Firestore
        const userDoc = await getDoc(doc(this.firestore, 'users', firebaseUser.uid));

        let userData: User;

        if (userDoc.exists()) {
          // User exists, update last login
          userData = userDoc.data() as User;
          await updateDoc(doc(this.firestore, 'users', firebaseUser.uid), {
            lastLogin: serverTimestamp()
          });
        } else {
          // New user, create document
          userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: 'User',
            createdAt: new Date(),
            lastLogin: new Date()
          };

          await setDoc(doc(this.firestore, 'users', firebaseUser.uid), {
            ...userData,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
        }

        const response: LoginResponse = {
          token,
          role: userData.role,
          user: userData
        };

        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.ROLE_KEY, userData.role);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));

        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);

        return response;
      }),
      catchError((error) => {
        console.error('Google Sign-In error:', error);
        let errorMessage = 'Google sign-in failed. Please try again.';

        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Sign-in was cancelled.';
        } else if (error.code === 'auth/cancelled-popup-request') {
          errorMessage = 'Sign-in is already in progress.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
