import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface PlanFeatures {
  plan_name: string;
  plan_slug: string;
  max_experiences: number | null;
  max_images_per_experience: number | null;
  max_contacts: number | null;
  max_bookings: number | null;
  has_analytics: boolean;
  has_priority_search: boolean;
  has_verified_badge: boolean;
  video_content: boolean;
  has_3d_visit: boolean;
  top_listing_days: number | null;
  business_card: boolean;
}

const STARTER_DEFAULTS: PlanFeatures = {
  plan_name: 'Starter',
  plan_slug: 'free',
  max_experiences: 2,
  max_images_per_experience: 5,
  max_contacts: 15,
  max_bookings: 10,
  has_analytics: false,
  has_priority_search: false,
  has_verified_badge: false,
  video_content: false,
  has_3d_visit: false,
  top_listing_days: null,
  business_card: false,
};

@Injectable({ providedIn: 'root' })
export class PlanFeaturesService {
  private _features$ = new BehaviorSubject<PlanFeatures>(STARTER_DEFAULTS);
  readonly features$ = this._features$.asObservable();

  constructor(private http: HttpClient) {}

  get snapshot(): PlanFeatures { return this._features$.value; }

  load(): Observable<PlanFeatures> {
    return this.http.get<PlanFeatures>(`${environment.apiUrl}/users/guides/plan-features/`).pipe(
      tap(f => this._features$.next(f))
    );
  }
}
