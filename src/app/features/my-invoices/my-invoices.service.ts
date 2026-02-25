import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserInvoice } from '../../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class MyInvoicesService {
    private readonly url = '/api/invoices';

    constructor(private http: HttpClient) { }

    getByUser(userId: string): Observable<UserInvoice[]> {
        return this.http.get<UserInvoice[]>(`${this.url}/user/${userId}`).pipe(
            tap(data => console.debug('GET invoices/user', data.length)),
            catchError(err => this.handleError(err))
        );
    }

    getById(id: number): Observable<UserInvoice> {
        return this.http.get<UserInvoice>(`${this.url}/${id}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    private handleError(err: any) {
        console.error('MyInvoicesService error:', err);
        const message = err?.error?.message || err?.message || 'Server error';
        return throwError(() => ({ status: err?.status ?? 0, message }));
    }
}
