import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppNotification } from '../../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private readonly url = '/api/notifications';

    constructor(private http: HttpClient) { }

    getAll(userId: string): Observable<AppNotification[]> {
        return this.http.get<AppNotification[]>(`${this.url}/user/${userId}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    getUnreadCount(userId: string): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.url}/unread-count/${userId}`).pipe(
            catchError(err => this.handleError(err))
        );
    }

    markRead(id: string, userId: string): Observable<any> {
        return this.http.put(`${this.url}/mark-read/${id}?userId=${userId}`, {}).pipe(
            catchError(err => this.handleError(err))
        );
    }

    markAllRead(userId: string): Observable<any> {
        return this.http.put(`${this.url}/mark-all-read/${userId}`, {}).pipe(
            catchError(err => this.handleError(err))
        );
    }

    private handleError(err: any) {
        console.error('NotificationsService error:', err);
        const message = err?.error?.message || err?.message || 'Server error';
        return throwError(() => ({ status: err?.status ?? 0, message }));
    }
}
