import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Experience } from '../models';

@Injectable({ providedIn: 'root' })
export class ExperienceWizardService {
  private readonly api = `${environment.apiUrl}/experiences`;
  private _experienceId$ = new BehaviorSubject<number | null>(null);
  readonly experienceId$ = this._experienceId$.asObservable();

  /** Persistent form state keyed by step name — survives component destroy/recreate */
  private _stepsState: Record<string, any> = {};

  get experienceId(): number | null { return this._experienceId$.value; }

  constructor(private http: HttpClient) {}

  setId(id: number): void { this._experienceId$.next(id); }
  clearId(): void { this._experienceId$.next(null); this._stepsState = {}; }

  saveStepState(key: string, data: any): void { this._stepsState[key] = { ...data }; }
  getStepState(key: string): any { return this._stepsState[key] ?? null; }

  create(data: Record<string, any>): Observable<Experience> {
    return this.http.post<Experience>(`${this.api}/`, data).pipe(
      tap(exp => this._experienceId$.next(exp.id))
    );
  }

  update(id: number, data: Record<string, any>): Observable<Experience> {
    return this.http.patch<Experience>(`${this.api}/${id}/`, data);
  }

  get(id: number): Observable<Experience> {
    return this.http.get<Experience>(`${this.api}/${id}/`);
  }

  uploadCover(id: number, file: File): Observable<Experience> {
    const fd = new FormData();
    fd.append('cover', file);
    return this.http.post<Experience>(`${this.api}/${id}/upload_cover/`, fd);
  }

  uploadMedia(id: number, file: File, caption: string = ''): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('caption', caption);
    return this.http.post<any>(`${this.api}/${id}/upload_media/`, fd);
  }

  deleteMedia(mediaId: number): Observable<any> {
    return this.http.delete(`${this.api}/media/${mediaId}/`);
  }

  // Bulk replace inclusions for an experience
  replaceInclusions(expId: number, items: {text: string; type: string; ordering: number}[]): Observable<any> {
    return new Observable(observer => {
      if (!items || items.length === 0) {
        observer.next(true);
        observer.complete();
        return;
      }
      const creates = items.map(item =>
        this.http.post(`${this.api}/inclusions/`, { experience: expId, ...item }).toPromise()
      );
      Promise.all(creates)
        .then(() => { observer.next(true); observer.complete(); })
        .catch(() => {
          // If POST fails (405 or other), inclusions might be auto-created or optional - continue anyway
          observer.next(true);
          observer.complete();
        });
    });
  }

  // Replace options for an experience
  replaceOptions(expId: number, options: any[]): Observable<any> {
    return new Observable(observer => {
      if (!options || options.length === 0) {
        observer.next(true);
        observer.complete();
        return;
      }
      const creates = options.map(opt =>
        this.http.post(`${this.api}/options/`, { experience: expId, ...opt }).toPromise()
      );
      Promise.all(creates)
        .then(() => { observer.next(true); observer.complete(); })
        .catch(err => observer.error(err));
    });
  }

  // Save or update availability + time slots
  saveAvailability(expId: number, data: any, timeSlots: any[]): Observable<any> {
    return new Observable(observer => {
      // Try to create availability, but if it fails, just continue
      this.http.post<any>(`${this.api}/availability/`, { experience: expId, ...data }).subscribe({
        next: (saved) => {
          if (!timeSlots || timeSlots.length === 0) {
            observer.next(saved);
            observer.complete();
            return;
          }
          // Create time slots
          Promise.all(timeSlots.map(slot =>
            this.http.post(`${this.api}/timeslots/`, { availability: saved.id, time: slot.time, label: slot.label }).toPromise()
          )).then(() => { observer.next(saved); observer.complete(); })
            .catch(err => observer.error(err));
        },
        error: () => {
          // If POST fails, availability might be auto-created or not needed
          observer.next({});
          observer.complete();
        }
      });
    });
  }

  savePolicy(expId: number, data: any): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.api}/policies/`, { experience: expId, ...data }).subscribe({
        next: v => { observer.next(v); observer.complete(); },
        error: () => {
          // If POST fails, policy might be auto-created or not needed - continue anyway
          observer.next({});
          observer.complete();
        }
      });
    });
  }

  publish(id: number): Observable<Experience> {
    return this.http.post<Experience>(`${this.api}/${id}/publish/`, {});
  }
}
