import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// Backend DTO shape
export interface CustomerDto {
    customerID: number;
    customerName: string;
    customerCategory?: string;
    phoneNumber?: string;
    email?: string;
    deliveryAddress?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    creditLimit?: number;
    paymentDays?: number;
    isOnCreditHold?: boolean;
    isActive?: boolean;
    accountOpenedDate?: string;
    outstandingBalance?: number;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
    private readonly url = '/api/Customers';
    private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) { }

    private handleError(err: any) {
        console.error('CustomerService error:', err);
        const raw = err?.error?.message || err?.message || 'Server error';
        const message = this.friendlyMessage(raw, err?.status);
        return throwError(() => ({ status: err?.status ?? 0, message }));
    }

    /** Convert raw backend messages to user-friendly English text. */
    private friendlyMessage(raw: string, status?: number): string {
        const lower = raw.toLowerCase();
        if (lower.includes('unique key') || lower.includes('clé dupliquée') || lower.includes('duplicate key')) {
            // Extract the duplicate value if present: e.g. "(maissaaa)"
            const match = raw.match(/\(([^)]+)\)\s*\.?\s*$/);
            const name = match ? match[1] : '';
            return name
                ? `A customer named "${name}" already exists. Please use a different name.`
                : 'A customer with this name already exists. Please use a different name.';
        }
        if (lower.includes('validation') || status === 422) {
            return 'Please check the form fields and try again.';
        }
        if (status === 400) {
            return raw.startsWith('Erreur') ? 'Failed to save the customer. Please verify your data.' : raw;
        }
        if (status === 404) {
            return 'Customer not found. It may have been deleted.';
        }
        return raw;
    }

    getAll(): Observable<CustomerDto[]> {
        return this.http.get<CustomerDto[]>(this.url).pipe(
            tap(() => console.debug('GET', this.url)),
            catchError(err => this.handleError(err))
        );
    }

    getById(id: number): Observable<CustomerDto> {
        const endpoint = `${this.url}/${id}`;
        return this.http.get<CustomerDto>(endpoint).pipe(
            tap(() => console.debug('GET', endpoint)),
            catchError(err => this.handleError(err))
        );
    }

    create(customer: Partial<CustomerDto>): Observable<CustomerDto> {
        // Assume customer is already mapped from form value
        return this.http.post<CustomerDto>(this.url, customer, { headers: this.jsonHeaders }).pipe(
            tap(res => console.debug('POST', this.url, res)),
            catchError(err => this.handleError(err))
        );
    }

    update(id: number, customer: Partial<CustomerDto>): Observable<CustomerDto> {
        const endpoint = `${this.url}/${id}`;
        return this.http.put<CustomerDto>(endpoint, customer, { headers: this.jsonHeaders }).pipe(
            tap(res => console.debug('PUT', endpoint, res)),
            catchError(err => this.handleError(err))
        );
    }

    delete(id: number): Observable<void> {
        const endpoint = `${this.url}/${id}`;
        return this.http.delete<void>(endpoint).pipe(
            tap(() => console.debug('DELETE', endpoint)),
            catchError(err => this.handleError(err))
        );
    }
}
