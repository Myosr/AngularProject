import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { initializeApp, deleteApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import {
    Firestore,
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { FirebaseService } from '../../core/firebase.service';
import { User } from '../../models/user.model';
import { firebaseConfig } from '../../../environments/firebase.config';

@Injectable()
export class UserManagementService {
    private firestore: Firestore;

    constructor(private firebaseService: FirebaseService) {
        this.firestore = firebaseService.getFirestore();
    }

    /**
     * List all users from the Firestore 'users' collection
     */
    getAll(): Observable<User[]> {
        return from(
            getDocs(query(collection(this.firestore, 'users'), orderBy('createdAt', 'desc')))
        ).pipe(
            map(snapshot => snapshot.docs.map(d => {
                const data = d.data();
                return {
                    uid: d.id,
                    email: data['email'] ?? '',
                    displayName: data['displayName'] ?? '',
                    role: data['role'] ?? 'User',
                    createdAt: data['createdAt']?.toDate?.() ?? null,
                    lastLogin: data['lastLogin']?.toDate?.() ?? null,
                } as User;
            })),
            catchError(err => throwError(() => new Error('Failed to load users: ' + err.message)))
        );
    }

    /**
     * Create a new user in Firebase Auth + Firestore.
     * Uses a temporary secondary Firebase app so the admin session is not affected.
     */
    create(userData: Partial<User> & { password: string }): Observable<User> {
        return from((async () => {
            // Create a temporary secondary Firebase app to avoid signing out the admin
            const tempApp = initializeApp(firebaseConfig, '_userCreation');
            const tempAuth = getAuth(tempApp);

            try {
                const cred = await createUserWithEmailAndPassword(
                    tempAuth, userData.email!, userData.password
                );
                const newUid = cred.user.uid;
                const newUser: User = {
                    uid: newUid,
                    email: userData.email!,
                    displayName: userData.displayName || userData.email!.split('@')[0],
                    role: userData.role || 'User',
                    createdAt: new Date(),
                    lastLogin: new Date(),
                };

                // Write user profile to Firestore
                await setDoc(doc(this.firestore, 'users', newUid), {
                    ...newUser,
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                });

                return newUser;
            } finally {
                // Always clean up the temporary app
                await deleteApp(tempApp);
            }
        })()).pipe(
            catchError(err => {
                let msg = 'Failed to create user.';
                if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
                else if (err.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
                else if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
                return throwError(() => new Error(msg));
            })
        );
    }

    /**
     * Update user profile in Firestore (role, displayName)
     */
    update(uid: string, userData: Partial<User>): Observable<User> {
        const updates: Record<string, any> = {};
        if (userData.displayName !== undefined) updates['displayName'] = userData.displayName;
        if (userData.role !== undefined) updates['role'] = userData.role;
        if (userData.email !== undefined) updates['email'] = userData.email;

        return from(updateDoc(doc(this.firestore, 'users', uid), updates)).pipe(
            map(() => ({ uid, ...userData } as User)),
            catchError(err => throwError(() => new Error('Failed to update user: ' + err.message)))
        );
    }

    /**
     * Delete user profile from Firestore.
     * Note: This removes the Firestore document. The Firebase Auth account
     * remains (requires Admin SDK to delete), but they will not appear in the list.
     */
    delete(uid: string): Observable<void> {
        return from(deleteDoc(doc(this.firestore, 'users', uid))).pipe(
            catchError(err => throwError(() => new Error('Failed to delete user: ' + err.message)))
        );
    }
}
