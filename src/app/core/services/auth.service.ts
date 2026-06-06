import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly user$ = new Subject<User | null>();  // observable stream for currency service etc.
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isGuide = computed(() => this._user()?.role === 'Guide');
  readonly isAdmin = computed(() => this._user()?.role === 'Admin');
  readonly isCustomer = computed(() => this._user()?.role === 'Customer');

  constructor(private http: HttpClient) {
    if (this.isBrowser) {
      const stored = localStorage.getItem('user');
      if (stored) this._user.set(JSON.parse(stored));
    }
  }

  // login() now completes only AFTER loadMe() finishes — callers can safely read user() in .next()
  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthTokens>(`${this.api}/token/`, { email, password }).pipe(
      tap(tokens => {
        if (this.isBrowser) {
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
        }
      }),
      switchMap(() => this.loadMe())
    );
  }

  register(data: { email: string; name: string; password: string; password2: string; role: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/users/register/`, data);
  }

  loadMe(): Observable<User> {
    return this.http.get<User>(`${this.api}/users/me/`).pipe(
      tap(user => {
        this._user.set(user);
        this.user$.next(user);
        if (this.isBrowser) localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    this._user.set(null);
  }

  getAccessToken(): string | null {
    return this.isBrowser ? localStorage.getItem('access_token') : null;
  }
}
