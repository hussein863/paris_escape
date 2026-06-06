import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Favorite, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly api = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  list(): Observable<PaginatedResponse<Favorite>> {
    return this.http.get<PaginatedResponse<Favorite>>(`${this.api}/`);
  }

  add(experienceId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.api}/`, { experience: experienceId });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}/`);
  }
}
