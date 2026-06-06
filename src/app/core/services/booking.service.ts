import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly api = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  list(): Observable<PaginatedResponse<Booking>> {
    return this.http.get<PaginatedResponse<Booking>>(`${this.api}/`);
  }

  get(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.api}/${id}/`);
  }

  create(data: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(`${this.api}/`, data);
  }

  update(id: number, data: Partial<Booking>): Observable<Booking> {
    return this.http.patch<Booking>(`${this.api}/${id}/`, data);
  }

  cancel(id: number): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${this.api}/${id}/cancel/`, {});
  }

  createDetail(data: {
    booking: number; first_name: string; last_name: string; email: string;
    phone_code: string; phone_number: string; country: string;
    special_requests: string; accept_terms: boolean; receive_updates: boolean;
  }): Observable<any> {
    return this.http.post<any>(`${this.api}/details/`, data);
  }
}
