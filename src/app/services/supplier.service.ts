import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface SupplierDto {
  supplierID?: number;
  supplierName: string;
  supplierCategory?: string;
  phoneNumber?: string;
  faxNumber?: string;
  websiteURL?: string;
  deliveryAddress: string;
  deliveryAddressLine2?: string;
  city: string;
  country?: string;
  postalCode?: string;
  paymentDays?: number;
  supplierReference?: string;
  bankAccountName?: string;
  bankAccountBranch?: string;
  bankAccountCode?: string;
  bankAccountNumber?: string;
  bankInternationalCode?: string;
  internalComments?: string;
  totalPurchaseOrders?: number;
  totalPurchaseAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private baseUrl = 'https://localhost:7182/api/Suppliers';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAll(): Observable<SupplierDto[]> {
    const url = this.baseUrl;
    return this.http.get<SupplierDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<SupplierDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<SupplierDto>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<SupplierDto>): Observable<SupplierDto> {
    const url = this.baseUrl;
    return this.http.post<SupplierDto>(url, payload, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<SupplierDto>): Observable<SupplierDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<SupplierDto>(url, payload, { headers: this.headers }).pipe(
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
