import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private readonly url = '/api/products';
    private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) { }

    private handleError(err: any) {
        console.error('ProductService error:', err);
        const raw = err?.error?.message || err?.message || 'Server error';
        const message = this.friendlyMessage(raw, err?.status);
        return throwError(() => ({ status: err?.status ?? 0, message }));
    }

    /** Convert raw backend messages to user-friendly English text. */
    private friendlyMessage(raw: string, status?: number): string {
        const lower = raw.toLowerCase();
        if (lower.includes('unique') || lower.includes('duplicate') || lower.includes('dupliquée')) {
            return 'A product with this name already exists. Please use a different name.';
        }
        if (lower.includes('validation') || status === 422) {
            return 'Please check the form fields and try again.';
        }
        if (status === 400) {
            return raw.startsWith('Erreur') || raw.startsWith('Error')
                ? 'Failed to save the product. Please verify your data.'
                : raw;
        }
        if (status === 404) {
            return 'Product not found. It may have been deleted.';
        }
        return raw;
    }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.url).pipe(
            tap(() => console.debug('GET', this.url)),
            catchError(err => this.handleError(err))
        );
    }

    create(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(this.url, product, { headers: this.jsonHeaders }).pipe(
            tap(res => console.debug('POST', this.url, res)),
            catchError(err => this.handleError(err))
        );
    }

    update(id: string, product: Partial<Product>): Observable<Product> {
        const endpoint = `${this.url}/${id}`;
        return this.http.put<Product>(endpoint, product, { headers: this.jsonHeaders }).pipe(
            tap(res => console.debug('PUT', endpoint, res)),
            catchError(err => this.handleError(err))
        );
    }

    delete(id: string): Observable<void> {
        const endpoint = `${this.url}/${id}`;
        return this.http.delete<void>(endpoint).pipe(
            tap(() => console.debug('DELETE', endpoint)),
            catchError(err => this.handleError(err))
        );
    }
}
