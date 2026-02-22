import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from './user-management.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../models/user.model';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    loading = true;
    formVisible = false;
    isEditing = false;
    editingUid: string | null = null;
    submitting = false;
    errorMsg = '';

    showDeleteModal = false;
    deletingUid: string | null = null;
    deletingName = '';

    form: FormGroup;

    columns: TableColumn[] = [
        { key: 'displayName', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        {
            key: 'role', label: 'Role', type: 'badge',
            badgeMap: { Admin: 'badge-info', User: 'badge-neutral' }
        },
        { key: 'lastLogin', label: 'Last Login', type: 'date' },
        { key: 'createdAt', label: 'Joined', type: 'date' },
    ];

    get currentUid(): string | undefined { return this.auth.getCurrentUser()?.uid; }

    constructor(
        private svc: UserManagementService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            displayName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            role: ['User', Validators.required],
            password: ['', [Validators.minLength(8)]],
        });
    }

    ngOnInit(): void { this.loadUsers(); }

    loadUsers(): void {
        this.loading = true;
        this.svc.getAll().subscribe({
            next: d => { this.users = d; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    openCreate(): void {
        this.isEditing = false;
        this.editingUid = null;
        this.form.reset({ role: 'User' });
        this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.form.get('password')?.updateValueAndValidity();
        this.formVisible = true;
        this.errorMsg = '';
    }

    openEdit(user: User): void {
        this.isEditing = true;
        this.editingUid = user.uid;
        // Password not required when editing
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
        this.form.patchValue({
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            password: '',
        });
        this.formVisible = true;
        this.errorMsg = '';
    }

    closeForm(): void { this.formVisible = false; this.form.reset(); }

    saveUser(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.submitting = true;
        const obs = this.isEditing && this.editingUid
            ? this.svc.update(this.editingUid, this.form.value)
            : this.svc.create(this.form.value);

        obs.subscribe({
            next: () => { this.submitting = false; this.closeForm(); this.loadUsers(); },
            error: (err: any) => { this.submitting = false; this.errorMsg = err?.message ?? 'Operation failed.'; }
        });
    }

    confirmDelete(user: User): void {
        this.deletingUid = user.uid;
        this.deletingName = user.displayName ?? user.email;
        this.showDeleteModal = true;
    }

    onDeleteConfirmed(): void {
        if (!this.deletingUid) return;
        this.showDeleteModal = false;
        this.svc.delete(this.deletingUid).subscribe({ next: () => this.loadUsers() });
    }

    onDeleteCancelled(): void { this.showDeleteModal = false; }

    isSelf(user: User): boolean { return user.uid === this.currentUid; }

    hasError(field: string, error: string) {
        return this.form.get(field)?.hasError(error) && this.form.get(field)?.touched;
    }
}

