import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DwFilters {
    dateFrom?: string;
    dateTo?: string;
    productId?: number | null;
    territory?: string;
}

export interface DwKpis {
    totalRevenue: number;
    totalProfit: number;
    totalQuantity: number;
    invoiceCount: number;
    customerCount: number;
    productCount: number;
}

export interface DwSalesByProduct {
    product: string;
    revenue: number;
    profit: number;
    qty: number;
}

export interface DwSalesByCustomer {
    customer: string;
    revenue: number;
    profit: number;
    qty: number;
}

export interface DwSalesByDate {
    period: string;
    revenue: number;
    profit: number;
}

export interface DwSalesByGeography {
    territory: string;
    state: string;
    revenue: number;
    profit: number;
    invoiceCount: number;
}

export interface DwSalesByTerritory {
    territory: string;
    revenue: number;
    profit: number;
    invoiceCount: number;
}

export interface DwFilterOptions {
    products: { id: number; name: string }[];
    territories: string[];
}

@Injectable()
export class DashboardDwService {
    private readonly base = '/api/dashboard-dw';

    constructor(private http: HttpClient) { }

    private buildParams(filters: DwFilters, extra?: Record<string, string>): HttpParams {
        let p = new HttpParams();
        if (filters.dateFrom) p = p.set('dateFrom', filters.dateFrom);
        if (filters.dateTo) p = p.set('dateTo', filters.dateTo);
        if (filters.productId) p = p.set('productId', filters.productId.toString());
        if (filters.territory) p = p.set('territory', filters.territory);
        if (extra) {
            for (const [k, v] of Object.entries(extra)) p = p.set(k, v);
        }
        return p;
    }

    getKpis(f: DwFilters): Observable<DwKpis> {
        return this.http.get<DwKpis>(`${this.base}/kpis`, { params: this.buildParams(f) });
    }

    getSalesByProduct(f: DwFilters): Observable<DwSalesByProduct[]> {
        return this.http.get<DwSalesByProduct[]>(`${this.base}/sales-by-product`, { params: this.buildParams(f) });
    }

    getSalesByCustomer(f: DwFilters): Observable<DwSalesByCustomer[]> {
        return this.http.get<DwSalesByCustomer[]>(`${this.base}/sales-by-customer`, { params: this.buildParams(f) });
    }

    getSalesByDate(f: DwFilters, granularity: 'monthly' | 'yearly' = 'monthly'): Observable<DwSalesByDate[]> {
        return this.http.get<DwSalesByDate[]>(`${this.base}/sales-by-date`, {
            params: this.buildParams(f, { granularity })
        });
    }

    getSalesByGeography(f: DwFilters): Observable<DwSalesByGeography[]> {
        return this.http.get<DwSalesByGeography[]>(`${this.base}/sales-by-geography`, { params: this.buildParams(f) });
    }

    getSalesByTerritory(f: DwFilters): Observable<DwSalesByTerritory[]> {
        return this.http.get<DwSalesByTerritory[]>(`${this.base}/sales-by-territory`, { params: this.buildParams(f) });
    }

    getFilterOptions(): Observable<DwFilterOptions> {
        return this.http.get<DwFilterOptions>(`${this.base}/filter-options`);
    }
}
