import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CAJERO' | 'VENDEDOR' | 'OPERATOR';
}

interface LoginData {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'inv_token';
  private readonly USER_KEY  = 'inv_user';

  private readonly userSignal = signal<AuthUser | null>(this.loadUser());
  private readonly authSignal = computed(() => !!this.userSignal());
  readonly isVendedorSignal = computed(() => this.userSignal()?.role === 'VENDEDOR');

  constructor(private readonly http: HttpClient) {}

  isAuthenticated() {
    return this.authSignal;
  }

  getCurrentUser() {
    return this.userSignal.asReadonly();
  }

  isVendedor() {
    return this.isVendedorSignal();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(email: string, password: string) {
    return this.http
      .post<ApiResponse<LoginData>>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.data.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
          this.userSignal.set(res.data.user);
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
  }

  private loadUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
