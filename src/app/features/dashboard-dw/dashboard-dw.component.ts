import { Component, OnInit } from '@angular/core';
import {
    DashboardDwService,
    DwFilters,
    DwKpis,
    DwSalesByProduct,
    DwSalesByCustomer,
    DwSalesByDate,
    DwSalesByTerritory,
    DwSalesByGeography,
    DwFilterOptions
} from './dashboard-dw.service';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-dashboard-dw',
    templateUrl: './dashboard-dw.component.html',
    styleUrls: ['./dashboard-dw.component.scss']
})
export class DashboardDwComponent implements OnInit {
    loading = true;
    errorMsg = '';

    /* ── Filters ── */
    filters: DwFilters = {};
    granularity: 'monthly' | 'yearly' = 'monthly';
    filterOptions: DwFilterOptions = { products: [], territories: [] };

    /* ── KPIs ── */
    kpis: DwKpis = { totalRevenue: 0, totalProfit: 0, totalQuantity: 0, invoiceCount: 0, customerCount: 0, productCount: 0 };

    kpiCards = [
        { title: 'Total Revenue', key: 'totalRevenue', icon: 'payments', color: '#10b981', format: 'currency' },
        { title: 'Total Profit', key: 'totalProfit', icon: 'trending_up', color: '#3b82f6', format: 'currency' },
        { title: 'Invoices', key: 'invoiceCount', icon: 'receipt_long', color: '#f59e0b', format: 'number' },
        { title: 'Customers', key: 'customerCount', icon: 'people', color: '#8b5cf6', format: 'number' },
        { title: 'Products Sold', key: 'productCount', icon: 'inventory_2', color: '#06b6d4', format: 'number' },
        { title: 'Units Sold', key: 'totalQuantity', icon: 'local_shipping', color: '#ec4899', format: 'number' },
    ];

    /* ── Raw data ── */
    salesByProduct: DwSalesByProduct[] = [];
    salesByCustomer: DwSalesByCustomer[] = [];
    salesByDate: DwSalesByDate[] = [];
    salesByTerritory: DwSalesByTerritory[] = [];
    salesByGeography: DwSalesByGeography[] = [];

    /* ── Chart configs ── */
    // Sales by Date (bar + line combo)
    dateChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    dateChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: $${(+ctx.raw! / 1e6).toFixed(2)}M`
                }
            }
        },
        scales: {
            y: { beginAtZero: true, ticks: { callback: (v) => '$' + (+v / 1e6).toFixed(1) + 'M' } }
        }
    };

    // Sales by Product (horizontal bar)
    productChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    productChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `Revenue: $${(+ctx.raw!).toLocaleString()}`
                }
            }
        },
        scales: {
            x: { beginAtZero: true, ticks: { callback: (v) => '$' + (+v / 1e6).toFixed(1) + 'M' } }
        }
    };

    // Sales by Customer (horizontal bar)
    customerChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    customerChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `Revenue: $${(+ctx.raw!).toLocaleString()}`
                }
            }
        },
        scales: {
            x: { beginAtZero: true, ticks: { callback: (v) => '$' + (+v / 1e6).toFixed(1) + 'M' } }
        }
    };

    // Sales by Territory (doughnut)
    territoryChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
    territoryChartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: $${(+ctx.raw! / 1e6).toFixed(2)}M`
                }
            }
        }
    };

    private readonly palette = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1',
        '#84cc16', '#a855f7', '#0ea5e9', '#d946ef', '#facc15'
    ];

    constructor(private svc: DashboardDwService) { }

    ngOnInit(): void {
        this.svc.getFilterOptions().subscribe({
            next: opts => this.filterOptions = opts,
            error: () => { }
        });
        this.loadData();
    }

    applyFilters(): void {
        this.loadData();
    }

    resetFilters(): void {
        this.filters = {};
        this.granularity = 'monthly';
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.errorMsg = '';
        let pending = 5;
        const done = () => { if (--pending <= 0) this.loading = false; };

        // KPIs
        this.svc.getKpis(this.filters).subscribe({
            next: k => this.kpis = k,
            error: e => { this.errorMsg = e?.error?.message ?? 'Error loading KPIs'; done(); },
            complete: done
        });

        // Sales by Date
        this.svc.getSalesByDate(this.filters, this.granularity).subscribe({
            next: data => {
                this.salesByDate = data;
                this.dateChartData = {
                    labels: data.map(d => d.period),
                    datasets: [
                        { data: data.map(d => d.revenue), label: 'Revenue', backgroundColor: '#3b82f6', borderRadius: 4 },
                        { data: data.map(d => d.profit), label: 'Profit', backgroundColor: '#10b981', borderRadius: 4 }
                    ]
                };
            },
            error: () => done(),
            complete: done
        });

        // Sales by Product
        this.svc.getSalesByProduct(this.filters).subscribe({
            next: data => {
                this.salesByProduct = data;
                this.productChartData = {
                    labels: data.map(d => d.product.length > 30 ? d.product.substring(0, 30) + '…' : d.product),
                    datasets: [{
                        data: data.map(d => d.revenue),
                        backgroundColor: this.palette.slice(0, data.length),
                        label: 'Revenue',
                        borderRadius: 4
                    }]
                };
            },
            error: () => done(),
            complete: done
        });

        // Sales by Customer
        this.svc.getSalesByCustomer(this.filters).subscribe({
            next: data => {
                this.salesByCustomer = data;
                this.customerChartData = {
                    labels: data.map(d => d.customer.length > 30 ? d.customer.substring(0, 30) + '…' : d.customer),
                    datasets: [{
                        data: data.map(d => d.revenue),
                        backgroundColor: this.palette.slice(0, data.length),
                        label: 'Revenue',
                        borderRadius: 4
                    }]
                };
            },
            error: () => done(),
            complete: done
        });

        // Sales by Territory
        this.svc.getSalesByTerritory(this.filters).subscribe({
            next: data => {
                this.salesByTerritory = data;
                this.territoryChartData = {
                    labels: data.map(d => d.territory),
                    datasets: [{
                        data: data.map(d => d.revenue),
                        backgroundColor: this.palette.slice(0, data.length)
                    }]
                };
                // Also load detail geography table
                this.svc.getSalesByGeography(this.filters).subscribe({
                    next: geo => this.salesByGeography = geo,
                    error: () => { }
                });
            },
            error: () => done(),
            complete: done
        });
    }

    getKpiValue(key: string): number {
        return (this.kpis as any)[key] ?? 0;
    }

    formatCurrency(val: number): string {
        if (val >= 1e9) return '$' + (val / 1e9).toFixed(2) + 'B';
        if (val >= 1e6) return '$' + (val / 1e6).toFixed(2) + 'M';
        if (val >= 1e3) return '$' + (val / 1e3).toFixed(1) + 'K';
        return '$' + val.toFixed(2);
    }

    formatNumber(val: number): string {
        return val.toLocaleString('en-US');
    }
}
