import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface InvoiceLineDto {
  invoiceLineID?: number;
  invoiceID?: number;
  stockItemID: number;
  stockItemName?: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  taxRate?: number;
  taxAmount?: number;
  lineTotal?: number;
  lineTotalWithTax?: number;
}

export interface InvoiceDto {
  invoiceID?: number;
  customerID: number;
  customerName?: string;
  billToCustomerID?: number;
  billToCustomerName?: string;
  orderID?: number;
  invoiceDate: string;
  customerPurchaseOrderNumber?: string;
  isCreditNote?: boolean;
  comments?: string;
  deliveryInstructions?: string;
  confirmedDeliveryTime?: string;
  paymentDays?: number;
  totalAmount?: number;
  totalTax?: number;
  totalWithTax?: number;
  paymentStatus?: string;
  outstandingBalance?: number;
  invoiceLines?: InvoiceLineDto[];
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private baseUrl = '/api/Invoices';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAll(): Observable<InvoiceDto[]> {
    const url = this.baseUrl;
    return this.http.get<InvoiceDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<InvoiceDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<InvoiceDto>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getByCustomer(customerId: number): Observable<InvoiceDto[]> {
    const url = `${this.baseUrl}/customer/${customerId}`;
    return this.http.get<InvoiceDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<InvoiceDto>): Observable<InvoiceDto> {
    const url = this.baseUrl;
    return this.http.post<InvoiceDto>(url, payload, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<InvoiceDto>): Observable<InvoiceDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<InvoiceDto>(url, payload, { headers: this.headers }).pipe(
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
