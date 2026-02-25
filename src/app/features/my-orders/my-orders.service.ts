import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Order } from '../../models/order.model';

@Injectable({ providedIn: 'root' })
export class MyOrdersService {
    private readonly url = '/api/orders';

    constructor(private http: HttpClient) { }

    getByUser(userId: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.url}/user/${userId}`).pipe(
            tap(data => console.debug('GET orders/user', data.length)),
            catchError(err => this.handleError(err))
        );
    }

    getById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.url}/${id}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    cancel(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    private handleError(err: any) {
        console.error('MyOrdersService error:', err);
        const message = err?.error?.message || err?.message || 'Server error';
        return throwError(() => ({ status: err?.status ?? 0, message }));
    }
}
