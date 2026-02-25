import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface PurchaseOrderLineDto {
  purchaseOrderLineID?: number;
  purchaseOrderID?: number;
  stockItemID?: number;
  stockItemName?: string;
  description?: string;
  orderedOuters?: number;
  receivedOuters?: number;
  expectedUnitPricePerOuter?: number;
  lastReceiptDate?: string;
  isOrderLineFinalized?: boolean;
  lineTotal?: number;
}

export interface PurchaseOrderDto {
  purchaseOrderID?: number;
  supplierID: number;
  supplierName?: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  supplierReference?: string;
  isOrderFinalized?: boolean;
  comments?: string;
  internalComments?: string;
  totalAmount?: number;
  status?: string;
  isApproved?: boolean;
  goodsReceivedDate?: string;
  purchaseOrderLines?: PurchaseOrderLineDto[];
}

export interface ConfirmArrivalDto {
  receivedDate?: string;
}

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
  private baseUrl = 'https://localhost:7182/api/PurchaseOrders';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getAll(): Observable<PurchaseOrderDto[]> {
    const url = this.baseUrl;
    return this.http.get<PurchaseOrderDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<PurchaseOrderDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<PurchaseOrderDto>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<PurchaseOrderDto>): Observable<PurchaseOrderDto> {
    const url = this.baseUrl;
    return this.http.post<PurchaseOrderDto>(url, payload, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<PurchaseOrderDto>): Observable<PurchaseOrderDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<PurchaseOrderDto>(url, payload, { headers: this.headers }).pipe(
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

  approve(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}/approve`;
    return this.http.post<void>(url, null, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  confirmArrival(id: number, dto: ConfirmArrivalDto): Observable<void> {
    const url = `${this.baseUrl}/${id}/confirm-arrival`;
    return this.http.post<void>(url, dto, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    const message = error.error?.detail || error.message || 'Unknown error';
    return throwError(() => ({ status: error.status, message }));
  }
}
