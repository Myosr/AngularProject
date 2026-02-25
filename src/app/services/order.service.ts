import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface OrderLineDto {
  orderLineID?: number;
  orderID?: number;
  stockItemID: number;
  stockItemName?: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  taxRate?: number;
  pickedQuantity?: number;
  lineTotal?: number;
}

export interface OrderDto {
  orderID?: number;
  customerID: number;
  customerName?: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  customerPurchaseOrderNumber?: string;
  contactPersonID?: number;
  contactPersonName?: string;
  salespersonPersonID?: number;
  salespersonName?: string;
  isUndersupplyBackordered?: boolean;
  comments?: string;
  deliveryInstructions?: string;
  totalAmount?: number;
  status?: string;
  orderLines?: OrderLineDto[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'https://localhost:7182/api/Orders';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAll(): Observable<OrderDto[]> {
    const url = this.baseUrl;
    return this.http.get<OrderDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<OrderDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<OrderDto>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getByCustomer(customerId: number): Observable<OrderDto[]> {
    const url = `${this.baseUrl}/customer/${customerId}`;
    return this.http.get<OrderDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<OrderDto>): Observable<OrderDto> {
    const url = this.baseUrl;
    return this.http.post<OrderDto>(url, payload, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<OrderDto>): Observable<OrderDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<OrderDto>(url, payload, { headers: this.headers }).pipe(
      tap(() => console.log(`PUT ${url}`)),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`DELETE ${url}`)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    const message = error.error?.detail || error.message || 'Unknown error';
    return throwError(() => ({ status: error.status, message }));
  }
}
