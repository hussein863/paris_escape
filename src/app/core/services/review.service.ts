import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewReply, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly api = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  list(params?: { experience?: number; guide?: number; page?: number }): Observable<PaginatedResponse<Review>> {
    let httpParams = new HttpParams();
    if (params?.experience) httpParams = httpParams.set('experience', params.experience.toString());
    if (params?.guide)      httpParams = httpParams.set('guide', params.guide.toString());
    if (params?.page)       httpParams = httpParams.set('page', params.page.toString());
    return this.http.get<PaginatedResponse<Review>>(`${this.api}/`, { params: httpParams });
  }

  create(data: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(`${this.api}/`, data);
  }

  reply(reviewId: number, content: string): Observable<ReviewReply> {
    return this.http.post<ReviewReply>(`${this.api}/replies/`, { review: reviewId, content });
  }

  updateReply(replyId: number, content: string): Observable<ReviewReply> {
    return this.http.patch<ReviewReply>(`${this.api}/replies/${replyId}/`, { content });
  }

  delete(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${reviewId}/`);
  }

  deleteReply(replyId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/replies/${replyId}/`);
  }

  report(data: { report_type: string; experience?: number; guide?: number; reason: string; description: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/reports/`, data);
  }
}
