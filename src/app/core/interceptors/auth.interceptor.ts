import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

// Prevent multiple simultaneous refresh calls
let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const http = inject(HttpClient);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const token = authService.getAccessToken();

  // Skip adding auth header for the token endpoints themselves
  const isAuthEndpoint = req.url.includes('/api/token/');
  const authReq = (token && !isAuthEndpoint)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthEndpoint || !isBrowser) {
        return throwError(() => error);
      }

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken || isRefreshing) {
        authService.logout();
        router.navigate(['/landing']);
        return throwError(() => error);
      }

      isRefreshing = true;

      return http.post<{ access: string; refresh?: string }>(
        `${environment.apiUrl}/token/refresh/`,
        { refresh: refreshToken }
      ).pipe(
        switchMap((tokens) => {
          isRefreshing = false;
          localStorage.setItem('access_token', tokens.access);
          if (tokens.refresh) {
            localStorage.setItem('refresh_token', tokens.refresh);
          }
          // Retry the original request with the new token
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${tokens.access}` }
          });
          return next(retryReq);
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          authService.logout();
          router.navigate(['/landing']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
