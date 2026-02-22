import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable()
export class ProductService {
    private readonly url = '/api/products';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.url);
    }

    create(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(this.url, product);
    }

    update(id: string, product: Partial<Product>): Observable<Product> {
        return this.http.put<Product>(`${this.url}/${id}`, product);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
