import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customer.model';

@Injectable()
export class CustomerService {
    private readonly url = '/api/customers';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.url);
    }

    getById(id: string): Observable<Customer> {
        return this.http.get<Customer>(`${this.url}/${id}`);
    }

    create(customer: Partial<Customer>): Observable<Customer> {
        return this.http.post<Customer>(this.url, customer);
    }

    update(id: string, customer: Partial<Customer>): Observable<Customer> {
        return this.http.put<Customer>(`${this.url}/${id}`, customer);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
