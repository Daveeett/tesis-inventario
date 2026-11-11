import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/** Attaches JWT token to every outgoing request */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const api = new URL(environment.apiBaseUrl, window.location.origin);
  const target = new URL(req.url, window.location.origin);
  if (!token || target.origin !== api.origin || !(target.pathname === api.pathname || target.pathname.startsWith(api.pathname.replace(/\/$/, '') + '/'))) return next(req);

  return next(
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
  );
};
