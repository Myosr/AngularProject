import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface LoginResponse {
    token: string;
    role: 'Admin' | 'User';
}

@Injectable()
export class AuthService {
    private readonly TOKEN_KEY = 'salesdw_token';
    private readonly ROLE_KEY = 'salesdw_role';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<LoginResponse> {
        // Replace with real API call: return this.http.post<LoginResponse>('/api/auth/login', { email, password });
        // For demo create a fake response where admin@example.com => Admin
        const role = email === 'admin@example.com' ? 'Admin' : 'User';
        const resp: LoginResponse = { token: 'FAKE_JWT_TOKEN', role };
        return of(resp).pipe(tap(r => {
            localStorage.setItem(this.TOKEN_KEY, r.token);
            localStorage.setItem(this.ROLE_KEY, r.role);
        }));
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ROLE_KEY);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRole(): 'Admin' | 'User' | null {
        return (localStorage.getItem(this.ROLE_KEY) as 'Admin' | 'User') ?? null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
