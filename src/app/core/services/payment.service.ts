import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, Plan, Subscription, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly api = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  listPayments(): Observable<PaginatedResponse<Payment>> {
    return this.http.get<PaginatedResponse<Payment>>(`${this.api}/invoices/`);
  }

  listPayouts(): Observable<PaginatedResponse<any>> {
    return this.http.get<PaginatedResponse<any>>(`${this.api}/payouts/`);
  }

  getBillingInfo(): Observable<PaginatedResponse<any>> {
    return this.http.get<PaginatedResponse<any>>(`${this.api}/billing/`);
  }

  updateBillingInfo(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/billing/${id}/`, data);
  }

  getSubscriptions(): Observable<PaginatedResponse<Subscription>> {
    return this.http.get<PaginatedResponse<Subscription>>(`${this.api}/subscriptions/`);
  }

  getPlans(): Observable<PaginatedResponse<Plan>> {
    return this.http.get<PaginatedResponse<Plan>>(`${this.api}/plans/`);
  }

  getPaymentMethods(): Observable<PaginatedResponse<any>> {
    return this.http.get<PaginatedResponse<any>>(`${this.api}/cards/`);
  }
}
