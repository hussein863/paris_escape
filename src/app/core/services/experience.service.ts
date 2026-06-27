import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Experience, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly api = `${environment.apiUrl}/experiences`;

  constructor(private http: HttpClient) {}

  list(params?: { search?: string; ordering?: string; page?: number; available_today?: boolean }): Observable<PaginatedResponse<Experience>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.ordering) httpParams = httpParams.set('ordering', params.ordering);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.available_today) httpParams = httpParams.set('available_today', '1');
    return this.http.get<PaginatedResponse<Experience>>(`${this.api}/`, { params: httpParams });
  }

  get(id: number): Observable<Experience> {
    return this.http.get<Experience>(`${this.api}/${id}/`);
  }

  create(data: Partial<Experience>): Observable<Experience> {
    return this.http.post<Experience>(`${this.api}/`, data);
  }

  update(id: number, data: Partial<Experience>): Observable<Experience> {
    return this.http.patch<Experience>(`${this.api}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}/`);
  }

  duplicate(id: number): Observable<Experience> {
    return this.http.post<Experience>(`${this.api}/${id}/duplicate/`, {});
  }

  recordView(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/record_view/`, {});
  }
}
