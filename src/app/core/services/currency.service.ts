import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private rates: Record<string, number> = {
    'EUR': 1.0,
    'USD': 1.10,
    'GBP': 0.86,
    'JPY': 165.0,
    'AUD': 1.65,
    'CAD': 1.47,
    'CHF': 0.93,
    'CNY': 7.85,
    'INR': 91.5,
    'MXN': 17.5,
  };

  private currentCurrency$ = new BehaviorSubject<string>('EUR');

  constructor(private auth: AuthService) {
    // Seed from already-loaded user
    const current = this.auth.user();
    if (current?.currency) this.currentCurrency$.next(current.currency);
    // React to future loadMe() calls
    this.auth.user$.subscribe(user => {
      if (user?.currency) this.currentCurrency$.next(user.currency);
    });
  }

  getCurrentCurrency(): Observable<string> {
    return this.currentCurrency$.asObservable();
  }

  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;
    const eurAmount = amount / (this.rates[fromCurrency] || 1);
    return eurAmount * (this.rates[toCurrency] || 1);
  }

  format(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  }

  getSymbol(currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(0).replace(/[0-9]/g, '').trim().split('')[0] || currency;
  }
}
