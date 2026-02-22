import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';

export interface StatCard {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    trend: 'up' | 'down' | null;
    trendValue: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    loading = true;

    stats: StatCard[] = [
        { title: 'Total Sales', value: 0, icon: 'attach_money', color: '#10b981', trend: null, trendValue: '' },
        { title: 'Total Profit', value: 0, icon: 'trending_up', color: '#3b82f6', trend: null, trendValue: '' },
        { title: 'Total Orders', value: 0, icon: 'shopping_cart', color: '#f59e0b', trend: null, trendValue: '' },
        { title: 'Total Customers', value: 0, icon: 'people', color: '#8b5cf6', trend: null, trendValue: '' },
    ];

    salesByMonth: any[] = [];
    salesByProduct: any[] = [];
    salesByCustomer: any[] = [];

    recentActivityCols = [
        { key: 'id', label: '#', type: 'text' },
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'product', label: 'Product', type: 'text' },
        { key: 'amount', label: 'Amount', type: 'currency' },
        {
            key: 'status', label: 'Status', type: 'badge',
            badgeMap: { paid: 'badge-success', pending: 'badge-warning', overdue: 'badge-error' }
        },
        { key: 'date', label: 'Date', type: 'date' },
    ] as any[];

    recentActivity: any[] = [];

    constructor(private svc: DashboardService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        this.svc.getSummary().subscribe({
            next: (r) => {
                this.stats[0].value = r.totalSales ?? 0;
                this.stats[1].value = r.totalProfit ?? 0;
                this.stats[2].value = r.totalOrders ?? 0;
                this.stats[3].value = r.totalCustomers ?? 0;

                // Example trend data from API
                if (r.salesTrend != null) {
                    this.stats[0].trend = r.salesTrend >= 0 ? 'up' : 'down';
                    this.stats[0].trendValue = `${Math.abs(r.salesTrend)}% vs last month`;
                }
            },
            error: () => { },
            complete: () => { this.loading = false; }
        });

        this.svc.getSalesByMonth().subscribe(r => this.salesByMonth = r);
        this.svc.getSalesByProduct().subscribe(r => this.salesByProduct = r);
        this.svc.getSalesByCustomer().subscribe(r => this.salesByCustomer = r);
    }

    formatCurrency(val: number): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
}

