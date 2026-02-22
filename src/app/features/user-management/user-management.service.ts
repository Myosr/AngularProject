import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable()
export class UserManagementService {
    private readonly url = '/api/users';

    constructor(private http: HttpClient) { }

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }

    create(user: Partial<User> & { password: string }): Observable<User> {
        return this.http.post<User>(this.url, user);
    }

    update(uid: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.url}/${uid}`, user);
    }

    delete(uid: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${uid}`);
    }
}
