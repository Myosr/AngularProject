import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from './customer.service';
import { AuthService } from '../../core/auth.service';
import { CustomerDto } from './customer.service';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
    customers: CustomerDto[] = [];
    loading = true;
    formVisible = false;
    isEditing = false;
    editingId: number | null = null;
    submitting = false;
    errorMsg = '';

    // Confirm delete modal
    showDeleteModal = false;
    deletingId: number | null = null;
    deletingName = '';

    form: FormGroup;

    columns: TableColumn[] = [
        { key: 'customerName', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phoneNumber', label: 'Phone', type: 'text' },
        { key: 'customerCategory', label: 'Company', type: 'text' },
        {
            key: 'status', label: 'Status', type: 'badge',
            badgeMap: { Active: 'badge-success', Inactive: 'badge-error' }
        },
        { key: 'accountOpenedDate', label: 'Created', type: 'date' },
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
            phone: ['', Validators.required],
            company: ['', Validators.required],
            status: ['active', Validators.required],
            deliveryAddress: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            postalCode: ['', Validators.required],
            paymentDays: [30, Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.loading = true;
        this.svc.getAll().subscribe({
            next: (data) => {
                this.customers = data.map((c: any) => ({
                    ...c,
                    status: c.isActive ? 'Active' : 'Inactive'
                }));
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    openCreate(): void {
        this.isEditing = false;
        this.editingId = null;
        this.form.reset({
            status: 'active',
            paymentDays: 30
        });
        this.formVisible = true;
        this.errorMsg = '';
    }

    openEdit(customer: CustomerDto): void {
        this.isEditing = true;
        this.editingId = customer.customerID ?? null;
        this.form.patchValue({
            name: customer.customerName,
            email: customer.email,
            phone: customer.phoneNumber ?? '',
            company: customer.customerCategory ?? '',
            status: customer.isActive ? 'active' : 'inactive',
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
        // Map form to backend DTO
        const formValue = this.form.value;
        const payload: Partial<CustomerDto> = {
            customerName: formValue.name,
            customerCategory: formValue.company,
            phoneNumber: formValue.phone,
            email: formValue.email,
            deliveryAddress: formValue.deliveryAddress,
            city: formValue.city,
            country: formValue.country,
            postalCode: formValue.postalCode,
            paymentDays: Number(formValue.paymentDays),
            isActive: formValue.status === 'active',
        };
        console.log('Customer payload:', payload);

        const obs = this.isEditing && this.editingId !== null
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

    confirmDelete(customer: CustomerDto): void {
        this.deletingId = customer.customerID ?? null;
        this.deletingName = customer.customerName;
        this.showDeleteModal = true;
    }

    onDeleteConfirmed(): void {
        if (this.deletingId == null) return;
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

