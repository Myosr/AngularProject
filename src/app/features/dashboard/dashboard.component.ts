import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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

    /* ── Chart data objects ── */
    salesMonthData: ChartData<'bar'> = { labels: [], datasets: [] };
    salesMonthOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { callback: (v) => '$' + (+v / 1e6).toFixed(1) + 'M' }
            }
        }
    };

    salesProductData: ChartData<'doughnut'> = { labels: [], datasets: [] };
    salesProductOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
        }
    };

    salesCustomerData: ChartData<'doughnut'> = { labels: [], datasets: [] };
    salesCustomerOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
        }
    };

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
            badgeMap: { Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-error' }
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

                if (r.salesTrend != null) {
                    this.stats[0].trend = r.salesTrend >= 0 ? 'up' : 'down';
                    this.stats[0].trendValue = `${Math.abs(r.salesTrend)}% vs last year`;
                }
            },
            error: () => { },
            complete: () => { this.loading = false; }
        });

        this.svc.getSalesByMonth().subscribe(r => {
            this.salesByMonth = r;
            this.salesMonthData = {
                labels: r.map(x => x.month),
                datasets: [{
                    data: r.map(x => x.total),
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                    label: 'Sales'
                }]
            };
        });

        this.svc.getSalesByProduct().subscribe(r => {
            this.salesByProduct = r;
            this.salesProductData = {
                labels: r.map(x => x.product.length > 25 ? x.product.substring(0, 25) + '...' : x.product),
                datasets: [{
                    data: r.map(x => x.total),
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                        '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1'
                    ]
                }]
            };
        });

        this.svc.getSalesByCustomer().subscribe(r => {
            this.salesByCustomer = r;
            this.salesCustomerData = {
                labels: r.map(x => x.customer),
                datasets: [{
                    data: r.map(x => x.total),
                    backgroundColor: [
                        '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
                        '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1'
                    ]
                }]
            };
        });

        this.svc.getRecentActivity().subscribe(r => this.recentActivity = r);
    }

    formatCurrency(val: number): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
}

