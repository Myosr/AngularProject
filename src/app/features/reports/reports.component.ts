import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

interface SummaryData {
    totalSales: number;
    totalProfit: number;
    totalOrders: number;
    totalCustomers: number;
    salesTrend: number;
}

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    loading = true;
    errorMsg = '';

    summary: SummaryData = { totalSales: 0, totalProfit: 0, totalOrders: 0, totalCustomers: 0, salesTrend: 0 };

    salesByMonth: any[] = [];
    salesByProduct: any[] = [];
    salesByCustomer: any[] = [];

    monthColumns: TableColumn[] = [
        { key: 'month', label: 'Month', type: 'text' },
        { key: 'total', label: 'Sales', type: 'currency' },
    ];

    productColumns: TableColumn[] = [
        { key: 'product', label: 'Product', type: 'text' },
        { key: 'total', label: 'Revenue', type: 'currency' },
    ];

    customerColumns: TableColumn[] = [
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'total', label: 'Revenue', type: 'currency' },
    ];

    get isAdmin(): boolean { return this.auth.isAdmin(); }

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit(): void { this.loadReports(); }

    loadReports(): void {
        this.loading = true;
        this.errorMsg = '';

        this.http.get<SummaryData>('/api/dashboard/summary').subscribe({
            next: (r) => { this.summary = r; },
            error: (err) => { this.errorMsg = 'Failed to load summary.'; }
        });

        this.http.get<any[]>('/api/dashboard/sales-by-month').subscribe({
            next: (r) => { this.salesByMonth = r; },
            error: () => { }
        });

        this.http.get<any[]>('/api/dashboard/sales-by-product').subscribe({
            next: (r) => { this.salesByProduct = r; },
            error: () => { }
        });

        this.http.get<any[]>('/api/dashboard/sales-by-customer').subscribe({
            next: (r) => { this.salesByCustomer = r; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    formatCurrency(val: number): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    }

    formatPercent(val: number): string {
        return (val >= 0 ? '+' : '') + val.toFixed(1) + '%';
    }

    get profitMargin(): string {
        if (this.summary.totalSales === 0) return '0%';
        return ((this.summary.totalProfit / this.summary.totalSales) * 100).toFixed(1) + '%';
    }

    get avgOrderValue(): string {
        if (this.summary.totalOrders === 0) return '$0';
        return this.formatCurrency(this.summary.totalSales / this.summary.totalOrders);
    }
}
