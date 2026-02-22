import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from './customer.service';
import { AuthService } from '../../core/auth.service';
import { Customer } from '../../models/customer.model';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
    customers: Customer[] = [];
    loading = true;
    formVisible = false;
    isEditing = false;
    editingId: string | null = null;
    submitting = false;
    errorMsg = '';

    // Confirm delete modal
    showDeleteModal = false;
    deletingId: string | null = null;
    deletingName = '';

    form: FormGroup;

    columns: TableColumn[] = [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        {
            key: 'status', label: 'Status', type: 'badge',
            badgeMap: { active: 'badge-success', inactive: 'badge-error' }
        },
        { key: 'createdAt', label: 'Created', type: 'date' },
    ];

    get isAdmin(): boolean { return this.auth.isAdmin(); }

    constructor(
        private svc: CustomerService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            company: [''],
            status: ['active', Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.loading = true;
        this.svc.getAll().subscribe({
            next: (data) => {
                this.customers = data;
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    openCreate(): void {
        this.isEditing = false;
        this.editingId = null;
        this.form.reset({ status: 'active' });
        this.formVisible = true;
        this.errorMsg = '';
    }

    openEdit(customer: Customer): void {
        this.isEditing = true;
        this.editingId = customer.id ?? null;
        this.form.patchValue({
            name: customer.name,
            email: customer.email,
            phone: customer.phone ?? '',
            company: customer.company ?? '',
            status: customer.status,
        });
        this.formVisible = true;
        this.errorMsg = '';
    }

    closeForm(): void {
        this.formVisible = false;
        this.form.reset();
    }

    saveCustomer(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.submitting = true;
        this.errorMsg = '';
        const payload = this.form.value as Partial<Customer>;

        const obs = this.isEditing && this.editingId
            ? this.svc.update(this.editingId, payload)
            : this.svc.create(payload);

        obs.subscribe({
            next: () => {
                this.submitting = false;
                this.closeForm();
                this.loadCustomers();
            },
            error: (err: any) => {
                this.submitting = false;
                this.errorMsg = err?.message ?? 'An error occurred. Please try again.';
            }
        });
    }

    confirmDelete(customer: Customer): void {
        this.deletingId = customer.id ?? null;
        this.deletingName = customer.name;
        this.showDeleteModal = true;
    }

    onDeleteConfirmed(): void {
        if (!this.deletingId) return;
        this.showDeleteModal = false;
        this.svc.delete(this.deletingId).subscribe({
            next: () => this.loadCustomers(),
            error: () => { }
        });
    }

    onDeleteCancelled(): void {
        this.showDeleteModal = false;
        this.deletingId = null;
        this.deletingName = '';
    }

    // Form helpers
    get f() { return this.form.controls; }
    hasError(field: string, error: string) { return this.form.get(field)?.hasError(error) && this.form.get(field)?.touched; }
}

