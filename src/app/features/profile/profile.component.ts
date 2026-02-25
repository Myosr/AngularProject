import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    Auth,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import {
    Firestore,
    doc,
    updateDoc
} from 'firebase/firestore';
import { FirebaseService } from '../../core/firebase.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    private auth: Auth;
    private firestore: Firestore;

    user: User | null = null;

    profileForm: FormGroup;
    passwordForm: FormGroup;

    profileSaving = false;
    profileSuccess = '';
    profileError = '';

    passwordSaving = false;
    passwordSuccess = '';
    passwordError = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private firebaseService: FirebaseService
    ) {
        this.auth = firebaseService.getAuth();
        this.firestore = firebaseService.getFirestore();

        this.profileForm = this.fb.group({
            displayName: ['', [Validators.required, Validators.minLength(2)]],
            email: [{ value: '', disabled: true }],
            role: [{ value: '', disabled: true }],
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.user = this.authService.getCurrentUser();
        if (this.user) {
            this.profileForm.patchValue({
                displayName: this.user.displayName ?? '',
                email: this.user.email,
                role: this.user.role,
            });
        }

        this.authService.currentUser$.subscribe(u => {
            if (u) {
                this.user = u;
                this.profileForm.patchValue({
                    displayName: u.displayName ?? '',
                    email: u.email,
                    role: u.role,
                });
            }
        });
    }

    get initials(): string {
        const name = this.user?.displayName || this.user?.email || '?';
        return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    }

    get memberSince(): string {
        if (!this.user?.createdAt) return '—';
        const d = new Date(this.user.createdAt);
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    /* ---------- Profile Update ---------- */
    saveProfile(): void {
        if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
        this.profileSaving = true;
        this.profileSuccess = '';
        this.profileError = '';

        const displayName = this.profileForm.get('displayName')!.value.trim();

        if (!this.user?.uid) { this.profileError = 'Not logged in.'; this.profileSaving = false; return; }

        updateDoc(doc(this.firestore, 'users', this.user.uid), { displayName })
            .then(() => {
                this.profileSaving = false;
                this.profileSuccess = 'Profile updated successfully.';
                // Update local storage
                const stored = this.authService.getCurrentUser();
                if (stored) {
                    stored.displayName = displayName;
                    localStorage.setItem('salesdw_user', JSON.stringify(stored));
                }
                setTimeout(() => this.profileSuccess = '', 4000);
            })
            .catch((err: any) => {
                this.profileSaving = false;
                this.profileError = err.message ?? 'Failed to update profile.';
            });
    }

    /* ---------- Password Update ---------- */
    savePassword(): void {
        if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
        this.passwordSaving = true;
        this.passwordSuccess = '';
        this.passwordError = '';

        const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

        if (newPassword !== confirmPassword) {
            this.passwordError = 'New passwords do not match.';
            this.passwordSaving = false;
            return;
        }

        const firebaseUser = this.auth.currentUser;
        if (!firebaseUser || !firebaseUser.email) {
            this.passwordError = 'Not logged in.';
            this.passwordSaving = false;
            return;
        }

        const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);

        reauthenticateWithCredential(firebaseUser, credential)
            .then(() => updatePassword(firebaseUser, newPassword))
            .then(() => {
                this.passwordSaving = false;
                this.passwordSuccess = 'Password changed successfully.';
                this.passwordForm.reset();
                setTimeout(() => this.passwordSuccess = '', 4000);
            })
            .catch((err: any) => {
                this.passwordSaving = false;
                if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                    this.passwordError = 'Current password is incorrect.';
                } else if (err.code === 'auth/weak-password') {
                    this.passwordError = 'New password is too weak (min 6 characters).';
                } else {
                    this.passwordError = err.message ?? 'Failed to change password.';
                }
            });
    }

    hasError(form: FormGroup, field: string, error: string): boolean {
        return form.get(field)?.hasError(error) && form.get(field)?.touched || false;
    }
}
