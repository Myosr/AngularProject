import { Component, OnInit } from '@angular/core';
import { MyInvoicesService } from './my-invoices.service';
import { AuthService } from '../../core/auth.service';
import { UserInvoice } from '../../models/invoice.model';

@Component({
    selector: 'app-my-invoices',
    templateUrl: './my-invoices.component.html',
    styleUrls: ['./my-invoices.component.scss']
})
export class MyInvoicesComponent implements OnInit {
    invoices: UserInvoice[] = [];
    loading = true;
    errorMsg = '';

    constructor(
        private svc: MyInvoicesService,
        private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.loadInvoices();
    }

    loadInvoices(): void {
        this.loading = true;
        const userId = this.auth.getCurrentUser()?.uid ?? 'anonymous';
        this.svc.getByUser(userId).subscribe({
            next: (data) => { this.invoices = data; this.loading = false; },
            error: (err) => { this.errorMsg = err?.message ?? 'Failed to load invoices'; this.loading = false; }
        });
    }

    getPaymentClass(status?: string): string {
        if (!status) return 'badge-default';
        const s = status.toLowerCase();
        if (s.includes('paid') || s.includes('payée')) return 'badge-success';
        if (s.includes('pending') || s.includes('attente')) return 'badge-warning';
        if (s.includes('overdue')) return 'badge-error';
        return 'badge-default';
    }
}
