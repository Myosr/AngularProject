import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
    private base = '/api/dashboard';
    constructor(private http: HttpClient) { }

    getSummary(): Observable<any> {
        return this.http.get<any>(`${this.base}/summary`);
    }

    getSalesByMonth(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/sales-by-month`);
    }

    getSalesByProduct(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/sales-by-product`);
    }

    getSalesByCustomer(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/sales-by-customer`);
    }

    getRecentActivity(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/recent-activity`);
    }
}
