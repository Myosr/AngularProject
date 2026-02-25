import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart, AddToCartPayload, UpdateCartPayload } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
    private readonly url = '/api/cart';
    private readonly productsUrl = '/api/products';
    private readonly json = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) { }

    getCart(userId: string): Observable<Cart> {
        return this.http.get<Cart>(`${this.url}/${userId}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    addItem(payload: AddToCartPayload): Observable<Cart> {
        return this.http.post<Cart>(`${this.url}/add`, payload, { headers: this.json }).pipe(
            catchError(err => this.handleError(err))
        );
    }

    updateItem(payload: UpdateCartPayload): Observable<Cart> {
        return this.http.put<Cart>(`${this.url}/update`, payload, { headers: this.json }).pipe(
            catchError(err => this.handleError(err))
        );
    }

    removeItem(userId: string, productId: number): Observable<Cart> {
        return this.http.delete<Cart>(`${this.url}/remove/${userId}/${productId}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    clearCart(userId: string): Observable<Cart> {
        return this.http.delete<Cart>(`${this.url}/clear/${userId}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    checkout(userId: string): Observable<{ message: string; orderId: number }> {
        return this.http.post<{ message: string; orderId: number }>(`${this.url}/checkout/${userId}`, {}).pipe(
            catchError(err => this.handleError(err))
        );
    }

    /** Fetch products catalog for "Add to cart" */
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.productsUrl).pipe(
            catchError(err => this.handleError(err))
        );
    }

    private handleError(err: any) {
        console.error('CartService error:', err);
        const message = err?.error?.message || err?.message || 'Server error';
        return throwError(() => ({ status: err?.status ?? 0, message }));
    }
}
