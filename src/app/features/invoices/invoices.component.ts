import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService, InvoiceDto } from '../../services/invoice.service';
import { AuthService } from '../../core/auth.service';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

@Component({
    selector: 'app-invoices',
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
    invoices: InvoiceDto[] = [];
    loading = true;
    formVisible = false;
    isEditing = false;
    editingId: number | null = null;
    submitting = false;
    errorMsg = '';

    showDeleteModal = false;
    deletingId: number | null = null;
    deletingLabel = '';

    form: FormGroup;

    columns: TableColumn[] = [
        { key: 'invoiceID', label: '#', type: 'text' },
        { key: 'customerName', label: 'Customer', type: 'text' },
        { key: 'invoiceDate', label: 'Date', type: 'date' },
        { key: 'totalAmount', label: 'Amount', type: 'currency' },
        { key: 'totalTax', label: 'Tax', type: 'currency' },
        { key: 'totalWithTax', label: 'Total', type: 'currency' },
        {
            key: 'paymentStatus', label: 'Status', type: 'badge',
            badgeMap: { Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-error' }
        },
    ];

    get isAdmin(): boolean { return this.auth.isAdmin(); }

    constructor(
        private svc: InvoiceService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            customerID: [null, Validators.required],
            invoiceDate: ['', Validators.required],
            comments: [''],
            deliveryInstructions: [''],
            paymentDays: [30, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit(): void { this.loadInvoices(); }

    loadInvoices(): void {
        this.loading = true;
        this.svc.getAll().subscribe({
            next: (data) => { this.invoices = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    openCreate(): void {
        this.isEditing = false;
        this.editingId = null;
        this.form.reset({ paymentDays: 30 });
        this.formVisible = true;
        this.errorMsg = '';
    }

    openEdit(invoice: InvoiceDto): void {
        this.isEditing = true;
        this.editingId = invoice.invoiceID ?? null;
        this.form.patchValue({
            customerID: invoice.customerID,
            invoiceDate: invoice.invoiceDate,
            comments: invoice.comments ?? '',
            deliveryInstructions: invoice.deliveryInstructions ?? '',
            paymentDays: invoice.paymentDays ?? 30,
        });
        this.formVisible = true;
        this.errorMsg = '';
    }

    closeForm(): void { this.formVisible = false; this.form.reset(); }

    saveInvoice(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.submitting = true;
        this.errorMsg = '';

        const v = this.form.value;
        const payload: Partial<InvoiceDto> = {
            customerID: Number(v.customerID),
            billToCustomerID: Number(v.customerID),
            invoiceDate: v.invoiceDate,
            comments: v.comments,
            deliveryInstructions: v.deliveryInstructions,
            paymentDays: Number(v.paymentDays),
        };

        const obs = this.isEditing && this.editingId !== null
            ? this.svc.update(this.editingId, payload)
            : this.svc.create(payload);

        obs.subscribe({
            next: () => { this.submitting = false; this.closeForm(); this.loadInvoices(); },
            error: (err: any) => {
                this.submitting = false;
                this.errorMsg = err?.message ?? 'An error occurred.';
            }
        });
    }

    confirmDelete(invoice: InvoiceDto): void {
        this.deletingId = invoice.invoiceID ?? null;
        this.deletingLabel = `Invoice #${invoice.invoiceID}`;
        this.showDeleteModal = true;
    }

    onDeleteConfirmed(): void {
        if (this.deletingId == null) return;
        this.showDeleteModal = false;
        this.svc.delete(this.deletingId).subscribe({
            next: () => this.loadInvoices(),
            error: (err: any) => { this.errorMsg = err?.message ?? 'Delete failed.'; }
        });
    }

    onDeleteCancelled(): void { this.showDeleteModal = false; this.deletingId = null; }

    hasError(field: string, error: string) {
        return this.form.get(field)?.hasError(error) && this.form.get(field)?.touched;
    }
}
