import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface StockItemDto {
  stockItemID?: number;
  stockItemName: string;
  supplierID?: number;
  supplierName?: string;
  colorID?: number;
  colorName?: string;
  brand?: string;
  size?: string;
  unitPackageID?: number;
  outerPackageID?: number;
  unitPrice?: number;
  recommendedRetailPrice?: number;
  typicalWeightPerUnit?: number;
  barcode?: string;
  taxRate?: number;
  quantityOnHand?: number;
  reorderLevel?: number;
  targetStockLevel?: number;
  isChillerStock?: boolean;
  searchDetails?: string;
}

export interface StockCorrectionDto {
  stockItemID: number;
  newQuantity: number;
  reason: string;
}

export interface UpdateStockLevelDto {
  newQuantity: number;
}

export interface StockMovementDto {
  movementID?: number;
  stockItemID?: number;
  date?: string;
  quantity?: number;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private baseUrl = 'https://localhost:7182/api/Stock';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getAll(): Observable<StockItemDto[]> {
    const url = this.baseUrl;
    return this.http.get<StockItemDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<StockItemDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<StockItemDto>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<StockItemDto>): Observable<StockItemDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<StockItemDto>(url, payload, { headers: this.headers }).pipe(
      tap(() => console.log(`PUT ${url}`)),
      catchError(this.handleError)
    );
  }

  addProducts(payload: Partial<StockItemDto>[]): Observable<StockItemDto[]> {
    const url = `${this.baseUrl}/products`;
    return this.http.post<StockItemDto[]>(url, payload, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<void> {
    const url = `${this.baseUrl}/products/${id}`;
    return this.http.delete<void>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`DELETE ${url}`)),
      catchError(this.handleError)
    );
  }

  updateLevels(id: number, dto: UpdateStockLevelDto): Observable<void> {
    const url = `${this.baseUrl}/${id}/levels`;
    return this.http.put<void>(url, dto, { headers: this.headers }).pipe(
      tap(() => console.log(`PUT ${url}`)),
      catchError(this.handleError)
    );
  }

  correctStock(id: number, dto: StockCorrectionDto): Observable<void> {
    const url = `${this.baseUrl}/${id}/correct`;
    return this.http.post<void>(url, dto, { headers: this.headers }).pipe(
      tap(() => console.log(`POST ${url}`)),
      catchError(this.handleError)
    );
  }

  getMovements(id: number): Observable<StockMovementDto[]> {
    const url = `${this.baseUrl}/${id}/movements`;
    return this.http.get<StockMovementDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  getAllMovements(): Observable<StockMovementDto[]> {
    const url = `${this.baseUrl}/movements`;
    return this.http.get<StockMovementDto[]>(url, { headers: this.headers }).pipe(
      tap(() => console.log(`GET ${url}`)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    const message = error.error?.detail || error.message || 'Unknown error';
    return throwError(() => ({ status: error.status, message }));
  }
}
