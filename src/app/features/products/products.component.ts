import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './product.service';
import { AuthService } from '../../core/auth.service';
import { Product } from '../../models/product.model';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    loading = true;
    formVisible = false;
    isEditing = false;
    editingId: string | null = null;
    submitting = false;
    errorMsg = '';

    showDeleteModal = false;
    deletingId: string | null = null;
    deletingName = '';

    form: FormGroup;

    columns: TableColumn[] = [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'sku', label: 'SKU', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'price', label: 'Price', type: 'currency' },
        { key: 'stock', label: 'Stock', type: 'text' },
        {
            key: 'status', label: 'Status', type: 'badge',
            badgeMap: { active: 'badge-success', inactive: 'badge-error' }
        },
    ];

    get isAdmin(): boolean { return this.auth.isAdmin(); }

    constructor(
        private svc: ProductService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            sku: [''],
            category: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            status: ['active', Validators.required],
        });
    }

    ngOnInit(): void { this.loadProducts(); }

    loadProducts(): void {
        this.loading = true;
        this.svc.getAll().subscribe({
            next: (data) => { this.products = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    openCreate(): void {
        this.isEditing = false;
        this.editingId = null;
        this.form.reset({ price: 0, stock: 0, status: 'active' });
        this.formVisible = true;
        this.errorMsg = '';
    }

    openEdit(product: Product): void {
        this.isEditing = true;
        this.editingId = product.id ?? null;
        this.form.patchValue({ ...product });
        this.formVisible = true;
        this.errorMsg = '';
    }

    closeForm(): void { this.formVisible = false; this.form.reset(); }

    saveProduct(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.submitting = true;
        const obs = this.isEditing && this.editingId
            ? this.svc.update(this.editingId, this.form.value)
            : this.svc.create(this.form.value);

        obs.subscribe({
            next: () => { this.submitting = false; this.closeForm(); this.loadProducts(); },
            error: (err: any) => {
                this.submitting = false;
                this.errorMsg = err?.message || (err && typeof err === 'string' ? err : 'An error occurred.');
                console.error('Save product error:', err);
            }
        });
    }

    confirmDelete(product: Product): void {
        this.deletingId = product.id ?? null;
        this.deletingName = product.name;
        this.showDeleteModal = true;
    }

    onDeleteConfirmed(): void {
        if (!this.deletingId) return;
        this.showDeleteModal = false;
        this.submitting = true;
        this.svc.delete(this.deletingId).subscribe({
            next: () => { this.submitting = false; this.deletingId = null; this.loadProducts(); },
            error: (err: any) => {
                this.submitting = false;
                this.errorMsg = err?.message || 'Failed to delete product.';
                console.error('Delete product error:', err);
            }
        });
    }

    onDeleteCancelled(): void { this.showDeleteModal = false; }

    hasError(field: string, error: string) {
        return this.form.get(field)?.hasError(error) && this.form.get(field)?.touched;
    }
}

