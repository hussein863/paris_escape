import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GuideProfile {
  id: number;
  pronouns: string;
  headline: string;
  bio: string;
  cover_image: string | null;
  cover_image_url: string | null;
  years_of_experience: number;
  is_verified: boolean;
  is_original: boolean;
  rating: number;
  review_count: number;
  // Business
  company_name: string;
  siret: string;
  vat_number: string;
  public_email: string;
  show_email_on_profile: boolean;
  public_phone: string;
  show_phone_on_profile: boolean;
  // Location
  base_city: string;
  neighborhood: string;
  // Social
  instagram: string;
  show_instagram: boolean;
  tiktok: string;
  show_tiktok: boolean;
  youtube: string;
  show_youtube: boolean;
  website: string;
  show_website: boolean;
  // Availability
  working_days: Record<string, boolean>;
  availability_start_time: string;
  availability_end_time: string;
  timezone: string;
  // Pricing
  base_rate: number;
  private_rate: number;
  min_group_size: number;
  max_group_size: number;
  child_pricing: string;
  default_currency: string;
  // Policies
  cancellation_window: string;
  late_policy_notes: string;
  safety_notes: string;
  unique_description: string;
  // Nested
  languages: { id: number; name: string; level: string }[];
  specialties: { id: number; name: string }[];
  meeting_points: { id: number; name: string; address: string; is_default: boolean }[];
  gallery_photos: { id: number; image_url: string; ordering: number }[];
}

@Injectable({ providedIn: 'root' })
export class GuideProfileService {
  private readonly api = `${environment.apiUrl}/users`;
  private _profile$ = new BehaviorSubject<GuideProfile | null>(null);
  readonly profile$ = this._profile$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<GuideProfile> {
    return this.http.get<GuideProfile>(`${this.api}/guide-profile/`).pipe(
      tap(p => this._profile$.next(p))
    );
  }

  patch(data: Partial<GuideProfile>): Observable<GuideProfile> {
    return this.http.patch<GuideProfile>(`${this.api}/guide-profile/`, data).pipe(
      tap(p => this._profile$.next(p))
    );
  }

  uploadCover(file: File): Observable<GuideProfile> {
    const fd = new FormData();
    fd.append('cover', file);
    return this.http.post<GuideProfile>(`${this.api}/guide-profile/cover/`, fd).pipe(
      tap(p => this._profile$.next(p))
    );
  }

  uploadGalleryPhoto(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('photo', file);
    return this.http.post<any>(`${this.api}/guide-profile/gallery/`, fd);
  }

  deleteGalleryPhoto(id: number): Observable<any> {
    return this.http.delete(`${this.api}/guide-profile/gallery/${id}/`);
  }

  addLanguage(name: string, level: string): Observable<any> {
    return this.http.post(`${this.api}/guide-profile/languages/`, { name, level });
  }

  removeLanguage(id: number): Observable<any> {
    return this.http.delete(`${this.api}/guide-profile/languages/${id}/`);
  }

  addSpecialty(name: string): Observable<any> {
    return this.http.post(`${this.api}/guide-profile/specialties/`, { name });
  }

  removeSpecialty(id: number): Observable<any> {
    return this.http.delete(`${this.api}/guide-profile/specialties/${id}/`);
  }

  addMeetingPoint(data: { name: string; address: string; is_default: boolean }): Observable<any> {
    return this.http.post(`${this.api}/guide-profile/meeting-points/`, data);
  }

  deleteMeetingPoint(id: number): Observable<any> {
    return this.http.delete(`${this.api}/guide-profile/meeting-points/${id}/`);
  }

  setDefaultMeetingPoint(id: number): Observable<any> {
    return this.http.patch(`${this.api}/guide-profile/meeting-points/${id}/`, { is_default: true });
  }
}
